import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CreateSessions from './CreateSessions';
import CreateTasks from './CreateTasks';
import ProgressMonitoring from './ProgressMonitoring';

const DoctorDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null); // State to manage active component

  // Function to handle opening a component
  const handleOpenComponent = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white via-red-500 to-black">
      <Header />
      <div className="flex-grow relative flex">
        {/* Left side placeholder */}
        <div className="flex-shrink-0 w-1/6 max-w-xs p-4">
          <div className="max-w-full h-64 bg-gray-200 rounded-lg shadow-lg">
            {/* Placeholder for left image */}
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 mt-4 text-black">
            <p className="text-lg text-center font-bold">Wellness Message</p>
          </div>
        </div>
        
        {/* Middle scrolling card */}
        <div className="flex-grow p-8 max-w-6xl mx-auto relative">
          <div
            className="bg-white rounded-lg shadow-lg overflow-y-auto"
            style={{ maxHeight: '70vh', minHeight: '50vh' }}
          >
            <div className="p-8">
              <button
                onClick={() => handleOpenComponent('sessions')}
                className={`bg-red-500 text-white px-4 py-2 rounded-md mr-4 ${activeComponent === 'sessions' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeComponent === 'sessions'}
              >
                Sessions
              </button>
              <button
                onClick={() => handleOpenComponent('tasks')}
                className={`bg-red-500 text-white px-4 py-2 rounded-md mr-4 ${activeComponent === 'tasks' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeComponent === 'tasks'}
              >
                Tasks
              </button>
              <button
                onClick={() => handleOpenComponent('progress')}
                className={`bg-red-500 text-white px-4 py-2 rounded-md ${activeComponent === 'progress' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeComponent === 'progress'}
              >
                Progress
              </button>
            </div>
            <div>
              {activeComponent === 'sessions' && <CreateSessions />}
              {activeComponent === 'tasks' && <CreateTasks />}
              {activeComponent === 'progress' && <ProgressMonitoring />}
            </div>
          </div>
        </div>
        
        {/* Right side placeholder */}
        <div className="flex-shrink-0 w-1/6 max-w-xs p-4">
          <div className="max-w-full h-64 bg-gray-200 rounded-lg shadow-lg">
            {/* Placeholder for right image */}
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 mt-4 text-black">
            <p className="text-lg text-center font-bold">Therapy Message</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
