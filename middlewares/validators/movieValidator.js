const validator = require("validator");
const path = require("path");
const { promisify } = require("util");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { actor, movie, genre, category } = require("../../models/model");

class movieValidator {
  //getValidator
  getValidator = async (req, res, next) => {
    try {
      const errorMessages = [];
      const { page, size, sort, rating } = req.query;

      if ((page && !validator.isInt(page)) || page < 1) {
        errorMessages.push("page must be positive number");
      }

      if ((size && !validator.isInt(size)) || size < 1) {
        errorMessages.push("size must be positive number");
      }

      if (rating && !validator.isInt(rating)) {
        errorMessages.push("rating must be number");
      }

      if (errorMessages.length > 0) {
        return next({ messages: errorMessages, statusCode: 400 });
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  //Get by ID
  getByIdValidator = async (req, res, next) => {
    try {
      const errorMessages = [];

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        errorMessages.push("Id is not valid");
      }

      const findMovie = await movie.findOne({ _id: req.params.id });

      if (!findMovie) {
        errorMessages.push("No movie found with this id!");
      }

      if (errorMessages.length > 0) {
        return next({ messages: errorMessages, statusCode: 404 });
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  //get all actor from movie
  getAllActorValidator = async (req, res, next) => {
    try {
      const errorMessages = [];

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        errorMessages.push("Id is not valid");
      }

      if (errorMessages.length > 0) {
        return next({ messages: errorMessages, statusCode: 400 });
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  //add movie
  addValidator = async (req, res, next) => {
    try {
      const errorMessages = [];
      const column = [
        "title",
        "description",
        "synopsis",
        "category",
        "release",
        "director",
        "trailer",
        "years",
        "budget",
        "song",
      ];

      const actors = [];
      const genres = [];

      for (let i = 0; i < column.length; i++) {
        //Check if column is empty
        if (!req.body[column[i]]) {
          errorMessages.push(`field ${column[i]} is required`);
        }
        if (validator.isEmpty(req.body[column[i]].toString())) {
          errorMessages.push(`${column[i]} cannot be empty`);
        }
      }

      //budget must be number
      if (!validator.isInt(req.body.budget.toString())) {
        errorMessages.push("budget must be number");
      }

      //years must be number
      if (!validator.isInt(req.body.years.toString())) {
        errorMessages.push("years must be number");
      }

      //rating must be1 to 10
      if (req.body.rating >= 10 || req.body.rating <= 0) {
        errorMessages.push("rating must be 1 to 10");
      }

      //if name less than 3 char
      if (req.body.description.length <= 3 || req.body.synopsis.length <= 3) {
        errorMessages.push(
          "description and synopsis cannot less than 3 character"
        );
      }

      //if no genre
      if (!req.body.genres) {
        errorMessages.push("genres cannot be empty");
      } else {
        genres.push(req.body.genres);
      }

      if (req.body.actor < 2) {
        errorMessages.push("actor_id cannot less than 2");
      } else {
        actors.push(req.body.actor_id);
      }

      //validate actor id
      for (let val_a = 0; val_a < actors[0].length; val_a++) {
        if (!mongoose.Types.ObjectId.isValid(actors[0][val_a])) {
          errorMessages.push(`${actors[0][val_a]} is not valid`);
        }
      }

      if (errorMessages.length > 0) {
        return next({ messages: errorMessages, statusCode: 400 });
      }

      //======================================================================

      //find from model
      const findCat = await category.findOne({ category: req.body.category });
      if (!findCat) {
        errorMessages.push(`category ${req.body.category} not found!`);
      }

      //find actors from models
      for (let fa_i = 0; fa_i < actors[0].length; fa_i++) {
        const findActor = await actor.findById(actors[0][fa_i]);
        if (!findActor) {
          errorMessages.push(`actor with id ${actors[0][fa_i]} not found!`);
        }
      }

      //find genres from models
      for (let fg_i = 0; fg_i < genres[0].length; fg_i++) {
        const findGenres = await genre.findOne({ genre: genres[0][fg_i] });
        if (!findGenres) {
          errorMessages.push(`genre ${genres[0][fg_i]} not found!`);
        }
      }

      if (errorMessages.length > 0) {
        return next({ messages: errorMessages, statusCode: 400 });
      }

      req.body = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        genres: genres[0],
        actors: actors[0],
        trailer: req.body.trailer,
        synopsis: req.body.synopsis,
        movieInfo: {
          budget: req.body.budget,
          releaseDate: req.body.release,
          years: req.body.years,
          director: req.body.director,
          song: req.body.song,
        },
      };

      // If image was uploaded
      if (!req.files) {
        errorMessages.push("thumbnail and poster is required");
      } else {
        // req.files.image is come from key (file) in postman
        const thumbnail = req.files.thumbnail;
        const poster = req.files.poster;

        if (!thumbnail || !poster) {
          errorMessages.push("thumbnail and poster is required");
        }

        // If error
        if (errorMessages.length > 0) {
          return next({ statusCode: 400, messages: errorMessages });
        }

        // Make sure image is photo
        if (
          !thumbnail.mimetype.startsWith("image") ||
          !poster.mimetype.startsWith("image")
        ) {
          errorMessages.push("File must be an image");
        }

        // Check file size (max 1MB)
        if (thumbnail.size > 1000000 || poster.size > 1000000) {
          errorMessages.push("Image must be less than 1MB");
        }

        // If error
        if (errorMessages.length > 0) {
          return next({ statusCode: 400, messages: errorMessages });
        }

        // Create custom filename
        let fileName = crypto.randomBytes(16).toString("hex");

        // Rename the file
        thumbnail.name = `${fileName}${path.parse(thumbnail.name).ext}`;
        poster.name = `${fileName}${path.parse(poster.name).ext}`;

        // Make file.mv to promise
        const moveThumbnail = promisify(thumbnail.mv);
        const movePoster = promisify(poster.mv);

        // Upload image to /public/images
        await moveThumbnail(`./public/images/thumbnail/${thumbnail.name}`);
        await movePoster(`./public/images/poster/${poster.name}`);

        // assign req.body.image with file.name
        req.body.thumbnail = thumbnail.name;
        req.body.poster = poster.name;
      }

      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  updateValidator = async (req, res, next) => {
    try {
      const errorMessages = [];
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        errorMessages.push("Id is not valid");
      }

      const findMovie = await movie.findOne({ _id: req.params.id });

      if (!findMovie) {
        errorMessages.push("No movie found with this id!");
      }

      if (errorMessages.length > 0) {
        return next({ messages: errorMessages, statusCode: 404 });
      }

      const column = [
        "title",
        "description",
        "synopsis",
        "category",
        "release",
        "director",
        "trailer",
        "years",
        "budget",
        "song",
      ];

      const actors = [];
      const genres = [];

      for (let i = 0; i < column.length; i++) {
        //Check if column is empty
        if (validator.isEmpty(req.body[column[i]].toString())) {
          errorMessages.push(`${column[i]} cannot be empty`);
        }
      }

      //budget must be number
      if (!validator.isInt(req.body.budget.toString())) {
        errorMessages.push("budget must be number");
      }

      //years must be number
      if (!validator.isInt(req.body.years.toString())) {
        errorMessages.push("years must be number");
      }

      //rating must be1 to 10
      if (req.body.rating >= 10 || req.body.rating <= 0) {
        errorMessages.push("rating must be 1 to 10");
      }

      //if name less than 3 char
      if (req.body.description.length <= 3 || req.body.synopsis.length <= 3) {
        errorMessages.push(
          "description and synopsis cannot less than 3 character"
        );
      }

      //if no genre
      if (!req.body.genres) {
        errorMessages.push("genres cannot be empty");
      } else {
        genres.push(req.body.genres);
      }

      //if no actors
      if (!req.body.actor_id) {
        errorMessages.push("actor_id cannot be empty");
      } else {
        actors.push(req.body.actor_id);
      }

      //validate actor id
      for (let val_a = 0; val_a < actors[0].length; val_a++) {
        if (!mongoose.Types.ObjectId.isValid(actors[0][val_a])) {
          errorMessages.push(`${actors[0][val_a]} is not valid`);
        }
      }

      if (errorMessages.length > 0) {
        return next({ messages: errorMessages, statusCode: 400 });
      }

      //======================================================================

      //find from model
      const findCat = await category.findOne({ category: req.body.category });
      if (!findCat) {
        errorMessages.push(`category ${req.body.category} not found!`);
      }

      //find actors from models
      for (let fa_i = 0; fa_i < actors[0].length; fa_i++) {
        const findActor = await actor.findById(actors[0][fa_i]);
        if (!findActor) {
          errorMessages.push(`actor with id ${actors[0][fa_i]} not found!`);
        }
      }

      //find genres from models
      for (let fg_i = 0; fg_i < genres[0].length; fg_i++) {
        const findGenres = await genre.findOne({ genre: genres[0][fg_i] });
        if (!findGenres) {
          errorMessages.push(`genre ${genres[0][fg_i]} not found!`);
        }
      }

      if (errorMessages.length > 0) {
        return next({ messages: errorMessages, statusCode: 400 });
      }

      req.body = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        genres: genres[0],
        actors: actors[0],
        trailer: req.body.trailer,
        synopsis: req.body.synopsis,
        movieInfo: {
          budget: req.body.budget,
          releaseDate: req.body.release,
          years: req.body.years,
          director: req.body.director,
          song: req.body.song,
        },
      };

      // If image was uploaded
      if (!req.files) {
        errorMessages.push("thumbnail and poster is required");
      } else {
        // req.files.image is come from key (file) in postman
        const thumbnail = req.files.thumbnail;
        const poster = req.files.poster;

        if (!thumbnail || !poster) {
          errorMessages.push("thumbnail and poster is required");
        }

        // If error
        if (errorMessages.length > 0) {
          return next({ statusCode: 400, messages: errorMessages });
        }

        // Make sure image is photo
        if (
          !thumbnail.mimetype.startsWith("image") ||
          !poster.mimetype.startsWith("image")
        ) {
          errorMessages.push("File must be an image");
        }

        // Check file size (max 1MB)
        if (thumbnail.size > 1000000 || poster.size > 1000000) {
          errorMessages.push("Image must be less than 1MB");
        }

        // If error
        if (errorMessages.length > 0) {
          return next({ statusCode: 400, messages: errorMessages });
        }

        // Create custom filename
        let fileName = crypto.randomBytes(16).toString("hex");

        // Rename the file
        thumbnail.name = `${fileName}${path.parse(thumbnail.name).ext}`;
        poster.name = `${fileName}${path.parse(poster.name).ext}`;

        // Make file.mv to promise
        const moveThumbnail = promisify(thumbnail.mv);
        const movePoster = promisify(poster.mv);

        // Upload image to /public/images
        await moveThumbnail(`./public/images/thumbnail/${thumbnail.name}`);
        await movePoster(`./public/images/poster/${poster.name}`);

        // assign req.body.image with file.name
        req.body.thumbnail = thumbnail.name;
        req.body.poster = poster.name;
      }
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteValidator = async (req, res, next) => {
    try {
      const errorMessages = [];

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        errorMessages.push("Id is not valid");
      }

      const findMovie = await movie.findOne({ _id: req.params.id });

      if (!findMovie) {
        errorMessages.push("No movie found with this id!");
      }

      if (errorMessages.length > 0) {
        return next({ messages: errorMessages, statusCode: 404 });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new movieValidator();
