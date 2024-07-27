import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import CryptoJS from 'crypto-js';

const CREATE_SESSION_URL = "https://insight-backend-g7dg.onrender.com/users/sessions";
const DOCTORS_URL = "https://insight-backend-g7dg.onrender.com/users/doctors";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const CreateSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [meetingType, setMeetingType] = useState('online');
  const [location, setLocation] = useState('');
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  useEffect(()=> {
    getDoctors();
  }, [userId, token])

  const getDoctors = async () =>{
    if (!token || !userId) return;

    try {
      const response = await fetch(DOCTORS_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if(result.successful){
        const decryptedBytes = CryptoJS.AES.decrypt(result.ciphertext, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
          iv: CryptoJS.enc.Hex.parse(result.iv),
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        });
  
        let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        decryptedData = decryptedData.replace(/\0+$/, '');
  
        const userData = JSON.parse(decryptedData);
        Object.entries(userData).forEach(([key, value]) => console.log(` Test ${key} : ${JSON.stringify(value)}`));
        setDoctors(userData);

      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
      
    } catch (error) {
      setError(`Error making the request. Error: ${error}`);
      setTimeout(() => setError(""), 5000);
    }
  }

  const handleAddSession = async () => {
    if (!token || !userId || !doctorId) return;
    setLoading(true);

    const sessionDate = dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    if (!sessionDate.isValid()) {
      alert('Please provide a valid date and time.');
      setLoading(false);
      return;
    }

    const dayOfWeek = sessionDate.day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alert('Please choose a date that falls on a weekday (Monday to Friday).');
      setLoading(false);
      return;
    }
    const formattedDate = sessionDate.toISOString();

    const newSession = {
      date: formattedDate,
      meetingType: meetingType,
      location: location,
      userId: userId,
      doctorId: doctorId,
      approved: false,
    };
    Object.entries(newSession).forEach(([key, value]) => console.log(`${key} : ${JSON.stringify(value)}`));

    try {
      const response = await fetch(CREATE_SESSION_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSession)
      });
      const result = await response.json();

      if (result.successful) {
        setSessions([...sessions, newSession]);
        setDate('');
        setTime('');
        setMeetingType('online');
        setLocation('');
        setDoctorId('');
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError(`Error adding session: ${error.message}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableDates = () => {
    const startDate = dayjs();
    const endDate = startDate.add(3, 'month');
    const dates = [];

    let currentDate = startDate;
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      if (currentDate.day() !== 0 && currentDate.day() !== 6) {
        dates.push(currentDate.format('YYYY-MM-DD'));
      }
      currentDate = currentDate.add(1, 'day');
    }

    return dates.map(date => (
      <option key={date} value={date}>
        {date}
      </option>
    ));
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
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-2"
          >
            {getAvailableDates()}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Meeting Type</label>
          <select
            value={meetingType}
            onChange={(e) => setMeetingType(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-2"
          >
            <option value="online">Online</option>
            <option value="physical">Physical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Location / Meeting URL</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Select Doctor</label>
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-2"
          >
            <option value="">Select a doctor</option>
            {doctors && doctors.length > 0 ? (
              doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.first_name} {doctor.last_name}
                </option>
              ))
            ) : (
              <option>No doctors available</option>
            )}

          </select>
        </div>
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
              <div className="font-semibold">{session.date.split(' ')[0]}</div>
              <div>Time: {session.date.split(' ')[1]}</div>
              <div>Location: {session.location}</div>
              <div>Meeting Type: {session.meetingType}</div>
              <div>User ID: {session.userId}</div>
              <div>Doctor ID: {session.doctorId}</div>
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
