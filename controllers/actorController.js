const { actor } = require("../models/model");

class ActorController {
  getAllActor = async (req, res, next) => {
    try {
      const data = await actor.find().select("id name photo");
      const total = data.length;
      return res.status(200).json({ total, data });
    } catch (error) {
      next(error);
    }
  };
  getById = async (req, res, next) => {
    try {
      const data = await actor
        .findOne({ _id: req.params.id })
        .select("-deleted -__v")
        .populate("movies", "title");
      return res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  addActor = async (req, res, next) => {
    try {
      const newData = await actor.create(req.body);

      const data = await actor
        .findOne({ _id: newData._id })
        .populate("movies", "title")
        .select("-deleted -__v");
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  };

  updateActor = async (req, res, next) => {
    try {
      const newData = await actor.findByIdAndUpdate(req.params.id, req.body);

      const data = await actor
        .findById(req.params.id)
        .populate("movie", "title")
        .select("-deleted -__v");
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  };

  deleteActor = async (req, res, next) => {
    try {
      const newData = await actor.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Actor deleted" });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ActorController();
