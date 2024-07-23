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
    "Muscle weakness", "Tranquilizers", "Diuretics", "Diet pills", "Hormones", 
    "Sleeping pills", "Asprin", "Cocaine", "Pain Killers", "Narcotics", "Stimulants", 
    "Hallucinogens (e.g. LSD)", "Laxatives", "Cigarettes", "Tobacco (specify)", "Coffee", 
    "Alcohol", "Birth control pills", "Vitamins", "Undereat", "Overeat", "Eat junk foods",
    "Diarrhea", "Constipation", "Gas", "Indigestion", "Nausea", "Vomiting", "Heartburn", 
    "Dizziness", "Palpitations", "Fatigue", "Allergies", "High blood pressure", "Chest pain", 
    "Shortness of breath", "Insomnia", "Sleep too much", "Fitful sleep", "Early morning awakening", 
    "Earaches", "Headaches", "Backaches", "Bruise or bleed easily", "Weight problems"
  ];

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked ? 'Yes' : 'No',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const currentDate = new Date().toISOString();

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

    setFormData({});
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Symptoms and Habits</h2>
          <div className="grid grid-cols-2 gap-4">
            {questions.map((question, index) => (
              <div key={index}>
                <label className="block mb-2">{question}:</label>
                <input
                  type="checkbox"
                  name={question}
                  checked={formData[question] === 'Yes'}
                  onChange={handleChange}
                  className="mr-2"
                />
              </div>
            ))}
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
