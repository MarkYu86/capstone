import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Sidebar.css"

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="custom-sidebar d-flex flex-column flex-shrink-0 p-3"
      style={{
        width: "220px",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <h4 className="text-center">Menu</h4>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link
            to="/dashboard"
            className={`nav-link ${
              isActive("/dashboard") ? "active" : "text-dark"
            }`}
          >
            Tasks
          </Link>
        </li>
        <li>
          <Link
            to="/calendar"
            className={`nav-link ${
              isActive("/calendar") ? "active" : "text-dark"
            }`}
          >
            Calendar
          </Link>
        </li>
        <li>
          <Link
            to="/groups"
            className={`nav-link ${
              isActive("/groups") ? "active" : "text-dark"
            }`}
          >
            Manage Groups
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
