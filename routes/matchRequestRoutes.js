const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const {
  requestMatch,
  getRequests,
  acceptRequest,
  rejectRequest,
  scheduleSession,
  completeSession
} = require("../controllers/matchRequestController");


// SEND MATCH REQUEST
router.post(
  "/request",
  authMiddleware,
  requestMatch
);


// GET ALL REQUESTS
router.get(
  "/all",
  authMiddleware,
  getRequests
);


// ACCEPT REQUEST
router.put(
  "/accept/:id",
  authMiddleware,
  acceptRequest
);


// REJECT REQUEST
router.put(
  "/reject/:id",
  authMiddleware,
  rejectRequest
);


// SCHEDULE SESSION
router.put(
  "/schedule/:id",
  authMiddleware,
  scheduleSession
);


// COMPLETE SESSION
router.put(
  "/complete/:id",
  authMiddleware,
  completeSession
);

module.exports = router;