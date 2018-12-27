const request = require("supertest");
const app = require("../../app");
const database = require("../../models/database");
const UserModel = require("../../models/User");
const authCtrl = require("../../controllers/auth");

var ObjectId = require("mongoose").Types.ObjectId;

const testEmail = "testEmail";
const testPassword = "testPassword";

beforeAll(() => {
	database.connect();
});

afterAll(async () => {
	await UserModel.deleteMany({});
	database.disconnect();
});

describe("Signup to User management integration tests. API → DB, no mocks.", () => {
	let testUser = {};
	// I need this test to create a user without tricks or mocks.
	// Jest doesn't have an ordered execution
	describe("POST /api/auth/signup", () => {
		test("Returns a User for successful signup", async () => {
			await request(app)
				.post("/api/auth/signup")
				.send({
					email: testEmail,
					password: testPassword,
					repeatPassword: testPassword
				})
				.expect(200)
				.then(res => {
					expect(res.body.id).not.toBeFalsy();
					expect(res.body.email).toEqual(testEmail);
					testUser = res.body;
				});
		});
	});

	describe("GET /api/users/", () => {
		test("Returns all the users", async () => {
			let allUsers = await UserModel.find();
			allUsers = allUsers.map(u => {
				return u.email;
			});

			await request(app)
				.get("/api/users")
				.set("Authorization", "Bearer " + authCtrl.getToken(testEmail))
				.expect(200)
				.then(res => {
					expect(
						res.body.map(u => {
							return u.email;
						})
					).toEqual(allUsers);
				});
		});
	});

	describe("GET /api/users/:id", () => {
		test("Returns the specified user", async () => {
			await request(app)
				.get("/api/users/" + testUser.id)
				.set("Authorization", "Bearer " + authCtrl.getToken(testUser.email))
				.expect(200)
				.then(res => {
					expect(res.body.email).toEqual(testUser.email);
				});
		});

		test("Returns 'User not found' if user id doesn't match", async () => {
			const objectId = new ObjectId();
			await request(app)
				.get("/api/users/"+objectId)
				.set("Authorization", "Bearer " + authCtrl.getToken(testUser.email))
				.expect(400)
				.then(res => {
					expect(res.body.err).toEqual("User not found");
				});
		});
	});

	describe("PUT /api/users/:id/password", () => {
		test("Changes password for the specified user and redirect to logout", async () => {
			await request(app)
				.put(`/api/users/${testUser.id}/password`)
				.set("Authorization", "Bearer " + authCtrl.getToken(testUser.email))
				.send({
					oldPassword: testPassword,
					newPassword: "any",
					repeatNewPassword: "any"
				})
				.expect(307);
		});
	});

	describe("DELETE /api/users/:id/", () => {
		test("Deletes specified user and redirect to logout", async () => {
			await request(app)
				.delete(`/api/users/${testUser.id}`)
				.set("Authorization", "Bearer " + authCtrl.getToken(testUser.email))
				.expect(307)
				.then(async ()=>{
					let deletedUser = await UserModel.findById(testUser.id);
					expect(deletedUser).toBeNull();
				});
		});
	});
});
