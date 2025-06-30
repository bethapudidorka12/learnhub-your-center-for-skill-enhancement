import { Routes, Route, Link } from 'react-router-dom';

import Login from './components/common/Login';
import Register from './components/common/Register';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AddCourse from './components/teacher/AddCourse';
import CourseDetail from './components/student/CourseDetail';
import AdminLogin from './components/admin/AdminLogin';

function App() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold fs-4" to="/">📘 Smart LMS</Link>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-light">Login</Link>
            <Link to="/register" className="btn btn-outline-light">Register</Link>
            <Link to="/admin-login" className="btn btn-warning text-dark fw-semibold">Admin</Link>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Dashboards */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/add-course" element={<AddCourse />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/course/:id" element={<CourseDetail />} />

        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Home Page */}
        <Route
          path="/"
          element={
            <section className="d-flex flex-column justify-content-center align-items-center text-center bg-light" style={{ minHeight: '90vh' }}>
              <h1 className="display-4 fw-bold mb-3 text-primary">🎓 Welcome to Smart LMS</h1>
              <p className="fs-5 text-secondary mb-4">Learn at your pace. Teach with ease. Manage effectively.</p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/login" className="btn btn-primary px-4 py-2">Student/Teacher Login</Link>
                <Link to="/register" className="btn btn-success px-4 py-2">Register</Link>
                <Link to="/admin-login" className="btn btn-dark px-4 py-2">Admin Login</Link>
              </div>
            </section>
          }
        />
      </Routes>
    </>
  );
}

export default App;
