// Event Model Mongoose
const Event = require("../models/event");
const Config = require("../models/config");

// Returns Index View
exports.getIndex = async (req, res, next) => {
    const siteConfig = await Config.findById("5e79211c227c580a24c1919d");

    return res.render("shared/home", {
        path: "/",
        pageTitle: "Home",
        homeConfig: siteConfig.homeConfig
    });
};

// Returns Events View
exports.getEvents = async (req, res, next) => {
    let events = await Event.find({ approved: "APPROVED" }).select(
        "-_id -userId -approved"
    );

    res.render("shared/events", {
        path: "/events",
        pageTitle: "Events",
        events: events
    });
};

// Returns Donate View
exports.getDonate = (req, res, next) => {
    res.render("shared/donate", {
        path: "/donate",
        pageTitle: "Donate"
    });
};
