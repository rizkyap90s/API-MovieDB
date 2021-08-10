const { category } = require("../models/model");

class Category {
  async createCategory(req, res, next) {
    try {
      const newData = await category.create(req.body);

      let data = await category.findOne({ _id: newData._id });

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getAllCategory(req, res, next) {
    try {
      const data = await category.find();

      if (data.length === 0) {
        return next({ message: "Category not found", statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getOneCategory(req, res, next) {
    try {
      let data = await category.findOne({ _id: req.params.id });

      if (!data) {
        return next({ message: "Category not found", statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      let data = await category.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      if (!data) {
        return next({ message: "Category not found", statusCode: 404 });
      }

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const data = await category.delete({ _id: req.params.id });

      if (data.n === 0) {
        return next({ message: "Category not found", statusCode: 404 });
      }

      res.status(200).json({ message: `Category has been deleted` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Category();
