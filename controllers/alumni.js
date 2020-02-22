const User = require("../models/user");
const mongoose = require("mongoose");

exports.getMe = (req, res, next) => {
	res.render("alumni-student/me", {
		path: "/me",
		pageTitle: "Me"
	});
};

exports.getUpdate = (req, res, next) => {
	console.log(req.session.user._id);

	User.findById(req.session.user._id)
		.select("-password")
		.then(user => {
			if (!user) {
				return res.redirect("/");
			}
			res.render("alumni/update-info", {
				path: "/me",
				pageTitle: "Update Info",
				userInfo: user
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postUpdate = (req, res, next) => {
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

	User.findById(req.session.user._id)
		.then(user => {
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
			return user.save().then(result => {
				console.log("User Updated");
				res.redirect("/update-info");
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};
