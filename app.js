// Initialize Express Server
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const path = require("path");

// Routes
const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

// Setting EJS As View Engine & Views Dir
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(publicRoutes);
app.use(authRoutes);

app.use(errorController.get404);

app.listen(port, () => {
	console.log(`App listening on port ${port}!`);
});
