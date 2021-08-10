const request = require("supertest");
const app = require("../index");
const { category } = require("../models/model");
const faker = require("faker");
let getRandom = "";

beforeAll(async () => {
	const getCat = await category.find();
	getRandom = getCat[Math.floor(Math.random() * getCat.length)]._id;
});

describe("GET Category", () => {
	it("GET All Category ", async () => {
		const res = await request(app).get("/api/v1/category/");

		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("GET Category by Id", async () => {
		const res = await request(app).get(`/api/v1/category/${getRandom}`);

		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Category not found", async () => {
		const res = await request(app).get(
			`/api/v1/category/61091efbddb46b8cd947eeb5`
		);

		expect(res.statusCode).toEqual(404);
		expect(res.body).toBeInstanceOf(Object);
	});
});

describe("POST Add Category", () => {
	it("Add Category Success", async () => {
		const res = await request(app).post(`/api/v1/category/`).send({
			category: "Mamamtuh",
		});

		expect(res.statusCode).toEqual(201);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Add Category Failed", async () => {
		const res = await request(app).post(`/api/v1/category`);

		expect(res.statusCode).toEqual(500);
		expect(res.body).toBeInstanceOf(Object);
	});
});

describe("PUT Update Category", () => {
	it("Update Category success", async () => {
		const res = await request(app).put(`/api/v1/category/${getRandom}`).send({
			category: faker.name.firstName(),
		});

		expect(res.statusCode).toEqual(201);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Update Category Failed", async () => {
		const res = await request(app)
			.put(`/api/v1/category/61091efbddb46b8cd947eeb5`)
			.send({
				category: faker.name.firstName(),
			});

		expect(res.statusCode).toEqual(404);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Update Must Be Filled", async () => {
		const res = await request(app).put(`/api/v1/category/${getRandom}`).send({
			category: "",
		});

		expect(res.statusCode).toEqual(400);
		expect(res.body).toBeInstanceOf(Object);
	});
});

describe("DELETE Category", () => {
	it("Delete success", async () => {
		const res = await request(app).delete(`/api/v1/category/${getRandom}`);

		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Delete category not found", async () => {
		const res = await request(app).delete(
			`/api/v1/category/61091efbddb46b8cd947eeb5`
		);

		expect(res.statusCode).toEqual(404);
		expect(res.body).toBeInstanceOf(Object);
	});
});
