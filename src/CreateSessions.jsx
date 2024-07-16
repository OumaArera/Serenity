import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

const CREATE_SESSION_URL = "https://insight-backend-8sg2.onrender.com/users/sessions";

const CreateSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [sessionType, setSessionType] = useState('online');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [specificLocation, setSpecificLocation] = useState('');
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  const calculateSessionTime = () => {
    if (startTime && endTime) {
      const start = dayjs(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm');
      const end = dayjs(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm');
      return end.diff(start, 'hour', true) + ' hours';
    }
    return '';
  };

  const handleAddSession = async () => {
    if (!token || !userId) return;
    setLoading(true);
    const sessionTime = calculateSessionTime();
    if (!sessionTime) {
      alert('Please provide valid start and end times.');
      setLoading(false);
      return;
    }

    const newSession = {
      physicianId: userId,
      available: true,
      start_time: `${date} ${startTime}`,
      end_time: `${date} ${endTime}`,
      session_time: `${date} ${startTime}`,
      location: sessionType === 'online' ? meetingUrl : specificLocation,
      meetingUrl: sessionType === 'online' ? meetingUrl : "",
      meetingLocation: sessionType === 'physical' ? specificLocation : ""
    };

    Object.entries(newSession).forEach(([key, value]) => console.log(`${key} : ${value}`))

    try {
      const response = await axios.post(CREATE_SESSION_URL, newSession, {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.successful) {
        setSessions([...sessions, newSession]);
        setDate('');
        setStartTime('');
        setEndTime('');
        setLocation('');
        setSessionType('online');
        setMeetingUrl('');
        setSpecificLocation('');
      } else {
        setError(response.data.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError(`Error adding session: ${error.message}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Create Sessions</h1>
      {error && (
        <div className="text-red-500 mb-4 text-sm text-center">{error}</div>
      )}
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
              <div className="font-semibold">{session.start_time.split(' ')[0]}</div>
              <div>Time: {session.start_time} to {session.end_time}</div>
              <div>Location: {session.location}</div>
              <div>Physician ID: {session.physicianId}</div>
            </li>
          ))}
        </ul>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-700"></div>
        </div>
      )}
    </div>
  );
};

export default CreateSessions;
