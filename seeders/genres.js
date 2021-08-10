const { genre } = require("../models/model");

const genresList = [
  "Action",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Thriller",
  "Western",
];

class genreSeeder {
  // Seeder add
  addGenre = async () => {
    for (let i = 0; i < genresList.length; i++) {
      await genre.create({
        genre: genresList[i],
      });
    }
    console.log("Genres have been added");
  };

  // Seeder delete
  removeGenre = async () => {
    await genre.remove();
    console.log("Genres have been deleted");
  };
}

module.exports = new genreSeeder();
