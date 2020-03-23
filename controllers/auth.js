const CONFIG = require("../util/config");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

// User Model Mongoose
const User = require("../models/user");

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key: CONFIG.sendGridKey
		}
	})
);

// Returns Login View
exports.getLogin = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/login", {
		path: "/login",
		pageTitle: "Login",
		errorMessage: message,
		oldInput: {
			email: "",
			password: ""
		},
		validationErrors: []
	});
};

// Post Login To Server
exports.postLogin = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render("auth/login", {
			path: "/login",
			pageTitle: "Login",
			errorMessage: errors.array()[0].msg,
			oldInput: {
				email: email,
				password: password
			},
			validationErrors: errors.array()
		});
	}

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(422).render("auth/login", {
				path: "/login",
				pageTitle: "Login",
				errorMessage: "Invalid email or password.",
				oldInput: {
					email: email,
					password: password
				},
				validationErrors: []
			});
		}

		const doMatch = await bcrypt.compare(password, user.password);

		if (doMatch) {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.userType = user.type;
			return req.session.save(err => {
				console.log("Session saved!");
				res.redirect("/");
			});
		}
		return res.status(422).render("auth/login", {
			path: "/login",
			pageTitle: "Login",
			errorMessage: "Invalid email or password.",
			oldInput: {
				email: email,
				password: password
			},
			validationErrors: []
		});
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};

// Returns Signup View
exports.getSignup = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}

	res.render("auth/signup", {
		path: "/signup",
		pageTitle: "Signup",
		errorMessage: message,
		oldInput: {
			email: "",
			password: "",
			confirmPassword: ""
		},
		validationErrors: []
	});
};

// Post Signup To Server
exports.postSignup = async (req, res, next) => {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
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
	const password = req.body.password;

	const errors = validationResult(req);

	const image = req.file;
	if (!image) {
		return console.log("File is not an image");
	}

	const profileUrl = image.path;

	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).render("auth/signup", {
			path: "/login",
			pageTitle: "Signup",
			errorMessage: errors.array()[0].msg,
			oldInput: {
				firstName: firstName,
				lastName: lastName,
				email: email,
				phone: phone,
				addressLineMain: addressLineMain,
				addressLineSecondary: addressLineSecondary,
				city: city,
				state: state,
				zip: zip,
				classYear: classYear,
				major: major,
				occupation: occupation,
				company: company,
				password: password,
				confirmPassword: req.body.confirmPassword
			},
			validationErrors: errors.array()
		});
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 12);

		const user = new User({
			firstName: firstName,
			lastName: lastName,
			email: email,
			phone: phone,
			addressLineMain: addressLineMain,
			addressLineSecondary: addressLineSecondary,
			city: city,
			state: state,
			zip: zip,
			classYear: classYear,
			major: major,
			occupation: occupation,
			company: company,
			password: hashedPassword,
			profileUrl: profileUrl
		});
		await user.save();

		res.redirect("/login");
		return transporter.sendMail({
			to: email,
			from: "admin@cu-connect.com",
			subject: "Signup succeeded!",
			html: "<h1>Signup Successful</h1>"
		});
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};

// Post Logout To Server
exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log("Session Destroyed");
		res.redirect("/");
	});
};

// Return Reset View
exports.getReset = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/reset", {
		path: "/reset",
		pageTitle: "Reset Password",
		errorMessage: message
	});
};

// Post Reset To Server
exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, async (err, buffer) => {
		if (err) {
			return res.redirect("/reset");
		}
		// Turn Buffer Into String
		const token = buffer.toString("hex");

		try {
			const user = await User.findOne({ email: req.body.email });

			if (!user) {
				req.flash("error", "No account with that email found.");
				return res.redirect("/reset");
			}
			user.resetToken = token;
			user.resetTokenExpiration = Date.now() + 3600000;
			const result = await user.save();

			if (result) {
				res.redirect("/");
				transporter.sendMail({
					to: req.body.email,
					from: "admin@cu-connect.com",
					subject: "Password Reset",
					html: `
                            <p>You requested a password reset</p>
                            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                        `
				});
			}
		} catch (err) {
			const error = new Error(err);
			error.httpStatusCode = 500;
			throw error;
		}
	});
};

// Return New Password View
exports.getNewPassword = async (req, res, next) => {
	const token = req.params.token;

	try {
		const user = await User.findOne({
			resetToken: token,
			resetTokenExpiration: { $gt: Date.now() } // $gt = greater
		});

		let message = req.flash("error");
		if (message.length > 0) {
			message = message[0];
		} else {
			message = null;
		}
		res.render("auth/new-password", {
			path: "/new-password",
			pageTitle: "New Password",
			errorMessage: message,
			userId: user._id.toString(),
			passwordToken: token
		});
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};

// Post New Password To Server
exports.postNewPassword = async (req, res, next) => {
	const newPassword = req.body.password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;

	try {
		const user = await User.findOne({
			resetToken: passwordToken,
			resetTokenExpiration: { $gt: Date.now() },
			_id: userId
		});

		const hashedPassword = await bcrypt.hash(newPassword, 12);

		user.password = hashedPassword;
		user.resetToken = undefined;
		user.resetTokenExpiration = undefined;
		await user.save();

		res.redirect("/login");
	} catch (err) {
		const error = new Error(err);
		error.httpStatusCode = 500;
		throw error;
	}
};
