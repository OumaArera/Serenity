import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaPlayCircle } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Confetti from 'react-confetti';
import CryptoJS from 'crypto-js';

const ACTIVITIES_URL = "https://insight-backend-8sg2.onrender.com/users/tasks";
const UPDATE_TASK_URL = "https://insight-backend-8sg2.onrender.com/users/update/task";
const PAUSE_TASK_URL = "https://insight-backend-8sg2.onrender.com/users/pause/task";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activityInProgress, setActivityInProgress] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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

  useEffect(() => {
    getActivities();
  }, [token, userId]);

  const getActivities = async () => {
    if (!token || !userId) return;
    try {
      setLoading(true); // Set loading to true before fetching data
      const response = await fetch(`${ACTIVITIES_URL}/${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (result.successful) {
        const decryptedBytes = CryptoJS.AES.decrypt(result.ciphertext, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
          iv: CryptoJS.enc.Hex.parse(result.iv),
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        });

        let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        decryptedData = decryptedData.replace(/\0+$/, '');
        const userData = JSON.parse(decryptedData);
        setActivities(userData);
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError(`There was an error getting the activities: ${error.message}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const handleStartActivity = (activity) => {
    setCurrentActivity(activity);
    setElapsedTime(activity.progress);
    setIsPaused(false);
    setActivityInProgress(true);
  };

  const handlePauseActivity = async () => {
    setIsPaused(true);
    const updatedActivities = activities.map((act) =>
      act === currentActivity
        ? {
            ...act,
            progress: elapsedTime,
            remaining_time: (currentActivity.duration * 60 * 60 - elapsedTime).toFixed(2),
          }
        : act
    );
    setActivities(updatedActivities);
    await sendUpdateRequest(currentActivity.id, elapsedTime.toFixed(2), (currentActivity.duration * 60 * 60 - elapsedTime).toFixed(2));
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

  const handleActivityCompletion = async () => {
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
    await sendCompleteRequest(currentActivity.id);

    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    setTimeout(() => {
      setActivities((prevActivities) =>
        prevActivities.filter((act) => act.id !== currentActivity.id)
      );
      setCurrentActivity(null);
    }, 10000);
  };

  const sendUpdateRequest = async (id, progress, remainingTime) => {
    const payload = {
      progress: progress,
      remainingTime: remainingTime
    };
    try {
      const response = await fetch(`${PAUSE_TASK_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!result.successful) {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError(`There was an error updating the activity: ${error.message}`);
      setTimeout(() => setError(""), 5000);
    }
  };

  const sendCompleteRequest = async (id) => {
    try {
      const response = await fetch(`${UPDATE_TASK_URL}/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (!result.successful) {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError(`There was an error completing the activity: ${error.message}`);
      setTimeout(() => setError(""), 5000);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const filteredActivities = activities.filter(
    (activity) =>
      (activity.dateTime.startsWith(today) ||
        activity.dateTime.startsWith(tomorrowStr)) &&
      activity.status !== 'complete'
  );

  const calculateProgress = (elapsed, duration) => {
    return (elapsed / (duration * 60 * 60)) * 100;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {error && (
        <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">Activities</h2>
          <div className="grid gap-4">
            {filteredActivities.map((activity) => (
              <div key={activity.activities} className="p-4 bg-white rounded shadow-md">
                <h3 className="text-xl font-bold">{activity.activities}</h3>
                <p>Date: {new Date(activity.dateTime).toLocaleDateString()}</p>
                <p>Time: {activity.startTime} - {activity.endTime}</p>
                <p>Status: {activity.status}</p>
                {activity.dateTime.startsWith(today) ? (
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
        </>
      )}
    </div>
  );
};

export default Activities;
