const usersApi = require("./users");
const UserModel = require("../models/User");

beforeAll(() => {
	require("dotenv").config();
});

describe("User controller functionalities", () => {
	describe("Retrieve all users", () => {
		test("usersApi.all: returns users without password field", () => {
			jest.spyOn(UserModel, "find").mockReturnValueOnce(
				Promise.resolve([
					{
						_id: "mockId",
						email: "mockEmail",
						password: "this should be omitted",
						settings: {
							language: "Japanese",
							isPrivate: true
						}
					}
				])
			);
			return usersApi.all().then(users => {
				expect(users[0]).toEqual({
					id: "mockId",
					email: "mockEmail",
					settings: {
						language: "Japanese",
						isPrivate: true
					}
				});
			});
		});
	});
	describe("Retrieve single user", () => {
		test("usersApi.retrieve: resolves with  err == 'User not found' for _id not present in DB", () => {
			jest
				.spyOn(UserModel, "findOne")
				.mockReturnValueOnce(Promise.resolve(null));
			return usersApi.retrieve("anyid").then(result => {
				expect(result.err).toEqual("User not found");
			});
		});

		test("usersApi.retrieve: resolves with a User object without password for _id present in DB", () => {
			jest.spyOn(UserModel, "findOne").mockReturnValueOnce(
				Promise.resolve({
					_id: "anyid",
					email: "user.email",
					settings: "user.settings",
					password: "hideme!"
				})
			);
			return usersApi.retrieve("anyid").then(result => {
				expect(result).toEqual({
					id: "anyid",
					email: "user.email",
					settings: "user.settings"
				});
			});
		});
	});
	describe("Update user", () => {
		test("usersApi.update: resolves with  err == 'User not updated' for empty error", () => {
			jest
				.spyOn(UserModel, "findOneAndUpdate")
				.mockReturnValueOnce(Promise.reject(new Error()));
			return usersApi.update("anyid",{}).then(result => {
				expect(result.err).toEqual("User not updated");
			});
		});
        
		test("usersApi.update: updates all the properties passed as options", () => {
			const settingsToModify = { language: "Korean" };
			const options = {
				new: true,
				runValidators: true
			};
			const fakeResult = {
				_id: "anyid",
				email: "user.email",
				settings: "user.settings"
			};
			jest
				.spyOn(UserModel, "findOneAndUpdate")
				.mockReturnValueOnce(Promise.resolve(fakeResult));

			return usersApi.update("anyid", settingsToModify).then(result => {
				expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
					{ _id: "anyid" },
					{ $set: { "settings.language": "Korean" } },
					options
				);

				expect(result).toEqual(fakeResult);
			});
		});
	});
	describe("Delete user", () => {
		test("usersApi.delete: resolves with err == 'User not deleted.' for Error", () => {
			jest
				.spyOn(UserModel, "deleteOne")
				.mockReturnValueOnce(Promise.reject(null));
			return usersApi.delete("anyid").then(result => {
				expect(result.err).toEqual("User not deleted.");
			});
		});
		test("usersApi.delete: resolves with message == 'User deleted.' for no Error", () => {
			jest
				.spyOn(UserModel, "deleteOne")
				.mockReturnValueOnce(Promise.resolve(null));
			return usersApi.delete("anyid").then(result => {
				expect(result.message).toEqual("User deleted.");
			});
		});
	});

	describe("Update password", () => {
		test("usersApi.updatePassword: returns 'Password not changed' for user not found", () => {
			jest
				.spyOn(UserModel, "findOne")
				.mockReturnValueOnce(Promise.resolve(null));
			return usersApi.updatePassword("anyid").then(result => {
				expect(result.err).toEqual("Password not changed");
			});
		});
		test("usersApi.updatePassword: returns 'Password not changed' for oldPassword not matching current password", () => {
			jest
				.spyOn(UserModel, "findOne")
				.mockReturnValueOnce(
					Promise.resolve(new UserModel({ password: "correctPassword" }))
				);

			jest
				.spyOn(UserModel.prototype, "comparePassword")
				.mockReturnValueOnce(false);

			return usersApi
				.updatePassword("anyid", "wrongPassword", "anypassword")
				.then(result => {
					expect(UserModel.prototype.comparePassword).toHaveBeenCalledWith(
						"wrongPassword"
					);
					expect(result.err).toEqual("Password not changed");
				});
		});
		test("usersApi.updatePassword: returns 'Password changed' for oldPassword matching current password", () => {
			jest
				.spyOn(UserModel, "findOne")
				.mockReturnValueOnce(
					Promise.resolve(new UserModel({email:"anyemail", password: "correctPassword" }))
				);

			jest
				.spyOn(UserModel.prototype, "comparePassword")
				.mockReturnValueOnce(true);

			return usersApi
				.updatePassword("anyid", "correctPassword", "anypassword")
				.then(result => {
					expect(UserModel.prototype.comparePassword).toHaveBeenCalledWith(
						"correctPassword"
					);
					expect(result.message).toEqual("Password changed");
				});
		});
	});
});
