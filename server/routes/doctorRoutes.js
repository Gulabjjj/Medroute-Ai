const express = require("express");

const {
  getDoctors,
  createDoctor,
} = require(
  "../controllers/doctorController"
);

const router = express.Router();

router
  .route("/")
  .get(getDoctors)
  .post(createDoctor);

module.exports = router;