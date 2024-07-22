import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PROGRESS_URL = `https://insight-backend-g7dg.onrender.com/users/all/tasks/`;

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
            setTasks(response.data.tasks);
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

  const calculateCompletionPercentage = (tasks) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'complete').length;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const handleClickPatient = (patientName) => {
    setSelectedPatient(patientName);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Get unique patients based on patientId
  const uniquePatients = Array.from(new Set(tasks.map(task => task.patientId)))
    .map(patientId => tasks.find(task => task.patientId === patientId));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl text-black font-bold mb-4 text-center">Progress Monitoring</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <h3 className="text-lg font-bold mb-2">Patients:</h3>
          <ul className="space-y-2">
            {uniquePatients.map(patient => (
              <li key={patient.patientId}>
                <button
                  className={`block w-full text-left px-4 py-2 rounded-md ${selectedPatient === patient.patientName ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => handleClickPatient(patient.patientName)}
                >
                  {patient.patientName}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-1">
          {selectedPatient && (
            <div>
              <h3 className="text-lg font-bold mb-2">{selectedPatient}'s Tasks:</h3>
              {tasks.filter(task => task.patientName === selectedPatient).map(task => (
                <div key={task.id} className="p-4 border rounded-lg shadow-md mb-4">
                  <p><strong>Activity:</strong> {task.activities}</p>
                  <p><strong>Status:</strong> {task.status === 'complete' ? 'Complete' : 'Pending'}</p>
                  <p><strong>Date:</strong> {new Date(task.dateTime).toLocaleString()}</p>
                  <p><strong>Duration:</strong> {task.duration} hours</p>
                  <p><strong>Progress:</strong> {task.progress}</p>
                </div>
              ))}
              <p><strong>Completion Percentage:</strong> {calculateCompletionPercentage(tasks.filter(task => task.patientName === selectedPatient))}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressMonitoring;
