const { user, movie, review } = require("../models/model");

class Reviews {
  async createReview(req, res, next) {
    try {
      const { id_movie } = req.params;
      const newData = await review.create(req.body);

      let result = await review.findById(newData._id);
      result.user = await user.findById(result.id_user);
      result.movie = await movie.findById(result.id_movie);

      let data = {
        id_review: result._id,
        reviewer: {
          id: result.user._id,
          user_name: result.user.username,
        },
        headline: result.headline,
        comment: result.comment,
        rating: result.rating,
        created_at: result.createAt,
      };

      const findAllReview = await review.find({ id_movie });
      const allRating = findAllReview.map((x) => x.rating);
      const avgRating = allRating.reduce((a, b) => a + b, 0) / allRating.length;

      const updateRating = await movie.findByIdAndUpdate(id_movie, {
        "movieInfo.rating": avgRating,
        $inc: { "movieInfo.total_review": 1 },
      });

      res.status(201).json({
        message: `review created successfully`,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  //get all reviews in one movies
  async getAllMoviesReviews(req, res, next) {
    try {
      const id_movie = req.params;

      const allData = await review
        .find(id_movie)
        .sort({ createAt: -1 })
        .populate("id_user", "username")
        .populate("id_movie", "title");
      // console.log(allData.id_movie);
      for (let i = 0; i < allData.length; i++) {
        allData[i] = {
          id_review: allData[i]._id,
          reviewer: {
            id: allData[i].id_user._id,
            user_name: allData[i].id_user.username,
            image: allData[i].id_user.image,
          },
          headline: allData[i].headline,
          comment: allData[i].comment,
          rating: allData[i].rating,
          created_at: allData[i].createAt,
        };
      }

      if (allData) {
        const count = req.query.page || 1;
        const page = parseInt(count);
        const limit = 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result = {};
        if (endIndex < allData.length) {
          result.next = {
            page: page + 1,
          };
        }
        if (startIndex > 0) {
          result.previous = {
            page: page - 1,
          };
        }

        result.results = allData.slice(startIndex, endIndex);

        res.status(200).json({
          page,
          next: result.next,
          total_result: allData.length,
          allData,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getAllUsersReviews(req, res, next) {
    try {
      const id_user = req.params;
      const allData = await review
        .find(id_user)
        .populate("id_user", "username")
        .populate("id_movie", "title poster movieInfo");

      for (let i = 0; i < allData.length; i++) {
        allData[i] = {
          id_review: allData[i]._id,
          movie: {
            id: allData[i].id_movie._id,
            poster: allData[i].id_movie.poster,
            release_date: allData[i].id_movie.movieInfo.releaseDate,
          },
          headline: allData[i].headline,
          comment: allData[i].comment,
          rating: allData[i].rating,
          created_at: allData[i].createAt,
        };
      }

      if (allData) {
        const count = req.query.page || 1;
        const page = parseInt(count);
        const limit = 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result = {};
        if (endIndex < allData.length) {
          result.next = {
            page: page + 1,
          };
        }
        if (startIndex > 0) {
          result.previous = {
            page: page - 1,
          };
        }

        result.results = allData.slice(startIndex, endIndex);

        res.status(200).json({
          page,
          next: result.next,
          total_result: allData.length,
          allData,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req, res, next) {
    try {
      let updateData = await review.findOneAndUpdate(
        { _id: req.params.id },
        {
          headline: req.body.headline,
          comment: req.body.comment,
          rating: req.body.rating,
        },
        { new: true }
      );

      let result = await review.findById(updateData._id);
      result.user = await user.findById(result.id_user);
      result.movie = await movie.findById(result.id_movie);

      let data = {
        id_review: result._id,
        reviewer: {
          id: result.user._id,
          user_name: result.user.username,
          image: result.user.image,
        },
        headline: result.headline,
        comment: result.comment,
        rating: result.rating,
        updated_at: result.updatedAt,
      };

      const id_movie = result.movie._id;
      const findAllReview = await review.find({ id_movie });
      const allRating = findAllReview.map((x) => x.rating);
      const avgRating = allRating.reduce((a, b) => a + b) / allRating.length;

      const updateRating = await movie.findByIdAndUpdate(id_movie, {
        "movieInfo.rating": avgRating,
      });
      console.log(updateData);

      res
        .status(201)
        .json({ message: `review updated successfully`, updated_data: data });
    } catch (error) {
      next(error);
    }
  }

  async getReviewByMovieAndUser(req, res, next) {
    try {
      const getReview = await review.find({ id_user: req.user.user });
      const data = await getReview.filter((rev) => {
        return rev.id_movie == req.params.id;
      });
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
  //

  async deleteReview(req, res, next) {
    try {
      const id_review = req.params.id;
      const deletedReview = await review.delete({ _id: id_review });

      const findDeleted = await review.findOneDeleted({ _id: id_review });

      const id_movie = findDeleted.id_movie;
      const findAllReview = await review.find({ id_movie });
      const allRating = findAllReview.map((x) => x.rating);
      const avgRating = allRating.reduce((a, b) => a + b, 0) / allRating.length;

      const updateRating = await movie.findByIdAndUpdate(id_movie, {
        "movieInfo.rating": avgRating,
        $inc: { "movieInfo.total_review": -1 },
      });

      res.status(204).json({ message: `Review has been deleted` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Reviews();
