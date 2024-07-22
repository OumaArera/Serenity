import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Confetti from 'react-confetti';
import io from 'socket.io-client';

const TASKS_URL = "https://insight-backend-g7dg.onrender.com/users/tasks";
const COMPLETE_TASK_URL = "https://insight-backend-g7dg.onrender.com/users/update/task";

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [timers, setTimers] = useState({});
    const [completed, setCompleted] = useState(false);
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("");
    const [activeActivity, setActiveActivity] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("userData");

        if (accessToken) setToken(JSON.parse(accessToken));
        if (userData) setUserId(JSON.parse(userData).userId);
    }, []);

    useEffect(() => {
        fetchActivities();
        const socket = io('https://insight-backend-g7dg.onrender.com', {
            query: { token }
        });

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('task_reminders', (reminders) => {
            console.log('Received reminders:', reminders);
            setActivities(prevActivities => {
                const updatedActivities = [...prevActivities];
                reminders.forEach(reminder => {
                    const index = updatedActivities.findIndex(activity => activity.id === reminder.id);
                    if (index !== -1) {
                        updatedActivities[index] = reminder;
                    } else {
                        updatedActivities.push(reminder);
                    }
                });
                return updatedActivities.sort((a, b) => new Date(a.nextDueTime) - new Date(b.nextDueTime));
            });
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
        });

        return () => socket.disconnect();
    }, [token]);

    const fetchActivities = async () => {
        try {
            const response = await fetch(`${TASKS_URL}/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.successful) {
                const sortedActivities = result.data.sort((a, b) => new Date(a.nextDueTime) - new Date(b.nextDueTime));
                setActivities(sortedActivities);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const startTimer = (id, duration) => {
        if (activeActivity) return; // Prevent starting another activity if one is already active
        const endTime = new Date().getTime() + duration * 3600000;
        setTimers(prevTimers => ({
            ...prevTimers,
            [id]: { endTime, remainingTime: duration * 3600000, isActive: true, duration, startTime: new Date().getTime() }
        }));
        setActiveActivity(id);
    };

    const pauseTimer = (id) => {
        const currentTime = new Date().getTime();
        setTimers(prevTimers => ({
            ...prevTimers,
            [id]: { ...prevTimers[id], remainingTime: prevTimers[id].endTime - currentTime, isActive: false }
        }));
    };

    const resumeTimer = (id) => {
        const endTime = new Date().getTime() + timers[id].remainingTime;
        setTimers(prevTimers => ({
            ...prevTimers,
            [id]: { ...prevTimers[id], endTime, isActive: true }
        }));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            setTimers(prevTimers => {
                const updatedTimers = { ...prevTimers };
                for (const id in updatedTimers) {
                    if (updatedTimers[id].isActive) {
                        if (currentTime >= updatedTimers[id].endTime) {
                            handleCompletion(id);
                            updatedTimers[id].isActive = false;
                        } else {
                            updatedTimers[id].remainingTime = updatedTimers[id].endTime - currentTime;
                        }
                    }
                }
                return updatedTimers;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleCompletion = async id => {
        const payload = {
            taskId: id,
            patientId: userId,
            completedTime: new Date().toISOString() // Using current date time in ISO format
        };

        try {
            const response = await fetch(COMPLETE_TASK_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.successful) {
                fetchActivities(); // Fetch updated activities after marking one as completed
            }
        } catch (error) {
            console.error("Error completing task:", error);
        }
    };

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="p-4">
            {completed && <Confetti />}
            {activities.map(activity => (
                <div key={activity.id} className="activity bg-white p-4 mb-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-2">{activity.activities}</h3>
                    <p className="text-gray-600 mb-2">Next Due: {new Date(activity.nextDueTime).toLocaleString()}</p>
                    <p className="text-gray-600 mb-2">Duration: {activity.duration} hours</p>
                    <div className="relative w-24 h-24 mb-4 mx-auto">
                        <CircularProgressbar
                            value={timers[activity.id]?.remainingTime ? 100 - (timers[activity.id].remainingTime / (activity.duration * 3600000)) * 100 : 0}
                            styles={buildStyles({
                                pathColor: '#3b82f6', // Blue color for fill
                                textColor: '#4A5568',
                                trailColor: '#d1d5db', // Gray color for background
                                backgroundColor: '#fff',
                            })}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-gray-700">
                            <span>{timers[activity.id]?.remainingTime ? formatTime(timers[activity.id].remainingTime) : formatTime(activity.duration * 3600000)}</span>
                            <span>/{formatTime(activity.duration * 3600000)}</span>
                        </div>
                    </div>
                    {!timers[activity.id]?.isActive ? (
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={() => startTimer(activity.id, activity.duration)}
                            disabled={activeActivity !== null} // Disable button if another activity is active
                        >
                            <FaPlay className="inline-block mr-2" /> Start
                        </button>
                    ) : (
                        <button
                            className="bg-orange-700 text-white py-2 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                            onClick={() => pauseTimer(activity.id)}
                        >
                            <FaPause className="inline-block mr-2" /> Pause
                        </button>
                    )}
                    {timers[activity.id] && !timers[activity.id].isActive && timers[activity.id].remainingTime < timers[activity.id].duration * 3600000 && (
                        <button
                            className="bg-orange-700 text-white py-2 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ml-2"
                            onClick={() => resumeTimer(activity.id)}
                        >
                            <FaPlay className="inline-block mr-2" /> Resume
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Activities;
