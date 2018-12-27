const mongoose = require("mongoose");
let db = mongoose.connection;

db.once("open", () => console.log("Connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = {
	disconnect: done => {
		mongoose.disconnect(done);
	},
	connect: () => {
		mongoose.connect(
			process.env.DB_URL,
			{
				keepAlive: 300,
				useNewUrlParser: true,
				reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
				reconnectInterval: 500 // Reconnect every 500ms
			}
		);
	}
};
