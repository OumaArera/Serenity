import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CreateSessions from './CreateSessions';
import CreateTasks from './CreateTasks';
import ProgressMonitoring from './ProgressMonitoring';
import ManageSession from './ManageSession';
import PatientsHistory from './PatientsHistory';

const DoctorDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null); // State to manage active component

  // Function to handle opening a component
  const handleOpenComponent = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-red-600 to-green-500">
      <Header />
      <div className="flex-grow p-4 md:p-8 max-w-6xl mx-auto relative">
        <div className="bg-white rounded-lg shadow-lg overflow-y-auto max-w-full" style={{ maxHeight: '70vh', minHeight: '50vh' }}>
          <div className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleOpenComponent('sessions')}
                className={`bg-gray-900 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto ${activeComponent === 'sessions' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeComponent === 'sessions'}
              >
                Sessions
              </button>
              <button
                onClick={() => handleOpenComponent('tasks')}
                className={`bg-gray-900 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto ${activeComponent === 'tasks' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeComponent === 'tasks'}
              >
                Tasks
              </button>
              <button
                onClick={() => handleOpenComponent('progress')}
                className={`bg-gray-900 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto ${activeComponent === 'progress' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeComponent === 'progress'}
              >
                Progress
              </button>
              <button
                onClick={() => handleOpenComponent('manageSessions')}
                className={`bg-gray-900 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto ${activeComponent === 'manageSessions' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeComponent === 'manageSessions'}
              >
                Manage Sessions
              </button>
              <button
                onClick={() => handleOpenComponent('patientsHistory')}
                className={`bg-gray-900 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto ${activeComponent === 'patientsHistory' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={activeComponent === 'patientsHistory'}
              >
                Patients History
              </button>
            </div>
            <div>
              {activeComponent === 'sessions' && <CreateSessions />}
              {activeComponent === 'tasks' && <CreateTasks />}
              {activeComponent === 'progress' && <ProgressMonitoring />}
              {activeComponent === 'manageSessions' && <ManageSession />}
              {activeComponent === 'patientsHistory' && <PatientsHistory />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
