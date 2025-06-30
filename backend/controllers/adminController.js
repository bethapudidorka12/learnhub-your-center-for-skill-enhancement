const User = require("../schemas/userModel");
const Course = require("../schemas/courseModel");
const EnrolledCourse = require("../schemas/enrolledCourseModel");

// ✅ Get all registered users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email type");
    res.status(200).json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Edit any course
const editCourse = async (req, res) => {
  const courseId = req.params.id;
  const updates = req.body;

  try {
    const course = await Course.findByIdAndUpdate(courseId, updates, { new: true });
    if (!course) return res.status(404).json({ error: "Course not found" });

    res.status(200).json({ message: "Course updated", course });
  } catch (err) {
    console.error("Edit course error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get enrolled students
const getEnrolledStudents = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const enrolled = await EnrolledCourse.find({ courseId }).populate("userId", "name email");
    res.status(200).json(enrolled);
  } catch (err) {
    console.error("Fetch enrolled students error:", err);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
};

module.exports = {
  getAllUsers,
  editCourse,
  getEnrolledStudents,
};
