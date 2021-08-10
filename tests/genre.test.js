const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../index");
const { genre } = require("../models/model");
const faker = require("faker");
let getRandom = "";

beforeAll(async () => {
  const getGenre = await genre.find();
  getRandom = getGenre[Math.floor(Math.random() * getGenre.length)]._id;
});

describe("Get Genre", () => {
  it("get all genres", async () => {
    const res = await request(app).get("/api/v1/genre");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("get genre by id", async () => {
    const res = await request(app).get(`/api/v1/genre/${getRandom}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("get not found", async () => {
    const res = await request(app).get(`/api/v1/genre/61091efbddb46b8cd947eeb5`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("Add genre", () => {
  it("Add genre success", async () => {
    const res = await request(app).post(`/api/v1/genre`).send({
      genre: "Yea bois",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Add genre failed", async () => {
    const res = await request(app).post(`/api/v1/genre`);
    expect(res.statusCode).toEqual(500);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("Update genre", () => {
  it("Update genre success", async () => {
    const res = await request(app).put(`/api/v1/genre/${getRandom}`).send({
      genre: faker.name.firstName(),
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("update genre not found", async () => {
    const res = await request(app).put(`/api/v1/genre/61091efbddb46b8cd947eeb5`).send({
      genre: faker.name.firstName(),
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Update genre failed", async () => {
    const res = await request(app).put(`/api/v1/genre/${getRandom}`).send({
      genre: "",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("delete genre", () => {
  it("delete genre success", async () => {
    const res = await request(app).delete(`/api/v1/genre/${getRandom}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("delete genre not found", async () => {
    const res = await request(app).delete(`/api/v1/genre/61091efbddb46b8cd947eeb5`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
  });
});
