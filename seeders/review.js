const { user, review, movie } = require("../models/model");
const faker = require("faker");

class reviewSeeder {
  // Seeder add
  addReview = async () => {
    const userList = await user.find();
    const movies = await movie.find();
    for (let i = 0; i < 3; i++) {
      await review.create({
        id_user: userList[Math.floor(Math.random() * userList.length)]._id,
        id_movie: movies[Math.floor(Math.random() * movies.length)]._id,
        headline: faker.lorem.sentence(10),
        comment: faker.lorem.sentence(30),
        rating: 2,
      });
    }
    console.log("Review have been added");
  };

  // Seeder delete
  removeReview = async () => {
    await review.remove();
    console.log("Review have been deleted");
  };
}

module.exports = new reviewSeeder();
