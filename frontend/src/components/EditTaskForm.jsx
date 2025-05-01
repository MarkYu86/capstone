import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupSelector from "./GroupSelector";
import "../index.css"

function EditTaskForm({ task, onTaskUpdated }) {
  const [formData, setFormData] = useState({
    name: task.name || "",
    repeatInterval: task.frequency.split(" ")[1] || 1,
    repeatUnit: task.frequency.split(" ")[2] || "days",
    notes: task.notes || "",
    assignedTo: task.assignedTo || "",
  });
  const [groupUsers, setGroupUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(task.groupId || "");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  useEffect(() => {
    if (selectedGroup) {
      const token = localStorage.getItem("token");
      axios
        .get(`http://localhost:3001/api/groups/${selectedGroup}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setGroupUsers(res.data))
        .catch((err) => console.error("Failed to load group users:", err));
    }
  }, [selectedGroup]);

  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      name: formData.name,
      frequency: `Every ${formData.repeatInterval} ${formData.repeatUnit}`,
      dueDate: new Date(),
      notes: formData.notes.trim() || null,
      status: "incomplete",
    };

    if (selectedGroup) {
      payload.groupId = selectedGroup;
    }
    if (formData.assignedTo) {
      payload.assignedTo = formData.assignedTo;
    }

    try {
      await axios.put(`http://localhost:3001/api/tasks/${task.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onTaskUpdated();
    } catch (err) {
      console.error(err);
      alert("Failed to update task.");
    }
  };

  return (
   <>
      <div className="card-header">Edit Task</div>
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

          <textarea
            className="form-control mb-2"
            name="notes"
            placeholder="Additional notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
          />

          <div className="mb-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              {showAdvancedOptions ? "Hide Group & Assign ▲" : "Select Group & Assign ▼"}
            </button>
          </div>

          {showAdvancedOptions && (
            <>
              <GroupSelector onSelect={handleGroupChange} />
              <select
                className="form-select mt-2"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
              >
                <option value="">Assign to (optional)...</option>
                {groupUsers.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </>
          )}

          <button className="btn-outline-success me-2 mt-3" type="submit">
            Save Changes 
          </button>
        </form>
      </div>
      </>
  );
}

export default EditTaskForm;
