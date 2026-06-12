const pool = require("../config/db");

// ACTIVATE MEMBERSHIP
exports.activateMembership = async (req, res) => {

  const { user_id } = req.body;

  try {

    // Membership expiry = current date + 30 days
    const result = await pool.query(
      `
      UPDATE users
      SET
        is_premium = true,
        membership_expires_at = NOW() + INTERVAL '30 days'
      WHERE id = $1
      RETURNING *
      `,
      [user_id]
    );

    res.json({
      message: "Membership activated successfully",
      user: result.rows[0]
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Membership activation failed"
    });
  }
};

// CHECK MEMBERSHIP STATUS
exports.checkMembership = async (req, res) => {

  const { user_id } = req.params;

  try {

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        is_premium,
        membership_expires_at
      FROM users
      WHERE id = $1
      `,
      [user_id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch membership"
    });
  }
};