import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const PATIENT_HISTORY_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const EleventhQuestionsForm = () => {
  const [formData, setFormData] = useState({
    explainRejections: '',
    doerLevel: '',
    emotionalLevel: '',
    sensationsLevel: '',
    imageryLevel: '',
    thinkerPlannerLevel: '',
    friendshipsImportance: '',
    generalHealthLevel: '',
    healthConcerns: '',
    medications: '',
    balancedMeals: '',
    exerciseRegularly: '',
    exerciseDetails: '',
    healthConcernDetails:""
  });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked ? 'Yes' : 'No',
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const currentDate = new Date().toISOString();

    const dataToSend = {
      userId: userId,
      pageNo: 11,
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
      setError(`There was an error sending your data: Error: ${error}`);
      setTimeout(() => setError(""), 5000);
      
    }finally{
      setLoading(false);
    }

    // Clear form fields after submission (optional)
    setFormData({
      explainRejections: '',
      doerLevel: '',
      emotionalLevel: '',
      sensationsLevel: '',
      imageryLevel: '',
      thinkerPlannerLevel: '',
      friendshipsImportance: '',
      generalHealthLevel: '',
      healthConcerns: '',
      medications: '',
      balancedMeals: '',
      exerciseRegularly: '',
      exerciseDetails: '',
    });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">EXPLAIN REJECTIONS:</h2>
          <textarea
            name="explainRejections"
            value={formData.explainRejections}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Image 1</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Behaviors:</h3>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mb-2">
                <input
                  type="radio"
                  name="doerLevel"
                  value={num}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="mr-4">{num}</label>
              </div>
            ))}
          </div>

          {/* Other sections of the form omitted for brevity */}

        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Image 2</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Biological Factors:</h3>
            <div className="mb-2">
              <label className="block mb-2">
                Do you have any current concerns about your physical health?
              </label>
              <input
                type="checkbox"
                name="healthConcerns"
                checked={formData.healthConcerns === 'Yes'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">Yes</label>
              <input
                type="checkbox"
                name="healthConcerns"
                checked={formData.healthConcerns === 'No'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">No</label>
              {formData.healthConcerns === 'Yes' && (
                <textarea
                  name="healthConcernDetails"
                  value={formData.healthConcernDetails}
                  onChange={handleChange}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md mb-4"
                />
              )}
            </div>

            {/* Other sections of the form omitted for brevity */}

          </div>
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

export default EleventhQuestionsForm;
