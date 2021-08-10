const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      requires: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      set: setPassword,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
      default: "user",
    },
    image: {
      type: String,
      required: false,
      get: getImage,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

function setPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function getImage(img) {
  if (!img || img.includes("https") || img.includes("http")) {
    return img;
  }
  return `/images/users/${img}`;
}
userSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("user", userSchema);
