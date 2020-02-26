const express = require("express");
// const isAuth = require("../middleware/is-auth");
// const { body } = require("express-validator");

const publicController = require("../controllers/public");

const router = express.Router();

//! HOME
// GET => /
router.get("/", publicController.getIndex);

//! EVENTS
// GET => /events
router.get("/events", publicController.getEvents);

//! DONATE
// GET => /donate
router.get("/donate", publicController.getDonate);

module.exports = router;
