import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    setIsLoggedIn(!!token);

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserName(parsedUser.name || parsedUser.email);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    alert("Logged out!");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm w-100" style={{ width: "100%" }}>
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="navbar-brand mb-0 h1">Flatties</div>

        {isLoggedIn ? (
          <div className="d-flex align-items-center">
            <span className="me-3">
              Welcome, <strong>{userName}</strong> 👋
            </span>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <ul className="navbar-nav ms-auto d-flex flex-row">
            <li className="nav-item me-3">
              <Link className="nav-link" to="/">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
