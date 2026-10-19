const mongoose = require("mongoose");

const doctorSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      specialization: {
        type: String,
        required: true,
      },

      experience: {
        type: Number,
        required: true,
        min: [0, "Experience cannot be less than 0 years"],
      },

      hospital: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Doctor",
  doctorSchema
);