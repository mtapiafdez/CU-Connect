// User/Event Model Mongoose
const User = require("../models/user");
const Event = require("../models/event");

// Returns Me View
exports.getMe = (req, res, next) => {
	res.render("alumni-student/me", {
		path: "/me",
		pageTitle: "Me"
	});
};

// Returns Messages View
exports.getMessages = (req, res, next) => {
	res.render("alumni-student/messages", {
		path: "/me",
		pageTitle: "Messages"
	});
};

// Returns Update View
exports.getUpdate = async (req, res, next) => {
	try {
		const user = await User.findById(req.session.user._id).select(
			"-password"
		);
		if (!user) {
			return res.redirect("/");
		}
		res.render("alumni/update-info", {
			path: "/me",
			pageTitle: "Update Info",
			userInfo: user
		});
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};

// Posts Updated User Data
exports.postUpdate = async (req, res, next) => {
	const phone = req.body.phone;
	const addressLineMain = req.body.addressLineMain;
	const addressLineSecondary = req.body.addressLineSecondary;
	const city = req.body.city;
	const state = req.body.state;
	const zip = req.body.zip;
	const classYear = req.body.classYear;
	const major = req.body.major;
	const occupation = req.body.occupation;
	const company = req.body.company;

	// Social Media
	const facebook = req.body.facebook;
	const twitter = req.body.twitter;
	const linkedIn = req.body.linkedIn;
	const instagram = req.body.instagram;

	// Image
	const image = req.file;

	// TODO: VALIDATE IMAGE LEGITIMACY & CLEAN UP
	if (!image) {
		return console.log("File is not an image");
	}

	const profileUrl = image.path;

	try {
		const user = await User.findById(req.session.user._id);

		user.phone = phone;
		user.addressLineMain = addressLineMain;
		user.addressLineSecondary = addressLineSecondary;
		user.city = city;
		user.state = state;
		user.zip = zip;
		user.classYear = classYear;
		user.major = major;
		user.occupation = occupation;
		user.company = company;
		user.social.facebook = facebook;
		user.social.twitter = twitter;
		user.social.linkedIn = linkedIn;
		user.social.instagram = instagram;
		user.profileUrl = profileUrl;
		await user.save();
		res.redirect("/update-info");
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};

// Returns Report View
exports.getReports = (req, res, next) => {
	res.render("alumni/reports", {
		path: "/me",
		pageTitle: "Reports"
	});
};

// Returns Request Event View
exports.getRequestEvent = (req, res, next) => {
	res.render("alumni/request-event", {
		path: "/events",
		pageTitle: "Request Event"
	});
};

// Posts Request Event
exports.postEventRequest = async (req, res, next) => {
	const eventName = req.body["event-name"];
	const eventDate = req.body["event-date"];
	const eventTime = Date(req.body["event-time"]);
	const eventDesc = req.body["event-description"];

	const event = new Event({
		eventName: eventName,
		eventDate: eventDate,
		eventTime: eventTime,
		eventDesc: eventDesc,
		userId: req.session.user._id
	});

	await event.save();

	res.redirect("/requested-events");
};

// Returns Requested Events View
exports.getRequestedEvents = async (req, res, next) => {
	const requestedEvents = await Event.find({
		userId: req.session.user._id,
		approved: "PENDING"
	});
	res.render("alumni/requested-events", {
		path: "/events",
		pageTitle: "Requested Events",
		requestedEvents: requestedEvents
	});
};

// Deletes Particular Requested Event
exports.deleteRequestedEvent = async (req, res, next) => {
	const reqEventId = req.params.reqEventId;

	try {
		const requestedEvent = await Event.findById(reqEventId);

		if (!requestedEvent) {
			const error = new Error("Requested Event Not Found");
			error.httpStatusCode = 404;
			throw error;
		}

		await Event.deleteOne({
			_id: reqEventId,
			userId: req.user._id
		});

		res.status(200).json({ message: "Success!" });
	} catch (err) {
		// throw new Error(err);
		res.status(500).json({ message: "Deleting product failed." });
	}
};

// Returns Connect View
exports.getConnect = (req, res, next) => {
	res.render("alumni-student/connect", {
		path: "/connect",
		pageTitle: "Connect"
	});
};
