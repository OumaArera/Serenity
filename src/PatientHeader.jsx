import React, { useEffect, useState } from 'react';
import { FaBell, FaCalendarAlt, FaEnvelope } from 'react-icons/fa';
import logo from './logo.jpeg'; 
import CalendarComponent from './CalendarComponent'; // Adjust the path as necessary
import Chat from './Chat'; // Adjust the path as necessary

const PatientHeader = () => {
  const [userName, setUserName] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('first_name') || 'User';
    setUserName(name);

    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const day = today.toLocaleDateString(undefined, options);
    setCurrentDay(day);
  }, []);

  const handleCalendarClick = () => {
    setIsCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === 'calendar-modal' || e.target.id === 'chat-modal') {
      if (isCalendarOpen) handleCloseCalendar();
      if (isChatOpen) handleCloseChat();
    }
  };

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <header className="bg-black text-white p-6 flex justify-between items-center shadow-md relative">
      <div className="flex items-center">
        <img src={logo} alt="Company Logo" className="h-12 w-12 mr-4 rounded-full shadow-lg" />
        <div>
          <h1 className="text-xl font-bold tracking-wide text-red-500">Your Balanced Perspective</h1>
          <p className="text-sm text-gray-300">Bringing harmony to your world</p>
        </div>
      </div>
      <div className="flex items-center ml-auto space-x-4">
        <div className="text-center" onClick={handleCalendarClick}>
          <FaCalendarAlt className="text-2xl cursor-pointer text-red-500 hover:text-red-300" />
          <p className="text-xs text-gray-300">Calendar</p>
        </div>
        <div className="text-center">
          <FaBell className="text-2xl cursor-pointer text-red-500 hover:text-red-300" />
          <p className="text-xs text-gray-300">Notifications</p>
        </div>
        <div className="text-center" onClick={handleChatClick}>
          <FaEnvelope className="text-2xl cursor-pointer text-red-500 hover:text-red-300" />
          <p className="text-xs text-gray-300">Messages</p>
        </div>
        <div className="text-right">
          <h2 className="text-base">Welcome, {userName}</h2>
          <p className="text-xs text-gray-400">{currentDay}</p>
        </div>
      </div>

      {isCalendarOpen && (
        <div
          id="calendar-modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              onClick={handleCloseCalendar}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-8 w-8 flex justify-center items-center hover:bg-red-600 transition duration-200"
            >
              &times;
            </button>
            <CalendarComponent />
          </div>
        </div>
      )}

      {isChatOpen && (
        <div
          id="chat-modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-h-3/4 w-3/4">
            <button
              onClick={handleCloseChat}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-8 w-8 flex justify-center items-center hover:bg-red-600 transition duration-200"
            >
              &times;
            </button>
            <Chat userId={userName} />
          </div>
        </div>
      )}
    </header>
  );
};

export default PatientHeader;
