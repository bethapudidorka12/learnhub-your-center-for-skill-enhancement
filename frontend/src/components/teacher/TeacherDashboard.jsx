import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../../services/AxiosInstance";

function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [sectionInput, setSectionInput] = useState({});
  const teacher = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // 🔁 Load teacher courses
  useEffect(() => {
    AxiosInstance.get("/api/courses")
      .then((res) => {
        const teacherCourses = res.data.filter(
          (c) => c.userID === teacher.id || c.userID === teacher._id
        );
        setCourses(teacherCourses);
      })
      .catch((err) => console.error("Error loading courses:", err));
  }, []);

  // 🚀 Auto-redirect to add-course if none exist
  useEffect(() => {
    if (courses.length === 0) {
      navigate("/teacher/add-course");
    }
  }, [courses, navigate]);

  const handleDelete = async (courseId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure to delete this course?")) return;

    try {
      await AxiosInstance.delete(`/api/courses/delete/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Course deleted");
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const handleAddSection = async (courseId) => {
    const token = localStorage.getItem("token");
    const title = sectionInput[courseId];
    if (!title || title.trim() === "") return alert("Section title required");

    try {
      const res = await AxiosInstance.post(
        `/api/courses/section/${courseId}`,
        { sectionTitle: title },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Section added");
      setSectionInput({ ...sectionInput, [courseId]: "" });

      setCourses((prev) =>
        prev.map((c) => (c._id === courseId ? res.data.course : c))
      );
    } catch (err) {
      alert(err.response?.data?.error || "Add section failed");
    }
  };
  
  

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">👨‍🏫 Your Courses</h2>

      {courses.length === 0 ? (
        <div className="alert alert-warning text-center">
          No courses created yet.
          <div className="mt-3">
            <Link to="/teacher/add-course" className="btn btn-primary">
              ➕ Create your first course
            </Link>
          </div>
        </div>
      ) : (
        courses.map((course) => (
          <div className="card mb-4 shadow-sm" key={course._id}>
            <div className="card-body">
              <h5 className="card-title">{course.C_title}</h5>
              <h6 className="text-muted mb-2">{course.C_categories}</h6>
              <p className="card-text">{course.C_description}</p>

              <p><strong>👥 Enrolled:</strong> {course.enrolled}</p>

              <p><strong>📚 Sections:</strong></p>
              <ul className="list-group list-group-flush mb-3">
                {course.sections.map((s, i) => (
                  <li className="list-group-item" key={i}>
                    {i + 1}. {s}
                  </li>
                ))}
              </ul>

              <div className="row g-2 align-items-center">
                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="New section title"
                    value={sectionInput[course._id] || ""}
                    onChange={(e) =>
                      setSectionInput({ ...sectionInput, [course._id]: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4 d-flex gap-2">
                  <button
                    className="btn btn-success w-100"
                    onClick={() => handleAddSection(course._id)}
                  >
                    ➕ Add Section
                  </button>
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => handleDelete(course._id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TeacherDashboard;
