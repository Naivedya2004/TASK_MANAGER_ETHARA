import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async () => {
  try {
    // create user
    await API.post("/signup", form);

    // auto login
    const res = await API.post("/login", {
      email: form.email,
      password: form.password,
    });

    localStorage.setItem("token", res.data.access_token);

    navigate("/dashboard");
  } catch (err) {
    alert(err.response?.data?.detail || "Signup failed");
  }
};

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account 🚀</h1>

        <input
          className="w-full p-2 mb-3 rounded bg-gray-700"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

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
          className="w-full bg-green-600 py-2 rounded hover:bg-green-700"
          onClick={handleSignup}
        >
          Signup
        </button>
      </div>
    </div>
  );
}