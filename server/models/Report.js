const mongoose = require("mongoose");

const reportSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      fileName: {
        type: String,
        required: true,
      },

      analysis: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Report",
  reportSchema
);