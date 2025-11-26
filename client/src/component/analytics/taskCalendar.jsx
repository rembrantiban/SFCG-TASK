import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const TaskCalendar = ({ tasks }) => {
  const events = useMemo(() => {
    return tasks.map((t) => ({
      id: t._id,
      title: t.requestId?.taskType || "Task",
      date: t.updatedAt,      
      backgroundColor: "#2563eb",
      borderColor: "#1e3a8a",
      textColor: "#fff"
    }));
  }, [tasks]);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-300 dark:border-gray-700 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Task Calendar Overview
      </h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"

        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}

        height="650px"
        events={events}

        eventClick={(info) => {
          alert(`Task: ${info.event.title}`);
        }}

        dayMaxEvents={3} 
        editable={false}
        selectable={false}
      />
    </div>
  );
};

export default TaskCalendar;
