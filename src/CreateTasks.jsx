import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import { toHaveFormValues } from '@testing-library/jest-dom/matchers';

const USERS_URL = "https://insight-backend-8sg2.onrender.com/users";
const TASKS_URL = "https://insight-backend-8sg2.onrender.com/users/task";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const CreateTasks = () => {
  const [activities, setActivities] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [patientID, setPatientID] = useState('');
  const [patients, setPatients] = useState([]);

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

  const calculateDuration = () => {
    const startDateTime = dayjs(`${date} ${startTime}`, "YYYY-MM-DD HH:mm");
    const endDateTime = dayjs(`${date} ${endTime}`, "YYYY-MM-DD HH:mm");
    return endDateTime.diff(startDateTime, 'hour', true);
  };

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
  
    setLoading(true);
    const duration = calculateDuration();
    const selectedPatient = patients.find(patient => patient.userId.toString() === patientID);
  
    const newTask = {
      activities: activities,
      dateTime: dayjs(`${date} ${startTime}`, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm"),
      status: 'pending',
      duration: duration,
      startTime: startTime,
      endTime: endTime,
      progress: 0,
      remainingTime: 0,
      doctorId: userId,
      patientId: selectedPatient ? selectedPatient.userId : '',
      patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '',
    };
    Object.entries(newTask).forEach(([key, value]) => console.log(`${key} : ${value}`))
  
    const dataStr = JSON.stringify(newTask);
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
    Object.entries(payload).forEach(([key, value]) => console.log(`${key} : ${value}`));
  
    try {
      const response = await fetch(TASKS_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
  
      if (result.successful) {
        setSuccessful(result.message);
        setTimeout(() => setSuccessful(""), 5000);
        setActivities('');
        setDate('');
        setStartTime('');
        setEndTime('');
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-2"
            />
          </div>
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
