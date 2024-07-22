import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const SESSIONS_URL = "https://insight-backend-g7dg.onrender.com/users/all/sessions";
const BOOK_SESSION_URL = "https://insight-backend-g7dg.onrender.com/users/book/session";

const Booking = () => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  useEffect(() => {
    if (token) {
      axios.get(SESSIONS_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data.successful) {
          setSessions(response.data.sessions);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the sessions!", error);
      });
    }
  }, [token]);

  const handleBookSession = (sessionId) => {
    setLoading(true);
    const bookSessionUrl = `${BOOK_SESSION_URL}/${sessionId}`;
    axios.put(bookSessionUrl, { userId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setMessage({ text: response.data.message, type: "success" });
      setSessions(sessions.filter(session => session.id !== sessionId));
    })
    .catch(error => {
      setMessage({ text: error.response?.data?.message || "There was an error booking the session!", type: "error" });
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMMM D, YYYY, [at] h:mm A");
  };

  const filteredSessions = sessions.filter(session => 
    dayjs(session.start_time).format("MMMM D, YYYY").includes(searchTerm)
  );

  return (
    <div>
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Search by date (e.g., July 20)"
          className="border p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {message.text && (
        <div className={`text-center py-2 ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
          {message.text}
        </div>
      )}
      <div className="flex flex-wrap justify-center">
        {filteredSessions.map(session => (
          <div key={session.id} className="max-w-sm rounded overflow-hidden shadow-lg m-4 p-4 border">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Session ID: {session.id}</div>
              <p className="text-gray-700 text-base">Location: {session.location}</p>
              <p className="text-gray-700 text-base">Meeting Location: {session.meetingLocation}</p>
              <p className="text-gray-700 text-base">Meeting URL: {session.meetingUrl}</p>
              <p className="text-gray-700 text-base">Start Time: {formatDate(session.start_time)}</p>
              <p className="text-gray-700 text-base">End Time: {formatDate(session.end_time)}</p>
              <p className="text-gray-700 text-base">Available: {session.available ? "Yes" : "No"}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <button
                onClick={() => handleBookSession(session.id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-700"></div>
        </div>
      )}
    </div>
  );
};

export default Booking;
