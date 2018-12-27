const users = require("./users.handler");
const ctrl = require("../../controllers/users");

beforeAll(() => {
	require("dotenv").config();
});

describe("Users handler methods", () => {
	let res = {};
	res.send = jest.fn(payload => {
		return payload;
	});
	res.redirect = jest.fn();

	describe("Get all users", () => {
		test("users.getAll returns the list of users", () => {
			const usersArray = [
				{ id: "1", email: "user.email1", settings: {} },
				{ id: "2", email: "user.email2", settings: {} }
			];

			jest.spyOn(ctrl, "all").mockImplementationOnce(() => {
				return usersArray;
			});

			users.getAll({}, res).then(payload => {
				expect(payload).toEqual(usersArray);
			});
		});
	});

	describe("Get specific user by ID", () => {
		test("users.getById with an empty ID, returns 'Invalid parameters!'", () => {
			users.getById({ params: {} }, res).then(payload => {
				expect(payload).toEqual("Invalid parameters!");
			});
		});

		test("users.getById with a valid ID, returns any value the controller returns", () => {
			jest.spyOn(ctrl, "retrieve").mockImplementationOnce(() => {
				return "ctrl.retrieve return value";
			});

			users.getById({ params: { id: "anyId" } }, res).then(payload => {
				expect(payload).toEqual("ctrl.retrieve return value");
			});
		});
	});

	describe("Update specific user", () => {
		test("users.updateUser with an empty ID, returns 'Invalid parameters!'", () => {
			users.updateUser({}, res).then(payload => {
				expect(payload).toEqual("Invalid parameters!");
			});
		});

		test("users.updateUser with a valid ID, returns any value the controller returns", () => {
			let updateUser = jest.spyOn(ctrl, "update");

			updateUser.mockImplementationOnce(() => {
				return "ctrl.retrieve return value";
			});

			users
				.updateUser(
					{ params: { id: "anyId" }, body: { language: "Korean" } },
					res
				)
				.then(payload => {
					expect(updateUser).toHaveBeenCalledWith("anyId", {
						language: "Korean"
					});
					expect(payload).toEqual("ctrl.retrieve return value");
				});
		});
	});

	describe("Delete specific user", () => {
		test("users.delete with an empty ID, returns 'Invalid parameters!'", () => {
			users.deleteUser({}, res).then(payload => {
				expect(payload).toEqual("Invalid parameters!");
			});
		});
		test("users.delete doesn't redirect to logout after deletions on error", () => {
			jest.spyOn(ctrl, "delete").mockImplementationOnce(() => {
				return { err: "error" };
			});

			users.deleteUser({ params: {} }, res).then(() => {
				expect(res.send).toHaveBeenCalledWith({ err: "error" });
			});
		});

		test("users.delete redirect to logout after deletions without error", () => {
			jest.spyOn(ctrl, "delete").mockImplementationOnce(() => {
				return {};
			});

			users.deleteUser({ params: {} }, res).then(() => {
				expect(res.redirect).toHaveBeenCalledWith(307, "../auth/logout");
			});
		});
	});

	describe("Change password", () => {
		test("users.changePassword without a body returns err == 'Invalid request format!'", () => {
			users.changePassword({}, res).then(result => {
				expect(result.err).toEqual("Invalid request format!");
			});
		});

		test("users.changePassword without passwords returns err == 'Invalid request format! All the password fields are required.'", () => {
			users
				.changePassword({ body: { repeatNewPassword: "" } }, res)
				.then(result => {
					expect(result.err).toEqual(
						"Invalid request format! All the password fields are required."
					);
				});
		});

		test("users.changePassword returns err==Passwords must match! for non-matching password error", () => {
			
			users
				.changePassword(
					{
						body: {
							newPassword: "newPass",
							repeatNewPassword: "wrongNewPass",
							oldPassword: "oldPass"
						}
					},
					res
				)
				.then(result => {
					expect(result.err).toEqual("Passwords must match!");
				});
		});

		test("users.changePassword doesn't redirect to logout after deletions on error", () => {
			jest.spyOn(ctrl, "updatePassword").mockImplementationOnce(() => {
				return { err: "error" };
			});

			users
				.changePassword(
					{
						body: {
							newPassword: "newPass",
							repeatNewPassword: "newPass",
							oldPassword: "oldPass"
						},
						params: {}
					},
					res
				)
				.then(() => {
					expect(res.redirect).not.toHaveBeenCalled();
					expect(res.send).toHaveBeenCalledWith({ err: "error" });
				});
		});

		test("users.changePassword redirects to logout after change without error", () => {
			jest.spyOn(ctrl, "updatePassword").mockImplementationOnce(() => {
				return {}; // no error
			});

			users
				.changePassword(
					{
						body: {
							newPassword: "newPass",
							repeatNewPassword: "newPass",
							oldPassword: "oldPass"
						},
						params:{}
					},
					res
				)
				.then(() => {
					expect(res.redirect).toHaveBeenCalledWith(307, "../../auth/logout");
				});
		});
	});
});
