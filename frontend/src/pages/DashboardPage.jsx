import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to view the dashboard.");
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:3001/api/protected/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser({
          name: res.data.name,
          email: res.data.email,
        });
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  return (
    <>
    <Sidebar/>
      <div className="container mt-5">
        <h1>Dashboard</h1>
        {user ? (
          <p>
            Welcome back, <strong>{user.name ? user.name : user.email}</strong>!
          </p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default DashboardPage;
