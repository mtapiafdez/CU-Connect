// Event, User Model Mongoose
const Event = require("../models/event");
const User = require("../models/user");

// Returns Donate Metrics View
exports.getDonateMetrics = (req, res, next) => {
	res.render("admin/donate-metrics", {
		path: "/donate",
		pageTitle: "Donation Metrics"
	});
};

// Returns Add Event View
exports.getAddEvent = (req, res, next) => {
	res.render("admin/add-event", {
		path: "/events",
		pageTitle: "Add Event"
	});
};

// Post Event To Database
exports.postAddEvent = async (req, res, next) => {
	const eventName = req.body["event-name"];
	const eventDate = req.body["event-date"];
	const eventTime = Date(req.body["event-time"]);
	const eventDesc = req.body["event-description"];

	const event = new Event({
		eventName: eventName,
		eventDate: eventDate,
		eventTime: eventTime,
		eventDesc: eventDesc,
		userId: req.session.user._id,
		approved: "APPROVED"
	});

	try {
		await event.save();
		res.redirect("/events");
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};

// Returns Event Approval View
exports.getEventApproval = async (req, res, next) => {
	try {
		const events = await Event.find({ approved: "PENDING" });
		res.render("admin/event-approval", {
			path: "/events",
			pageTitle: "Event Approval",
			events: events
		});
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};

// Patch Event Approval Flag
exports.patchEventApproval = async (req, res, next) => {
	const eventId = req.params.eventId;
	const type = req.params.type;

	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return res.redirect("/");
		}

		event.approved = type;
		await event.save();

		res.status(200).json({ message: "Success!" });
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};

// Returns Master Search View
exports.getMasterSearch = (req, res, next) => {
	res.render("admin/master-search", {
		path: "/alumni",
		pageTitle: "Master Search"
	});
};

// Gets Alumni By Filter
exports.getAlumni = async (req, res, next) => {
	const firstName = req.query.firstName;
	const lastName = req.query.lastName;
	const email = req.query.email;
	const classOf = req.query.classOf;
	const major = req.query.major;

	let query = {};

	if (firstName) {
		query["firstName"] = firstName;
	}

	if (major) {
		query["major"] = major;
	}

	try {
		const alumni = await User.find(query).select(
			"-_id -password -resetToken -resetTokenExpiration"
		);

		res.status(200).json(alumni);
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};

// Returns Add News View
exports.getAddNews = (req, res, next) => {
	res.render("admin/add-news", {
		path: "/alumni",
		pageTitle: "Add News"
	});
};

// Returns Site Config View
exports.getSiteConfig = (req, res, next) => {
	res.render("admin/site-config", {
		path: "/management",
		pageTitle: "Site Config"
	});
};
