const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const actorSchema = new mongoose.Schema(
  // Column
  {
    name: {
      type: String,
      required: true,
    },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "movie" }],
    photo: {
      type: String,
      required: false,
      get: getPhoto,
    },
  },
  // Options
  {
    id: false,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
    // Enable timestamps
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toJSON: { getters: true },
  }
);

// Photo Getter
function getPhoto(photo) {
  if (!photo || photo.includes("https") || photo.includes("http")) {
    return photo;
  }

  return `/images/actor/${photo}`;
}
// Enable soft delete, it will make delete column automaticly
actorSchema.plugin(mongooseDelete, { overrideMethods: "all" });

// Export model
module.exports = mongoose.model("actor", actorSchema);
