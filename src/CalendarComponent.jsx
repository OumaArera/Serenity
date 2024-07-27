import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';

const SESSIONS_URL = "https://insight-backend-g7dg.onrender.com/users/get/booking";
const UPDATE_SESSION_URL = "https://insight-backend-g7dg.onrender.com/users/update/session";

const CalendarComponent = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  useEffect(() => {
    if (token && userId) {
      axios.get(`${SESSIONS_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data.successful) {
          setActivities(response.data.sessions);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the sessions!", error);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [token, userId]);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const dayActivities = activities.filter(activity =>
        dayjs(activity.session_time).format('YYYY-MM-DD') === formattedDate
      );
      return (
        <ul className="list-none p-0 m-0">
          {dayActivities.map((activity, index) => (
            <li
              key={index}
              className="text-xs bg-blue-600 text-white rounded-md px-2 py-1 my-1 cursor-pointer"
              onClick={() => handleDayClick(activity)}
            >
              {dayjs(activity.date).format('MMMM D, YYYY h:mm A')} - {dayjs(activity.end_time).format('h:mm A')}
              <br />
              Meeting Type: {activity.meetingType}
              <br />
              Location/ Meeting URL: <a href={activity.location} target="_blank" rel="noopener noreferrer">{activity.meeting_url}</a>
              
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const handleDayClick = (activity) => {
    setSelectedDate(activity.session_time); // Use session_time as selectedDate
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl text-black font-bold mb-4 text-center">My Bookings</h2>
      <Calendar
        tileContent={tileContent}
        className="mx-auto border rounded-lg shadow-lg bg-white text-gray-800"
        tileClassName={({ date, view }) => view === 'month' ? 'text-black' : ''}
        formatShortWeekday={(locale, date) => dayjs(date).format('ddd')}
        showNavigation={true}
        next2Label={null}
        prev2Label={null}
        formatMonthYear={(locale, date) => dayjs(date).format('MMMM YYYY')}
      />

      {selectedDate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-gray-800">
            <h3 className="text-xl font-bold mb-4">Booking Details</h3>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {dayjs(selectedDate).format('MMMM D, YYYY h:mm A')}</p>
            <p><strong>Location:</strong> {activities.find(activity => activity.session_time === selectedDate)?.location}</p>
            <p><strong>Meeting Link:</strong> <a href={activities.find(activity => activity.session_time === selectedDate)?.meeting_url} target="_blank" rel="noopener noreferrer">{activities.find(activity => activity.session_time === selectedDate)?.meeting_url}</a></p>
            <p><strong>Meeting Location:</strong> {activities.find(activity => activity.session_time === selectedDate)?.meeting_location}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
