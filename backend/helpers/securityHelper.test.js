const securityHelper = require("./securityHelper");
var memcache = require("../util/memcache");

afterAll(()=>{
	jest.resetAllMocks();
	jest.restoreAllMocks();
});

describe("Security helper function", () => {
	test("Method isRevoked returns UnauthorizedError if a token is blacklisted (memcache)", () => {
		jest.spyOn(memcache, "get").mockImplementationOnce(() => {
			return true;
		});

		const done = jest.fn();

		securityHelper.isRevoked(null, { jti: "not important" }, done);
		expect(done).toBeCalledWith("UnauthorizedError");
	});
});
