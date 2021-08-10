const faker = require("faker");
const { category } = require("../models/model");
const list = ["Animation", "Movie", "TV-Series", "Drama", "Documenter"];

class categorySeeder {
  // Seeder add
  addCategory = async () => {
    for (let i = 0; i < 10; i++) {
      await category.create({
        category: list[Math.floor(Math.random() * category.length)],
      });
    }

    console.log("Category have been added");
  };

  // Seeder undo (Delete Actor)
  removeCategory = async () => {
    await category.remove();
    console.log("Category have been deleted");
  };
}

module.exports = new categorySeeder();
