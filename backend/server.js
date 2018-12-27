const app = require("./app");
require("./models/database").connect();

app.listen(process.env.API_PORT, () =>
	console.log(`Backend listening on ::${process.env.API_PORT}`)
);
