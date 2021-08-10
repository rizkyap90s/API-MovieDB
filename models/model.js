require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const mongoose = require("mongoose");

console.log(process.env.MONGO_URI);
const uri = mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

exports.user = require("./user");
exports.review = require("./review");
exports.category = require("./category");
exports.genre = require("./genre");
exports.movie = require("./movie");
exports.actor = require("./actor");
