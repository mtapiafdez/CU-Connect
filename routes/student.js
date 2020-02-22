const express = require("express");

const studentController = require("../controllers/student");

const router = express.Router();

router.get("/me", studentController.getMe);

module.exports = router;
