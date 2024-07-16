import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const SESSIONS_URL = "https://insight-backend-8sg2.onrender.com/users/all/sessions";
const BOOK_SESSION_URL = "https://insight-backend-8sg2.onrender.com/users/book/session";

const Booking = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);

    fetchData();
  }, []);

  const fetchData = async () => {
    if (!token || !userId) return;
    setLoading(true);
    try {
      const response = await fetch(SESSIONS_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();

      if (result.successful) {
        setSessions(result.sessions);
        Object.entries(result.sessions).forEach(([key, value]) => console.log(`${key} : ${value}`));
      } else {
        setError(result.message);
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      setError('Error fetching booking data');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (index) => {
    if (!token || !userId) return;
    setIsBooking(true);
    setSelectedSession(index);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);

    const sessionToBook = sessions.find(session => session.id === selectedSession);
    sessionToBook.available = false;
    sessionToBook.patientName = name;
    sessionToBook.patientNumber = phoneNumber;

    try {
      const response = await fetch(`${BOOK_SESSION_URL}/${selectedSession}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      });
      const result = await response.json();

      if (response.ok && result.successful) {
        setSessions(prevSessions => prevSessions.filter(session => session.id !== selectedSession));
        alert('Session booked successfully');
        setIsBooking(false);
        setName('');
        setPhoneNumber('');
      } else {
        alert('Failed to book session');
      }
    } catch (error) {
      alert('Error booking session');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSessions = sessions.filter(session =>
    dayjs(session.start_time).format('dddd MMMM D, YYYY').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Sessions</h2>
      <input
        type="text"
        placeholder="Search by date (e.g., July 15, 2024)"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 p-2 border rounded-md shadow-md w-full"
      />
      <div>
        {filteredSessions.map((session, index) => (
          <div key={index} className="card bg-white p-4 rounded-lg shadow-md mb-4">
            <p><strong>Date:</strong> {dayjs(session.start_time).format('dddd MMMM D, YYYY at h:mm A')}</p>
            <p><strong>Session Time:</strong> {dayjs(session.start_time).format('h:mm A')} - {dayjs(session.end_time).format('h:mm A')}</p>
            <p><strong>Location:</strong> {session.location}</p>
            <p><strong>Link:</strong> {session.meetingUrl}</p>
            {session.available && (
              <button
                onClick={() => handleBook(session.id)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
              >
                Book
              </button>
            )}
          </div>
        ))}
      </div>
      {isBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Booking Information</h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mr-2 p-2 border rounded-md shadow-md mb-2"
              required
            />
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="p-2 border rounded-md shadow-md mb-2"
              required
            />
            <button
              onClick={handleConfirmBooking}
              className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition duration-200"
            >
              Confirm Booking
            </button>
            <button
              onClick={() => setIsBooking(false)}
              className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 transition duration-200 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
