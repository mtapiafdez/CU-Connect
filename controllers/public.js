exports.getIndex = (req, res, next) => {
	res.render("shared/home", {
		path: "/",
		pageTitle: "Home"
	});
};

exports.getEvents = (req, res, next) => {
	res.render("shared/events", {
		path: "/events",
		pageTitle: "Events"
	});
};

exports.getDonate = (req, res, next) => {
	res.render("shared/donate", {
		path: "/donate",
		pageTitle: "Donate"
	});
};
