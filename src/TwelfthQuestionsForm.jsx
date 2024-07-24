import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const PATIENT_HISTORY_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const TwelfthQuestionsForm = () => {
  const [formData, setFormData] = useState({});
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  const questions = [
    "Muscle_weakness", "Tranquilizers", "Diuretics", "Diet_pills", "Marijuana", 
    "Hormones", "Sleeping_pills", "Aspirin", "Cocaine", "Pain_Killers", "Narcotics", 
    "Stimulants", "Hallucinogens", "Laxatives", "Cigarettes", "Tobacco_(specify)", 
    "Coffee", "Alcohol", "Birth_control_pills", "Vitamins", "Undereat", "Overeat", 
    "Eat_junk_foods", "Diarrhea", "Constipation", "Gas", "Indigestion", "Nausea", 
    "Vomiting", "Heartburn", "Dizziness", "Palpitations", "Fatigue", "Allergies", 
    "High_blood_pressure", "Chest_pain", "Shortness_of_breath", "Insomnia", 
    "Sleep_too_much", "Fitful_sleep", "Early_morning_awakening", "Earaches", 
    "Headaches", "Backaches", "Bruise_or_bleed_easily", "Weight_problems"
  ];

  const frequencies = ["Never", "Rarely", "Occasionally", "Frequently", "Daily"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const currentDate = new Date().toISOString();

    // Ensure all questions are answered
    if (Object.keys(formData).length < questions.length) {
      setError("Please answer all the questions.");
      setLoading(false);
      return;
    }

    const dataToSend = {
      userId: userId,
      pageNo: 12,
      questions: formData,
      date: currentDate
    };

    const dataStr = JSON.stringify(dataToSend);
    const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
    const encryptedData = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
      iv: CryptoJS.enc.Hex.parse(iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    }).toString();

    const payload = {
      iv: iv,
      ciphertext: encryptedData
    };

    try {
      const response = await fetch(PATIENT_HISTORY_URL, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.successful) {
        setSuccessful(result.message);
        setTimeout(() => setSuccessful(""), 5000);
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(`There was an error sending your data: ${error.message}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }

    // Clear form fields after submission (optional)
    setFormData({});
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Symptoms and Habits</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2"></th>
                  {frequencies.map((frequency) => (
                    <th key={frequency} className="border border-gray-300 px-4 py-2 text-center">
                      {frequency}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{question}</td>
                    {frequencies.map((frequency) => (
                      <td key={frequency} className="border border-gray-300 px-4 py-2 text-center">
                        <input
                          type="radio"
                          name={question}
                          value={frequency}
                          checked={formData[question] === frequency}
                          onChange={handleChange}
                          required
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Significant Childhood (or other) Memories:</h2>
          <textarea
            name="significantMemories"
            value={formData.significantMemories || ''}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
        {error && (
          <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
        )}
        {successful && (
          <div className="text-green-500 mt-2 text-sm text-center">{successful}</div>
        )}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Submit
        </button>
      </form>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-700"></div>
        </div>
      )}
    </div>
  );
};

export default TwelfthQuestionsForm;
