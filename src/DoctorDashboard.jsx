import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CreateSessions from './CreateSessions';
import CreateTasks from './CreateTasks';

// Example paths to wellness and therapy images
import therapy1 from "./images/therapy.jpeg";
import therapy2 from "./images/therapy1.jpeg";
import therapy3 from "./images/therapy2.jpeg";
import therapy4 from "./images/therapy3.jpeg";
import therapy5 from "./images/therapy4.jpeg";
import therapy6 from "./images/therapy5.jpeg";
import therapy7 from "./images/therapy6.jpeg";
import therapy8 from "./images/therapy7.jpeg";
import therapy9 from "./images/therapy8.jpeg";
import therapy10 from "./images/therapy9.jpeg";
import therapy11 from "./images/therapy10.jpeg";
import therapy12 from "./images/therapy11.jpeg";
import therapy13 from "./images/therapy12.jpeg";
import therapy14 from "./images/therapy13.jpeg";
import therapy15 from "./images/therapy14.jpeg";
import therapy16 from "./images/therapy15.jpeg";
import therapy17 from "./images/therapy16.jpeg";
import therapy18 from "./images/therapy17.jpeg";
import therapy19 from "./images/therapy18.jpeg";
import therapy20 from "./images/therapy19.jpeg";
import therapy21 from "./images/therapy20.jpeg";

// Wellness
import wellness from "./images/therapy21.jpeg";
import wellness1 from "./images/therapy22.jpeg";
import wellness2 from "./images/therapy23.jpeg";
import wellness4 from "./images/therapy24.jpeg";
import wellness5 from "./images/therapy25.jpeg";
import wellness6 from "./images/therapy26.jpeg";
import wellness7 from "./images/therapy27.jpeg";
import wellness8 from "./images/therapy28.jpeg";
import wellness9 from "./images/therapy29.jpeg";
import wellness10 from "./images/therapy30.jpeg";
import wellness11 from "./images/therapy31.jpeg";
import wellness12 from "./images/therapy32.jpeg";
import wellness13 from "./images/therapy33.jpeg";
import wellness14 from "./images/therapy34.jpeg";
import wellness15 from "./images/therapy35.jpeg";
import wellness16 from "./images/therapy36.jpeg";
import wellness17 from "./images/therapy37.jpeg";
import wellness18 from "./images/therapy38.jpeg";
import wellness19 from "./images/therapy39.jpeg";
import wellness20 from "./images/therapy40.jpeg";
import wellness21 from "./images/therapy41.jpeg";

