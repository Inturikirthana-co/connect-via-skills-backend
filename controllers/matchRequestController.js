const pool = require("../config/db");

// SEND MATCH REQUEST
exports.requestMatch = async (req, res) => {

  const learner_id = req.user.id;

  const {
    teacher_id,
    skill,
    credit
  } = req.body;

  try {

    if (teacher_id === learner_id) {

      return res.status(400).json({
        message: "You cannot send request to yourself"
      });

    }

    const learner = await pool.query(
      "SELECT credit, name FROM users WHERE id=$1",
      [learner_id]
    );

    if (
      learner.rows.length === 0 ||
      learner.rows[0].credit < credit
    ) {

      return res.status(400).json({
        message: "Insufficient credits"
      });

    }

    await pool.query(
      `
      INSERT INTO match_requests
      (
        teacher_id,
        learner_id,
        skill,
        credits_used,
        status
      )
      VALUES
      ($1,$2,$3,$4,'pending')
      `,
      [
        teacher_id,
        learner_id,
        skill,
        credit
      ]
    );

    // Notification for teacher
    await pool.query(
      `
      INSERT INTO notifications
      (user_id, message)
      VALUES ($1,$2)
      `,
      [
        teacher_id,
        `${learner.rows[0].name} sent you a request for ${skill}`
      ]
    );

    res.json({
      message: "Match request sent successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Match request failed"
    });

  }
};


// GET REQUESTS
exports.getRequests = async (req, res) => {

  const currentUser = req.user.id;

  try {

    const result = await pool.query(
      `
      SELECT
        mr.*,
        teacher.name AS teacher_name,
        learner.name AS learner_name
      FROM match_requests mr
      JOIN users teacher
        ON teacher.id = mr.teacher_id
      JOIN users learner
        ON learner.id = mr.learner_id
      WHERE
        mr.teacher_id = $1
        OR
        mr.learner_id = $1
      ORDER BY mr.created_at DESC
      `,
      [currentUser]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch requests"
    });

  }
};


// ACCEPT REQUEST
exports.acceptRequest = async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      `
      UPDATE match_requests
      SET status='accepted'
      WHERE id=$1
      `,
      [id]
    );

    const request = await pool.query(
      `
      SELECT *
      FROM match_requests
      WHERE id=$1
      `,
      [id]
    );

    await pool.query(
      `
      INSERT INTO notifications
      (user_id, message)
      VALUES ($1,$2)
      `,
      [
        request.rows[0].learner_id,
        "Your request was accepted."
      ]
    );

    res.json({
      message: "Request accepted"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Accept failed"
    });

  }
};


// REJECT REQUEST
exports.rejectRequest = async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      `
      UPDATE match_requests
      SET status='rejected'
      WHERE id=$1
      `,
      [id]
    );

    const request = await pool.query(
      `
      SELECT *
      FROM match_requests
      WHERE id=$1
      `,
      [id]
    );

    await pool.query(
      `
      INSERT INTO notifications
      (user_id, message)
      VALUES ($1,$2)
      `,
      [
        request.rows[0].learner_id,
        "Your request was rejected."
      ]
    );

    res.json({
      message: "Request rejected"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Reject failed"
    });

  }
};


// SCHEDULE SESSION
exports.scheduleSession = async (req, res) => {

  const { id } = req.params;

  const {
    session_date,
    session_time
  } = req.body;

  try {

    const result = await pool.query(
      `
      UPDATE match_requests
      SET
        session_date=$1,
        session_time=$2
      WHERE id=$3
      RETURNING *
      `,
      [
        session_date,
        session_time,
        id
      ]
    );

    await pool.query(
      `
      INSERT INTO notifications
      (user_id, message)
      VALUES ($1,$2)
      `,
      [
        result.rows[0].learner_id,
        `Session scheduled on ${session_date} at ${session_time}`
      ]
    );

    res.json({
      message: "Session scheduled successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

};


// COMPLETE SESSION
// COMPLETE SESSION
exports.completeSession = async (req, res) => {

  const { id } = req.params;

  try {

    // get request details
    const request = await pool.query(
      `
      SELECT *
      FROM match_requests
      WHERE id = $1
      `,
      [id]
    );

    if (request.rows.length === 0) {

      return res.status(404).json({
        error: "Request not found"
      });

    }

    const data = request.rows[0];

    // update status
    await pool.query(
      `
      UPDATE match_requests
      SET status='completed'
      WHERE id=$1
      `,
      [id]
    );

    // deduct credits from learner
    await pool.query(
      `
      UPDATE users
      SET credit = credit - $1
      WHERE id = $2
      `,
      [
        data.credits_used,
        data.learner_id
      ]
    );

    // add credits to teacher
    await pool.query(
      `
      UPDATE users
      SET credit = credit + $1
      WHERE id = $2
      `,
      [
        data.credits_used,
        data.teacher_id
      ]
    );

    // increase session count for learner
    await pool.query(
      `
      UPDATE users
      SET completed_sessions =
      completed_sessions + 1
      WHERE id = $1
      `,
      [data.learner_id]
    );

    // increase session count for teacher
    await pool.query(
      `
      UPDATE users
      SET completed_sessions =
      completed_sessions + 1
      WHERE id = $1
      `,
      [data.teacher_id]
    );

    // notification
    await pool.query(
      `
      INSERT INTO notifications
      (user_id, message)
      VALUES ($1,$2)
      `,
      [
        data.learner_id,
        "Session completed successfully."
      ]
    );

    res.json({
      message: "Session marked as completed"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to complete session"
    });

  }

};