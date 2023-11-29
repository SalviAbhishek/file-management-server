const mongoUtils = require("../utilities/mongo");
const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    file_type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
schema.plugin(aggregatePaginate);

module.exports = mongoose.model("files", schema, mongoUtils.OTP_COLLECTION);
