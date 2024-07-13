import React, { useState } from 'react';
import dayjs from 'dayjs';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const CreateSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [sessionType, setSessionType] = useState('online');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [specificLocation, setSpecificLocation] = useState('');
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const physician = "Dr. Ouma"; // This should be retrieved from browser or context

  const calculateSessionTime = () => {
    if (startTime && endTime) {
      const start = dayjs(startTime);
      const end = dayjs(endTime);
      return end.diff(start, 'hour') + ' hours';
    }
    return '';
  };

  const handleAddSession = async () => {
    const sessionTime = calculateSessionTime();
    if (!sessionTime) {
      alert('Please provide valid start and end times.');
      return;
    }

    const newSession = {
      date,
      available: true,
      session_time: sessionTime,
      location: sessionType === 'online' ? meetingUrl : specificLocation,
      physician
    };

    const encryptedSession = CryptoJS.AES.encrypt(JSON.stringify(newSession), secretKey).toString();

    try {
      await axios.post('/api/sessions', { data: encryptedSession });
      setSessions([...sessions, newSession]);
      setDate('');
      setStartTime('');
      setEndTime('');
      setLocation('');
      setSessionType('online');
      setMeetingUrl('');
      setSpecificLocation('');
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Create Sessions</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-2"
          />
        </div>
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
        <div>
          <label className="block text-sm font-medium">Session Type</label>
          <select
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-2"
          >
            <option value="online">Online</option>
            <option value="physical">Physical</option>
          </select>
        </div>
        {sessionType === 'online' ? (
          <div>
            <label className="block text-sm font-medium">Meeting URL</label>
            <input
              type="text"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-2"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium">Specific Location</label>
            <input
              type="text"
              value={specificLocation}
              onChange={(e) => setSpecificLocation(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-2"
            />
          </div>
        )}
        <div>
          <button
            onClick={handleAddSession}
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
          >
            Add Session
          </button>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Sessions</h2>
        <ul className="space-y-2">
          {sessions.map((session, index) => (
            <li key={index} className="border-2 border-gray-300 rounded-lg p-2">
              <div className="font-semibold">{session.date}</div>
              <div>Time: {session.session_time}</div>
              <div>Location: {session.location}</div>
              <div>Physician: {session.physician}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateSessions;
