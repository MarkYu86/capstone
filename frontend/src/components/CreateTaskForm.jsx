import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupSelector from "./GroupSelector";

function CreateTaskForm({ onTaskCreated, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    repeatInterval: 1,
    repeatUnit: "days",
    assignedTo: "",
    notes: "",
  });

  const [groupUsers, setGroupUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId);
    if (!groupId) return;

    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:3001/api/groups/${groupId}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setGroupUsers(res.data))
      .catch((err) => console.error("Failed to load group users:", err));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:3001/api/tasks",
        {
          name: formData.name,
          frequency: "custom",
          dueDate: new Date(), // fallback for required field
          assignedTo: formData.assignedTo,
          notes: `Repeat every ${formData.repeatInterval} ${formData.repeatUnit}. ${formData.notes}`,
          status: "incomplete",
          UserId: 1, // Optional: from JWT or context
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onTaskCreated(); // Refresh task list
    } catch (err) {
      alert("Failed to create task.");
      console.error(err);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">Create New Task</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            name="name"
            placeholder="Task name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div className="d-flex mb-2">
            <input
              type="number"
              name="repeatInterval"
              value={formData.repeatInterval}
              onChange={handleChange}
              className="form-control me-2"
              min="1"
              required
            />
            <select
              name="repeatUnit"
              value={formData.repeatUnit}
              onChange={handleChange}
              className="form-select"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>

          <GroupSelector onSelect={handleGroupChange} />

          <select
            className="form-select mb-2"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            required
          >
            <option value="">Assign to...</option>
            {groupUsers.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <textarea
            className="form-control mb-2"
            name="notes"
            placeholder="Additional notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
          />

          <button className="btn btn-success me-2" type="submit">
            Save Task
          </button>
  
        </form>
      </div>
    </div>
  );
}

export default CreateTaskForm;
