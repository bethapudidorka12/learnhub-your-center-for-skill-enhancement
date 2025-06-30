const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllUsers,
  editCourse,
  getEnrolledStudents,
} = require('../controllers/adminController');

// ✅ Get all users
router.get('/users', authMiddleware, getAllUsers);

// ✅ Edit course
router.put('/edit/:id', authMiddleware, editCourse);

// ✅ Get enrolled students in a course
router.get('/enrollments/:courseId', authMiddleware, getEnrolledStudents);

module.exports = router;
