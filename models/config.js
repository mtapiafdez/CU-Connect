const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const configSchema = new Schema({
	homeConfig: {
		eventsText: {
			type: String,
			required: true
		},
		infoText: {
			type: String,
			required: true
		},
		othersText: {
			type: String,
			required: true
		},
		carouselItems: [
			{
				imgPath: {
					type: String,
					required: true
				},
				headerText: {
					type: String,
					required: true
				},
				bodyText: {
					type: String,
					required: true
				}
			}
		]
	}
});

configSchema.statics.modifyConfig = function(type, change) {
	// find main and change document.
};

module.exports = mongoose.model("Config", configSchema);
