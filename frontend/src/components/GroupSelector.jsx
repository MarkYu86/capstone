import React, { useEffect, useState } from "react";
import axios from "axios";

function GroupSelector({ onSelect }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3001/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setGroups(res.data))
      .catch((err) => {
        console.error("Error loading groups:", err);
      });
  }, []);

  const handleSelect = (e) => {
    const groupId = e.target.value;
    setSelectedGroupId(groupId);
    onSelect(groupId);
  };

  return (
    <div className="mb-3">
      <label className="form-label">Select Group</label>
      <select
        className="form-select"
        value={selectedGroupId}
        onChange={handleSelect}
      >
        <option value="">Choose a group</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GroupSelector;
