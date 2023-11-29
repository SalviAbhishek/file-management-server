const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mKeys = require("../../utilities/keys");
const mUsersModel = require("../../models/Users");

/* ------------------------------ get user details ----------------------------- */
exports.getUser = async (req, res) => {
  const response = {};
  try {
    let user = await mUsersModel.findOne(
      { _id: req?.userData?._id },
      { password: 0 }
    );
    response.code = 200;
    response.user = user;
    response.message = "data found";
  } catch (error) {
    response.code = error.error_code ? error.error_code : 501;
    response.message = error.message;
  } finally {
    res.status(response.code).send(response);
  }
};

/* ------------------------------ update user details -------------------------------- */
exports.updateUser = async (req, res) => {
  const response = {};
  try {
    response.code = 200;
    response.message = "Updated Successfully";
  } catch (error) {
    response.code = error.error_code ? error.error_code : 501;
    response.message = error.message;
  } finally {
    res.status(response.code).send(response);
  }
};
