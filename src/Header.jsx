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
    <header className="bg-black text-white p-6 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <img src={logo} alt="Company Logo" className="h-12 w-12 mr-4 rounded-full shadow-lg" />
        <div>
          <h1 className="text-xl font-bold tracking-wide text-red-500">Your Balanced Perspective</h1>
          <p className="text-sm text-gray-300">Bringing harmony to your world</p>
        </div>
      </div>
      <div className="flex items-center ml-auto space-x-4">
        <FaCalendarAlt className="text-2xl cursor-pointer text-red-500 hover:text-red-300" />
        <FaBell className="text-2xl cursor-pointer text-red-500 hover:text-red-300" />
        <div className="text-right">
          <h2 className="text-base">Welcome, {userName}</h2>
          <p className="text-xs text-gray-400">{currentDay}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
