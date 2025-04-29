import React, { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [taskMap, setTaskMap] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(
    localStorage.getItem("selectedGroupId") || ""
  );

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      localStorage.setItem("selectedGroupId", selectedGroup);
      fetchTasks(selectedGroup);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://localhost:3001/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data);

      if (!selectedGroup && res.data.length > 0) {
        setSelectedGroup(res.data[0].id.toString());
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  const fetchTasks = async (groupId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `http://localhost:3001/api/calendar/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
      const key = dueDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });

    setTaskMap(map);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div key={`empty-${i}`} className="calendar-cell empty"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(year, month, day);
      const key = thisDate.toISOString().split("T")[0];
      const dayTasks = taskMap[key] || [];

      let cellClass = "calendar-cell";
      let tooltip = "";

      if (dayTasks.length > 0) {
        const overdue = dayTasks.some(
          (task) =>
            new Date(task.dueDate) < new Date() && task.status !== "complete"
        );
        const complete = dayTasks.every((task) => task.status === "complete");

        if (complete) {
          cellClass += " complete";
        } else if (overdue) {
          cellClass += " overdue";
        }

        tooltip = dayTasks
          .map((task) => `${task.name} (${task.assignedTo}) - ${task.status}`)
          .join("\n");
      }

      cells.push(
        <div key={day} className={`${cellClass} calendar-tooltip-container`}>
          <div className="date-number">{day}</div>
          {dayTasks.length > 0 && <div className="dot"></div>}
          {dayTasks.length > 0 && (
            <div className="calendar-tooltip">
              {dayTasks.map((task, idx) => (
                <div key={idx}>
                  <strong>{task.name}</strong> {task.assignedTo}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return cells;
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Calendar - {monthLabel}</h2>
        <select
          className="form-select w-auto"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="calendar-header d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => changeMonth(-1)}
        >
          Previous
        </button>
        <h3 className="m-0">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          className="btn btn-outline-primary"
          onClick={() => changeMonth(1)}
        >
          Next
        </button>
      </div>
      <div className="calendar-header">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">{renderCalendar()}</div>
    </div>
  );
}

export default CalendarPage;
