const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const genreSchema = new mongoose.Schema(
  {
    genre: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

genreSchema.plugin(mongooseDelete, { overrideMethods: "all" }); //enable soft delete

module.exports = mongoose.model("genre", genreSchema);
