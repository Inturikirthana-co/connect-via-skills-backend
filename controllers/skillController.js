const pool = require("../config/db");

// ADD SKILL
exports.addSkill = async (req, res) => {

  const { skill_name, skill_type } = req.body;

  const user_id = req.user.id;

  try {

    const result = await pool.query(
      `
      INSERT INTO skills
      (user_id, skill_name, skill_type)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [
        user_id,
        skill_name,
        skill_type.toLowerCase()
      ]
    );

    res.json({
      message: "Skill added successfully",
      skill: result.rows[0]
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to add skill"
    });
  }
};


// GET SKILLS + SEARCH
exports.getSkills = async (req, res) => {

  const search = req.query.search || "";

  try {

    const result = await pool.query(
      `
      SELECT
        skills.*,
        users.name AS teacher_name

      FROM skills

      JOIN users
      ON users.id = skills.user_id

      WHERE
        skills.user_id != $1
        AND skills.skill_type = 'teach'
        AND LOWER(skills.skill_name)
            LIKE LOWER($2)

      ORDER BY skills.skill_name
      `,
      [
        req.user.id,
        `%${search}%`
      ]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch skills"
    });
  }
};