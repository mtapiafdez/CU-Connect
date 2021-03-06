const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Event Blueprint
const eventSchema = new Schema({
	eventName: {
		type: String,
		required: true
	},
	eventDate: {
		type: String,
		required: true
	},
	eventTime: {
		type: String,
		required: true
	},
	eventDesc: {
		type: String,
		required: true
	},
	approved: {
		type: String,
		default: "PENDING",
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
});

module.exports = mongoose.model("Event", eventSchema);
