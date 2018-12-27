require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const routeLoader = require("./routes/_loader");
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

routeLoader.loadRoutes().map(route =>{
	app.use(`/api/${route}`, require(`./routes/${route}`));
});

app.use(function(req, res) {
	res.status(404).send("Sorry can't find that!");
});

module.exports = app;
