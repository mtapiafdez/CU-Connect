const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const articleSchema = new Schema({
	articleName: {
		type: String,
		required: true
	},
	articleDate: {
		type: Date,
		required: true
	},
	articleTime: {
		type: Date,
		required: true
	},
	articleSummary: {
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
