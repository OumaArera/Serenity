import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const PROGRESS_URL = `https://insight-backend-g7dg.onrender.com/users/monitor/`;

const ProgressMonitoring = () => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (token && userId) {
          const response = await axios.get(`${PROGRESS_URL}${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.successful) {
            setTasks(response.data.data);
          } else {
            setError('Failed to retrieve tasks');
          }
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to retrieve tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token, userId]);

  const formatDate = (dateStr) => {
    return format(new Date(dateStr), 'EEEE MMMM dd, yyyy hh:mm a');
  };

  const groupTasksByPatientAndDate = (tasks) => {
    const groupedTasks = {};

    tasks.forEach((task) => {
      const patientId = task.patientId;
      const patientName = task.patientName;
      const dateKey = format(new Date(task.dateCompleted), 'yyyy-MM-dd');

      if (!groupedTasks[patientId]) {
        groupedTasks[patientId] = {
          patientName,
          dates: {}
        };
      }

      if (!groupedTasks[patientId].dates[dateKey]) {
        groupedTasks[patientId].dates[dateKey] = [];
      }

      groupedTasks[patientId].dates[dateKey].push(task);
    });

    return groupedTasks;
  };

  const handlePatientClick = (patientId) => {
    setSelectedPatient(patientId);
  };

  const groupedTasks = groupTasksByPatientAndDate(tasks);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>
          <div className="flex space-x-4">
            {Object.keys(groupedTasks).map((patientId) => (
              <button
                key={patientId}
                onClick={() => handlePatientClick(patientId)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                {groupedTasks[patientId].patientName}
              </button>
            ))}
          </div>

          {selectedPatient && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">
                {groupedTasks[selectedPatient].patientName}
              </h2>

              {Object.keys(groupedTasks[selectedPatient].dates).map((dateKey) => (
                <div key={dateKey} className="mb-4">
                  <h3 className="text-xl font-semibold">
                    {formatDate(dateKey)}
                  </h3>
                  <p className="text-gray-700 mb-2">
                    {groupedTasks[selectedPatient].dates[dateKey].length} tasks completed
                  </p>
                  <ul className="list-disc pl-5">
                    {groupedTasks[selectedPatient].dates[dateKey].map((task) => (
                      <li key={task.id}>
                        {task.activity} - {formatDate(task.dateCompleted)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressMonitoring;
