const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../index");
const { actor, movie } = require("../models/model");
const faker = require("faker");
let getRandomActor = "";
let getRandomMovie = "";
beforeAll(async () => {
  const getActor = await actor.find();
  getRandomActor = getActor[Math.floor(Math.random() * getActor.length)]._id;

  const getMovie = await movie.find();
  getRandomMovie = getMovie[Math.floor(Math.random() * getMovie.length)]._id;
});

describe("Get all actor", () => {
  it("get all actor", async () => {
    const res = await request(app).get("/api/v1/actor");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("Get actor by id", () => {
  it("get actor by id", async () => {
    const res = await request(app).get(`/api/v1/actor/${getRandomActor}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });
  it("get actor no id", async () => {
    const res = await request(app).get(
      `/api/v1/actor/610acebc6c6ae698e1b71e3d`
    );
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("Add Actor", () => {
  it("Add actor success", async () => {
    const res = await request(app)
      .post(`/api/v1/actor/`)
      .send({
        name: faker.name.findName(),
        movies: [getRandomMovie],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Add actor failed", async () => {
    const res = await request(app)
      .post(`/api/v1/actor/`)
      .send({
        name: "",
        movies: [getRandomMovie],
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("Update Actor", () => {
  it("Update actor success", async () => {
    const res = await request(app)
      .put(`/api/v1/actor/${getRandomActor}`)
      .send({
        name: "asdadasdasda",
        movies: [getRandomMovie],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Update actor failed", async () => {
    const res = await request(app).put(`/api/v1/actor/${getRandomActor}`).send({
      name: "",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Update actor not found", async () => {
    const res = await request(app)
      .put(`/api/v1/actor/61091ef3c8b43f8c9efc288e`)
      .send({
        name: faker.name.findName(),
        movies: [getRandomMovie],
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("Delete Actor", () => {
  it("Update actor success", async () => {
    const res = await request(app).delete(`/api/v1/actor/${getRandomActor}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Update actor failed not found", async () => {
    const res = await request(app).delete(
      `/api/v1/actor/61091ef3c8b43f8c9efc288e`
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
  });
});
