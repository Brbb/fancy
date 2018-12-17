require("dotenv").config();
require("./models/database");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const fs = require("fs");
const security = require('./handlers/security')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all("*", security.handle);

app.use("/api", router);

let routeFiles = fs.readdirSync("./routes");
routeFiles.forEach(rf => {
  app.use(`/api/${rf.replace(".js", "")}`, require(`./routes/${rf}`));
});

app.listen(process.env.API_PORT, () =>
  console.log(`LISTENING ON PORT ${process.env.API_PORT}`)
);
