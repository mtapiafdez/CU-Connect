const User = require("../models/user");
const Article = require("../models/article");

// Returns Me Student View
exports.getStudentMe = async (req, res, next) => {
	try {
		const user = await User.findById(req.session.user._id).select(
			"-password"
		);

		const articles = await Article.find().select("-_id -userId");

		if (!user || !articles) {
			return res.redirect("/");
		}

		res.render("alumni-student/me", {
			path: "/me",
			pageTitle: "Me",
			userInfo: user,
			articles: articles
		});
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};

// Returns Messages Student View
exports.getStudentMessages = (req, res, next) => {
	res.render("alumni-student/messages", {
		path: "/me",
		pageTitle: "Messages"
	});
};

// Returns Connect Student View
exports.getStudentConnect = (req, res, next) => {
	res.render("alumni-student/connect", {
		path: "/connect",
		pageTitle: "Connect",
		userId: req.session.user._id
	});
};
