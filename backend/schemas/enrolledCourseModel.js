// backend/schemas/enrolledCourseModel.js
const mongoose = require("mongoose");

const enrolledCourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  progress: { type: Number, default: 0 }, // in percentage (0-100)
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("EnrolledCourse", enrolledCourseSchema);
