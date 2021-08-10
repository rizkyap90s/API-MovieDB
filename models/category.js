const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

categorySchema.plugin(mongooseDelete, { overrideMethods: "all" }); //enable soft delete

module.exports = mongoose.model("category", categorySchema);
