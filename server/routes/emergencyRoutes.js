const express =
  require("express");

const router =
  express.Router();

const {
  getEmergencyHelp,
} = require(
  "../controllers/emergencyController"
);

router.post(
  "/",
  getEmergencyHelp
);

module.exports = router;