const request = require("supertest");
const app = require("./app");
const auth = jest.genMockFromModule("./controllers/auth");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//mock the creation of a token in the login
auth.getToken = jest.fn(() => {
	return jwt.sign(
		{ email: "nobody", jti: crypto.randomBytes(16).toString("hex") },
		process.env.TOKEN_SECRET,
		{
			expiresIn: "1h"
		}
	);
});

describe("Express App", () => {
	describe("Routes authorization", () => {
		test("GET / should response 401 Unauthorized if a valid JWT is missing", () => {
			return request(app)
				.get("/")
				.then(response => {
					expect(response.statusCode).toBe(401);
				});
		});
		test("GET /api should response 401 Unauthorized if a valid JWT is missing", () => {
			return request(app)
				.get("/api")
				.then(response => {
					expect(response.statusCode).toBe(401);
				});
		});
		test("GET /api/users should response 401 Unauthorized if a valid JWT is missing", () => {
			return request(app)
				.get("/api/users")
				.then(response => {
					expect(response.statusCode).toBe(401);
				});
		});
	});

	describe("GET returns 404 for wrong paths", () => {
		test("GET /api/wrong should return 404", () => {
			let tempToken = auth.getToken();
			return request(app)
				.get("/api/wrong")
				.set("Authorization", "Bearer " + tempToken)
				.then(response => {
					expect(response.statusCode).toBe(404);
				});
		});
	});
});
