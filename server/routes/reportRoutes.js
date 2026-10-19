const express = require("express");

const router =
  express.Router();

const {
  createReport,
  getUserReports,
} = require(
  "../controllers/reportController"
);

router.post(
  "/",
  createReport
);

router.get(
  "/:userId",
  getUserReports
);

module.exports = router;