import React, { useState, useEffect } from "react";
import axios from "axios";
import InviteModal from "../components/InviteModal";

function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState({});

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const res = await axios.get("http://localhost:3001/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(res.data);
    } catch (err) {
      console.error("Error fetching user groups:", err);
    }
  };

  const handleCreate = async () => {
    if (!groupName.trim()) return;
  
    try {
      const token = localStorage.getItem("token"); // ✅ Add this
      await axios.post(
        "http://localhost:3001/api/groups",
        { name: groupName },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send the token
          },
        }
      );
      setGroupName("");
      fetchGroups(); // Refresh list
    } catch (err) {
      console.error("Group creation failed", err); // Log error
      alert("Failed to create group.");
    }
  };

  const handleInvite = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  const handleDelete = async (groupId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this group?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3001/api/groups/${groupId}`);
      fetchGroups(); // refresh list
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete group.");
    }
  };

  const toggleMembers = async (groupId) => {
    if (expandedGroupId === groupId) {
      setExpandedGroupId(null); // collapse if already open
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3001/api/groups/${groupId}/members`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGroupMembers((prev) => ({ ...prev, [groupId]: res.data }));
      setExpandedGroupId(groupId);
    } catch (err) {
      console.error("Error fetching group members:", err);
      alert("Failed to load members.");
    }
  };

  return (
    <>
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
              <div className="d-flex justify-content-between align-items-center">
                <span>{g.name}</span>
                <div>
                  <button
                    className="btn btn-outline-info btn-sm me-2"
                    onClick={() => toggleMembers(g.id)}
                  >
                    {expandedGroupId === g.id ? "▲" : "▼"}

                  </button>
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
              </div>

              {expandedGroupId === g.id && groupMembers[g.id] && (
                <ul className="list-group mt-2">
                  {groupMembers[g.id].length === 0 ? (
                    <li className="list-group-item">No members yet.</li>
                  ) : (
                    groupMembers[g.id].map((member) => (
                      <li key={member.id} className="list-group-item">
                        {member.name ? member.name : member.email}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <InviteModal
        group={selectedGroup}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchGroups()}
      />
    </>
  );
}

export default GroupPage;
