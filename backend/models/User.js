const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: String,
	password: String,
	settings: {
		language: String,
		isPrivate: { type: Boolean, default: false }
	}
});

userSchema.pre("save", function(next) {
	this.password = bcrypt.hashSync(this.password, saltRounds);
	next();
});

userSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model("User", userSchema);
module.exports = User;
