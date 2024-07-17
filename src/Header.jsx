import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import logo from './logo.jpeg'; // Replace with the path to your logo
import Chat from './Chat'; // Adjust the path as necessary
import CalendarComponent from './CalendarComponent'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const Header = () => {
  const [userName, setUserName] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use navigate from react-router-dom

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserId(parsedData.userId);
      setUserName(parsedData.firstName);
    }
  }, []);

  const handleCalendarClick = () => {
    setIsCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
  };

  const handleChatClick = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === 'calendar-modal' || e.target.id === 'chat-modal') {
      if (isCalendarOpen) handleCloseCalendar();
      if (isChatOpen) handleCloseChat();
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://insight-backend-8sg2.onrender.com/users/logout', {
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
        navigate('/login'); // Redirect to login page after successful logout
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
    <header className="bg-black text-white p-4 md:p-6 flex flex-col md:flex-row justify-between items-center shadow-md relative">
      <div className="flex items-center mb-4 md:mb-0">
        <img src={logo} alt="Company Logo" className="h-12 w-12 mr-4 rounded-full shadow-lg" />
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-wide text-red-500">Your Balanced Perspective</h1>
          <p className="text-sm text-gray-300">Bringing harmony to your world</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center md:ml-auto space-y-4 md:space-y-0 md:space-x-4">
        <div className="text-center">
          <FaCalendarAlt className="text-2xl cursor-pointer text-red-500 hover:text-red-300" onClick={handleCalendarClick} />
          <p className="text-xs text-gray-300">Calendar</p>
        </div>
        <div className="text-center">
          <FaEnvelope className="text-2xl cursor-pointer text-red-500 hover:text-red-300" onClick={handleChatClick} />
          <p className="text-xs text-gray-300">Messages</p>
        </div>
        <div className="text-center">
          <FaSignOutAlt className="text-2xl cursor-pointer text-red-500 hover:text-red-300" onClick={handleLogout} />
          {loading && (
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          )}
          <p className="text-xs text-gray-300">Logout</p>
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
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-8 w-8 flex justify-center items-center hover:bg-red-600 transition duration-200"
            >
              &times;
            </button>
            <CalendarComponent />
          </div>
        </div>
      )}

      {/* Chat Modal */}
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

export default Header;
