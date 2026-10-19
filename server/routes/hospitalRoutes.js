const express = require("express");

const {
  getHospitals,
  createHospital,
  deleteHospital,
} = require(
  "../controllers/hospitalController"
);

const router =
  express.Router();

router
  .route("/")
  .get(getHospitals)
  .post(createHospital);

router.delete(
  "/:id",
  deleteHospital
);

module.exports =
  router;