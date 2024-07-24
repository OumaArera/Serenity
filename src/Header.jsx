import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import logo from './logo.jpeg'; // Replace with the path to your logo
import CalendarComponent from './CalendarComponent'; // Adjust the path as necessary

const Header = () => {
  const [userName, setUserName] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);

    const parsedData = JSON.parse(userData);
    if (parsedData) {
      setUserName(parsedData.firstName);
    }

    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDay(today.toLocaleDateString(undefined, options));
  }, []);

  const handleCalendarClick = () => {
    setIsCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === 'calendar-modal') {
      if (isCalendarOpen) handleCloseCalendar();
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://insight-backend-g7dg.onrender.com/users/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        window.location.reload();
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-gray-900 text-white p-4 md:p-6 flex flex-col md:flex-row justify-between items-center shadow-md relative">
      <div className="flex items-center mb-4 md:mb-0">
        <img src={logo} alt="Company Logo" className="h-12 w-12 mr-4 rounded-full shadow-lg" />
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-wide text-blue-800">Your Balanced Perspective</h1>
          <p className="text-sm text-white">Bringing harmony to your world</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center md:ml-auto space-y-4 md:space-y-0 md:space-x-4">
        <div className="text-center">
          <FaCalendarAlt className="text-2xl cursor-pointer text-blue-800 hover:text-blue-600" onClick={handleCalendarClick} />
          <p className="text-xs text-white hidden md:block">Calendar</p>
        </div>
        <div className="text-center">
          <FaEnvelope className="text-2xl text-blue-800 hover:text-blue-600" />
          <p className="text-xs text-white hidden md:block">Messages</p>
        </div>
        <div className="text-center">
          <FaSignOutAlt className="text-2xl cursor-pointer text-blue-800 hover:text-blue-600" onClick={handleLogout} />
          <p className="text-xs text-white hidden md:block">Logout</p>
        </div>
      </div>

      {/* CalendarComponent Modal */}
      {isCalendarOpen && (
        <div
          id="calendar-modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              onClick={handleCloseCalendar}
              className="absolute top-2 right-2 bg-blue-700 text-white rounded-full h-8 w-8 flex justify-center items-center hover:bg-blue-600 transition duration-200"
            >
              &times;
            </button>
            <CalendarComponent />
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-700"></div>
        </div>
      )}
    </header>
  );
};

export default Header;
