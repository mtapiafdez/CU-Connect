// Import Packages
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const User = require("./models/user");

// Initialize Express Server & Port
const app = express();
const port = 3000;

// Import Routes
const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const alumniRoutes = require("./routes/alumni");
const studentRoutes = require("./routes/student");
const errorController = require("./controllers/error");

// Declare Mongo URI
const MONGODB_URI = "";

// Instantiate MongoDBStore & Initialize CSRF Protection
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: "sessions"
});
const csrfProtection = csrf();

// Setting EJS As View Engine & Views Dir
app.set("view engine", "ejs");
app.set("views", "views");

// Set Public Directory, Filter Requests Through BodyParser/Session
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: "",
		resave: false,
		saveUninitialized: false,
		store: store
	})
);

// Filter Through CSRF & Flash
app.use(csrfProtection);
app.use(flash());

// Add Locals To All Responses
app.use((req, res, next) => {
	// In All Responses
	res.locals.userType = req.session.userType;
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

// Add Mongoose User Model To Req
app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch(err => {
			next(new Error(err)); // Inside Async Stuff
		});
});

// Filter Through Main Routes
app.use(publicRoutes);
app.use(authRoutes);
app.use(alumniRoutes);
app.use(studentRoutes);
app.use("/admin", adminRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

// Special Middleware That Manages Errors
app.use((error, req, res, next) => {
	res.status(500).render("500", {
		pageTitle: "Error!",
		path: "/500",
		isAuthenticated: req.session.isLoggedIn
	});
});

// Initialize Application With Mongoose Connection
mongoose
	.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(result => {
		app.listen(port, () => {
			console.log(`App listening on port ${port}!`);
		});
	})
	.catch(err => {
		console.log(err);
	});
