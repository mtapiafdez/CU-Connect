// Event, User, Article, Config Model Mongoose
const Event = require("../models/event");
const User = require("../models/user");
const Article = require("../models/article");
const Config = require("../models/config");

// Returns Donate Metrics View
exports.getDonateMetrics = (req, res, next) => {
	res.render("admin/donate-metrics", {
		path: "/donate",
		pageTitle: "Donation Metrics",
	});
};

// Returns Add Event View
exports.getAddEvent = (req, res, next) => {
	res.render("admin/add-event", {
		path: "/events",
		pageTitle: "Add Event",
	});
};

// Post Event To Database
exports.postAddEvent = async (req, res, next) => {
	const eventName = req.body["event-name"];
	const eventDate = req.body["event-date"];
	const eventTime = req.body["event-time"];
	const eventDesc = req.body["event-description"];

	const event = new Event({
		eventName: eventName,
		eventDate: eventDate,
		eventTime: eventTime,
		eventDesc: eventDesc,
		userId: req.session.user._id,
		approved: "APPROVED",
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
			events: events,
		});
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};

// Patch Event Approval Flag - Rest
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

		res.status(200).json({ message: "SUCCESS" });
	} catch (err) {
		err.type = "REST";
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

// Returns Master Search View
exports.getMasterSearch = (req, res, next) => {
	res.render("admin/master-search", {
		path: "/alumni",
		pageTitle: "Master Search",
	});
};

// Gets Alumni By Filter
exports.getAlumni = async (req, res, next) => {
	const { type } = req.query;

	if (type === "individual") {
		const { id } = req.query;
		const alumni = await User.findById(id).select(
			`-password -resetToken -resetTokenExpiration -profileUrl -type -_id -__v -connections -chatRooms`
		);

		res.status(200).json(alumni);
	} else {
		let query = {};

		for (var key in req.query) {
			if (req.query[key]) query[key] = req.query[key];
		}

		try {
			const alumni = await User.find(query).select(
				"-password -resetToken -resetTokenExpiration"
			);

			res.status(200).json(alumni);
		} catch (err) {
			err.type = "REST";
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
};

// Returns Add News View
exports.getAddNews = (req, res, next) => {
	res.render("admin/add-news", {
		path: "/alumni",
		pageTitle: "Add News",
	});
};

// Post News To Database
exports.postAddNews = async (req, res, next) => {
	const { articleName, articleDate, articleTime, articleDesc } = req.body;

	const article = new Article({
		articleName: articleName,
		articleDate: articleDate,
		articleTime: articleTime,
		articleDesc: articleDesc,
		userId: req.session.user._id,
	});

	try {
		await article.save();
		res.redirect("/me");
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};

// Returns Site Config View
exports.getSiteConfig = async (req, res, next) => {
	const siteConfig = await Config.findById("5e79211c227c580a24c1919d").select(
		"-__v"
	);

	res.render("admin/site-config", {
		path: "/management",
		pageTitle: "Site Config",
		siteConfig: siteConfig,
	});
};

// Update Site Config
exports.postSiteConfig = async (req, res, next) => {
	const type = req.query.type;

	if (type === "TEXTS") {
		const { eventsText, infoText, othersText } = req.body;
		const changeObj = {
			eventsText: eventsText,
			infoText: infoText,
			othersText: othersText,
		};
		await Config.modifyConfig(type, changeObj);
		return res.redirect("/");
	} else if (type === "CAROUSEL") {
		const {
			carouselId,
			imgPath,
			headerText,
			bodyText,
			btnClicked,
		} = req.body;

		const changeObj = {
			_id: carouselId,
			imgPath: imgPath,
			headerText: headerText,
			bodyText: bodyText,
			btnClicked: btnClicked,
		};

		await Config.modifyConfig(type, changeObj);
		return res.redirect("/");
	} else if (type === "CAROUSEL-ADD") {
		const { imgPath, headerText, bodyText } = req.body;

		const changeObj = {
			imgPath: imgPath,
			headerText: headerText,
			bodyText: bodyText,
		};

		await Config.modifyConfig(type, changeObj);
		return res.redirect("/");
	}
};
