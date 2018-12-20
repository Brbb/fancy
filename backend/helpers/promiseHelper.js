// This helps with promise rejection without repeating the same catch block.
// It also prevents UnhandledPromiseRejection warnings which might lead to application crash.

module.exports = {
	handle: fn => {
		return (req, res, next) => {
			const routePromise = fn(req, res, next);
			if (routePromise.catch) {
				routePromise.catch(err => next(err));
			}
		};
	}
};
