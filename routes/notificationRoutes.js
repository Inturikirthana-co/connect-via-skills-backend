const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAllRead
} = require("../controllers/notificationController");


router.get(
  "/",
  authMiddleware,
  getNotifications
);


router.put(
  "/read",
  authMiddleware,
  markAllRead
);


module.exports = router;