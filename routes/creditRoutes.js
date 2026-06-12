const express = require("express");
const router = express.Router();

const { transferCredit } = require("../controllers/creditController");

router.post("/transfer", transferCredit);

module.exports = router;
