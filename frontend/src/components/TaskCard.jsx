import React from "react";
import axios from "axios";

function TaskCard({ task, onDelete, onEdit }) {
  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this task?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3001/api/tasks/${task.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onDelete();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete task.");
    }
  };

  const handleDidIt = async () => {
    const match = task.frequency.match(/Every (\d+) (\w+)/);
    if (!match) return alert("Invalid frequency format");

    const [, amount, unit] = match;
    const interval = parseInt(amount);
    const today = new Date(); 
    const newDueDate = new Date(today); 
    
    switch (unit) {
      case "days":
        newDueDate.setDate(today.getDate() + interval);
        break;
      case "weeks":
        newDueDate.setDate(today.getDate() + interval * 7);
        break;
      case "months":
        newDueDate.setMonth(today.getMonth() + interval);
        break;
      default:
        return alert("Unknown time unit");
    }

    try {
      await axios.put(`http://localhost:3001/api/tasks/${task.id}`, {
        dueDate: newDueDate,
        status: "incomplete", // or "active"
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      onEdit(); // refresh the task list
    } catch (err) {
      console.error("Failed to update task", err);
      alert("Error updating task.");
    }
  };

  const daysLeft = Math.ceil(
    (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{task.name}</h5>
      <h6>{task.assignedTo} </h6> 
        <p className="card-text text-muted">
          Due in {daysLeft <= 0 ? "Today" : `${daysLeft} day${daysLeft > 1 ? "s" : ""}`}
        </p>
        <button className="btn btn-sm btn-outline-success me-2" onClick={handleDidIt}>
          Did it!
        </button>
        <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
