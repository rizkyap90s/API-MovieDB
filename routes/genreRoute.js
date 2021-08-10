const express = require("express");
const route = express.Router();

const {
  getAllGenre,
  getGenreById,
  createGenre,
  updateGenreById,
  deleteGenreById,
} = require("../controllers/genreController");

const {
  createGenreValidator,
  updateGenreValidator,
  getGenreByIdValidator,
} = require("../middlewares/validators/genreValidator");

route.get("/", getAllGenre);
route.get("/:id", getGenreByIdValidator, getGenreById);
route.post("/", createGenreValidator, createGenre);
route.put("/:id", updateGenreValidator, updateGenreById);
route.delete("/:id", deleteGenreById);

module.exports = route;
