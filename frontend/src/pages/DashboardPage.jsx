import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateTaskForm from "../components/CreateTaskForm";
import TaskCard from "../components/TaskCard";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3001/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Fetched tasks:", res.data);
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
        setLoading(false);
      });
  };

  const fetchGroups = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3001/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setGroups(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch groups:", err);
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
        setUser({
          name: res.data.name,
          email: res.data.email,
        });
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/");
      });

    fetchGroups();
    fetchTasks();
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>

      {user && (
        <>
          <p>
            Welcome back, <strong>{user.name || user.email}</strong> 👋
          </p>
          {groups.length === 0 && (
            <p>
              You are not in any group yet.{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/groups");
                }}
              >
                Create or join one now!
              </a>
            </p>
          )}
        </>
      )}

      <button
        className="btn btn-primary mb-4"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Close Form" : "Add New Task"}
      </button>

      {showForm && (
        <CreateTaskForm
          onTaskCreated={() => {
            fetchTasks();
            setShowForm(false);
          }}
        />
      )}

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found for your groups.</p>
      ) : (
        <div className="row">
         {tasks.map((task) => {
  console.log("Rendering task:", task); // 👈 now valid
  return (
    <div className="taskcard" key={task.id}>
      <TaskCard
        task={task}
        onDelete={fetchTasks}
        onEdit={fetchTasks}
      />
    </div>
  );
})}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
