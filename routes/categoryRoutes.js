const express = require("express");

// import auth

//import validator
const { cretaeOrUpdateCategoryValidator, getDetailCategoryValidator } = require("../middlewares/validators/categoryValidator");

//import constroller
const { createCategory, getAllCategory, getOneCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

const router = express.Router();

router.route("/").post(cretaeOrUpdateCategoryValidator, createCategory).get(getAllCategory);

router.route("/:id").get(getDetailCategoryValidator, getOneCategory).put(cretaeOrUpdateCategoryValidator, updateCategory).delete(deleteCategory);

module.exports = router;
