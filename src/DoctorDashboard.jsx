import React, { useState } from 'react';
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
      <div className="flex-grow p-8 max-w-6xl mx-auto relative">
        <div className="bg-white rounded-lg shadow-lg overflow-y-auto" style={{ maxHeight: '70vh', minHeight: '50vh' }}>
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
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
