require("dotenv").config();
require("./models/database");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const fs = require("fs");
const security = require("./helpers/securityHelper");
const morgan = require("morgan");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(security.jwt());
app.use(morgan("dev"));

app.use(function(err, req, res, next) {
	if (!err) return next();

	if (err === "UnauthorizedError" || err.name === "UnauthorizedError") {
		return res.status(401).send("Unauthorized");
	}
	return res.status(500).send("Oooops, some error occurred");
});

app.use("/api", router);

// Load routes dynamically
let routeFiles = fs.readdirSync("./routes");
routeFiles.forEach(rf => {
	app.use(`/api/${rf.replace(".js", "")}`, require(`./routes/${rf}`));
});

app.use(function(req, res) {
	res.status(404).send("Sorry can't find that!");
});

app.listen(process.env.API_PORT, () =>
	console.log(`LISTENING ON PORT ${process.env.API_PORT}`)
);
