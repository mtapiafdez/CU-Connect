const express = require("express");

const publicController = require("../controllers/public");

const router = express.Router();

router.get("/", publicController.getIndex);

module.exports = router;
