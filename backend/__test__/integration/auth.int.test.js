const request = require("supertest");
const app = require("../../app");
const database = require("../../models/database");
const UserModel = require("../../models/User");

beforeAll(() => {
	jest.setTimeout(15000);
	database.connect();
});

afterAll(async () => {
	await UserModel.deleteMany({});
	database.disconnect();
});

describe("Signup to auth management integration tests. API → DB, no mocks.", () => {
	describe("POST /api/auth/signup", () => {
		test("Returns a User for successful signup", async () => {
			await request(app)
				.post("/api/auth/signup")
				.send({
					email: "email",
					password: "random1234",
					repeatPassword: "random1234"
				})
				.expect(200)
				.then(res => {
					expect(res.body.id).not.toBeFalsy();
					expect(res.body.email).toEqual("email");
				});
		});

		test("Returns an error for duplicate user", async () => {
			await request(app)
				.post("/api/auth/signup")
				.send({
					email: "email",
					password: "random1234",
					repeatPassword: "random1234"
				})
				.expect(409)
				.then(res => {
					expect(res.body.err).toEqual("Email already in use!");
				});
		});
	});

	describe("POST /api/auth/login", () => {
		test("Returns a token for successful login", async () => {
			await request(app)
				.post("/api/auth/login")
				.send({
					email: "email",
					password: "random1234"
				})
				.expect(200)
				.then(response => {
					expect(response.body.token).not.toBeFalsy();
				});
		});
		test("Returns an error message for wrong credentials", async () => {
			await request(app)
				.post("/api/auth/login")
				.send({
					email: "email",
					password: "wrongPassword"
				})
				.expect(400)
				.then(response => {
					expect(response.body.err).toEqual("Wrong username/password combination");
				});
		});
	});

	describe("POST /api/auth/logout", () => {
		test("Returns a logout message for successful logout", async () => {
			await request(app)
				.post("/api/auth/logout")
				.expect(200)
				.then(response => {
					expect(response.body.message).toEqual("Logout user");
				});
		});
	});
});
