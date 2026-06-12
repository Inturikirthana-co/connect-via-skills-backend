const pool = require("../config/db");

// GET USER NOTIFICATIONS
exports.getNotifications = async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT *
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch notifications"
    });

  }
};


// MARK ALL AS READ
exports.markAllRead = async (req, res) => {

  try {

    await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = $1
      `,
      [req.user.id]
    );

    res.json({
      message: "Notifications marked as read"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to update notifications"
    });

  }
};