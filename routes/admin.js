const express = require("express");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");

const router = express.Router();

//! DONATE
// GET => /admin/donate-metrics
router.get("/donate-metrics", isAuth.Admin, adminController.getDonateMetrics);

//! EVENTS
// GET-POST => /admin/events/add-event
router.get("/events/add-event", isAuth.Admin, adminController.getAddEvent);
router.post("/events/add-event", isAuth.Admin, adminController.postAddEvent);

// GET-PATCH => /admin/events/event-approval
router.get(
	"/events/event-approval",
	isAuth.Admin,
	adminController.getEventApproval
);
router.patch(
	"/events/event-approval/:eventId/:type",
	isAuth.Admin,
	adminController.patchEventApproval
);

//! ALUMNI
// GET => /admin/alumni/master-search
router.get(
	"/alumni/master-search",
	isAuth.Admin,
	adminController.getMasterSearch
);

// GET => /admin/alumni/add-news
router.get("/alumni/add-news", isAuth.Admin, adminController.getAddNews);

//! MGMT
// GET => /admin/management/site-config
router.get(
	"/management/site-config",
	isAuth.Admin,
	adminController.getSiteConfig
);

module.exports = router;
