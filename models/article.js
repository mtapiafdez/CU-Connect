const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Article Blueprint
const articleSchema = new Schema({
	articleName: {
		type: String,
		required: true
	},
	articleDate: {
		type: String,
		required: true
	},
	articleTime: {
		type: String,
		required: true
	},
	articleDesc: {
		type: String,
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
});

module.exports = mongoose.model("Article", articleSchema);
