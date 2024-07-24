import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CreateSessions from './CreateSessions';
import CreateTasks from './CreateTasks';
import ProgressMonitoring from './ProgressMonitoring';
import ManageSession from './ManageSession';
import PatientsHistory from './PatientsHistory';
import Responses from './Responses';

const DoctorDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null); // State to manage active component
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  // Function to handle opening a component
  const handleOpenComponent = (component) => {
    setLoading(true);
    setActiveComponent(component);
  };

  useEffect(() => {
    setLoading(false);
  }, [activeComponent]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-red-600 to-green-500">
      <Header />
      <div className="flex flex-col md:flex-row flex-grow">
        <div className="w-full md:w-1/4 bg-gray-800 text-white p-4 flex flex-col items-center md:items-start md:justify-start space-y-4 md:space-y-0 md:space-y-4">
          <button
            onClick={() => handleOpenComponent('sessions')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeComponent === 'sessions' ? 'bg-blue-600' : 'bg-gray-900'} hover:bg-blue-600`}
          >
            Create Sessions
          </button>
          <button
            onClick={() => handleOpenComponent('tasks')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeComponent === 'tasks' ? 'bg-blue-600' : 'bg-gray-900'} hover:bg-blue-600`}
          >
            Create Tasks
          </button>
          <button
            onClick={() => handleOpenComponent('progress')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeComponent === 'progress' ? 'bg-blue-600' : 'bg-gray-900'} hover:bg-blue-600`}
          >
            Monitor Tasks
          </button>
          <button
            onClick={() => handleOpenComponent('manageSessions')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeComponent === 'manageSessions' ? 'bg-blue-600' : 'bg-gray-900'} hover:bg-blue-600`}
          >
            Manage Sessions
          </button>
          <button
            onClick={() => handleOpenComponent('patientsHistory')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeComponent === 'patientsHistory' ? 'bg-blue-600' : 'bg-gray-900'} hover:bg-blue-600`}
          >
            Patients History
          </button>
          <button
            onClick={() => handleOpenComponent('responses')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeComponent === 'responses' ? 'bg-blue-600' : 'bg-gray-900'} hover:bg-blue-600`}
          >
            Track Progress
          </button>
        </div>
        <div className="flex-grow p-4 md:p-8 max-w-6xl mx-auto relative">
          <div className="bg-white rounded-lg shadow-lg overflow-y-auto" style={{ maxHeight: '70vh', minHeight: '50vh' }}>
            <div className="p-4 md:p-8">
              {loading && (
                <div className="flex items-center justify-center h-full">Loading...</div>
              )}
              {!loading && (
                <div>
                  {activeComponent === 'sessions' && <CreateSessions />}
                  {activeComponent === 'tasks' && <CreateTasks />}
                  {activeComponent === 'progress' && <ProgressMonitoring />}
                  {activeComponent === 'manageSessions' && <ManageSession />}
                  {activeComponent === 'patientsHistory' && <PatientsHistory />}
                  {activeComponent === 'responses' && <Responses />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
