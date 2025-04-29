import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GroupPage from "./pages/GroupPage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column" style={{ minHeight: "100vh", width: "100vw" }}>
        <Navbar />
        <div className="d-flex flex-grow-1" style={{ flex: 1 }}>
          <Sidebar />
          <div className="main-content flex-grow-1 p-3">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/calendar" element={<CalendarPage/>}/>
              <Route path="/groups" element={<GroupPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}


export default App;
