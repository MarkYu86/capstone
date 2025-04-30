import React, { useState } from "react";
import axios from "axios";
import GroupSelector from "./GroupSelector";

function CreateTaskForm({ onTaskCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    repeatInterval: 1,
    repeatUnit: "days",
    notes: "",
    assignedTo: "",
  });

  const [groupUsers, setGroupUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions((prev) => !prev);
  };

  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId);

    if (!groupId) {
      setGroupUsers([]);
      return;
    }

    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3001/api/groups/${groupId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
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
  
    const payload = {
      name: formData.name,
      frequency: `Every ${formData.repeatInterval} ${formData.repeatUnit}`,
      dueDate: new Date(),
      notes: formData.notes.trim() || null,
      status: "incomplete",
      groupId: selectedGroup || null, // ✅ allow null group
      assignedTo: formData.assignedTo || "",
    };
  
    try {
      console.log("Submitting task:", payload);
      await axios.post("http://localhost:3001/api/tasks", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      onTaskCreated();
    } catch (err) {
      console.error(err);
      alert("Failed to create task.");
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
              onClick={toggleAdvancedOptions}
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

          <button className="btn btn-success me-2 mt-3" type="submit">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskForm;
