// This solution is not ideal because at each restart the cache is flushed, but it gives a glance of possible mechanisms to create a global
// list of tokens we don't want to use/allow anymore and solves the JWT revoke problem. Redis or a persistent memcache might be a better solution.
// Another solution for the login is the session.

var memcache = require("../util/memcache");
const expressJwt = require("express-jwt");

function isRevoked(req, token, done) {
	var blackslistedToken = memcache.get(token.jti);
	if (blackslistedToken) return done("UnauthorizedError");

	return done(null);
}

module.exports = {
	revokeToken: token => {
		memcache.set(token.jti, token);
	},
	jwt: () => {
		return expressJwt({
			secret: process.env.TOKEN_SECRET,
			isRevoked: isRevoked
		}).unless({ path: [/^\/api\/auth\/.*/] });
	},
	isRevoked: isRevoked
};
