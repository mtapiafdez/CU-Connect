const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// /admin/alumni/management
router.get("/alumni/management", adminController.getAlumniManagement);

// /admin/alumni/add-news
router.get("/alumni/add-news", adminController.getAlumniAddNews);

module.exports = router;
