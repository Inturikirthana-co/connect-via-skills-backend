const pool = require("../config/db");


// ADD REVIEW
exports.addReview = async (req, res) => {

  const learner_id = req.user.id;

  const {
    teacher_id,
    rating,
    review
  } = req.body;

  try {

    await pool.query(
      `
      INSERT INTO reviews
      (
        teacher_id,
        learner_id,
        rating,
        review
      )
      VALUES ($1,$2,$3,$4)
      `,
      [
        teacher_id,
        learner_id,
        rating,
        review
      ]
    );

    res.json({
      message: "Review added successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to add review"
    });
  }
};


// GET REVIEWS OF A TEACHER
exports.getTeacherReviews = async (req, res) => {

  const { teacherId } = req.params;

  try {

    const result = await pool.query(
      `
      SELECT
        r.*,
        u.name AS learner_name
      FROM reviews r

      JOIN users u
      ON u.id = r.learner_id

      WHERE r.teacher_id = $1

      ORDER BY r.created_at DESC
      `,
      [teacherId]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch reviews"
    });
  }
};