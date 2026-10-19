const express = require("express");

const {
  getAppointments,
  getUserAppointments,
  createAppointment,
  cancelAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
} = require(
  "../controllers/appointmentController"
);

const router =
  express.Router();

router
  .route("/")
  .get(getAppointments)
  .post(createAppointment);

router.get(
  "/user/:userId",
  getUserAppointments
);

router.get(
  "/doctor/:email",
  getDoctorAppointments
);

router.put(
  "/:id/status",
  updateAppointmentStatus
);

router.delete(
  "/:id",
  cancelAppointment
);

module.exports =
  router;