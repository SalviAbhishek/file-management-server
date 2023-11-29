const mongoUtils = require("../utilities/mongo");
const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    identity: {
      type: String,
      required: true,
    },
    expries_in: {
      type: Number,
      required: true,
    },
    created_at: {
      type: Number,
      default: Date.now(),
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otps", schema, mongoUtils.OTP_COLLECTION);
