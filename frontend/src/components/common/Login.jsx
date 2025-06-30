import { useState } from "react";
import AxiosInstance from "../../services/AxiosInstance";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await AxiosInstance.post("/api/users/login", { email, password });
      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.type === "admin") navigate("/admin/dashboard");
      else if (user.type === "teacher") navigate("/teacher/dashboard");
      else navigate("/student/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">🔐 Login to LearnHub</h3>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
        </div>
        <div className="mb-4">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
        </div>
        <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
