import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-black p-4 text-center shadow-md">
      <nav className="mb-2">
        <a href="#" className="text-red-700 mx-2 hover:text-red-500">Home</a>
        <a href="#" className="text-red-700 mx-2 hover:text-red-500">About</a>
        <a href="#" className="text-red-700 mx-2 hover:text-red-500">Contact</a>
      </nav>
      <p className="text-red-700">&copy; 2024 Insight Wellbeing P/L. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
