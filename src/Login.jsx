import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import CryptoJS from 'crypto-js';
import landingImage from './landing.jpeg';

const LOGIN_URL = "loginurl";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Hardcoded login credentials for testing
    const hardcodedEmail = 'ous@gmail.com';
    const hardcodedPassword = 'Ous';

    if (username === hardcodedEmail && password === hardcodedPassword) {
      const userData = {
        access_token: 'fake-access-token',
        first_name: 'Ousmane',
        last_name: 'User',
        role: 'patient',
        userId: 1
      };

      // Store user data in localStorage
      localStorage.setItem('access_token', userData.access_token);
      localStorage.setItem('first_name', userData.first_name);
      localStorage.setItem('last_name', userData.last_name);
      localStorage.setItem('role', userData.role);
      localStorage.setItem('userId', userData.userId);

      if (userData.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (userData.role === 'patient') {
        navigate('/patient-dashboard');
      }
      setLoading(false);
      return;
    }
    // End of hardcoded login credentials


    // const dataToEncrypt = {
    //   email: username,
    //   password: password
    // };

    // const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dataToEncrypt), SECRET_KEY).toString();
    // const payload = {
    //   data: encryptedData
    // };

    // try {
    //   const response = await fetch(LOGIN_URL, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(payload)
    //   });

    //   const result = await response.json();
    //   const decryptedData = CryptoJS.AES.decrypt(result.data, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    //   const userData = JSON.parse(decryptedData);

    //   const { access_token, first_name, last_name, role } = userData;
      
    //   localStorage.setItem('access_token', access_token);
    //   localStorage.setItem('first_name', first_name);
    //   localStorage.setItem('last_name', last_name);
    //   localStorage.setItem('role', role);
    //   localStorage.setItem('userId', id);

    //   if (role === 'doctor') {
    //     navigate('/doctor-dashboard');
    //   } else if (role === 'patient') {
    //     navigate('/patient-dashboard');
    //   }

    // } catch (error) {
    //   console.error("Error:", error);

    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center fixed top-0 left-0 right-0 bottom-0"
      style={{ backgroundImage: `url(${landingImage})` }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded mt-1 bg-gray-100 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded mt-1 bg-gray-100 text-black"
                required
              />
              <span className="absolute right-2 top-3 cursor-pointer text-gray-800" onClick={handlePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type="submit" className="bg-red-700 hover:bg-red-800 text-white w-full py-2 rounded mt-4">
            Login
          </button>
          <div className="text-center mt-4">
            <NavLink to="/signup" className="bg-red-700 text-white p-2 rounded hover:bg-red-800">
              Don't have an account? Sign up
            </NavLink>
          </div>
        </form>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-700"></div>
        </div>
      )}
    </div>
  );
};

export default Login;

