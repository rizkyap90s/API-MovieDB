const faker = require("faker");
const { user } = require("../models/model");

// Seeder add
exports.addUser = async () => {
  for (let i = 0; i < 10; i++) {
    await user.create({
      fullname: faker.name.findName(),
      username: faker.name.firstName(),
      email: faker.internet.email(),
      password: "Kiki123!",
      image: faker.image.imageUrl(),
    });
  }

  console.log("User have been added");
};

// Seeder undo
exports.deleteUser = async () => {
  await user.remove();

  console.log("User have been deleted");
};
