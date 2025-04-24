import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CreateTaskForm from "../components/CreateTaskForm";
import TaskCard from "../components/TaskCard";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3001/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to view the dashboard.");
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:3001/api/protected/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser({ name: res.data.name, email: res.data.email });
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/");
      });

    fetchTasks();
  }, [navigate]);

  return (
    <div className="d-flex">
      {/* <Sidebar /> */}
      <div className="container mt-4">
        <h1>Dashboard</h1>
        {user && (
          <p>
            Welcome back, <strong>{user.name || user.email}</strong> 👋
          </p>
        )}

        <button
          className="btn btn-primary mb-4"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Close Form" : "Add New Task"}
        </button>
        <button
  className="btn btn-outline-primary me-3"
  onClick={() => navigate("/groups")}
>
  Create New Group
</button>


        {showForm && (
          <CreateTaskForm
            onTaskCreated={() => {
              fetchTasks();
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="row">
            {tasks.map((task) => (
              <div className="col-md-4 mb-4" key={task.id}>
                <TaskCard
                  task={task}
                  onDelete={fetchTasks}
                  onEdit={(task) => {
                    alert("Edit task coming soon!");
                    setEditingTask(task);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
