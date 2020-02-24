const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key:
				""
		}
	})
);

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

exports.postLogin = (req, res, next) => {
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

	User.findOne({ email: email })
		.then(user => {
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
			bcrypt
				.compare(password, user.password)
				.then(doMatch => {
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
				})
				.catch(err => {
					console.log(err);
					res.redirect("/login");
				});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postSignup = (req, res, next) => {
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

	return bcrypt
		.hash(password, 12)
		.then(hashedPassword => {
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
				type: "alumni"
			});
			return user.save();
		})
		.then(result => {
			console.log("Here");
			res.redirect("/login");
			return transporter.sendMail({
				to: email,
				from: "admin@cu-connect.com",
				subject: "Signup succeeded!",
				html: "<h1>Signup Successful</h1>"
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log("Session Destroyed");
		res.redirect("/");
	});
};

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

exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			return res.redirect("/reset");
		}
		// Turn Buffer Into String
		const token = buffer.toString("hex");
		User.findOne({ email: req.body.email })
			.then(user => {
				if (!user) {
					req.flash("error", "No account with that email found.");
					return res.redirect("/reset");
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000;
				return user.save();
			})
			.then(result => {
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
			})
			.catch(err => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now() } // $gt = greater
	})
		.then(user => {
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
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postNewPassword = (req, res, next) => {
	const newPassword = req.body.password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;
	let resetUser;

	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId
	})
		.then(user => {
			resetUser = user;
			return bcrypt.hash(newPassword, 12);
		})
		.then(hashedPassword => {
			resetUser.password = hashedPassword;
			resetUser.resetToken = undefined;
			resetUser.resetTokenExpiration = undefined;
			return resetUser.save();
		})
		.then(result => {
			res.redirect("/login");
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};
