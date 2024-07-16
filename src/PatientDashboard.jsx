import React, { useState } from 'react';
import PatientHeader from './PatientHeader';
import Footer from './Footer';
import { Pie } from 'react-chartjs-2';
import Activities from './Activities';
import HistoryComponent from './HistoryComponent';
import Progress from './Progress'; // Import the Progress component
import Booking from './Booking'; // Import the Booking component

// Wellness and Therapy images removed for responsiveness

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState(null);

  const handleToggle = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const data = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [60, 30, 10],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white via-red-500 to-black">
      <PatientHeader />
      <div className="flex-grow relative flex">
        {/* Left side content (removed images and text for responsiveness) */}
        <div className="flex-shrink-0 w-1/6 max-w-xs p-4">
          {/* Placeholder for left content */}
          <div className="max-w-full h-64 bg-gray-200 rounded-lg shadow-lg">
            {/* Placeholder for left image */}
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 mt-4 text-black">
            {/* Placeholder for left text */}
          </div>
        </div>
        
        {/* Middle scrolling card */}
        <div className="flex-grow p-8 max-w-6xl mx-auto relative">
          <div
            className="bg-white rounded-lg shadow-lg overflow-y-auto"
            style={{ maxHeight: '70vh', minHeight: '50vh' }}
          >
            <div className="p-8">
              {/* Content specific to the scrolling card */}
              <h2 className="text-3xl font-bold mb-4 text-gray-700">Welcome to Your Dashboard</h2>
              <div className="flex justify-between mb-4">
                {/* Buttons for different sections */}
                <button onClick={() => handleToggle('activities')} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg">
                  Activities
                </button>
                <button onClick={() => handleToggle('progress')} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg">
                  Progress
                </button>
                <button onClick={() => handleToggle('history')} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg">
                  History
                </button>
                <button onClick={() => handleToggle('booking')} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg">
                  Book
                </button>
              </div>
              {/* Conditional rendering based on active section */}
              {activeSection === 'activities' && <Activities />}
              {activeSection === 'progress' && <Progress userId="dummyUserId" />} {/* Render the Progress component */}
              {activeSection === 'history' && <HistoryComponent />}
              {activeSection === 'booking' && <Booking />} {/* Render the Booking component */}
            </div>
          </div>
        </div>
        
        {/* Right side content (removed images and text for responsiveness) */}
        <div className="flex-shrink-0 w-1/6 max-w-xs p-4">
          {/* Placeholder for right content */}
          <div className="max-w-full h-64 bg-gray-200 rounded-lg shadow-lg">
            {/* Placeholder for right image */}
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 mt-4 text-black">
            {/* Placeholder for right text */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientDashboard;
