import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaPlayCircle } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Confetti from 'react-confetti';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activityInProgress, setActivityInProgress] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const hardcodedData = [
      {
        activities: 'Yoga',
        date_time: '2024-07-12T09:00:00',
        status: 'pending',
        duration: 0.025,
        start_time: '09:00',
        end_time: '10:00',
        progress: 0,
        remaining_time: 90,
      },
      {
        activities: 'Meditation',
        date_time: '2024-07-13T08:00:00',
        status: 'pending',
        duration: 0.5,
        start_time: '08:00',
        end_time: '08:30',
        progress: 0,
        remaining_time: 1800,
      },
      {
        activities: 'Running',
        date_time: '2024-07-12T07:00:00',
        status: 'complete',
        duration: 1,
        start_time: '07:00',
        end_time: '08:00',
        progress: 3600,
        remaining_time: 0,
      },
    ];

    setActivities(hardcodedData);
  }, []);

  const handleStartActivity = (activity) => {
    setCurrentActivity(activity);
    setElapsedTime(0);
    setIsPaused(false);
    setActivityInProgress(true);
  };

  const handlePauseActivity = () => {
    setIsPaused(true);

    const updatedActivities = activities.map((act) =>
      act === currentActivity
        ? {
            ...act,
            progress: elapsedTime,
            remaining_time: currentActivity.duration * 60 * 60 - elapsedTime,
          }
        : act
    );
    setActivities(updatedActivities);

    sendUpdateRequest(currentActivity);
  };

  const handleContinueActivity = () => {
    setIsPaused(false);
    setActivityInProgress(true);
  };

  useEffect(() => {
    if (currentActivity && !isPaused) {
      const interval = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime >= currentActivity.duration * 60 * 60) {
            clearInterval(interval);
            handleActivityCompletion();
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentActivity, isPaused]);

  const handleActivityCompletion = () => {
    const updatedActivities = activities.map((act) =>
      act === currentActivity
        ? {
            ...act,
            status: 'complete',
            progress: currentActivity.duration * 60 * 60,
            remaining_time: 0,
          }
        : act
    );
    setActivities(updatedActivities);

    sendCompleteRequest(currentActivity);

    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const sendUpdateRequest = (activity) => {
    console.log(`Updating progress for ${activity.activities}`);
  };

  const sendCompleteRequest = (activity) => {
    console.log(`Completing activity: ${activity.activities}`);
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const filteredActivities = activities.filter(
    (activity) =>
      (activity.date_time.startsWith(today) ||
        activity.date_time.startsWith(tomorrowStr)) &&
      activity.status !== 'complete'
  );

  const calculateProgress = (elapsed, duration) => {
    return (elapsed / (duration * 60 * 60)) * 100;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Activities</h2>
      <div className="grid gap-4">
        {filteredActivities.map((activity) => (
          <div key={activity.activities} className="p-4 bg-white rounded shadow-md">
            <h3 className="text-xl font-bold">{activity.activities}</h3>
            <p>Date: {new Date(activity.date_time).toLocaleDateString()}</p>
            <p>Time: {activity.start_time} - {activity.end_time}</p>
            <p>Status: {activity.status}</p>
            {activity.date_time.startsWith(today) ? (
              <>
                {activityInProgress && currentActivity === activity ? (
                  <>
                    {!isPaused ? (
                      <button
                        className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700"
                        onClick={handlePauseActivity}
                      >
                        <FaPause className="inline mr-2" /> Pause
                      </button>
                    ) : (
                      <button
                        className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                        onClick={handleContinueActivity}
                      >
                        <FaPlayCircle className="inline mr-2" /> Continue
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    onClick={() => handleStartActivity(activity)}
                  >
                    <FaPlay className="inline mr-2" /> Start
                  </button>
                )}
              </>
            ) : (
              <button
                className="mt-4 bg-gray-500 text-white py-2 px-4 rounded cursor-not-allowed"
                disabled
              >
                <FaPlay className="inline mr-2" /> Start
              </button>
            )}
          </div>
        ))}
      </div>
      {currentActivity && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Current Activity: {currentActivity.activities}</h2>
          <div className="w-40 mx-auto">
            <CircularProgressbar
              value={calculateProgress(elapsedTime, currentActivity.duration)}
              text={`${Math.floor(elapsedTime / 60)}m`}
              styles={buildStyles({
                textColor: 'black',
                pathColor: 'blue',
                trailColor: 'gray',
              })}
            />
          </div>
          <p className="text-center mt-4">Elapsed Time: {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s</p>
          <p className="text-center mt-2">Remaining Time: {Math.floor((currentActivity.duration * 60 - elapsedTime / 60))}m {60 - (elapsedTime % 60)}s</p>
        </div>
      )}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}
    </div>
  );
};

export default Activities;
