import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';

const USERS_URL = "https://insight-backend-g7dg.onrender.com/users";
const TASKS_URL = "https://insight-backend-g7dg.onrender.com/users/task";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const CreateTasks = () => {
  const [activities, setActivities] = useState('');
  const [patientID, setPatientID] = useState('');
  const [duration, setDuration] = useState('');
  const [frequency, setFrequency] = useState('');
  const [patients, setPatients] = useState([]);
  const [dateTime, setDateTime] = useState(dayjs().format("YYYY-MM-DD HH:mm"));

  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  useEffect(() => {
    if (token) getUsers();
  }, [token]);

  const getUsers = async () => {
    try {
      const response = await fetch(USERS_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();

      if (result.successful) {
        const decryptedBytes = CryptoJS.AES.decrypt(result.ciphertext, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
          iv: CryptoJS.enc.Hex.parse(result.iv),
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        });
        
        let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

        decryptedData = decryptedData.replace(/\0+$/, '');

        const userData = JSON.parse(decryptedData);
        Object.entries(userData).forEach(([key, value]) => console.log(`${key} : ${JSON.stringify(value)}`));
        setPatients(userData.filter(user => user.role === 'patient'));
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
      
    } catch (error) {
      setError(`Failed to fetch users. Error: ${error.message}`);
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleAddTask = async () => {
    if (!token || !userId) return;
    console.log("Token ", token);
  
    setLoading(true);
    const selectedPatient = patients.find(patient => patient.userId.toString() === patientID);
  

    const newTask = {
      activities: activities,
      dateTime: dateTime,
      duration: duration,
      frequency: frequency,
      doctorId: userId,
      patientId: selectedPatient ? selectedPatient.userId : '',
      patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '',
    };

    console.log(`${JSON.stringify(newTask)}`);
  
    try {
      const response = await fetch(TASKS_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });
      const result = await response.json();
  
      if (result.successful) {
        setSuccessful(result.message);
        setTimeout(() => setSuccessful(""), 5000);
        setActivities('');
        setDateTime(dayjs().format("YYYY-MM-DD HH:mm")); 
        setDuration('');
        setFrequency('');
        setPatientID('');
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
  
    } catch (error) {
      setError(`There was an error making your request. Error: ${error.message}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Create Task</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Activities</label>
          <input
            type="text"
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Duration (hours)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Frequency Per Day</label>
          <input
            type="number"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Patient</label>
          <select
            value={patientID}
            onChange={(e) => setPatientID(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-2"
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.userId} value={patient.userId}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-end">
          {error && (
            <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
          )}
          {successful && (
            <div className="text-green-500 mt-2 text-sm text-center">{successful}</div>
          )}
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Add Task
          </button>
        </div>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-700"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTasks;
