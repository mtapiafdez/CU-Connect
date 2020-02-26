const express = require("express");
// const isAuth = require("../middleware/is-auth");
// const { body } = require("express-validator");

const errorController = require("../controllers/error");

const router = express.Router();

//! 404
// GET => /404
router.get("/404", errorController.get404);

//! 500
// GET => /500
router.get("/500", errorController.get500);

module.exports = router;
