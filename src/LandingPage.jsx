import React, { useState, useEffect } from 'react';
import "./landing.jpeg"; 
import logo from "./logo.jpeg"; 

const messages = [
  "Regain Hope",
  "Find Peace",
  "Embrace Serenity",
  "Achieve Balance",
  "Live Mindfully"
];

const LandingPage = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-cover bg-center min-h-screen flex flex-col justify-center items-center"
      style={{ backgroundImage: `url('./landing.jpeg')` }}>
      <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center">
        <div className="flex items-center justify-center mb-4">
          <img src={logo} alt="Insight Wellbeing Logo" className="w-16 h-16 mr-4 rounded-full"/>
          <h1 className="text-6xl font-extrabold text-white">INSIGHT WELLBEING</h1>
        </div>
        <p className="text-2xl text-white mb-8">Your World's Perspective in Balance</p>
        <div className="bg-white bg-opacity-20 p-4 rounded-lg mb-8">
          <p className="text-4xl font-bold text-white">{messages[currentMessageIndex]}</p>
        </div>
        <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
