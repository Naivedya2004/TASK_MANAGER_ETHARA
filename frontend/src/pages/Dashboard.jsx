import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [role, setRole] = useState("member");

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    overdue: 0,
  });

  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    const decoded = jwtDecode(token);
    setRole(decoded.role);

    fetchData();
  }, []);

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    try {
      const p = await API.get("/projects");
      const t = await API.get("/tasks");

      setProjects(p.data);
      setTasks(t.data);

      const total = t.data.length;
      const completed = t.data.filter((x) => x.status === "completed").length;
      const overdue = t.data.filter((x) => x.status === "pending").length;

      setStats({ total, completed, overdue });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ---------------- UPDATE STATUS (FIXED) ----------------
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      await fetchData();
    } catch {
      alert("Update failed");
    }
  };

  // ---------------- CREATE PROJECT ----------------
  const createProject = async () => {
    try {
      await API.post("/projects", { name: projectName });
      setProjectName("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail);
    }
  };

  // ---------------- CREATE TASK ----------------
  const createTask = async () => {
  try {
    if (!selectedProject) return alert("Please select a project first");
    if (!taskTitle) return alert("Enter task title");

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    await API.post("/tasks", {
      title: taskTitle,
      project_id: selectedProject,
      assigned_to: decoded.user_id   // ✅ FIX 2
    });

    setTaskTitle("");
    await fetchData();
  } catch (err) {
    alert(err.response?.data?.detail || "Task creation failed");
  }
};
  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="p-6">

        {/* DASHBOARD STATS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-700 p-4 rounded">
            Projects: {projects.length}
          </div>

          <div className="bg-gray-800 p-4 rounded">
            Total Tasks: {stats.total}
          </div>

          <div className="bg-green-700 p-4 rounded">
            Completed: {stats.completed}
          </div>

          <div className="bg-red-700 p-4 rounded">
            Overdue: {stats.overdue}
          </div>
        </div>

        {/* PROJECT CREATION */}
        {role === "admin" && (
          <div className="mb-6">
            <h2 className="mb-2">Create Project</h2>
            <input
              className="p-2 text-black mr-2"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <button
              className="bg-blue-600 px-4 py-2 rounded"
              onClick={createProject}
            >
              Add Project
            </button>
          </div>
        )}

        {/* PROJECT LIST */}
        <div className="mb-6">
          <h2 className="mb-2">Projects</h2>

          <div className="grid grid-cols-3 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p.id)}
                className={`p-4 rounded cursor-pointer ${
                  selectedProject === p.id ? "bg-blue-600" : "bg-gray-800"
                }`}
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>

        {/* TASK CREATION */}
        <div className="mb-6">
          <h2 className="mb-2">Create Task</h2>

          <input
            className="p-2 text-black mr-2"
            placeholder="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <button
            className="bg-green-600 px-4 py-2 rounded"
            onClick={createTask}
          >
            Add Task
          </button>
        </div>

        {/* TASK LIST */}
        <div>
          <h2 className="mb-2">Tasks</h2>

          <div className="grid grid-cols-3 gap-4">
            {tasks
              .filter((t) => t.project_id === selectedProject)
              .map((t) => (
                <div key={t.id} className="bg-gray-800 p-4 rounded">

                  <p className="font-semibold">{t.title}</p>
                  <p className="text-sm text-gray-400">{t.status}</p>

                  {/* ✔ STATUS UPDATE BUTTON (CORRECT PLACE) */}
                  <button
                    onClick={() => updateStatus(t.id, "completed")}
                    className="bg-green-600 px-3 py-1 mt-2 rounded"
                  >
                    Mark Complete
                  </button>

                  <select
                    className="text-black mt-2 block"
                    value={t.status}
                    onChange={(e) => updateStatus(t.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>

                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}