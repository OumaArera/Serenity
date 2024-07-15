import React, { useState } from 'react';
import FirstQuestionsForm from './FirstQuestionsForm';
import SecondQuestionsForm from './SecondQuestionsForm';
import ThirdQuestionsForm from './ThirdQuestionsForm';
import FourthQuestionsForm from './FourthQuestionsForm';
import FifthQuestionsForm from './FifthQuestionsForm';
import SixthQuestionsForm from './SixthQuestionsForm';
import SeventhQuestionsForm from './SeventhQuestionsForm';
import EighthQuestionsForm from './EighthQuestionsForm';
import NinthQuestionsForm from './NinthQuestionsForm';
import TenthQuestionsForm from './TenthQuestionsForm';
import EleventhQuestionsForm from './EleventhQuestionsForm';
import TwelfthQuestionsForm from './TwelfthQuestionsForm';

const PATIENTS_HISTORY_URL = "https://insight-backend-8sg2.onrender.com/users/patient-history"

const HistoryComponent = () => {
  const [currentFormIndex, setCurrentFormIndex] = useState(0);

  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  const forms = [
    <FirstQuestionsForm onContinue={handleContinue} />,
    <SecondQuestionsForm onContinue={handleContinue} />,
    <ThirdQuestionsForm onContinue={handleContinue} />,
    <FourthQuestionsForm onContinue={handleContinue} />,
    <FifthQuestionsForm onContinue={handleContinue} />,
    <SixthQuestionsForm onContinue={handleContinue} />,
    <SeventhQuestionsForm onContinue={handleContinue} />,
    <EighthQuestionsForm onContinue={handleContinue} />,
    <NinthQuestionsForm onContinue={handleContinue} />,
    <TenthQuestionsForm onContinue={handleContinue} />,
    <EleventhQuestionsForm onContinue={handleContinue} />,
    <TwelfthQuestionsForm onContinue={handleContinue} />
  ];

  function handleContinue() {
    if (currentFormIndex < forms.length - 1) {
      setCurrentFormIndex(currentFormIndex + 1);
    }
  }

  const getUserHistory = async () =>{
    try {
      const response = await fetch(PATIENTS_HISTORY_URL, {
        method: "GET",
        headers:{
          headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      })
      
    } catch (error) {
      
    }

  }

  return (
    <div className="history-component">
      {forms[currentFormIndex]}
      {currentFormIndex === 0 && (
        <div>
          <p>This page is used to enter medical history information.</p>
          <button onClick={handleContinue} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg">
            Continue
          </button>
        </div>
      )}
      {currentFormIndex !== 0 && (
        <button onClick={handleContinue} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg mt-4">
          Continue
        </button>
      )}
    </div>
  );
};

export default HistoryComponent;
