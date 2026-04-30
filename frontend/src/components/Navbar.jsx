import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let name = "User";
  let role = "member";

  if (token) {
    const decoded = jwtDecode(token);
    name = decoded?.name || "User";
    role = decoded?.role || "member";
  }

  return (
    <div className="flex justify-between items-center bg-gray-900 px-6 py-4 shadow">
      <div>
        <h1 className="text-xl font-bold">Team Task Manager</h1>
        <p className="text-sm text-gray-400">
          Welcome, {name} 👋 ({role})
        </p>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
        className="bg-red-500 px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}