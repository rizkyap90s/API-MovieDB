const { movie } = require("../models/model");

class MovieController {
  getController = async (req, res, next) => {
    try {
      const condition = [];

      let { page, size, genres, category, years, rating, sort, title } =
        req.query;

      // new RegExp(title, "i");
      if (title) {
        condition.push({ title: new RegExp(title, "i") });
      }

      if (genres) {
        condition.push({ genres: genres });
      }

      if (rating) {
        condition.push({ "movieInfo.rating": rating });
      }

      if (category) {
        condition.push({ category: category });
      }

      if (years) {
        years = parseInt(years);
        condition.push({ "movieInfo.years": years });
      }

      if (!page) {
        page = 1;
      }

      if (!size) {
        size = 10;
      }

      const limit = parseInt(size);
      const skip = (page - 1) * size;

      //total page masih error

      if (condition.length >= 1 && condition.length < 5) {
        if (sort && sort === "des") {
          const countAll = await movie.countDocuments({ $and: condition });
          const totalPage = Math.floor((countAll + limit - 1) / limit);

          const data = await movie
            .find({
              $and: condition,
            })
            .sort({ "movieInfo.rating": -1 })
            .select("title category genres thumbnail poster movieInfo.rating")
            .limit(limit)
            .skip(skip);

          if (data.length === 0) {
            return next({ message: "No Movie!", statusCode: 404 });
          }
          const total = data.length;

          return res.status(200).json({
            page,
            total_page: totalPage,
            total,
            data,
          });
        } else if (sort && sort === "asc") {
          const countAll = await movie.countDocuments({ $and: condition });
          const totalPage = Math.floor((countAll + limit - 1) / limit);

          const data = await movie
            .find({
              $and: condition,
            })
            .sort({ "movieInfo.rating": 1 })
            .select("title category genres thumbnail poster movieInfo.rating")
            .limit(limit)
            .skip(skip);

          if (data.length === 0) {
            return next({ message: "No Movie!", statusCode: 404 });
          }
          const total = data.length;

          return res.status(200).json({
            page,
            total_page: totalPage,
            total,
            data,
          });
        } else {
          const countAll = await movie.countDocuments({ $and: condition });
          const totalPage = Math.floor((countAll + limit - 1) / limit);

          const data = await movie
            .find({
              $and: condition,
            })
            .select("title category genres thumbnail poster movieInfo.rating")
            .limit(limit)
            .skip(skip);

          if (data.length === 0) {
            return next({ message: "No Movie!", statusCode: 404 });
          }
          const total = data.length;

          return res.status(200).json({
            page,
            total_page: totalPage,
            total,
            data,
          });
        }
      }

      //No condition
      if (!genres && !category && !years && !rating) {
        if (sort && sort === "des") {
          const countAll = await movie.countDocuments();
          const totalPage = Math.floor((countAll + limit - 1) / limit);

          const data = await movie
            .find()
            .sort({ "movieInfo.rating": -1 })
            .select("title category genres thumbnail poster movieInfo.rating")
            .limit(limit)
            .skip(skip);

          if (data.length === 0) {
            return next({ message: "No Movie!", statusCode: 404 });
          }
          const total = data.length;

          return res.status(200).json({
            page,
            total_page: totalPage,
            total,
            data,
          });
        } else if (sort && sort === "asc") {
          const countAll = await movie.countDocuments();
          const totalPage = Math.floor((countAll + limit - 1) / limit);

          const data = await movie
            .find()
            .sort({ "movieInfo.rating": 1 })
            .select("title category genres thumbnail poster movieInfo.rating")
            .limit(limit)
            .skip(skip);

          if (data.length === 0) {
            return next({ message: "No Movie!", statusCode: 404 });
          }
          const total = data.length;

          return res.status(200).json({
            page,
            total_page: totalPage,
            total,
            data,
          });
        } else {
          const countAll = await movie.countDocuments();
          const totalPage = Math.floor((countAll + limit - 1) / limit);
          const data = await movie
            .find()
            .select("title category genres thumbnail poster movieInfo.rating")
            .limit(limit)
            .skip(skip);

          if (data.length === 0) {
            return next({ message: "No Movie!", statusCode: 404 });
          }
          const total = data.length;

          return res.status(200).json({
            page,
            total_page: totalPage,
            total,
            data,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  getbyIdController = async (req, res, next) => {
    try {
      const data = await movie
        .findById(req.params.id)
        .select("-deleted")
        .populate("actors", "name");

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  getActorsController = async (req, res, next) => {
    try {
      const data = await movie
        .findById(req.params.id)
        .select("actors")
        .populate("actors", "name photo");

      const total = data.actors.length;

      res.status(200).json({ total, data });
    } catch (error) {
      next(error);
    }
  };

  addController = async (req, res, next) => {
    try {
      const newData = await movie.create(req.body);

      const data = await movie
        .findById(newData._id)
        .populate("actors", "name")
        .select("-deleted");
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  };

  updateController = async (req, res, next) => {
    try {
      const newData = await movie.findByIdAndUpdate(req.params.id, req.body);

      const data = await movie
        .findById(req.params.id)
        .populate("actors", "name")
        .select("-deleted");
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  };
  deleteController = async (req, res, next) => {
    try {
      const data = await movie.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Movie deleted" });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new MovieController();
