import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to view the dashboard.");
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:3001/api/protected/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  return (
    <>
      <div className="container mt-5">
        <h1>Dashboard</h1>
        {user ? (
          <p>
            Welcome back, <strong>{user.name || user.email}</strong>!
          </p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default DashboardPage;
