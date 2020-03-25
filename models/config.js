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

configSchema.statics.modifyConfig = async function(type, change) {
	let configDocument = await this.findById("5e79211c227c580a24c1919d");

	switch (type) {
		case "TEXTS":
			configDocument.homeConfig.eventsText = change.eventsText;
			configDocument.homeConfig.infoText = change.infoText;
			configDocument.homeConfig.othersText = change.othersText;

			return configDocument.save();
		case "CAROUSEL":
			if (change.btnClicked === "REMOVE") {
				const configDocMod = configDocument.homeConfig.carouselItems.filter(
					item => {
						return item._id.toString() !== change._id.toString();
					}
				);

				configDocument.homeConfig.carouselItems = configDocMod;

				return configDocument.save();
			} else if (change.btnClicked === "UPDATE") {
				const carouselItemIndex = configDocument.homeConfig.carouselItems.findIndex(
					cItem => {
						return cItem._id.toString() === change._id.toString();
					}
				);

				configDocument.homeConfig.carouselItems[
					carouselItemIndex
				].imgPath = change.imgPath;
				configDocument.homeConfig.carouselItems[
					carouselItemIndex
				].headerText = change.headerText;
				configDocument.homeConfig.carouselItems[
					carouselItemIndex
				].bodyText = change.bodyText;

				return configDocument.save();
			}
		case "CAROUSEL-ADD":
			const newCarouselItems = [
				...configDocument.homeConfig.carouselItems,
				{
					imgPath: change.imgPath,
					headerText: change.headerText,
					bodyText: change.bodyText
				}
			];

			configDocument.homeConfig.carouselItems = newCarouselItems;

			return configDocument.save();
	}
};

module.exports = mongoose.model("Config", configSchema);
