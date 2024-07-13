import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';

const Booking = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hardcoded encrypted data for testing
        const hardcodedEncryptedData = CryptoJS.AES.encrypt(
          JSON.stringify([
            {
              id: 1,
              date: "2024-07-15T10:00:00",
              available: true,
              session_time: "2 hours",
              location: "online",
              physician: "Dr. Ouma",
              patientName: "",
              patientNumber: ""
            },
            {
              id: 2,
              date: "2024-07-16T14:00:00",
              available: true,
              session_time: "2 hours",
              location: "physical location",
              physician: "Dr. Ouma",
              patientName: "",
              patientNumber: ""
            },
          ]),
          secretKey
        ).toString();

        // Simulate API response
        const response = {
          data: {
            message: "Success",
            data: hardcodedEncryptedData,
            successfull: true,
            status_code: 200
          }
        };

        if (response.data.successfull) {
          const decryptedData = JSON.parse(
            CryptoJS.AES.decrypt(response.data.data, secretKey).toString(CryptoJS.enc.Utf8)
          );
          setSessions(decryptedData);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError('Error fetching booking data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [secretKey]);

  const handleBook = (index) => {
    setIsBooking(true);
    setSelectedSession(index);
  };

  const handleConfirmBooking = async () => {
    if (!name || !phoneNumber) {
      alert('Name and phone number are required');
      return;
    }

    const sessionToBook = sessions.find(session => session.id === selectedSession);
    sessionToBook.available = false;
    sessionToBook.patientName = name;
    sessionToBook.patientNumber = phoneNumber;

    Object.entries(sessionToBook).forEach(([key, value]) => console.log(`${key}: ${JSON.stringify(value, null, 2)}`))

    const encryptedSession = CryptoJS.AES.encrypt(
      JSON.stringify(sessionToBook),
      secretKey
    ).toString();

    console.log(encryptedSession);

    try {
      // Simulate API response for booking
      const response = { data: { successfull: true } };
      if (response.data.successfull) {
        setSessions((prevSessions) => prevSessions.filter(session => session.id !== selectedSession));
        alert('Session booked successfully');
        setIsBooking(false);
        setName('');
        setPhoneNumber('');
      } else {
        alert('Failed to book session');
      }
    } catch (error) {
      alert('Error booking session');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSessions = sessions.filter((session) =>
    dayjs(session.date).format('dddd MMMM D, YYYY').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
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
            <p><strong>Date:</strong> {dayjs(session.date).format('dddd MMMM D, YYYY at h:mm A')}</p>
            <p><strong>Session Time:</strong> {session.session_time}</p>
            <p><strong>Location:</strong> {session.location}</p>
            <p><strong>Physician:</strong> {session.physician}</p>
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
            />
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="p-2 border rounded-md shadow-md mb-2"
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
