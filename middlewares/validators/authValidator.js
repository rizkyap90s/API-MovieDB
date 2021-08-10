const validator = require("validator");
const { promisify } = require("util");
const mongoose = require("mongoose");
const { user } = require("../../models/user");

exports.getUserByIdValidator = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next({ message: "id is not valid", statusCode: 400 });
    }
    next();
  } catch (error) {
    next(error);
  }
};
exports.signUpAndUpdateValidator = async (req, res, next) => {
  try {
    const errorMessages = [];
    if (validator.isEmpty(req.body.fullname) || validator.isEmpty(req.body.username)) {
      errorMessages.push("field can't be empty");
    }
    if (!validator.isEmail(req.body.email)) {
      errorMessages.push("your email is not valid");
    }
    if (!validator.isStrongPassword(req.body.password)) {
      errorMessages.push("your password is not strong enough");
    }

    if (req.files) {
      const file = req.files.image;
      if (!file.mimetype.startsWith("image")) {
        errorMessages.push("File must be an image");
      }
      if (file.size > 1000000) {
        errorMessages.push("Image must be less than 1MB");
      }
      if (errorMessages.length > 0) {
        return next({ statusCode: 404, messages: errorMessages });
      }
      file.name = new Date().getTime() + "_" + file.name;
      const move = promisify(file.mv);
      await move(`./public/images/users/${file.name}`);
      req.body.image = file.name;
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.signInValidator = async (req, res, next) => {
  try {
    const errorMessages = [];
    if (validator.isEmpty(req.body.password)) {
      errorMessages.push("field can't be empty");
    }
    if (!validator.isEmail(req.body.email)) {
      errorMessages.push("email is not valid");
    }
    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }
    next();
  } catch (error) {
    next(error);
  }
};
