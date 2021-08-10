const jwt = require("jsonwebtoken");
const { user } = require("../models/model");

class Auth {
  async getToken(req, res, next) {
    try {
      const id = { user: req.user._id };
      const token = await jwt.sign(id, process.env.JWT_SECRET);
      const data = await user.findOne({ _id: req.user._id }).select("-password -__v");
      data._doc.token = token;
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
  async getCurrentUser(req, res, next) {
    try {
      const data = await user.findOne({ _id: req.user.user }).select("-password -__v");
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  // async getAllUser(req, res, next) {
  //   try {
  //     const data = await user.find().select("-password -__v");
  //     console.log(req.user.user);

  //     res.status(200).json({ data });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  async getUserById(req, res, next) {
    try {
      const data = await user.findOne({ _id: req.params.id }).select("-password -__v");
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
  async updateUserById(req, res, next) {
    try {
      const data = await user
        .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .select("-password -__v");
      if (!data) {
        return next({ message: "User not found", statusCode: 404 });
      }
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }
  async deleteUserById(req, res, next) {
    try {
      const data = await user.deleteOne({ _id: req.params.id });
      if (data.n === 0) {
        return next({
          message: "user not found",
          statusCode: 404,
        });
      }
      res.status(201).json({ message: `user ${req.params.id} has been deleted` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Auth();
