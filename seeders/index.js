const { addCategory, removeCategory } = require("./category");
const { addGenre, removeGenre } = require("./genres");
const { addActor, removeActor } = require("./actor");
const { addReview, removeReview } = require("./review");
const { addMovies, removeMovies } = require("./movies");
const { addUser, deleteUser } = require("./user");

// Add
async function add() {
  await Promise.all([addCategory(), addGenre()]);
  await addActor();
  await addMovies();
  await addUser();
  await addReview();
}

// Remove
async function remove() {
  await Promise.all([
    removeMovies(),
    removeCategory(),
    removeGenre(),
    removeActor(),
    removeReview(),
    deleteUser(),
  ]);
}

if (process.argv[2] === "add") {
  add()
    .then(() => {
      console.log("Seeders success");
      process.exit(0);
    })
    .catch((err) => console.error(err));
} else if (process.argv[2] === "remove") {
  remove()
    .then(() => {
      console.log("Seeders deleted");
      process.exit(0);
    })
    .catch((err) => console.error(err));
}
