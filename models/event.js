const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
	eventName: {
		type: String,
		required: true
	},
	eventDate: {
		type: Date,
		required: true
	},
	eventTime: {
		type: Date,
		required: true
	},
	eventSummary: {
		type: String,
		required: true
	},
	approved: {
		type: String,
		enum: ["APPROVED", "REJECTED", "PENDING"],
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
