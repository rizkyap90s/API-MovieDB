const express = require("express");

// import auth
const { admin, user } = require("../middlewares/auth/auth");

//import validator
const {
  getReviewValidator,
  createOrUpdateReviewValidator,
} = require("../middlewares/validators/reviewValidator");

//import constroller
const {
  createReview,
  getAllMoviesReviews,
  getAllUsersReviews,
  updateReview,
  deleteReview,
  getReviewByMovieAndUser,
} = require("../controllers/reviewController");

const router = express.Router();

router
  .route("/:id_movie")
  .post(user, createOrUpdateReviewValidator, createReview)
  .get(getReviewValidator, getAllMoviesReviews);

router.route("/user/:id_user").get(getAllUsersReviews);
router.get("/getreview/:id", user, getReviewByMovieAndUser);

router
  .route("/:id")
  .put(user, createOrUpdateReviewValidator, updateReview)
  .delete(admin, deleteReview);

module.exports = router;
