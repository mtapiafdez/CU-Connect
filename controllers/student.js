// Returns Me Student View
exports.getStudentMe = (req, res, next) => {
	res.render("alumni-student/me", {
		path: "/me",
		pageTitle: "Me"
	});
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
		pageTitle: "Connect"
	});
};
