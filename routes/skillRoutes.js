const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addSkill,
  getSkills
} = require("../controllers/skillController");

router.post(
  "/add",
  authMiddleware,
  addSkill
);

router.get(
  "/",
  authMiddleware,
  getSkills
);

module.exports = router;