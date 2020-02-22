// Import Express, BodyParser, & Path
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const User = require("./models/user");

// Initialize Express Server
const app = express();
const port = 3000;

// Routes
const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const alumniRoutes = require("./routes/alumni");
const studentRoutes = require("./routes/student");
const errorController = require("./controllers/error");

const MONGODB_URI = "";

const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: "sessions"
});
const csrfProtection = csrf();

// Setting EJS As View Engine & Views Dir
app.set("view engine", "ejs");
app.set("views", "views");

// Filter Requests Through BodyParser & Set Public Directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
	session({
		secret: "",
		resave: false,
		saveUninitialized: false,
		store: store
	})
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	// In All Renders
	res.locals.userType = req.session.userType;
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

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

// Run Through Routes
app.use(publicRoutes);
app.use(authRoutes);
app.use(alumniRoutes);
app.use(studentRoutes);
app.use("/admin", adminRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
	res.status(500).render("500", {
		pageTitle: "Error!",
		path: "/500",
		isAuthenticated: req.session.isLoggedIn
	});
});

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
