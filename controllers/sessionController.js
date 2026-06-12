const pool = require("../config/db");

// CREATE SESSION
exports.createSession = async (req, res) => {

  const { request_id, teacher_id, learner_id, session_time } = req.body;

  try {

    const result = await pool.query(
      `
      INSERT INTO sessions
      (request_id, teacher_id, learner_id, session_time)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [
        request_id,
        teacher_id,
        learner_id,
        session_time
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to create session"
    });
  }
};


// GET USER SESSIONS
exports.getSessions = async (req, res) => {

  const currentUser = req.user.id;

  try {

    const result = await pool.query(
      `
      SELECT *
      FROM sessions
      WHERE teacher_id=$1
         OR learner_id=$1
      ORDER BY session_time
      `,
      [currentUser]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to load sessions"
    });
  }
};