import { useState } from "react";
import AxiosInstance from "../../services/AxiosInstance";

import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    try {
      const res = await AxiosInstance.post("/api/users/admin-login", {
        email,
        password,
      });

      // Store token and role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "admin");

      // Redirect to Admin Dashboard
      navigate("/admin-dashboard");
    } catch (err) {
      alert("Admin Login Failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">🔐 Admin Login</h2>
      <input
        type="email"
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleAdminLogin}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Login as Admin
      </button>
    </div>
  );
}

export default AdminLogin;
