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
    <nav className="navbar navbar-expand-lg bg-body-tertiary bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Cleaning App</Link>
  
        <div className="collapse navbar-collapse show" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {isLoggedIn ? (
              <>
                <li className="nav-item me-3">
                  <span className="navbar-text">
                    Welcome, <strong>{userName}</strong> 👋
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
