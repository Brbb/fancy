const auth = require("./auth");
const UserModel = require("../models/User");

beforeAll(() => {
	require("dotenv").config();
});

describe("Auth controller functionalities", () => {
	describe("User creation", () => {
		test("auth.create: returns a User with an _id", () => {
			jest.spyOn(UserModel, "create").mockReturnValueOnce(
				Promise.resolve({
					id: "mockId",
					email: "mockEmail",
					settings: {}
				})
			);
			return auth.create("any@email.com", "test").then(user => {
				expect(UserModel.create).toBeCalledWith({
					email: "any@email.com",
					password: "test"
				});
				expect(user.id).not.toBe(null);
			});
		});
		test("auth.create: returns a 'Email already in use!' error if user tries to create a duplicate account (E11000)", () => {
			jest
				.spyOn(UserModel, "create")
				.mockReturnValueOnce(Promise.reject(new Error("E11000")));
			return auth.create("any@email.com", "test").then(result => {
				expect(result.err).toEqual("Email already in use!");
			});
		});

		test("auth.create: returns 'Ops, something went wrong.' error in case it fails but not with E11000", () => {
			jest
				.spyOn(UserModel, "create")
				.mockReturnValueOnce(Promise.reject(new Error("Any Error")));
			return auth.create("any@email.com", "test").then(result => {
				expect(result.err).toEqual("Ops, something went wrong.");
			});
		});
	});

	describe("Verify username/password", () => {
		test("auth.verifyUserPassword: returns false if email is not found in the db (or null/empty of course)", () => {
			jest
				.spyOn(UserModel, "findOne")
				.mockReturnValueOnce(Promise.resolve(null));
			return auth.verifyUserPassword("any", "any").then(result => {
				expect(result).toBe(false);
			});
		});

		test("auth.verifyUserPassword: returns false if email is found in the db but password is wrong", () => {
			jest
				.spyOn(UserModel, "findOne")
				.mockReturnValueOnce(
					Promise.resolve(
						new UserModel({ email: "any", password: "different" })
					)
				);

			return auth.verifyUserPassword("any", "wrong").then(result => {
				expect(result).toBe(false);
			});
		});

		test("auth.verifyUserPassword: returns User if email and password are correct", () => {
			const expectedUser = new UserModel();
			jest
				.spyOn(UserModel, "findOne")
				.mockReturnValueOnce(Promise.resolve(expectedUser));

			jest
				.spyOn(UserModel.prototype, "comparePassword")
				.mockReturnValueOnce(true);

			return auth.verifyUserPassword("any", "any").then(result => {
				expect(result).toEqual(expectedUser);
			});
		});
	});

	describe("User login", () => {
		test("auth.login: returns a JWT token and the id for valid email/password", () => {
			jest
				.spyOn(auth, "verifyUserPassword")
				.mockReturnValueOnce({ _id: "anyrandomid", email: "mockEmail" });
			jest.spyOn(auth, "getToken").mockReturnValueOnce("secretToken");

			return auth.login("mockEmail", "test").then(user => {
				expect(user.token).not.toBe(null);
			});
		});

		test("auth.login: returns an error for invalid email/password", () => {
			jest.spyOn(auth, "verifyUserPassword").mockReturnValueOnce(false);
			return auth.login("any@email.com", "test").then(result => {
				expect(result.err).toEqual("Wrong username/password combination");
			});
		});
	});

	describe("User logout", () => {
		test("auth.logout: returns a Logout message for valid token passed as argument", () => {
			return auth.logout("anyValidToken").then(result => {
				expect(result.message).toEqual("Logout user");
			});
		});

		test("auth.logout: returns a Logout message for null token passed as argument", () => {
			return auth.logout().then(result => {
				expect(result.message).toEqual("Logout user");
			});
		});
	});
});
