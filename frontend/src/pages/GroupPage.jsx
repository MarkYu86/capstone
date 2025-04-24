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
          <li key={g.id} className="list-group-item">
            {g.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupPage;
