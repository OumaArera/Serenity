import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import CryptoJS from 'crypto-js';
import landingImage from './landing.jpeg';

const LOGIN_URL = "https://insight-backend-8sg2.onrender.com/users/login";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const accessToken = localStorage.getItem("accessToken");

    if (userData && accessToken) {
      const parsedUserData = JSON.parse(userData);
      const currentTime = new Date().getTime();
      const lastLoginTime = new Date(parsedUserData.lastLogin).getTime();
      const eightHours = 8 * 60 * 60 * 1000;

      if (currentTime - lastLoginTime > eightHours) {
        localStorage.removeItem("userData");
        localStorage.removeItem("accessToken");
        setError("Session expired. Please login again.");
      } else {
        setLoggedIn(true); // Set logged in state
        if (parsedUserData.role === 'doctor') {
          navigate('/doctor-dashboard');
        } else if (parsedUserData.role === 'patient') {
          navigate('/patient-dashboard');
        }
      }
    }
  }, [navigate, setLoggedIn]);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToEncrypt = {
      email: username.toLowerCase(),
      password: password
    };

    const dataStr = JSON.stringify(dataToEncrypt);
    const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
    const encryptedData = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
      iv: CryptoJS.enc.Hex.parse(iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    }).toString();

    const payload = {
      iv: iv,
      ciphertext: encryptedData
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

      if (!result.successful) {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
        return;
      }

      const decryptedBytes = CryptoJS.AES.decrypt(result.ciphertext, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
        iv: CryptoJS.enc.Hex.parse(result.iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      });

      let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

      // Remove trailing null characters
      decryptedData = decryptedData.replace(/\0+$/, '');

      const userData = JSON.parse(decryptedData);

      const userDetails = {
        "firstName": userData.firstName,
        "lastName": userData.lastName,
        "email": userData.email,
        "role": userData.role,
        "userId": userData.id,
        "lastLogin": new Date().toISOString() // Update lastLogin to current time
      };

      localStorage.setItem("userData", JSON.stringify(userDetails));
      localStorage.setItem("accessToken", JSON.stringify(userData.accessToken));
      console.log("Access Token: ", userData.accessToken);
      setLoggedIn(true); // Set logged in state

      if (userData.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (userData.role === 'patient') {
        navigate('/patient-dashboard');
      } else {
        setError("Invalid user!");
        setTimeout(() => setError(""), 5000);
        return;
      }

    } catch (error) {
      console.error("Error:", error);
      setError("Failed to login. Please check your credentials.");
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
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="text-center mt-4">
            <NavLink to="/signup" className="bg-red-700 text-white p-2 rounded hover:bg-red-800">
              Don't have an account? Sign up
            </NavLink>
          </div>
        </form>
        {error && (
          <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
        )}
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
