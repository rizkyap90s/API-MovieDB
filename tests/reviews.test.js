const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../index");
const { review, user, movie } = require("../models/model");
let user1Token = "";
let user2Token = "";
let adminToken = "";
let User1 = "";
let User2 = "";
let admin = "";
let theRev = "";
let theMov = "";

beforeAll(async () => {
	User1 = await user.create({
		fullname: "user Testing2",
		username: "userTesting2",
		email: "userTesting2@gmail.com",
		password: "User21234!",
	});

	User2 = await user.create({
		fullname: "user Testing22",
		username: "userTesting22",
		email: "userTesting22@gmail.com",
		password: "User221234!",
	});

	admin = await user.create({
		fullname: "admin Testing2",
		username: "adminTesting2",
		email: "adminTesting2@gmail.com",
		password: "Admin21234!",
		role: "admin",
	});

	theMov = await movie.create({
		title: "Sit Hom Alabambang",
		description: "a movie",
		synopsis: "a sinops",
		genres: "comedy",
		movieInfo: {
			releaseDate: "12-12-12",
			years: "2012",
			director: "Adam McCool",
			rating: "2",
		},
	});

	theRev = await review.create({
		id_user: User1._id,
		id_movie: theMov._id,
		headline: "HEADLINE",
		comment: "review comment",
		rating: "1",
	});

	user1Token = jwt.sign({ user: User1._id }, process.env.JWT_SECRET);
	user2Token = jwt.sign({ user: User2._id }, process.env.JWT_SECRET);
	adminToken = jwt.sign({ user: admin._id }, process.env.JWT_SECRET);
});

describe("POST Create New Review", () => {
	it("Review Created", async () => {
		const res = await request(app)
			.post(`/api/v1/reviews/${theMov._id}`)
			.set("Authorization", `Bearer ${user2Token}`)
			.send({
				id_user: User2._id,
				id_movie: theMov._id,
				headline: "This is Headline1",
				comment: "blaBLAblaBLAblaBLAblaBLA",
				rating: "2",
			});

		expect(res.statusCode).toEqual(201);
		expect(res.body).toBeInstanceOf(Object);
	});
});

describe("GET All Review One Movie", () => {
	it("GET Succesfully", async () => {
		const res = await request(app)
			.get(`/api/v1/reviews/${theMov._id}`)
			.set("Authorization", `Bearer ${user2Token}`);

		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Object);
	});
});

describe("GET All User Review", () => {
	it("GET Succesfully", async () => {
		const res = await request(app)
			.get(`/api/v1/reviews/user/${User2._id}`)
			.set("Authorization", `Bearer ${user2Token}`);

		expect(res.statusCode).toEqual(200);
		expect(res.body).toBeInstanceOf(Object);
	});
});

describe("PUT Update Review by User", () => {
	it("Review Updated", async () => {
		const res = await request(app)
			.put(`/api/v1/reviews/${theRev._id}`)
			.set("Authorization", `Bearer ${user1Token}`)
			.send({
				headline: "This is Headline1 updated",
				comment: "blaBLAblaBLAblaBLAblaBLA",
				rating: "9",
			});

		expect(res.statusCode).toEqual(201);
		expect(res.body).toBeInstanceOf(Object);
	});
});

describe("DELETE Review by Admin", () => {
	it("Review Deleted", async () => {
		const res = await request(app)
			.delete(`/api/v1/reviews/${theRev._id}`)
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.statusCode).toEqual(204);
		expect(res.body).toBeInstanceOf(Object);
	});

	it("Forbidden User unauthorized", async () => {
		const res = await request(app)
			.delete(`/api/v1/reviews/${theRev._id}`)
			.set("Authorization", `Bearer ${user1Token}`);

		expect(res.statusCode).toEqual(403);
		expect(res.body).toBeInstanceOf(Object);
	});
});
