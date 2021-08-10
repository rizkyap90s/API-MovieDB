const faker = require("faker");
const { actor } = require("../models/model");

class actorSeeder {
  // Seeder add
  addActor = async () => {
    for (let i = 0; i < 10; i++) {
      await actor.create({
        name: faker.name.findName(),
        photo: faker.image.food(),
      });
    }

    console.log("Actor have been added");
  };

  // Seeder undo (Delete Actor)
  removeActor = async () => {
    await actor.remove();
    console.log("Actor have been deleted");
  };
}

module.exports = new actorSeeder();
