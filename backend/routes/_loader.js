const fs = require("fs");
const path = require("path");

module.exports = {
	loadRoutes: () => {
		let routeFiles = fs.readdirSync(__dirname);
		return routeFiles
			.filter(rf => {
				return !rf.startsWith("_") && !rf.startsWith(".") && fs.lstatSync(path.join(__dirname,rf)).isFile();
			})
			.map(rf => {
				return rf.replace(".js", "");
			});
	}
};
