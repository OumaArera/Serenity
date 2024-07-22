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
      <div className="flex flex-col md:flex-row flex-grow">
        <div className="w-full md:w-1/4 bg-gray-800 text-white p-4 space-y-4 flex md:flex-col flex-col-reverse items-center md:items-start">
          <button
            onClick={() => handleOpenComponent('sessions')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeComponent === 'sessions' ? 'bg-blue-600 opacity-50 cursor-not-allowed' : 'bg-gray-900 hover:bg-blue-600'} md:w-auto`}
            disabled={activeComponent === 'sessions'}
          >
            Sessions
          </button>
          <button
            onClick={() => handleOpenComponent('tasks')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeComponent === 'tasks' ? 'bg-blue-600 opacity-50 cursor-not-allowed' : 'bg-gray-900 hover:bg-blue-600'} md:w-auto`}
            disabled={activeComponent === 'tasks'}
          >
            Tasks
          </button>
          <button
            onClick={() => handleOpenComponent('progress')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeComponent === 'progress' ? 'bg-blue-600 opacity-50 cursor-not-allowed' : 'bg-gray-900 hover:bg-blue-600'} md:w-auto`}
            disabled={activeComponent === 'progress'}
          >
            Progress
          </button>
          <button
            onClick={() => handleOpenComponent('manageSessions')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeComponent === 'manageSessions' ? 'bg-blue-600 opacity-50 cursor-not-allowed' : 'bg-gray-900 hover:bg-blue-600'} md:w-auto`}
            disabled={activeComponent === 'manageSessions'}
          >
            Manage Sessions
          </button>
          <button
            onClick={() => handleOpenComponent('patientsHistory')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeComponent === 'patientsHistory' ? 'bg-blue-600 opacity-50 cursor-not-allowed' : 'bg-gray-900 hover:bg-blue-600'} md:w-auto`}
            disabled={activeComponent === 'patientsHistory'}
          >
            Patients History
          </button>
        </div>
        <div className="flex-grow p-4 md:p-8 max-w-6xl mx-auto relative">
          <div className="bg-white rounded-lg shadow-lg overflow-y-auto max-w-full" style={{ maxHeight: '70vh', minHeight: '50vh' }}>
            <div className="p-4 md:p-8">
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
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
