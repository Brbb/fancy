const auth = require("./auth.handler");
const ctrl = require("../../controllers/auth");

beforeAll(() => {
	require("dotenv").config();
});

afterAll(()=>{
	jest.resetAllMocks();
	jest.restoreAllMocks();
});

describe("Auth handler methods", () => {
	let res = {
		send: jest.fn(payload => {
			return payload;
		}),
		status: function() {
			return this;
		},
		redirect: jest.fn()
	};
  
	describe("Request body check.", () => {
		test("auth.login Returns 'Request needs body' for requests without body", () => {

			auth.login({}, res).then(result => {
				expect(res.send).toBeCalled();
				expect(result.err).toEqual("Request needs body");
			});
		});
		test("auth.signup Returns 'Request needs body' for requests without body", () => {

			auth.signup({}, res).then(result => {
				expect(res.send).toBeCalled();
				expect(result.err).toEqual("Request needs body");
			});
		});
		
	});

	describe("Login: receive requests from route, parse the body and call the controller with the right parameters to login a user.", () => {
		test("auth.login: sends 'Body needs email and password properties' for null email OR password properties", () => {
			auth
				.login({ body: { email: null, password: null } }, res)
				.then(result => {
					expect(res.send).toBeCalled();
					expect(result.err).toEqual("Body needs email and password properties");
				});
		});

		test("auth.login: sends 'Body needs email and password properties' for empty string password property", () => {
			
			auth.login({ body: { email: "any", password: "" } }, res).then(result => {
				expect(res.send).toBeCalled();
				expect(result.err).toEqual("Body needs email and password properties");
			});
		});

		test("auth.login: returns a message for any outcome of ctrl.login", () => {

			jest.spyOn(ctrl, "login").mockImplementationOnce(() => {
				return "User logged in.";
			});

			auth
				.login({ body: { email: "any", password: "any" } }, res)
				.then(result => {
					expect(res.send).toBeCalled();
					expect(result).toEqual("User logged in.");
				});
		});
	});

	describe("Signup: receive requests from route, parse the body and call the controller with the right parameters to create a user.", () => {
		
		test("auth.signup: sends 'Body needs email and password properties' for null password property", () => {

			auth.signup({body:{ email: "any", password: "", repeatPassword:"" }}, res).then(result => {
				expect(res.send).toBeCalled();
				expect(result.err).toEqual("Body needs email and password properties");
			});
		});

		test("auth.signup: sends 'Body needs email and password properties' for null email property", () => {

			auth.signup({body:{ email: null, password: "ok", repeatPassword:"ok" }}, res).then(result => {
				expect(res.send).toBeCalled();
				expect(result.err).toEqual("Body needs email and password properties");
			});
		});

		test("auth.signup: sends 'Passwords must match!' for different password/repeatPassword properties in the body", () => {

			auth.signup({body:{ email: "any", password: "first", repeatPassword:"second" }}, res).then(result => {
				expect(res.send).toBeCalled();
				expect(result.err).toEqual("Passwords must match!");
			});
		});

		test("auth.signup: returns any message coming from the controller for proper email password properties", () => {

			jest.spyOn(ctrl, "create").mockImplementationOnce(() => {
				return "This can be a user or an error";
			});

			auth
				.signup({ body: { email: "any", password: "any", repeatPassword:"any" } }, res)
				.then(result => {
					expect(res.send).toBeCalled();
					expect(result).toEqual("This can be a user or an error");
				});
		});
	});

	describe("Logout: receive requests from route, parse the body and call the controller with the right parameters to logout a user.", () => {
		
		test("auth.logout: returns any message coming from the controller. The JWT invalidation will be handled in the controller", () => {

			jest.spyOn(ctrl, "logout").mockImplementationOnce(() => {
				return "This can be a logout success or error";
			});

			auth
				.logout({ }, res)
				.then(result => {
					expect(res.send).toBeCalled();
					expect(result).toEqual("This can be a logout success or error");
				});
		});
	});
});