const DoctorDashboard = () => {
  // Define arrays of images and messages with their corresponding colors
  const wellnessImages = [wellness1, wellness2, wellness4, wellness5, wellness6, wellness, wellness7, wellness8, wellness9, wellness10, wellness11, wellness12, wellness13, wellness14, wellness15, wellness16, wellness17, wellness18, wellness19, wellness20, wellness21];
  const therapyImages = [therapy1, therapy2, therapy3, therapy4, therapy5, therapy6, therapy7, therapy8, therapy9, therapy10, therapy11, therapy12, therapy13, therapy14, therapy15, therapy16, therapy17, therapy18, therapy19, therapy20, therapy21];
  
  const wellnessMessages = [
    { text: "You are stronger than you think. Embrace each step of your journey.", color: "text-red-500" },
    { text: "Believe in yourself. You are worth it.", color: "text-black" },
    { text: "Take one day at a time. Healing is a journey, not a race.", color: "text-red-700" },
    { text: "Stay positive, work hard, make it happen.", color: "text-black" },
    { text: "Your only limit is your mind.", color: "text-red-600" },
    { text: "Small steps every day.", color: "text-black" },
    { text: "Keep going, you're getting there.", color: "text-red-800" },
    { text: "Progress is progress, no matter how small.", color: "text-black" },
    { text: "You are doing great things.", color: "text-red-900" },
    { text: "Focus on the journey, not the destination.", color: "text-black" },
  ];

  const therapyMessages = [
    { text: "You have the strength within you to overcome any challenge.", color: "text-red-500" },
    { text: "Your mental health matters. Don't hesitate to reach out for help.", color: "text-black" },
    { text: "Practice self-care daily. It's essential for your well-being.", color: "text-red-700" },
    { text: "It's okay to not be okay. Seek support.", color: "text-black" },
    { text: "Mental health is just as important as physical health.", color: "text-red-600" },
    { text: "You are not alone in this.", color: "text-black" },
    { text: "Healing takes time. Be patient with yourself.", color: "text-red-800" },
    { text: "You deserve to feel better.", color: "text-black" },
    { text: "It's okay to ask for help.", color: "text-red-900" },
    { text: "Take care of your mind, body, and soul.", color: "text-black" },
  ];

  // State to hold randomly selected image and message indices
  const [wellnessIndex, setWellnessIndex] = useState(0);
  const [therapyIndex, setTherapyIndex] = useState(0);
  const [wellnessMessageIndex, setWellnessMessageIndex] = useState(0);
  const [therapyMessageIndex, setTherapyMessageIndex] = useState(0);
  const [showCreateSessions, setShowCreateSessions] = useState(false); // State to manage CreateSessions visibility
  const [showCreateTasks, setShowCreateTasks] = useState(false); // State to manage CreateTasks visibility

  // Function to handle random selection of images and messages
  const randomizeContent = () => {
    const randomWellnessIndex = Math.floor(Math.random() * wellnessImages.length);
    const randomTherapyIndex = Math.floor(Math.random() * therapyImages.length);
    const randomWellnessMessageIndex = Math.floor(Math.random() * wellnessMessages.length);
    const randomTherapyMessageIndex = Math.floor(Math.random() * therapyMessages.length);
    
    setWellnessIndex(randomWellnessIndex);
    setTherapyIndex(randomTherapyIndex);
    setWellnessMessageIndex(randomWellnessMessageIndex);
    setTherapyMessageIndex(randomTherapyMessageIndex);
  };

  // Initial random selection on component mount and update every 25 seconds
  useEffect(() => {
    randomizeContent();
    const intervalId = setInterval(randomizeContent, 25000);
    return () => clearInterval(intervalId);
  }, []);

  // Function to handle opening Sessions component
  const handleOpenSessions = () => {
    setShowCreateSessions(true);
    setShowCreateTasks(false);
  };

  // Function to handle opening Tasks component
  const handleOpenTasks = () => {
    setShowCreateTasks(true);
    setShowCreateSessions(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white via-red-500 to-black">
      <Header />
      <div className="flex-grow relative flex">
        {/* Left side image */}
        <div className="flex-shrink-0 w-1/6 max-w-xs p-4">
          <div className="max-w-full">
            <img src={wellnessImages[wellnessIndex]} alt="Wellness" className="w-full h-auto rounded-lg shadow-lg" style={{ width: '100%', height: 'auto' }} />
            <div className={`bg-white rounded-lg shadow-lg p-4 mt-4 ${wellnessMessages[wellnessMessageIndex].color}`}>
              <p className="text-lg text-center font-bold">{wellnessMessages[wellnessMessageIndex].text}</p>
            </div>
          </div>
        </div>
        
        {/* Middle scrolling card */}
        <div className="flex-grow p-8 max-w-6xl mx-auto relative">
          <div
            className="bg-white rounded-lg shadow-lg overflow-y-auto"
            style={{ maxHeight: '70vh', minHeight: '50vh' }}
          >
            {showCreateSessions && <CreateSessions />}
            {showCreateTasks && <CreateTasks />}
            <div className="p-8">
              <button
                onClick={handleOpenSessions}
                className={`bg-red-500 text-white px-4 py-2 rounded-md mr-4 ${showCreateSessions ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={showCreateSessions}
              >
                Sessions
              </button>
              <button
                onClick={handleOpenTasks}
                className={`bg-red-500 text-white px-4 py-2 rounded-md ${showCreateTasks ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={showCreateTasks}
              >
                Tasks
              </button>
            </div>
          </div>
        </div>
        
        {/* Right side image */}
        <div className="flex-shrink-0 w-1/6 max-w-xs p-4">
          <div className="max-w-full">
            <img src={therapyImages[therapyIndex]} alt="Therapy" className="w-full h-auto rounded-lg shadow-lg" style={{ width: '100%', height: 'auto' }} />
            <div className={`bg-white rounded-lg shadow-lg p-4 mt-4 ${therapyMessages[therapyMessageIndex].color}`}>
              <p className="text-lg text-center font-bold">{therapyMessages[therapyMessageIndex].text}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
