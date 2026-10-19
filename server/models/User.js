const mongoose = require("mongoose");

const userSchema =
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

      password: {
        type: String,
        required: true,
      },

      role: {
        type: String,
        enum: [
          "patient",
          "doctor",
          "admin",
        ],
        default: "patient",
      },

      avatar: {
        type: String,
        default: "",
      },

      isVerified: {
        type: Boolean,
        default: false,
      },

      otpCode: {
        type: String,
        default: undefined,
      },

      otpExpires: {
        type: Date,
        default: undefined,
      },

      otpPurpose: {
        type: String,
        enum: ["verify", "reset"],
        default: undefined,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "User",
  userSchema
);