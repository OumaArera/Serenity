import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';

const CalendarComponent = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hardcoded encrypted data for testing
        const hardcodedEncryptedData = CryptoJS.AES.encrypt(
          JSON.stringify([
            {
              date: "2024-07-15T10:00:00",
              available: true,
              session_time: "2 hours",
              location: "online",
              physician: "Dr. Ouma",
              patientName: "John Doe",
              patientNumber: "1234567890"
            },
            {
              date: "2024-07-16T14:00:00",
              available: true,
              session_time: "2 hours",
              location: "physical location",
              physician: "Dr. Ouma",
              patientName: "Jane Smith",
              patientNumber: "0987654321"
            },
          ]),
          secretKey
        ).toString();

        // Simulate API response
        const response = {
          message: "Success",
          data: hardcodedEncryptedData,
          successfull: true,
          status_code: 200
        };

        if (response.successfull) {
          const decryptedData = JSON.parse(
            CryptoJS.AES.decrypt(response.data, secretKey).toString(CryptoJS.enc.Utf8)
          );
          setActivities(decryptedData);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError('Error fetching booking data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [secretKey]);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const dayActivities = activities.filter(activity =>
        dayjs(activity.date).format('YYYY-MM-DD') === formattedDate
      );
      return (
        <ul className="list-none p-0 m-0">
          {dayActivities.map((activity, index) => (
            <li
              key={index}
              className="text-xs bg-blue-600 text-white rounded-md px-2 py-1 my-1 cursor-pointer"
              onClick={() => handleDayClick(activity)}
            >
              {activity.session_time} - {activity.physician}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const handleDayClick = (activity) => {
    setSelectedDate(activity.date);
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="text-center mt-4 text-red-500">{error}</div>;

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
            <p><strong>Date:</strong> {dayjs(selectedDate).format('dddd, MMMM D, YYYY')}</p>
            <p><strong>Time:</strong> {activities.find(activity => activity.date === selectedDate)?.session_time}</p>
            <p><strong>Location:</strong> {activities.find(activity => activity.date === selectedDate)?.location}</p>
            <p><strong>Physician:</strong> {activities.find(activity => activity.date === selectedDate)?.physician}</p>
            <p><strong>Patient Name:</strong> {activities.find(activity => activity.date === selectedDate)?.patientName}</p>
            <p><strong>Patient Number:</strong> {activities.find(activity => activity.date === selectedDate)?.patientNumber}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
