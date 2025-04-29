import React, { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [taskMap, setTaskMap] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    let groupId = localStorage.getItem("selectedGroupId");
  
    if (!groupId) {
      console.warn("No group selected, using fallback groupId = 11"); // or 9 or whatever your test group is
      groupId = 11;  // <-- put your real groupId here temporarily
    }
  
    try {
      const res = await axios.get(`http://localhost:3001/api/calendar/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      organizeTasks(res.data);
    } catch (err) {
      console.error("Error fetching calendar tasks:", err);
    }
  };

  const organizeTasks = (taskList) => {
    const map = {};

    taskList.forEach((task) => {
      const dueDate = new Date(task.dueDate);
      const key = dueDate.toISOString().split("T")[0]; // YYYY-MM-DD
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });

    setTaskMap(map);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 (Sunday) - 6
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(year, month, day);
      const key = thisDate.toISOString().split("T")[0];
      const todayTasks = taskMap[key] || [];

      let cellClass = "calendar-cell";
      let dotColor = "gray"; // default
      let tooltipContent = "";

      if (todayTasks.length > 0) {
        const overdue = todayTasks.some((task) => new Date(task.dueDate) < today && task.status !== "complete");
        const completed = todayTasks.every((task) => task.status === "complete");

        if (completed) {
          dotColor = "green";
        } else if (overdue) {
          dotColor = "red";
        } else {
          dotColor = "gray";
        }

        tooltipContent = todayTasks.map((task) => `${task.name} (${task.assignedTo}) - ${task.status}`).join("\n");
      }

      cells.push(
        <div key={day} className={cellClass} title={tooltipContent}>
          <div className="date-number">{day}</div>
          {todayTasks.length > 0 && <div className="dot" style={{ backgroundColor: dotColor }}></div>}
        </div>
      );
    }

    return cells;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-primary" onClick={() => changeMonth(-1)}>◀ Prev</button>
        <h2 className="mb-0">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button className="btn btn-outline-primary" onClick={() => changeMonth(1)}>Next ▶</button>
      </div>

      <div className="calendar-grid">{renderCalendar()}</div>
    </div>
  );
}

export default CalendarPage;
