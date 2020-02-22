const express = require("express");

const alumniController = require("../controllers/alumni");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/me", isAuth, alumniController.getMe);

router.get("/update-info", isAuth, alumniController.getUpdate);

router.post("/update-info", isAuth, alumniController.postUpdate);

module.exports = router;
