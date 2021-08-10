const express = require("express");
const route = express.Router();

//import authorization
const { admin } = require("../middlewares/auth/auth");

//  import validator
const {
  getValidator,
  getByIdValidator,
  getAllActorValidator,
  addValidator,
  updateValidator,
  deleteValidator,
} = require("../middlewares/validators/movieValidator");

// import controller
const {
  getController,
  getbyIdController,
  getActorsController,
  addController,
  updateController,
  deleteController,
} = require("../controllers/movieController");

//  routes

//get all with pagination
route.get("/", getValidator, getController);

//get by id
route.get("/:id", getByIdValidator, getbyIdController);

//get actor by movieid
route.get("/:id/actors", getAllActorValidator, getActorsController);

//add movie
route.post("/", admin, addValidator, addController);

//update movie
route.put("/:id", admin, updateValidator, updateController);

//delete movie
route.delete("/:id", admin, deleteValidator, deleteController);

module.exports = route;
