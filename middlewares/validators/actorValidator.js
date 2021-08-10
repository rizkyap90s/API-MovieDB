const validator = require("validator");
const path = require("path");
const { promisify } = require("util");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { actor, movie } = require("../../models/model");

class movieValidator {
  //Get by ID
  getByIdValidator = async (req, res, next) => {
    try {
      const errorMessages = [];

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        errorMessages.push("Id is not valid");
      }

      const findActor = await actor.findOne({ _id: req.params.id });

      if (!findActor) {
        errorMessages.push("No actor found with this id!");
      }

      if (errorMessages.length > 0) {
        return next({ messages: errorMessages, statusCode: 400 });
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  addValidator = async (req, res, next) => {
    try {
      const errorMessages = [];
      let movies = [];

      if (validator.isEmpty(req.body.name)) {
        errorMessages.push(`name cannot be empty`);
      }

      if (errorMessages.length > 0) {
        return next({ statusCode: 400, messages: errorMessages });
      }

      if (req.body.movies) {
        movies.push(req.body.movies);
      }

      if (movies.length > 0) {
        for (let i = 0; i < movies.length; i++) {
          const findMovie = await movie.findById(movies[0][i]);
          if (!findMovie) {
            errorMessages.push("No movies found with this id!");
          }
        }
      }

      // If error
      if (errorMessages.length > 0) {
        return next({ statusCode: 404, messages: errorMessages });
      }

      //if name less than 3 char
      if (req.body.name.length <= 3) {
        errorMessages.push("name cannot less than 3 character");
      }

      // If image was uploaded
      if (req.files) {
        // req.files.image is come from key (file) in postman
        const file = req.files.image;

        // Make sure image is photo
        if (!file.mimetype.startsWith("image")) {
          errorMessages.push("File must be an image");
        }

        // Check file size (max 1MB)
        if (file.size > 1000000) {
          errorMessages.push("Image must be less than 1MB");
        }

        // If error
        if (errorMessages.length > 0) {
          return next({ statusCode: 400, messages: errorMessages });
        }

        // Create custom filename
        let fileName = crypto.randomBytes(16).toString("hex");

        // Rename the file
        file.name = `${fileName}${path.parse(file.name).ext}`;

        // Make file.mv to promise
        const move = promisify(file.mv);

        // Upload image to /public/images
        await move(`./public/images/actors/${file.name}`);

        // assign req.body.image with file.name
        req.body.photo = file.name;
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  updateValidator = async (req, res, next) => {
    try {
      console.log(req.params.id);
      const errorMessages = [];

      if (validator.isEmpty(req.body.name)) {
        errorMessages.push(`name cannot be empty`);
      }

      if (errorMessages.length > 0) {
        return next({ statusCode: 400, messages: errorMessages });
      }

      const findActor = await actor.findById(req.params.id);

      if (!findActor) {
        errorMessages.push("No actor found with this id!");
      }

      // If error
      if (errorMessages.length > 0) {
        return next({ statusCode: 404, messages: errorMessages });
      }

      const movies = req.body.movies;

      for (let i = 0; i < movies.length; i++) {
        const findMovie = await movie.findById(movies[i]);
        if (!findMovie) {
          errorMessages.push("No movies found with this id!");
        }
      }

      // If error
      if (errorMessages.length > 0) {
        return next({ statusCode: 404, messages: errorMessages });
      }

      //if name less than 3 char
      if (req.body.name.length <= 3) {
        errorMessages.push("name cannot less than 3 character");
      }

      // If image was uploaded
      if (req.files) {
        // req.files.image is come from key (file) in postman
        const file = req.files.image;

        // Make sure image is photo
        if (!file.mimetype.startsWith("image")) {
          errorMessages.push("File must be an image");
        }

        // Check file size (max 1MB)
        if (file.size > 1000000) {
          errorMessages.push("Image must be less than 1MB");
        }

        // If error
        if (errorMessages.length > 0) {
          return next({ statusCode: 400, messages: errorMessages });
        }

        // Create custom filename
        let fileName = crypto.randomBytes(16).toString("hex");

        // Rename the file
        file.name = `${fileName}${path.parse(file.name).ext}`;

        // Make file.mv to promise
        const move = promisify(file.mv);

        // Upload image to /public/images
        await move(`./public/images/actors/${file.name}`);

        // assign req.body.image with file.name
        req.body.photo = file.name;
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  deleteValidator = async (req, res, next) => {
    try {
      const errorMessages = [];

      const findActor = await actor.findById(req.params.id);

      if (!findActor) {
        errorMessages.push("No actor found with this id!");
      }

      // If error
      if (errorMessages.length > 0) {
        return next({ statusCode: 404, messages: errorMessages });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new movieValidator();
