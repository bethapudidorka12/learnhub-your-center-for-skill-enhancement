const express = require('express');
const router = express.Router();
const { enrollInCourse, getProgress } = require('../controllers/enrollController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/enroll/:id', authMiddleware, enrollInCourse);
router.get('/progress/:id', authMiddleware, getProgress);

module.exports = router;
