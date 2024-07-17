import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login';
import Signup from './Signup';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if the user is already logged in on page reload
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const lastLogin = new Date(userData.lastLogin).getTime();
    const currentTime = new Date().getTime();
    const eightHours = 8 * 60 * 60 * 1000;

    if (accessToken && currentTime - lastLogin <= eightHours) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false); // Session expired or no valid token found
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/doctor-dashboard" element={loggedIn ? <DoctorDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/patient-dashboard" element={loggedIn ? <PatientDashboard /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
