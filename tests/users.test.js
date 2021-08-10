const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../index");
const { user } = require("../models/model");
const faker = require("faker");
let userToken = "";
let adminToken = "";
let ceritanyaUser = "";
let admin = "";

beforeAll(async () => {
  ceritanyaUser = await user.create({
    fullname: "user Testing",
    username: "userTesting",
    email: "userTesting@gmail.com",
    password: "User1234!",
  });

  admin = await user.create({
    fullname: "admin Testing",
    username: "adminTesting",
    email: "adminTesting@gmail.com",
    password: "Admin1234!",
    role: "admin",
  });

  userToken = jwt.sign({ user: ceritanyaUser._id }, process.env.JWT_SECRET);
  adminToken = jwt.sign({ user: admin._id }, process.env.JWT_SECRET);
});

describe("User Signup", () => {
  it("Sign up success", async () => {
    const res = await request(app).post("/auth/signup").send({
      fullname: faker.name.findName(),
      username: faker.name.firstName(),
      email: faker.internet.email(),
      password: "User1234!",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Empty Field", async () => {
    const res = await request(app).post("/auth/signup").send({
      fullname: "",
      username: faker.name.firstName(),
      email: faker.internet.email(),
      password: "User1234!",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Duplicate Email and Name", async () => {
    const res = await request(app).post("/auth/signup").send({
      fullname: "user Testing",
      username: "userTesting",
      email: "userTesting@gmail.com",
      password: "User1234!",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("User Signin", () => {
  it("Signin success", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: "userTesting@gmail.com",
      password: "User1234!",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("Signin empty field", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: "",
      password: "User1234!",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("User no register yet ", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: "userTesting123@gmail.com",
      password: "User1234!",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("User getCurrentUser", () => {
  it("getCurrentUser success", async () => {
    const res = await request(app)
      .get("/auth/getcurrentuser")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("GetCurrentUser no token", async () => {
    const res = await request(app)
      .get("/auth/getcurrentuser")
      .set("Authorization", `Bearer TOKEN_PALSU_HAHA`);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("Update User", () => {
  it("updateUser success", async () => {
    const res = await request(app)
      .put(`/auth/user/${ceritanyaUser._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        fullname: faker.name.findName(),
        username: faker.name.firstName(),
        email: faker.internet.email(),
        password: "User1234!",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("updateUser no user", async () => {
    const res = await request(app).put(`/auth/user/`).send({
      fullname: faker.name.findName(),
      username: faker.name.firstName(),
      email: faker.internet.email(),
      password: "User1234!",
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("Delete User", () => {
  it("delete success", async () => {
    const res = await request(app)
      .delete(`/auth/user/${admin._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toBeInstanceOf(Object);
  });

  it("delete no user", async () => {
    const res = await request(app).delete(`/auth/user/`).send();
    expect(res.statusCode).toEqual(404);
    expect(res.body).toBeInstanceOf(Object);
  });
});

afterAll(async () => {
  admin = await user.findOneAndDelete({
    email: "adminTesting@gmail.com",
  });
  ceritanyaUser = await user.findOneAndDelete({
    email: "userTesting@gmail.com",
  });
});
