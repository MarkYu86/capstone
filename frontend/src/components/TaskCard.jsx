import React from "react";
import axios from "axios";

function TaskCard({ task, onDelete, onEdit }) {
  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this task?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3001/api/tasks/${task.id}`,{
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

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{task.name}</h5>
        <p className="card-text">
          <strong>Status:</strong> {task.status} <br />
          <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()} <br />
          <strong>Frequency:</strong> {task.frequency} <br />
          <strong>Assigned To:</strong> {task.assignedTo} <br />
          {task.notes && (
            <>
              <strong>Notes:</strong> {task.notes} <br />
            </>
          )}
        </p>
        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
