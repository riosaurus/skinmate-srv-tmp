const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Doctor",
    },
    //for unit Services or Sub-Services
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
