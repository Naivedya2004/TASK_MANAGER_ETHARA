import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back 👋</h1>

        <input
          className="w-full p-2 mb-3 rounded bg-gray-700"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full p-2 mb-4 rounded bg-gray-700"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-center mt-4">
          New user?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}