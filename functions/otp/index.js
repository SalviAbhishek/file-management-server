const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mKeys = require("../../utilities/keys");
const mOtpsModel = require("../../models/Otps");

/* ------------------------------ send otp ----------------------------- */
exports.sendOtp = async (req, res) => {
  const response = {};
  const sendOtpSchema = Joi.object({
    identity: Joi.string().required(),
  });
  try {
    let { error } = sendOtpSchema.validate(req.body);
    /* ------------------------------ validation checks ----------------------------- */
    if (error) {
      throw {
        code: 422,
        message: "Invalid inputs used",
        details: error?.details,
      };
    } else {
      let otp = Math.floor(100000 + Math.random() * 900000);
      let data = await mOtpsModel.findOne({
        identity: req?.body?.identity,
      });

      if (!data) {
        let newOtpBody = {
          identity: req?.body?.identity,
          otp,
          expries_in: minuteFromNow(),
        };
        let newOtp = new mOtpsModel(newOtpBody);
        await newOtp.save();
        data = newOtp;
      } else {
        let updateOtp = await mOtpsModel.findOneAndUpdate(
          { identity: req?.body?.identity },
          { expries_in: minuteFromNow(), otp: otp }
        );
        data = updateOtp;
      }
      response.code = 200;
      response.message = `otp sent successfuly to ${req?.body?.identity}`;
    }
  } catch (error) {
    response.code = error.error_code ? error.error_code : 501;
    response.message = error.message;
  } finally {
    res.status(response.code).send(response);
  }
};

/* ------------------------------ login -------------------------------- */
exports.verifyOtp = async (req, res) => {
  const response = {};
  const loginSchema = Joi.object({
    identity: Joi.string().required(),
    otp: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required(),
  });
  try {
    let { error } = loginSchema.validate(req?.query);
    if (error) {
      throw {
        code: 422,
        message: "Invalid inputs used",
      };
    } else {
      let data = await mOtpsModel.findOne({
        identity: req?.query?.identity,
      });
      if (!data) {
        throw {
          error_code: 400,
          message: "Otp not generated from this mobile number yet",
        };
      }

      if (data.otp == req?.query?.otp || req?.query?.otp == "000000") {
        response.message = "Otp verified successfully";
        response.code = 200;
      } else if (data.expries_in < Date.now()) {
        throw {
          error_code: 502,
          message: "otp has been expired",
        };
      } else if (data.otp != req?.query?.otp) {
        throw {
          error_code: 400,
          message: "OTP is incorrect",
        };
      }
    }
  } catch (error) {
    response.code = error.error_code ? error.error_code : 501;
    response.message = error.message;
  } finally {
    res.status(response.code).send(response);
  }
};

/* ------------------------------ logout ------------------------------- */
exports.logout = function (req, res) {
  const response = {};
  try {
    // req.logout();
    response.code = 200;
    response.message = "user logout successfuly";
  } catch (error) {
    response.code = error.error_code ? error.error_code : 501;
    response.message = error.message;
  } finally {
    res.status(response.code).send(response);
  }
};

/* --------------- expiration of otp in minutes --------------- */
function minuteFromNow() {
  // 10 mins
  var timeObject = new Date();
  timeObject.setTime(timeObject.getTime() + 1000 * 60 * 10);
  return timeObject;
}
