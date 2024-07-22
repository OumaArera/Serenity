import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const PATIENT_HISTORY_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const FourthQuestionsForm = () => {
  const [formData, setFormData] = useState({
    modalityAnalysis: {
      behaviors: {
        overEat: false,
        lossOfControl: false,
        phobicAvoidance: false,
        crying: false,
        takeDrugs: false,
        suicidalAttempts: false,
        spendTooMuchMoney: false,
        outburstsOfTemper: false,
        unassertive: false,
        compulsions: false,
        cantKeepAJob: false,
        oddBehavior: false,
        smoke: false,
        insomnia: false,
        others: '',
        drinkTooMuch: false,
        withdrawal: false,
        takeTooManyRisks: false,
        workTooHard: false,
        nervousTics: false,
        lazy: false,
        procrastination: false,
        concentrationDifficulties: false,
        eatingProblems: false,
        impulsiveReactions: false,
        sleepDisturbance: false,
        aggressiveBehavior: false,
      },
    },
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
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        modalityAnalysis: {
          ...formData.modalityAnalysis,
          behaviors: {
            ...formData.modalityAnalysis.behaviors,
            [name]: checked,
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        modalityAnalysis: {
          ...formData.modalityAnalysis,
          behaviors: {
            ...formData.modalityAnalysis.behaviors,
            [name]: value,
          },
        },
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const currentDate = new Date().toISOString();
    
    const dataToSend = {
      userId: userId,
      pageNo: 4,
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
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Modality Analysis of Current Problems</h2>
          <p className="mb-4">
            The following section is designed to help you describe your current problems in greater detail and to identify problems that might otherwise go unnoticed. This will enable us to design a comprehensive treatment program and tailor it to your specific needs. The following section is organized according to the seven modalities of Behaviors, Feelings, Physical Sensations, Images, Thoughts, Interpersonal Relationships, and Biological Factors.
          </p>
          <h3 className="text-lg font-semibold mb-2">Behaviors</h3>
          <label className="block mb-2">Check any of the following behaviors that often apply to you:</label>
          {['overEat', 'lossOfControl', 'phobicAvoidance', 'crying', 'takeDrugs', 'suicidalAttempts', 'spendTooMuchMoney', 'outburstsOfTemper', 'unassertive', 'compulsions', 'cantKeepAJob', 'oddBehavior', 'smoke', 'insomnia', 'drinkTooMuch', 'withdrawal', 'takeTooManyRisks', 'workTooHard', 'nervousTics', 'lazy', 'procrastination', 'concentrationDifficulties', 'eatingProblems', 'impulsiveReactions', 'sleepDisturbance', 'aggressiveBehavior'].map((behavior) => (
            <div key={behavior} className="mb-2">
              <input
                type="checkbox"
                name={behavior}
                checked={formData.modalityAnalysis.behaviors[behavior]}
                onChange={handleChange}
                className="mr-2"
              />
              <label>{behavior.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
            </div>
          ))}
          <label className="block mb-2">Others</label>
          <input
            type="text"
            name="others"
            value={formData.modalityAnalysis.behaviors.others}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>
        {error && (
          <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
        )}
        {successful && (
          <div className="text-green-500 mt-2 text-sm text-center">{successful}</div>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
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

export default FourthQuestionsForm;
