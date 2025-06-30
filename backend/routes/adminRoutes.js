const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllUsers,
  editCourse,
  getEnrolledStudents,
} = require("../controllers/adminController");

router.get("/users", authMiddleware, getAllUsers);
router.put("/edit-course/:id", authMiddleware, editCourse);
router.get("/enrollments/:courseId", authMiddleware, getEnrolledStudents);

module.exports = router;
