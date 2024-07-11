import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToEncrypt = {
      email: username,
      password: password
    };
    console.log("Email " + dataToEncrypt["email"] + " Password " + dataToEncrypt["password"])

    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dataToEncrypt), SECRET_KEY).toString();
    console.log("Encrypted data " + encryptedData);
    const payload = {
      data: encryptedData
    };

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log("Response:", result);

    } catch (error) {
      console.log("Error:", error);

    } finally {
      setLoading(false);
    }
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
