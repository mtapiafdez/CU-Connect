// Alumni Auth Middleware
exports.Alumni = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.redirect("/login");
	}
	if (req.session.userType === "admin") {
		return next();
	}
	if (req.session.userType !== "alumni") {
		return res.redirect("/");
	}
	next();
};

// Student Auth Middleware
exports.Student = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.redirect("/login");
	}
	if (req.session.userType === "admin") {
		return next();
	}
	if (req.session.userType !== "student") {
		return res.redirect("/");
	}
	next();
};

// Student / Alumnni - Connect, Messages, Me
exports.AlumniStudent = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.redirect("/login");
	}

	if (req.session.userType === "admin") {
		return next();
	}

	if (
		req.session.userType === "alumni" ||
		req.session.userType === "student"
	) {
		return next();
	}

	return res.redirect("/");
};

// Admin Auth Middleware
exports.Admin = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.redirect("/login");
	}
	if (req.session.userType !== "admin") {
		return res.redirect("/");
	}
	next();
};

// Must Be Logged In To Log Out
exports.General = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.redirect("/login");
	}
	next();
};
