const validator = require("validator");
const mongoose = require("mongoose");
const { genre } = require("../../models/model");

exports.getGenreByIdValidator = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next({ message: "id is not valid", statusCode: 400 });
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.createGenreValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (validator.isEmpty(req.body.genre)) {
      errorMessages.push("genre cant be empty");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.updateGenreValidator = async (req, res, next) => {
  try {
    const errorMessages = [];
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      errorMessages.push("id not valid");
    }

    if (validator.isEmpty(req.body.genre)) {
      errorMessages.push("genre cant be empty");
    }

    const findGenre = await genre.findById(req.params.id);

    if (!findGenre) {
      errorMessages.push("genre not found");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
