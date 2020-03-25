const express = require("express");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

const alumniController = require("../controllers/alumni");

const router = express.Router();

//! ME
// GET => /me
router.get("/me", isAuth.Alumni, alumniController.getMe);
router.patch(
	"/manageConnectionRequest",
	isAuth.Alumni,
	alumniController.patchConnectionRequest
);

// GET => /messages
router.get("/messages", isAuth.Alumni, alumniController.getMessages);

// GET-POST => Update-Info
router.get("/update-info", isAuth.Alumni, alumniController.getUpdate);
router.post("/update-info", isAuth.Alumni, alumniController.postUpdate);

// GET => /reports
router.get("/reports", isAuth.Alumni, alumniController.getReports);

//! EVENT
// GET-POST => /request-event
router.get("/request-event", isAuth.Alumni, alumniController.getRequestEvent);
router.post("/request-event", isAuth.Alumni, alumniController.postEventRequest);

// GET => /requested-events
router.get(
	"/requested-events",
	isAuth.Alumni,
	alumniController.getRequestedEvents
);

// DELETE => /delete-requested/:reqEventId
router.delete(
	"/delete-requested/:reqEventId",
	isAuth.Alumni,
	alumniController.deleteRequestedEvent
);

//! CONNECT
// GET => /connect
router.get("/connect", isAuth.Alumni, alumniController.getConnect);
router.get(
	"/getConnections",
	isAuth.AlumniStudent,
	alumniController.getConnections
);
router.put(
	"/sendConnection",
	isAuth.AlumniStudent,
	alumniController.putConnection
);

module.exports = router;
