// backend/controllers/enrollController.js
const EnrolledCourse = require('../schemas/enrolledCourseModel');


exports.saveProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress } = req.body;
    const userId = req.user.id;

    const record = await EnrolledCourse.findOneAndUpdate(
      { userId, courseId },
      { progress, completed: progress >= 100 },
      { upsert: true, new: true }
    );

    res.json({ message: "Progress saved", data: record });
  } catch (err) {
    console.error("Save progress error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const record = await EnrolledCourse.findOne({ userId, courseId });

    if (!record) return res.status(404).json({ message: "Progress not found" });

    res.json(record);
  } catch (err) {
    console.error("Get progress error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id;         // 👈 Automatically comes from authMiddleware (after verifying token)
    const courseId = req.params.id;     // 👈 Comes from URL like /api/courses/progress/:id

    // 🔍 Find enrollment in DB for this user and course
    const enrollment = await EnrolledCourse.findOne({ userId, courseId });

    // ❌ If not enrolled, send error
    if (!enrollment) {
      return res.status(404).json({ error: "Not enrolled" });
    }

    // ✅ Send progress and completion status
    res.json({
      progress: enrollment.progress,     // 🔢 percentage completed (example: 40%)
      completed: enrollment.completed    // ✅ true or false
    });

  } catch (err) {
    console.error("Progress fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.enrollInCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    // Check if already enrolled
    const existing = await EnrolledCourse.findOne({ userId, courseId });
    if (existing) return res.status(200).json({ message: "Already enrolled" });

    const enrollment = new EnrolledCourse({ userId, courseId });
    await enrollment.save();

    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error('Enroll error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const enrollment = await EnrolledCourse.findOne({ userId, courseId });
    if (!enrollment) return res.status(404).json({ error: "Not enrolled" });

    res.json({ progress: enrollment.progress, completed: enrollment.completed });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
