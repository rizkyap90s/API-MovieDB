const express = require("express");

const { signup, signin, admin, user } = require("../middlewares/auth/auth");

const {
  signUpAndUpdateValidator,
  signInValidator,
  getUserByIdValidator,
} = require("../middlewares/validators/authValidator");

const {
  getToken,
  getCurrentUser,
  getAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/authController");

const router = express.Router();

// router.get("/user/all", user, getAllUser); //deleted soon
router.get("/user/:id", getUserByIdValidator, getUserById);
router.get("/getcurrentuser", user, getCurrentUser);

router.post("/signup", signUpAndUpdateValidator, signup, getToken);
router.post("/signin", signInValidator, signin, getToken);

router.put("/user/:id", signUpAndUpdateValidator, updateUserById);
router.delete("/user/:id", admin, deleteUserById);

module.exports = router;
