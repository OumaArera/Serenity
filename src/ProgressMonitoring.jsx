import React, { useState, useEffect } from 'react';

// Fake decryption function for demonstration purposes
const decryptData = (encryptedData) => {
  // Normally, you'd use a real decryption method here
  return JSON.parse(encryptedData);
};

const ProgressMonitoring = () => {
  const [data, setData] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // Hard-coded encrypted data for testing
  const encryptedData = JSON.stringify([
    {
      activities: 'Yoga',
      date_time: '2024-07-12T09:00:00',
      status: 'pending',
      duration: 0.025,
      start_time: '09:00',
      end_time: '10:00',
      progress: 0,
      remaining_time: 90,
      patientID: '1',
      patientName: 'John Doe'
    },
    {
      activities: 'Running',
      date_time: '2024-07-12T07:00:00',
      status: 'completed',
      duration: 1,
      start_time: '07:00',
      end_time: '08:00',
      progress: 100,
      remaining_time: 0,
      patientID: '2',
      patientName: 'Jane Smith'
    },
    {
      activities: 'Meditation',
      date_time: '2024-07-12T06:00:00',
      status: 'pending',
      duration: 0.5,
      start_time: '06:00',
      end_time: '06:30',
      progress: 50,
      remaining_time: 30,
      patientID: '1',
      patientName: 'John Doe'
    }
  ]);

  useEffect(() => {
    const decryptedData = decryptData(encryptedData);
    setData(decryptedData);
  }, [encryptedData]);

  const handlePatientClick = (patientID) => {
    setSelectedPatientId(patientID);
  };

  const renderPatientIcons = () => {
    const patientNames = [...new Set(data.map((item) => item.patientName))];
    return patientNames.map((name, index) => (
      <button
        key={index}
        className="m-2 p-2 bg-blue-500 text-white rounded-full"
        onClick={() => handlePatientClick(data.find((item) => item.patientName === name).patientID)}
      >
        {name}
      </button>
    ));
  };

  const renderActivities = (patientID) => {
    const activities = data.filter((item) => item.patientID === patientID);
    const completedActivities = activities.filter(activity => activity.status === 'completed').length;
    const totalActivities = activities.length;
    const completedPercentage = ((completedActivities / totalActivities) * 100).toFixed(2);

    return (
      <div>
        <p className="font-bold">Completed: {completedPercentage}% ({completedActivities}/{totalActivities})</p>
        {activities.map((activity, index) => (
          <div key={index} className="p-2 border-b border-gray-300">
            <p>Activity: {activity.activities}</p>
            <p>Date: {new Date(activity.date_time).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}</p>
            <p>Status: {activity.status}</p>
            <p>Duration: {activity.duration} hours</p>
            <p>Start Time: {activity.start_time}</p>
            <p>End Time: {activity.end_time}</p>
            <p>Progress: {activity.progress}%</p>
            <p>Remaining Time: {activity.remaining_time} minutes</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Progress Monitoring</h1>
      <div className="flex flex-wrap">
        {renderPatientIcons()}
      </div>
      {selectedPatientId && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Activities for Patient {selectedPatientId}</h2>
          <div className="border rounded-lg p-4">
            {renderActivities(selectedPatientId)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressMonitoring;
