const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../index");
const { movie, actor, genre, category, user } = require("../models/model");
const faker = require("faker");

let adminToken = "";
let admin = "";

beforeAll(async () => {
	admin = await user.create({
		fullname: "admin Testing3",
		username: "adminTesting3",
		email: "adminTesting3@gmail.com",
		password: "Admin31234!",
		role: "admin",
	});

	adminToken = jwt.sign({ user: admin._id }, process.env.JWT_SECRET);

	categoryList = await category.find();
	genresList = await genre.find();
	actors = await actor.find();
	movies = await movie.find();
});

describe("GET Movie", () => {
	it("Get all Data success", async () => {
		const res = await request(app).get("/api/v1/movie");
		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Get no data", async () => {
		const res = await request(app).get("/api/v1/movie?genres=nyeesss");
		expect(res.statusCode).toEqual(404);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Get not found", async () => {
		const res = await request(app).get(
			"/api/v1/movie/610aa21fe421db4a3b88632c"
		);
		expect(res.statusCode).toEqual(404);
		expect(res.body).toBeInstanceOf(Object);
	});
});

describe("Add movie", () => {
	it("Add Movie success", async () => {
		const res = await request(app)
			.post("/api/v1/movie")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: faker.lorem.words(),
				description: faker.lorem.words(),
				trailer: "https://www.youtube.com/watch?v=La460Ib5DPY",
				synopsis: faker.lorem.sentence(30),
				category:
					categoryList[Math.floor(Math.random() * categoryList.length)]
						.category,
				genres: [
					genresList[Math.floor(Math.random() * genresList.length)].genre,
				],

				thumbnail:
					"https://i1.sndcdn.com/artworks-000608006128-bvmugt-t500x500.jpg",
				poster:
					"https://i1.sndcdn.com/artworks-000608006128-bvmugt-t500x500.jpg",
				actor_id: [
					actors[Math.floor(Math.random() * actors.length)]._id,
					actors[Math.floor(Math.random() * actors.length)]._id,
					actors[Math.floor(Math.random() * actors.length)]._id,
					actors[Math.floor(Math.random() * actors.length)]._id,
					actors[Math.floor(Math.random() * actors.length)]._id,
				],
				release: faker.date.future(),
				years: 2002,
				director: faker.name.findName(),
				song: faker.music.genre(),
				budget: 7518465487,
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Add error value", async () => {
		const res = await request(app)
			.post("/api/v1/movie")
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: faker.lorem.words(),
				description: faker.lorem.words(),
				trailer: "https://www.youtube.com/watch?v=La460Ib5DPY",
				synopsis: faker.lorem.sentence(30),
				category: "YEAA BOIIS",
				genres: [
					genresList[Math.floor(Math.random() * genresList.length)].genre,
				],
				thumbnail:
					"https://i1.sndcdn.com/artworks-000608006128-bvmugt-t500x500.jpg",
				poster:
					"https://i1.sndcdn.com/artworks-000608006128-bvmugt-t500x500.jpg",
				actor_id: [
					[
						actors[Math.floor(Math.random() * actors.length)]._id,
						actors[Math.floor(Math.random() * actors.length)]._id,
						actors[Math.floor(Math.random() * actors.length)]._id,
						actors[Math.floor(Math.random() * actors.length)]._id,
						actors[Math.floor(Math.random() * actors.length)]._id,
					],
				],
				release: faker.date.future(),
				years: 2002,
				director: faker.name.findName(),
				song: faker.music.genre(),
				budget: faker.commerce.price(),
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Add forbidden", async () => {
		const res = await request(app)
			.post("/api/v1/movie")
			.set("Authorization", `Bearer TOKEN_PALSU_HAHA`)
			.send({
				title: faker.lorem.words(),
				description: faker.lorem.words(),
				trailer: "https://www.youtube.com/watch?v=La460Ib5DPY",
				synopsis: faker.lorem.sentence(30),
				category:
					categoryList[Math.floor(Math.random() * categoryList.length)]
						.category,
				genres: [
					genresList[Math.floor(Math.random() * genresList.length)].genre,
				],

				thumbnail:
					"https://i1.sndcdn.com/artworks-000608006128-bvmugt-t500x500.jpg",
				poster:
					"https://i1.sndcdn.com/artworks-000608006128-bvmugt-t500x500.jpg",
				actor_id: [
					actors[Math.floor(Math.random() * actors.length)]._id,
					actors[Math.floor(Math.random() * actors.length)]._id,
					actors[Math.floor(Math.random() * actors.length)]._id,
					actors[Math.floor(Math.random() * actors.length)]._id,
					actors[Math.floor(Math.random() * actors.length)]._id,
				],
				release: faker.date.future(),
				years: 2002,
				director: faker.name.findName(),
				song: faker.music.genre(),
				budget: 7518465487,
			});

		expect(res.statusCode).toEqual(403);
		expect(res.body).toBeInstanceOf(Object);
	});
});

