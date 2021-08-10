const { genre } = require("../models/model");

class Genre {
  async createGenre(req, res, next) {
    try {
      const newData = await genre.create(req.body);

      let data = await genre.findOne({ _id: newData._id }).select("-__v");

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getAllGenre(req, res, next) {
    try {
      const data = await genre.find().select("-__v");

      if (data.length === 0) {
        return next({ message: "Genre not found", statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getGenreById(req, res, next) {
    try {
      let data = await genre.findOne({ _id: req.params.id }).select("-__v");

      if (!data) {
        return next({ message: "Genre not found", statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updateGenreById(req, res, next) {
    try {
      let data = await genre
        .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .select("-__v");

      if (!data) {
        return next({ message: "Genre not found", statusCode: 404 });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deleteGenreById(req, res, next) {
    try {
      const data = await genre.delete({ _id: req.params.id });

      if (data.n === 0) {
        return next({ message: "Genre not found", statusCode: 404 });
      }

      res.status(200).json({ message: `Genre has been deleted` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Genre();
