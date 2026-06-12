const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
  sendMessage,
  getConversation,
  getUserDetails
} = require("../controllers/messageController");

router.post(
  "/send",
  authMiddleware,
  sendMessage
);

router.get(
  "/user/:userId",
  authMiddleware,
  getUserDetails
);

router.get(
  "/:userId",
  authMiddleware,
  getConversation
);

module.exports = router;