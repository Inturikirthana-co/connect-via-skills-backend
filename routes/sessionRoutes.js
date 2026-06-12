const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
  createSession,
  getSessions
} = require("../controllers/sessionController");

router.post(
  "/create",
  authMiddleware,
  createSession
);

router.get(
  "/all",
  authMiddleware,
  getSessions
);

module.exports = router;