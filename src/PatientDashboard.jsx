import React, { useState, useEffect } from 'react';
import PatientHeader from './PatientHeader';
import Footer from './Footer';
import Activities from './Activities';
import HistoryComponent from './HistoryComponent';
import Progress from './Progress';
import Booking from './Booking';

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleToggle = (section) => {
    if (section === 'booking') {
      setLoading(true);
      setActiveSection('booking');
    } else {
      setActiveSection(activeSection === section ? null : section);
    }
  };

  useEffect(() => {
    if (activeSection === 'booking') {
      setLoading(false);
    }
  }, [activeSection]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white via-red-500 to-black">
      <PatientHeader />
      <div className="flex-grow p-4 md:p-8 max-w-6xl mx-auto relative">
        <div
          className="bg-white rounded-lg shadow-lg overflow-y-auto"
          style={{ maxHeight: '70vh', minHeight: '50vh' }}
        >
          <div className="p-4 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-700">Welcome to Your Dashboard</h2>
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
              <button onClick={() => handleToggle('activities')} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg w-full sm:w-auto">
                Activities
              </button>
              <button onClick={() => handleToggle('progress')} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg w-full sm:w-auto">
                Progress
              </button>
              <button onClick={() => handleToggle('history')} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg w-full sm:w-auto">
                History
              </button>
              <button onClick={() => handleToggle('booking')} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg w-full sm:w-auto">
                Book
              </button>
            </div>
            {activeSection === 'activities' && <Activities />}
            {activeSection === 'progress' && <Progress userId="dummyUserId" />}
            {activeSection === 'history' && <HistoryComponent />}
            {activeSection === 'booking' && (
              loading ? (
                <div className="flex items-center justify-center h-screen">Loading...</div>
              ) : (
                <Booking onLoadingChange={setLoading} />
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientDashboard;
