const pool = require("../config/db");

exports.searchUsers = async (req, res) => {

  const keyword = req.query.name || "";

  try {

    const result = await pool.query(
      `
      SELECT id,name
      FROM users
      WHERE LOWER(name)
      LIKE LOWER($1)
      `,
      [`%${keyword}%`]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Search failed"
    });

  }

};