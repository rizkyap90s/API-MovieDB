const faker = require("faker");
const { movie, genre, actor, category } = require("../models/model");

class movieSeeder {
  // Seeder add
  addMovies = async () => {
    const categoryList = await category.find();
    const genresList = await genre.find();
    const actors = await actor.find();

    for (let i = 0; i < 10; i++) {
      await movie.create({
        title: faker.lorem.words(),
        description: faker.lorem.words(),
        trailer: faker.random.alphaNumeric(),
        synopsis: faker.lorem.sentence(30),
        category:
          categoryList[Math.floor(Math.random() * categoryList.length)]
            .category,
        genres: genresList[Math.floor(Math.random() * genresList.length)].genre,
        thumbnail: faker.image.city(),
        poster: faker.image.city(),
        actors: [
          actors[Math.floor(Math.random() * actors.length)]._id,
          actors[Math.floor(Math.random() * actors.length)]._id,
          actors[Math.floor(Math.random() * actors.length)]._id,
          actors[Math.floor(Math.random() * actors.length)]._id,
          actors[Math.floor(Math.random() * actors.length)]._id,
        ],
        movieInfo: {
          releaseDate: faker.date.future(),
          years: 2000 + i,
          director: faker.name.findName(),
          song: faker.music.genre(),
          budget: faker.commerce.price(),
          rating: Math.floor(Math.random() * 10),
          total_rating: Math.floor(Math.random() * 10),
        },
      });
    }
    console.log("Movie have been added");
  };

  // Seeder delete
  removeMovies = async () => {
    await movie.remove();
    console.log("Movie have been deleted");
  };
}

module.exports = new movieSeeder();
