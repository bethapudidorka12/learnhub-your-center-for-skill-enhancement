import { useEffect, useState } from "react";
import AxiosInstance from "../../services/AxiosInstance";

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await AxiosInstance.get("/api/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await AxiosInstance.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchEnrollments = async (courseId, title) => {
    try {
      const res = await AxiosInstance.get(`/api/admin/enrollments/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedCourseTitle(title);
      setEnrollments(res.data);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🛠️ Admin Dashboard</h2>

      <section>
        <h4>📚 Courses</h4>
        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          courses.map(course => (
            <div key={course._id} className="card p-3 mb-2">
              <h5>{course.C_title}</h5>
              <button
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => fetchEnrollments(course._id, course.C_title)}
              >
                View Enrollments
              </button>
            </div>
          ))
        )}
      </section>

      <section className="mt-5">
        <h4>👤 Registered Users</h4>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul className="list-group">
            {users.map(user => (
              <li className="list-group-item" key={user._id}>
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-5">
        <h4>🧑‍🎓 Enrolled Students {selectedCourseTitle && `for "${selectedCourseTitle}"`}</h4>
        {enrollments.length === 0 ? (
          <p>No students enrolled in this course.</p>
        ) : (
          <ul className="list-group">
            {enrollments.map(enroll => (
              <li className="list-group-item" key={enroll._id}>
                {enroll.userId?.name} ({enroll.userId?.email})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