describe("Update movie", () => {
	it("Update success", async () => {
		const res = await request(app)
			.put(
				`/api/v1/movie/${movies[Math.floor(Math.random() * movies.length)]._id}`
			)
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: faker.lorem.words(),
				description: faker.lorem.words(),
				trailer: "https://www.youtube.com/watch?v=La460Ib5DPY",
				synopsis: faker.lorem.sentence(30),
				category:
					categoryList[Math.floor(Math.random() * categoryList.length)]
						.category,
				genres: [
					genresList[Math.floor(Math.random() * genresList.length)].genre,
				],

				thumbnail:
					"https://i1.sndcdn.com/artworks-000608006128-bvmugt-t500x500.jpg",
				poster:
					"https://i1.sndcdn.com/artworks-000608006128-bvmugt-t500x500.jpg",
				actor_id: [
					actors[Math.floor(Math.random() * actors.length)]._id,
					actors[Math.floor(Math.random() * actors.length)]._id,
					actors[Math.floor(Math.random() * actors.length)]._id,
					actors[Math.floor(Math.random() * actors.length)]._id,
					actors[Math.floor(Math.random() * actors.length)]._id,
				],
				release: faker.date.future(),
				years: 2002,
				director: faker.name.findName(),
				song: faker.music.genre(),
				budget: 7518465487,
			});

		expect(res.statusCode).toEqual(201);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Update error value", async () => {
		const res = await request(app)
			.put(
				`/api/v1/movie/${movies[Math.floor(Math.random() * movies.length)]._id}`
			)
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Updated movie",
				description: faker.lorem.words(),
				trailer: "https://www.youtube.com/watch?v=La460Ib5DPY",
				synopsis: faker.lorem.sentence(30),
				category: "YEABOIIS",
				genres: [
					genresList[Math.floor(Math.random() * genresList.length)].genre,
				],
				thumbnail:
					"https://i1.sndcdn.com/artworks-000608006128-bvmugt-t500x500.jpg",
				poster:
					"https://i1.sndcdn.com/artworks-000608006128-bvmugt-t500x500.jpg",
				actor_id: [
					[
						actors[Math.floor(Math.random() * actors.length)]._id,
						actors[Math.floor(Math.random() * actors.length)]._id,
						actors[Math.floor(Math.random() * actors.length)]._id,
						actors[Math.floor(Math.random() * actors.length)]._id,
						actors[Math.floor(Math.random() * actors.length)]._id,
					],
				],
				release: faker.date.future(),
				years: 2002,
				director: faker.name.findName(),
				song: faker.music.genre(),
				budget: faker.commerce.price(),
			});

		expect(res.statusCode).toEqual(400);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Update movie not found", async () => {
		const res = await request(app)
			.put(`/api/v1/movie/610aa21fe421db4a3b88632c`)
			.set("Authorization", `Bearer ${adminToken}`)
			.send({
				title: "Updated movie",
				description: faker.lorem.words(),
				trailer: "https://www.youtube.com/watch?v=La460Ib5DPY",
				synopsis: faker.lorem.sentence(30),
				category: "YEABOIIS",
				genres: [
					genresList[Math.floor(Math.random() * genresList.length)].genre,
				],
				thumbnail:
					"https://i1.sndcdn.com/artworks-000608006128-bvmugt-t500x500.jpg",
				poster:
					"https://i1.sndcdn.com/artworks-000608006128-bvmugt-t500x500.jpg",
				actor_id: [
					[
						actors[Math.floor(Math.random() * actors.length)]._id,
						actors[Math.floor(Math.random() * actors.length)]._id,
						actors[Math.floor(Math.random() * actors.length)]._id,
						actors[Math.floor(Math.random() * actors.length)]._id,
						actors[Math.floor(Math.random() * actors.length)]._id,
					],
				],
				release: faker.date.future(),
				years: 2002,
				director: faker.name.findName(),
				song: faker.music.genre(),
				budget: faker.commerce.price(),
			});

		expect(res.statusCode).toEqual(404);
		expect(res.body).toBeInstanceOf(Object);
	});
});

describe("Delete Movie", () => {
	it("Delete success", async () => {
		const res = await request(app)
			.delete(
				`/api/v1/movie/${movies[Math.floor(Math.random() * movies.length)]._id}`
			)
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Delete not found", async () => {
		const res = await request(app)
			.delete(`/api/v1/movie/610aa21fe421db4a3b88632c`)
			.set("Authorization", `Bearer ${adminToken}`);
		expect(res.statusCode).toEqual(404);
		expect(res.body).toBeInstanceOf(Object);
	});
});
