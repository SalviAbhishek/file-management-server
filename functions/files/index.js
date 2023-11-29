const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mUploadFn = require("../../utilities/file-upload");
const mFilesModel = require("../../models/Files");
const ObjectId = require("mongoose").Types.ObjectId;

/* ------------------------------ upload file ----------------------------- */
exports.uploadFile = async (req, res) => {
  const response = {};
  try {
    let file = req?.file;
    console.log(req?.file, "file");

    let newFile = new mFilesModel({
      name: file?.filename,
      url: file?.path,
      user_id: req?.userData?._id,
      file_type: file?.mimetype,
    });

    await newFile.save();
    response.code = 200;
    response.message = "file uploaded successfully";
  } catch (error) {
    response.code = error.error_code ? error.error_code : 501;
    response.message = error.message;
  } finally {
    res.status(response.code).send(response);
  }
};

/* ------------------ list all file from user uploaded -------------------- */
exports.listUserFiles = async (req, res) => {
  const response = {};
  try {
    let { page = 1, limit = 10 } = req?.query;
    let user_id = req?.userData?._id;
    let filesAggregate = mFilesModel.aggregate({
      $matches: {
        $and: [{ user_id: user_id }],
      },
    });
    let data = await mFilesModel.aggregatePaginate(filesAggregate, {
      page,
      limit,
    });
    response.data = data;
    response.code = 200;
    response.message = "data found";
  } catch (error) {
    response.code = error.error_code ? error.error_code : 501;
    response.message = error.message;
  } finally {
    res.status(response.code).send(response);
  }
};

/* ------------------------------ update user details -------------------------------- */
exports.deleteFile = async (req, res) => {
  const response = {};
  try {
    let id = new ObjectId(req?.params?.id);

    let file = await mFilesModel.findOne({ _id: id }).lean();
    if (!file) {
      throw {
        error_code: 400,
        message: "file not found.",
      };
    } else {
      await mFilesModel.deleteOne({ _id: id });
      response.code = 200;
      response.message = "Deleted Successfully";
    }
  } catch (error) {
    response.code = error.error_code ? error.error_code : 501;
    response.message = error.message;
  } finally {
    res.status(response.code).send(response);
  }
};
