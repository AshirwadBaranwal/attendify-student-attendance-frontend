import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiMail,
  FiPhone,
  FiEye,
} from "react-icons/fi";

// --- Dummy Data for the Prototype ---

const recentAbsences = [
  {
    name: "Anjali Sharma",
    course: "B.Sc. Physics",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Rohan Kumar",
    course: "B.Com Honours",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Priya Singh",
    course: "B.A. History",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Amit Verma",
    course: "B.Tech CSE",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    name: "Sneha Reddy",
    course: "B.Sc. Chemistry",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

const watchlistStudents = [
  {
    name: "Vikram Rathore",
    attendance: "68%",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Sameer Khan",
    attendance: "71%",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    name: "Nisha Gupta",
    attendance: "65%",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
];

const calendarDays = [
  { day: "Mon", date: 22, active: false },
  { day: "Tue", date: 23, active: false },
  { day: "Wed", date: 24, active: true },
  { day: "Thu", date: 25, active: false },
  { day: "Fri", date: 26, active: false },
];

// --- The Main Component ---

const Schedule = () => {
  return (
    <div className="w-full max-w-sm mx-auto p-4 space-y-8 rounded-lg">
      {/* Section 1: Schedule Calendar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Schedule Calendar</h2>
          <div className="flex items-center space-x-2 text-gray-500">
            <FiChevronLeft className="cursor-pointer" />
            <FiChevronRight className="cursor-pointer" />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          {calendarDays.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center w-14 h-20 rounded-lg cursor-pointer transition-all duration-200 ${
                item.active
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-700"
              }`}
            >
              <span className="text-sm">{item.day}</span>
              <span className="text-xl font-bold">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Recent Absences */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Recent Absences</h2>
          <button className="text-sm text-indigo-600 font-semibold bg-indigo-100 px-3 py-1 rounded-md">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentAbsences.map((student, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-white rounded-lg shadow-sm"
            >
              <img
                src={student.avatar}
                alt={student.name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex-grow">
                <p className="font-semibold text-gray-900">{student.name}</p>
                <p className="text-xs text-gray-500">Class: {student.course}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-gray-400 hover:text-indigo-600">
                  <FiMail size={20} />
                </button>
                <button className="text-gray-400 hover:text-indigo-600">
                  <FiPhone size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Low Attendance Watchlist */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Low Attendance Watchlist
          </h2>
          <button className="text-sm text-indigo-600 font-semibold bg-indigo-100 px-3 py-1 rounded-md">
            View All
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {watchlistStudents.map((student, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm text-center"
            >
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-full mb-3"
              />
              <p className="font-semibold text-sm text-gray-900">
                {student.name}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Attendance: {student.attendance}
              </p>
              <button className="w-full bg-indigo-100 text-indigo-700 text-xs font-bold py-2 rounded-md hover:bg-indigo-200 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
