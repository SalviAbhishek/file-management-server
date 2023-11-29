const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mKeys = require("../../utilities/keys");
const mUsersModel = require("../../models/Users");

/* ------------------------------ register ----------------------------- */
exports.register = async (req, res) => {
  const response = {};
  const registerSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    mobile_number: Joi.string()
      .min(2)
      .pattern(/^[0-9]+$/)
      .required(),
  });
  try {
    let { error } = registerSchema.validate(req.body);
    /* ------------------------------ validation checks ----------------------------- */
    if (error) {
      return res.status(422).json({
        code: 422,
        message: "Invalid inputs used",
        details: error?.details,
      });
    } else {
      /* ------------------------------ check if user already exists ----------------------------- */
      let user = await mUsersModel
        .findOne({
          username: req?.body?.username,
        })
        .exec();

      if (user !== null) {
        throw {
          error_code: 400,
          message: "This username is already registered",
        };
      }
      /* ------------------------------ creating a new user record ----------------------------- */
      let hashedPassword = await bcrypt.hash(req?.body?.password, 10);
      let newUserBody = { ...req?.body, password: hashedPassword };
      let newUser = new mUsersModel(newUserBody);
      await newUser.save();
      let usr = { _id: newUser._id };
      let token = await generateToken(usr, "24h", mKeys.jwt_key);
      let refresh_token = await generateToken(
        usr,
        "48h",
        mKeys.jwt_refresh_key
      );
      response.token = token;
      response.refresh_token = refresh_token;
      response.code = 200;
      response.message = "user registered successfuly";
    }
  } catch (error) {
    response.code = error.error_code ? error.error_code : 501;
    response.message = error.message;
  } finally {
    res.status(response.code).send(response);
  }
};

/* ------------------------------ login -------------------------------- */
exports.login = async (req, res) => {
  const response = {};
  const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  try {
    let { error } = loginSchema.validate(req?.body);
    if (error) {
      return res.status(422).json({
        code: 422,
        message: "Invalid inputs used",
        details: error?.details,
      });
    } else {
      const user = await mUsersModel
        .findOne({ username: req?.body?.username }, { password: 1 })
        .lean();

      if (!user) {
        throw {
          error_code: 400,
          message: "Username is not registered",
        };
      }
      const validPassword = await bcrypt.compare(
        req?.body?.password,
        user?.password
      );
      if (validPassword) {
        let usr = { _id: user._id };
        let token = await generateToken(usr, "24h", mKeys.jwt_key);
        let refresh_token = await generateToken(
          usr,
          "48h",
          mKeys.jwt_refresh_key
        );

        let usrn = await mUsersModel
          .findOne({ username: req?.body?.username })
          .lean();
        delete usrn.password;
        response.code = 200;
        response.message = "Successfully logged In";
        response.token = token;
        response.refresh_token = refresh_token;
        response.user = usrn;
      } else {
        throw {
          code: 422,
          message: "Incorrect login details",
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

/* --------------- common function to genrate user token --------------- */
const generateToken = async (user, time, key) => {
  return jwt.sign({ user }, key, { expiresIn: time });
};
