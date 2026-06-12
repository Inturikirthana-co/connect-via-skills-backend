const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const {
  addReview,
  getTeacherReviews
} = require("../controllers/reviewController");


// ADD REVIEW
router.post(
  "/",
  authMiddleware,
  addReview
);


// GET TEACHER REVIEWS
router.get(
  "/:teacherId",
  getTeacherReviews
);

module.exports = router;