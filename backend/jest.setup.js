// This piece of code exits whenever we have an unhandled rejection.
// I have to add this to avoid false positive tests. 
// I handle the rejections with helpers/promiseHelper.js 

if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
	process.on("unhandledRejection", reason => {
		throw reason;
	});
	// Avoid memory leak by adding too many listeners
	process.env.LISTENING_TO_UNHANDLED_REJECTION = true;
}