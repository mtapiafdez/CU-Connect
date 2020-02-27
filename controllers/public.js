// Event Model Mongoose
const Event = require("../models/event");

// Returns Index View
exports.getIndex = (req, res, next) => {
	res.render("shared/home", {
		path: "/",
		pageTitle: "Home"
	});
};

// Returns Events View
exports.getEvents = async (req, res, next) => {
	const events = await Event.find({ approved: "APPROVED" }).select(
		"-_id -userId -approved"
	);
	res.render("shared/events", {
		path: "/events",
		pageTitle: "Events",
		events: events
	});
};

// Returns Donate View
exports.getDonate = (req, res, next) => {
	res.render("shared/donate", {
		path: "/donate",
		pageTitle: "Donate"
	});
};
