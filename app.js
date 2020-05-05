// Import Packages
// const CONFIG = require("./util/config");
const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const uuidv4 = require("uuid/v4");

// Packets For Deployment
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

// Import User Model
const User = require("./models/user");

// Initialize Express Server & Port
const app = express();
const port = process.env.PORT || 3000;

// Import Routes
const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const alumniRoutes = require("./routes/alumni");
const studentRoutes = require("./routes/student");
const errorRoutes = require("./routes/error");
const errorController = require("./controllers/error");

// Declare Mongo URI
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cu-connect-main-eipxr.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

// Instantiate MongoDBStore & Initialize CSRF Protection
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions"
});
const csrfProtection = csrf();

// Defining Multer Storage &  File Filter
const fileStorage = multer.diskStorage({
    // Send To Images Directory
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    // Use Universal Unique Identifier & Original Filename
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Allow Only Images
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Setting EJS As View Engine & Views Dir
app.set("view engine", "ejs");
app.set("views", "views");

// Set Static Directories
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// Function Access And Write To Log File
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
);

// Filter Through Requests For Compression, Security, And Logging
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

// Filter Requests Through BodyParser/Multer/Session
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
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
app.use(async (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    try {
        const user = await User.findById(req.session.user._id);

        if (!user) {
            return next();
        }
        req.user = user;
        next();
    } catch (err) {
        throw new Error(err);
    }
});

// Filter Through Main Routes
app.use(publicRoutes);
app.use(authRoutes);
app.use(alumniRoutes);
app.use(studentRoutes);
app.use("/admin", adminRoutes);
app.use(errorRoutes);

app.use(errorController.get404);

// Special Middleware That Manages Errors
app.use((error, req, res, next) => {
    console.log("Making it to error");
    if (error.type === "REST") {
        const status = error.statusCode || 500;
        const message = error.message;
        const data = error.data;
        res.status(status).json({
            message: message,
            data: data
        });
    } else {
        res.status(500).render("500", {
            pageTitle: "Error!",
            path: "/500"
        });
    }
});

// Initialize Application With Mongoose Connection
mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        const server = app.listen(port, () => {
            console.log(`App listening on port ${port}!`);
        });

        const io = require("./socket").init(server);

        io.on("connection", socket => {
            socket.on("join-room", room => {
                socket.join(room);
            });

            // New Message To Server
            socket.on("NMTS", clientData => {
                socket.to(clientData.room).emit("NMTC", clientData.message);
            });
        });
    })
    .catch(err => {
        console.log(err);
    });
