const express = require("express");

const publicController = require("../controllers/public");

const router = express.Router();

router.get("/", publicController.getIndex);

router.get("/events", publicController.getEvents);

router.get("/donate", publicController.getDonate);

module.exports = router;
