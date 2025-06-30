import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../../services/AxiosInstance";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // ✅ Fetch all courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await AxiosInstance.get("/api/courses");
        setCourses(res.data);
        setFilteredCourses(res.data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    };

    fetchCourses();
  }, []);

  // 🔍 Filter when search or category changes
  useEffect(() => {
    let results = [...courses];

    if (search.trim() !== "") {
      results = results.filter((course) =>
        course.C_title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      results = results.filter((course) => course.C_categories === category);
    }

    setFilteredCourses(results);
  }, [search, category, courses]);

  // 📝 Enroll in a course
  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to enroll");
        return;
      }

      const res = await AxiosInstance.post(
        `/api/courses/enroll/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Enrolled successfully");

      // Refresh course list after enroll
      const updated = await AxiosInstance.get("/api/courses");
      setCourses(updated.data);
    } catch (err) {
      console.error("Enroll failed:", err);
      alert(err.response?.data?.error || "Enrollment failed");
    }
  };

  const categories = ["all", ...new Set(courses.map((course) => course.C_categories))];

  return (
    <div className="container mt-5">
      <h3 className="mb-4">🎓 Explore Courses</h3>

      {/* 🔍 Search + Filter */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by course title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 📚 Course Cards */}
      <div className="row">
        {filteredCourses.length === 0 ? (
          <p>No courses match your criteria.</p>
        ) : (
          filteredCourses.map((course) => (
            <div className="col-md-4 mb-4" key={course._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{course.C_title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{course.C_educator}</h6>
                  <p className="card-text">{course.C_description}</p>
                  <div className="mt-auto">
                    <p className="text-muted mb-1">📂 {course.C_categories}</p>
                    <p className="fw-bold mb-2">
                      💰 {course.C_price === 0 ? "Free" : `₹${course.C_price}`}
                    </p>
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => handleEnroll(course._id)}
                    >
                      Enroll
                    </button>

                    {/* ✅ Resume Button */}
                    <Link
                      to={`/student/course/${course._id}`}
                      className="btn btn-primary w-100 mt-2"
                    >
                      Start Here
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
