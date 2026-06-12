const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const upload =
require("../middleware/upload");

const {
  saveProfile,
  getProfile,
  getUserProfile
} = require("../controllers/profileController");


// SAVE PROFILE
router.post(
  "/save",
  authMiddleware,
  upload.single("profile_pic"),
  saveProfile
);


// MY PROFILE
router.get(
  "/me",
  authMiddleware,
  getProfile
);


// OTHER USER PROFILE
router.get(
  "/:id",
  authMiddleware,
  getUserProfile
);


module.exports = router;