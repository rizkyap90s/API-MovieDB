const route = require("express").Router();

//  import validator
const {
  getByIdValidator,
  addValidator,
  updateValidator,
  deleteValidator,
} = require("../middlewares/validators/actorValidator");

// import controller
const {
  getAllActor,
  getById,
  addActor,
  updateActor,
  deleteActor,
} = require("../controllers/actorController");
//  routes

//get all with pagination
route.get("/", getAllActor);
route.get("/:id", getByIdValidator, getById);
route.post("/", addValidator, addActor);
route.put("/:id", updateValidator, updateActor);
route.delete("/:id", deleteValidator, deleteActor);

module.exports = route;
