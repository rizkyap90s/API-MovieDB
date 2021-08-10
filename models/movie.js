const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true, // make unique name
    },
    description: {
      type: String,
      required: true,
    },
    trailer: {
      type: String,
      required: false,
    },
    synopsis: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Movie",
    },
    genres: {
      type: mongoose.Schema.Types.Array,
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
      get: getThumbnailPhoto,
    },
    poster: {
      type: String,
      required: false,
      get: getPosterPhoto,
    },
    actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "actor" }],
    movieInfo: {
      releaseDate: {
        type: String,
        required: true,
      },
      years: {
        type: Number,
        required: true,
      },
      director: {
        type: String,
        required: true,
      },
      song: {
        type: String,
        required: false,
      },
      budget: {
        type: Number,
        default: 0,
        required: false,
      },
      rating: {
        type: Number,
        default: 0,
        required: false,
      },
      total_review: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: {
      createdAt: "createAt",
      updateAt: "updateAt",
    },
    id: false,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
  }
);

// Photo Getter (Poster)
function getPosterPhoto(photo) {
  if (!photo || photo.includes("https") || photo.includes("http")) {
    return photo;
  }

  return `/images/poster/${photo}`;
}

// Photo Getter (Thumbnail)
function getThumbnailPhoto(photo) {
  if (!photo || photo.includes("https") || photo.includes("http")) {
    return photo;
  }

  return `/images/thumbnail/${photo}`;
}

// Enable soft delete, it will make delete column automaticly
movieSchema.plugin(mongooseDelete, { overrideMethods: "all" });

// Export model
module.exports = mongoose.model("movie", movieSchema);
