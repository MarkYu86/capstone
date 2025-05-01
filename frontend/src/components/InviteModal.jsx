import React, { useState } from "react";
import axios from "axios";
import "../index.css"

function InviteModal({ group, show, onClose, onSuccess }) {
  const [email, setEmail] = useState("");

  const handleInvite = async () => {
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
      setEmail("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Invite failed:", err);
      alert(err.response?.data?.message || "Failed to invite user.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "#00000055" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Invite to {group.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="email"
              className="form-control"
              placeholder="Enter user's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-success" onClick={handleInvite}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InviteModal;
