const express = require("express");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

const studentController = require("../controllers/student");

const router = express.Router();

//! ME
// GET => /me-student
router.get("/student-me", isAuth.Student, studentController.getStudentMe);

// GET => /messages-student
router.get(
	"/student-messages",
	isAuth.Student,
	studentController.getStudentMessages
);

//! CONNECT
// GET => /student-connect
router.get(
	"/student-connect",
	isAuth.Student,
	studentController.getStudentConnect
);

module.exports = router;
