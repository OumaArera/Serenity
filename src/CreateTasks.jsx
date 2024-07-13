import React, { useState, useMemo } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';

const CreateTasks = () => {
  const [activities, setActivities] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState(0);
  const [patientID, setPatientID] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patients, setPatients] = useState([]);

  // Mock patient data (since endpoint is not yet available)
  useMemo(() => {
    setPatients([
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Michael Johnson' },
    ]);
  }, []);

  const calculateRemainingTime = () => {
    return Math.floor(duration * 60); // Convert duration from hours to minutes
  };

  const handleAddTask = async () => {
    const startDateTime = dayjs(`${date} ${startTime}`);
    const endDateTime = dayjs(`${date} ${endTime}`);
    const durationHours = endDateTime.diff(startDateTime, 'hour', true);

    const newTask = {
      activities,
      date_time: startDateTime.toISOString(),
      status: 'pending',
      duration: durationHours,
      start_time: startTime,
      end_time: endTime,
      progress: 0,
      remaining_time: calculateRemainingTime(),
      patientID,
      patientName,
    };

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const encryptedTask = CryptoJS.AES.encrypt(JSON.stringify(newTask), secretKey).toString();

    try {
      // Fake API endpoint (replace with actual endpoint when available)
      const response = await axios.post('https://fakeapi.example.com/api/tasks', { data: encryptedTask });
      console.log('Task added successfully:', response.data);
      
      // Clear form after successful submission
      setActivities('');
      setDate('');
      setStartTime('');
      setEndTime('');
      setDuration(0);
      setPatientID('');
      setPatientName('');
    } catch (error) {
      console.error('Error adding task:', error);
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
          <label className="block text-sm font-medium">Duration (hours)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            step="0.25"
            min="0"
            className="w-full border-2 border-gray-300 rounded-lg p-2"
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
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTasks;
