import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import logo from './logo.jpeg'; 
import CalendarComponent from './CalendarComponent'; 
import Chat from './Chat';
import { useNavigate } from 'react-router-dom';

const LOGOUT_URL = 'https://insight-backend-8sg2.onrender.com/users/logout';

const PatientHeader = () => {
  const [userName, setUserName] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserName(parsedData.firstName);
      setUserId(parsedData.id);
    }

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setToken(JSON.parse(accessToken));
    }

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

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch(LOGOUT_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        navigate('/login'); // Navigate to /login on successful logout
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-black text-white p-4 md:p-6 flex flex-col md:flex-row justify-between items-center shadow-md relative">
      <div className="flex items-center mb-4 md:mb-0">
        <img src={logo} alt="Company Logo" className="h-12 w-12 mr-2 md:mr-4 rounded-full shadow-lg" />
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-wide text-red-500">Your Balanced Perspective</h1>
          <p className="text-xs md:text-sm text-gray-300">Bringing harmony to your world</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 md:ml-auto">
        <div className="text-center" onClick={handleChatClick}>
          <FaEnvelope className="text-2xl cursor-pointer text-red-500 hover:text-red-300" />
          <p className="text-xs text-gray-300 hidden md:block">Messages</p>
        </div>
        <div className="text-center">
          <FaCalendarAlt className="text-2xl cursor-pointer text-red-500 hover:text-red-300" onClick={handleCalendarClick} />
          <p className="text-xs text-gray-300 hidden md:block">Calendar</p>
        </div>
        <div className="relative">
          <FaSignOutAlt
            onClick={handleLogout}
            className="text-2xl cursor-pointer text-red-500 hover:text-red-300"
          />
          {loading && (
            <div className="absolute top-0 right-0 mt-1 mr-1">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
          )}
          <p className="text-xs text-gray-300">Logout</p>
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
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-h-3/4 w-full md:w-3/4">
            <button
              onClick={handleCloseChat}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-8 w-8 flex justify-center items-center hover:bg-red-600 transition duration-200"
            >
              &times;
            </button>
            <Chat userId={userName} />
          </div>
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-700"></div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default PatientHeader;
