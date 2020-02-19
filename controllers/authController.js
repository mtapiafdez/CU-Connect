exports.getLogin = (req, res, next) => {
	// let message = req.flash("error");
	// if (message.length > 0) {
	// 	message = message[0];
	// } else {
	// 	message = null;
	// }
	res.render("auth/login", {
		path: "/login",
		pageTitle: "Login"
		// errorMessage: message,
		// oldInput: {
		// 	email: "",
		// 	password: ""
		// },
		// validationErrors: []
	});
};

exports.postLogin = (req, res, next) => {
	console.log(req.body.password);
	console.log("Getting to postLogin");
};
