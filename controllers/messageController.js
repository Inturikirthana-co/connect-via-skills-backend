const pool = require("../config/db");

// SEND MESSAGE
exports.sendMessage = async (req, res) => {

  console.log("===== SEND MESSAGE API CALLED =====");

  const sender_id = req.user?.id;

  const {
    receiver_id,
    message
  } = req.body;

  try {

    const result = await pool.query(
      `
      INSERT INTO messages
      (sender_id, receiver_id, message)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [
        sender_id,
        receiver_id,
        message
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
};


// GET CONVERSATION
exports.getConversation = async (req, res) => {

  const currentUser = req.user.id;

  const { userId } = req.params;

  try {

    const result = await pool.query(
      `
      SELECT
        m.*,
        sender.name AS sender_name,
        receiver.name AS receiver_name
      FROM messages m
      JOIN users sender
        ON sender.id = m.sender_id
      JOIN users receiver
        ON receiver.id = m.receiver_id
      WHERE
      (
        m.sender_id = $1
        AND
        m.receiver_id = $2
      )
      OR
      (
        m.sender_id = $2
        AND
        m.receiver_id = $1
      )
      ORDER BY m.created_at ASC
      `,
      [
        currentUser,
        userId
      ]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to load messages"
    });
  }
};


// GET USER DETAILS
exports.getUserDetails = async (req, res) => {

  const { userId } = req.params;

  try {

    const result = await pool.query(
      `
      SELECT
      id,
      name,
      email
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch user"
    });
  }
};