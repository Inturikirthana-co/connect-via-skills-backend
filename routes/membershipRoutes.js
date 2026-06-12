const express = require("express");

const router = express.Router();

const {
  activateMembership,
  checkMembership
} = require("../controllers/membershipController");

// Activate membership
router.post("/activate", activateMembership);

// Check membership
router.get("/:user_id", checkMembership);

module.exports = router;