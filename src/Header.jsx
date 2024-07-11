import React, { useEffect, useState } from 'react';
import { FaBell, FaCalendarAlt } from 'react-icons/fa';
import logo from './logo.jpeg'; // Replace with the path to your logo

const Header = () => {
  const [userName, setUserName] = useState('');
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('first_name') || 'User';
    setUserName(name);

    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const day = today.toLocaleDateString(undefined, options);
    setCurrentDay(day);
  }, []);

  return (
    <header className="bg-gray-200 text-black p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <img src={logo} alt="Company Logo" className="h-12 mr-4 rounded-full" />
        <div>
          <h1 className="text-lg font-bold">Your World's Perspective in Balance</h1>
        </div>
      </div>
      <div className="flex items-center ml-auto">
        <FaCalendarAlt className="text-2xl mr-4 cursor-pointer text-red-700 hover:text-red-500" />
        <FaBell className="text-2xl mr-4 cursor-pointer text-red-700 hover:text-red-500" />
        <div className="text-right">
          <h2 className="text-base">Welcome, {userName}</h2>
          <p className="text-xs">{currentDay}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
