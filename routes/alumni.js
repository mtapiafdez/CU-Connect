const express = require("express");

const alumniController = require("../controllers/alumni");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET => Me Page
router.get("/me", isAuth, alumniController.getMe);

// GET-POST => Update-Info
router.get("/update-info", isAuth, alumniController.getUpdate);
router.post("/update-info", isAuth, alumniController.postUpdate); // TODO: Change to Put

// GET-POST => Request-Event
router.get("/request-event", alumniController.getEventRequest);
router.post("/request-event", alumniController.postEventRequest);

module.exports = router;
