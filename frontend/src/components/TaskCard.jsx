import React, { useEffect, useState } from "react";
import axios from "axios";
import EditTaskForm from "./EditTaskForm";
import "../styles/TaskCard.css";

function TaskCard({ task, onDelete, onEdit }) {
  const [daysLeft, setDaysLeft] = useState(calculateDaysLeft());
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setDaysLeft(calculateDaysLeft());
  }, [task.dueDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysLeft(calculateDaysLeft());
    }, 5000);
    return () => clearInterval(interval);
  }, [task.dueDate]);

  function calculateDaysLeft() {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/tasks/${task.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

    const interval = parseInt(match[1]);
    const unit = match[2];
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
      await axios.put(
        `http://localhost:3001/api/tasks/${task.id}`,
        {
          dueDate: newDueDate,
          status: "incomplete",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      onEdit();
    } catch (err) {
      console.error("Failed to update task", err);
      alert("Error updating task.");
    }
  };

  let dueText = "";
  if (daysLeft < 0) {
    dueText = `Overdue by ${Math.abs(daysLeft)} day${
      Math.abs(daysLeft) > 1 ? "s" : ""
    }`;
  } else if (daysLeft === 0) {
    dueText = "Due Today";
  } else {
    dueText = `Due in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`;
  }

  const handleEditClick = () => {
    setEditMode(true);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {editMode ? (
          <EditTaskForm
            task={task}
            onTaskUpdated={() => {
              onEdit();
              setEditMode(false);
            }}
          />
        ) : (
          <>
            <h5 className="card-title">{task.name}</h5>
            <h6 className="text-muted">{task.assignedTo}</h6>
            <p className="card-text text-muted">{dueText}</p>
            {task.notes && (
              <p className="card-text">
                <strong>Notes:</strong> {task.notes}
              </p>
            )}
            <div className="task-buttons mt-2">
              <button
                className="btn btn-sm btn-outline-success me-2"
                onClick={handleDidIt}
              >
                Did it!
              </button>
              <button
                className="btn btn-sm btn-outline-warning me-2"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
