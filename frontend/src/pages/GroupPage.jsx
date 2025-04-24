import React, { useState, useEffect } from "react";
import axios from "axios";

function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const res = await axios.get("http://localhost:3001/api/groups");
    setGroups(res.data);
  };

  const handleCreate = async () => {
    if (!groupName.trim()) return;

    try {
      await axios.post("http://localhost:3001/api/groups", { name: groupName });
      setGroupName("");
      fetchGroups();
    } catch (err) {
      console.error("Group creation failed", err);
      alert("Failed to create group.");
    }
  };
  
  const handleInvite = async (group) => {
    const email = window.prompt(`Invite user to ${group.name}\nEnter user email:`);
  
    if (!email) return;
  
    try {
      const token = localStorage.getItem("token");
  
      const res = await axios.post(
        `http://localhost:3001/api/groups/${group.id}/invite`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert(res.data.message);
    } catch (err) {
      console.error("Invite failed:", err);
      alert(err.response?.data?.message || "Failed to invite user.");
    }
  };
  
  
  
  const handleDelete = async (groupId) => {
    const confirm = window.confirm("Are you sure you want to delete this group?");
    if (!confirm) return;
  
    try {
      await axios.delete(`http://localhost:3001/api/groups/${groupId}`);
      fetchGroups(); // refresh list
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete group.");
    }
  };
  

  return (
    <div className="container mt-4">
      <h2>Groups</h2>

      <div className="input-group mb-3" style={{ maxWidth: "400px" }}>
        <input
          className="form-control"
          placeholder="New group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleCreate}>
          Create Group
        </button>
      </div>

      <ul className="list-group">
  {groups.map((g) => (
    <li key={g.id} className="list-group-item d-flex justify-content-between align-items-center">
      <span>{g.name}</span>
      <div>
        <button
          className="btn btn-outline-primary btn-sm me-2"
          onClick={() => handleInvite(g)}
        >
          Invite
        </button>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => handleDelete(g.id)}
        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}

export default GroupPage;
