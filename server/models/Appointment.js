const mongoose = require("mongoose");

const appointmentSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      patientName: {
        type: String,
        required: true,
      },

      doctor: {
        type: String,
        required: true,
      },

      doctorEmail: {
        type: String,
        required: true,
      },

      hospital: {
        type: String,
        required: true,
      },

      appointmentDate: {
        type: String,
        required: true,
      },

      appointmentTime: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Booked",
          "Confirmed",
          "Completed",
          "Cancelled",
        ],
        default: "Booked",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);