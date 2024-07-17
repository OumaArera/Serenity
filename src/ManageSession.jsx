import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PROGRESS_URL = `https://insight-backend-8sg2.onrender.com/users/pending/sessions/`;
const UPDATE_SESSION_URL = `https://insight-backend-8sg2.onrender.com/users/update/session`;

const ManageSession = () => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [token, userId]);

  const fetchSessions = async () => {
    try {
      if (token && userId) {
        const response = await axios.get(`${PROGRESS_URL}${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.successful) {
          setSessions(response.data.sessions);
        } else {
          setError('Failed to retrieve sessions');
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to retrieve sessions');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleUpdateClick = (sessionId) => {
    setEditingSessionId(sessionId);
    setResponseMessage(null); 
  };

  const handleSaveClick = async (sessionId) => {
    if (!token || !userId) return;
    setIsLoading(true);

    const formattedStartTime = formatDateTime(startTime);
    const formattedEndTime = formatDateTime(endTime);

    const payload = {
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };

    try {
      const response = await fetch(`${UPDATE_SESSION_URL}/${sessionId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.successful) {
        setResponseMessage(result.message);
        setTimeout(() => setResponseMessage(""), 5000);
        fetchSessions();
        setEditingSessionId(null);
        setStartTime("");
        setEndTime("");
      } else {
        setResponseMessage(result.message);
        setTimeout(() => setResponseMessage(""), 5000);
      }
    } catch (error) {
      console.error('Error updating session:', error);
      setResponseMessage("Failed to update session");
      setTimeout(() => setResponseMessage(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl text-black font-bold mb-4 text-center">Manage Sessions</h2>
      {responseMessage && (
        <div className={`text-white p-2 rounded mb-4 ${responseMessage.includes("success") ? "bg-green-500" : "bg-red-500"}`}>
          {responseMessage}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {sessions.map((session) => (
          <div key={session.id} className="p-4 border rounded-lg shadow-md">
            <p><strong>Location:</strong> {session.location}</p>
            <p><strong>Meeting URL:</strong> {session.meeting_url}</p>
            <p><strong>Start Time:</strong> {new Date(session.start_time).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(session.end_time).toLocaleString()}</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md mt-2"
              onClick={() => handleUpdateClick(session.id)}
            >
              Update
            </button>
            {editingSessionId === session.id && (
              <div className="mt-4 p-4 border rounded-lg shadow-md">
                <label className="block mb-2">
                  Start Time:
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="block w-full mt-1 p-2 border rounded"
                  />
                </label>
                <label className="block mb-2">
                  End Time:
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="block w-full mt-1 p-2 border rounded"
                  />
                </label>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md mt-2"
                  onClick={() => handleSaveClick(session.id)}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-700"></div>
        </div>
      )}
    </div>
  );
};

export default ManageSession;
