const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// User Blueprint
const userSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	addressLineMain: {
		type: String,
		required: true
	},
	addressLineSecondary: {
		type: String
	},
	city: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	zip: {
		type: Number,
		required: true
	},
	classYear: {
		type: String,
		required: true
	},
	major: {
		type: String,
		required: true
	},
	occupation: {
		type: String
	},
	company: {
		type: String
	},
	password: {
		type: String,
		required: true
	},
	type: {
		type: String
	},
	social: {
		facebook: {
			type: String
		},
		linkedIn: {
			type: String
		},
		twitter: {
			type: String
		},
		instagram: {
			type: String
		}
	},
	profileUrl: {
		type: String,
		default: ""
	},
	resetToken: String,
	resetTokenExpiration: Date
});

module.exports = mongoose.model("User", userSchema);
