const Course = require('../schemas/courseModel');
const EnrolledCourse = require('../schemas/enrolledCourseModel');
const User = require('../schemas/userModel');
const PDFDocument = require("pdfkit");

// ✅ Add Course
const addCourse = async (req, res) => {
  try {
    const {
      userID, C_educator, C_categories,
      C_title, C_description, sections, C_price
    } = req.body;

    const newCourse = new Course({
      userID, C_educator, C_categories,
      C_title, C_description, sections, C_price
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });

  } catch (error) {
    console.error("Add course error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get All Courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (err) {
    console.error("Fetch courses error:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};


const createCourse = async (req, res) => {
  try {
    console.log("Incoming data:", req.body); // 🔍 Log request body

    const {
      userID,
      C_educator,
      C_categories,
      C_title,
      C_description,
      sections,
      C_price,
    } = req.body;

    // ✅ Check for missing required fields
    if (!userID || !C_educator || !C_categories || !C_title || !sections || !Array.isArray(sections)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCourse = new Course({
      userID,
      C_educator,
      C_categories,
      C_title,
      C_description: C_description || "",
      sections,
      C_price: C_price || 0,
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });

  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ error: "Failed to create course" });
  }
};

module.exports = { createCourse };


// ✅ Enroll in a Course
const enrollInCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const already = await EnrolledCourse.findOne({ userId, courseId });
    if (already) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const newEnrollment = new EnrolledCourse({ userId, courseId });
    await newEnrollment.save();

    res.status(201).json({ message: "Enrolled successfully" });
  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update Progress
const updateProgress = async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user.id;
  const { progress } = req.body;

  try {
    const record = await EnrolledCourse.findOneAndUpdate(
      { courseId, userId },
      {
        progress,
        completed: progress >= 100
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Progress updated", data: record });
  } catch (err) {
    console.error("Update progress error:", err);
    res.status(500).json({ error: "Failed to update progress" });
  }
};

// ✅ Get Progress
const getProgress = async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user.id;

  try {
    const record = await EnrolledCourse.findOne({ courseId, userId });
    if (!record) return res.status(404).json({ progress: 0, completed: false });

    res.status(200).json({
      progress: record.progress,
      completed: record.completed
    });
  } catch (err) {
    console.error("Fetch progress error:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
};

// ✅ Add Section
const addSection = async (req, res) => {
  const courseId = req.params.id;
  const { sectionTitle } = req.body;

  if (!sectionTitle || sectionTitle.trim() === "") {
    return res.status(400).json({ error: "Section title is required" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    course.sections.push(sectionTitle);
    await course.save();

    res.status(200).json({ message: "Section added", course });
  } catch (err) {
    console.error("Add section error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete Course
const deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const enrolled = await EnrolledCourse.find({ courseId });
    if (enrolled.length > 0) {
      return res.status(403).json({ error: "Cannot delete. Students already enrolled." });
    }

    await Course.findByIdAndDelete(courseId);
    res.json({ message: "Course deleted successfully" });

  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Generate Certificate
const generateCertificate = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    const enrollment = await EnrolledCourse.findOne({ courseId, userId }).populate('userId');
    const course = await Course.findById(courseId);

    if (!enrollment || !enrollment.completed) {
      return res.status(400).json({ error: "Course not completed or not enrolled" });
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=certificate.pdf");

    doc.pipe(res);
    doc.fontSize(26).text("🎓 Certificate of Completion", { align: "center" });
    doc.moveDown();
    doc.fontSize(18).text(`This certifies that ${enrollment.userId.name} has successfully completed`, {
      align: "center"
    });
    doc.fontSize(20).text(`\"${course.C_title}\"`, { align: "center", underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });
    doc.end();

  } catch (err) {
    console.error("Certificate error:", err);
    res.status(500).json({ error: "Failed to generate certificate" });
  }
};

// ✅ Update Course (Admin Function)
const updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const updatedData = req.body;

  try {
    const updated = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });
    if (!updated) return res.status(404).json({ error: "Course not found" });

    res.status(200).json({ message: "Course updated", course: updated });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// ✅ Admin: Get Enrolled Students for a Course
const getEnrolledStudents = async (req, res) => {
  try {
    const courseId = req.params.id;
    const enrolled = await EnrolledCourse.find({ courseId }).populate("userId", "name email");
    res.json(enrolled);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enrolled students" });
  }
};

module.exports = {
  addCourse,
  createCourse,
  getAllCourses,
  enrollInCourse,
  updateProgress,
  getProgress,
  addSection,
  deleteCourse,
  generateCertificate,
  updateCourse,
  getEnrolledStudents
};
