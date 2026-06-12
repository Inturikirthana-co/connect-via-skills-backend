const pool = require("../config/db");


// ========================
// SAVE / UPDATE PROFILE
// ========================
exports.saveProfile = async (req, res) => {

  const user_id = req.user.id;

  try {

    const {
      bio,
      education,
      college,
      degree,
      graduation_year,
      experience,
      current_role,
      linkedin,
      github,
      portfolio
    } = req.body;

    let profile_pic = null;

    if (req.file) {
      profile_pic = req.file.filename;
    }

    const existing = await pool.query(
      "SELECT * FROM profiles WHERE user_id = $1",
      [user_id]
    );

    // UPDATE PROFILE
    if (existing.rows.length > 0) {

      const result = await pool.query(
        `
        UPDATE profiles
        SET
          profile_pic = COALESCE($1, profile_pic),
          bio = $2,
          education = $3,
          college = $4,
          degree = $5,
          graduation_year = $6,
          experience = $7,
          "current_role" = $8,
          linkedin = $9,
          github = $10,
          portfolio = $11
        WHERE user_id = $12
        RETURNING *
        `,
        [
          profile_pic,
          bio,
          education,
          college,
          degree,
          graduation_year,
          experience,
          current_role,
          linkedin,
          github,
          portfolio,
          user_id
        ]
      );

      return res.json(result.rows[0]);
    }

    // INSERT PROFILE
    const result = await pool.query(
      `
      INSERT INTO profiles
      (
        user_id,
        profile_pic,
        bio,
        education,
        college,
        degree,
        graduation_year,
        experience,
        "current_role",
        linkedin,
        github,
        portfolio
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      )
      RETURNING *
      `,
      [
        user_id,
        profile_pic,
        bio,
        education,
        college,
        degree,
        graduation_year,
        experience,
        current_role,
        linkedin,
        github,
        portfolio
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Profile save failed"
    });

  }

};


// ========================
// GET MY PROFILE
// ========================
exports.getProfile = async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT
        users.name,
        users.email,
        users.credit,
        users.completed_sessions,
        profiles.*
      FROM users
      LEFT JOIN profiles
      ON users.id = profiles.user_id
      WHERE users.id = $1
      `,
      [req.user.id]
    );

    res.json(result.rows[0] || {});

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch profile"
    });

  }

};


// ========================
// VIEW OTHER USER PROFILE
// ========================
exports.getUserProfile = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        users.name,
        users.email,
        users.credit,
        users.completed_sessions,
        profiles.*
      FROM users
      LEFT JOIN profiles
      ON users.id = profiles.user_id
      WHERE users.id = $1
      `,
      [id]
    );

    res.json(result.rows[0] || {});

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch user profile"
    });

  }

};