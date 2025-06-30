import { useState } from "react";
import AxiosInstance from "../../services/AxiosInstance";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", type: "student"
  });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await AxiosInstance.post("/api/users/register", form);
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">📝 Register for LearnHub</h3>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter email" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter password" />
        </div>
        <div className="mb-4">
          <label className="form-label">Role</label>
          <select className="form-select" value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <button className="btn btn-success w-100" onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default Register;
