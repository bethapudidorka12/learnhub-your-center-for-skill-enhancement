const express = require("express");
const router = express.Router();

// ✅ Make sure this matches your actual folder: "middleware", not "middlewares"
const authMiddleware = require("../middleware/authMiddleware");

const {
  createCourse,
  addCourse,
  getAllCourses,
  enrollInCourse,
  updateProgress,
  getProgress,
  deleteCourse,
  addSection,
  generateCertificate,
  updateCourse
} = require("../controllers/courseController");

// 🟢 Routes for course actions
router.post("/create", authMiddleware, createCourse);      // ✅ Course creation
router.post("/add", authMiddleware, addCourse);            // ✅ Optional older addCourse
router.get("/", getAllCourses);                            // ✅ Get all courses
router.post("/enroll/:id", authMiddleware, enrollInCourse);
router.put("/progress/:id", authMiddleware, updateProgress);
router.get("/progress/:id", authMiddleware, getProgress);
router.post("/section/:id", authMiddleware, addSection);
router.delete("/delete/:id", authMiddleware, deleteCourse);
router.get("/certificate/:id", authMiddleware, generateCertificate);
router.put("/edit/:id", authMiddleware, updateCourse);

module.exports = router;
