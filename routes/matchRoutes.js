const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  requestMatch,
  getRequests,
  acceptRequest,
  rejectRequest
} = require("../controllers/matchRequestController");

// Send request
router.post("/request", authMiddleware, requestMatch);

// Get requests of current user only
router.get("/all", authMiddleware, getRequests);

// Accept request
router.put("/accept/:id", authMiddleware, acceptRequest);

// Reject request
router.put("/reject/:id", authMiddleware, rejectRequest);
  

module.exports = router;