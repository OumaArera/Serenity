import React, { useState, useEffect, useMemo } from 'react';
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
import CryptoJS from 'crypto-js';

const PATIENTS_HISTORY_URL = "https://insight-backend-g7dg.onrender.com/users/history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const HistoryComponent = () => {
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allFormsCompleted, setAllFormsCompleted] = useState(false);
  const [gameMessage, setGameMessage] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  useEffect(() => {
    const getUserHistory = async () => {
      if (!token || !userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${PATIENTS_HISTORY_URL}/${userId}`, {
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
          setHistoryData(userData);
        } else {
          // setError("Failed to fetch user history.");
        }
      } catch (error) {
        setError("Failed to fetch user history.");
      } finally {
        setLoading(false);
      }
    };

    getUserHistory();
  }, [token, userId]);

  const handleContinue = () => {
    if (currentFormIndex < forms.length - 1) {
      setCurrentFormIndex(currentFormIndex + 1);
    } else {
      setAllFormsCompleted(true);
    }
  };

  const handlePlay = () => {
    setGameMessage("Welcome to the game of life");
  };

  const forms = useMemo(() => [
    { component: <FirstQuestionsForm onContinue={handleContinue} />, pageNo: 1 },
    { component: <SecondQuestionsForm onContinue={handleContinue} />, pageNo: 2 },
    { component: <ThirdQuestionsForm onContinue={handleContinue} />, pageNo: 3 },
    { component: <FourthQuestionsForm onContinue={handleContinue} />, pageNo: 4 },
    { component: <FifthQuestionsForm onContinue={handleContinue} />, pageNo: 5 },
    { component: <SixthQuestionsForm onContinue={handleContinue} />, pageNo: 6 },
    { component: <SeventhQuestionsForm onContinue={handleContinue} />, pageNo: 7 },
    { component: <EighthQuestionsForm onContinue={handleContinue} />, pageNo: 8 },
    { component: <NinthQuestionsForm onContinue={handleContinue} />, pageNo: 9 },
    { component: <TenthQuestionsForm onContinue={handleContinue} />, pageNo: 10 },
    { component: <EleventhQuestionsForm onContinue={handleContinue} />, pageNo: 11 },
    { component: <TwelfthQuestionsForm onContinue={handleContinue} />, pageNo: 12 }
  ], []);

  const renderForms = () => {
    if (loading) return <p>Loading...</p>;
    if (error) {
      return (
        <div>
          <p>{error}</p>
          <div className="history-component">
            {forms[currentFormIndex]?.component}
            <button onClick={handleContinue} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg mt-4">
              Continue
            </button>
          </div>
        </div>
      );
    }

    const filledPages = historyData ? historyData.map(hist => hist.page_no) : [];
    const formsToRender = historyData ? forms.filter(form => !filledPages.includes(form.pageNo)) : forms;

    if (allFormsCompleted || formsToRender.length === 0) {
      return (
        <div className="history-component">
          <button onClick={handlePlay} className="bg-green-700 hover:bg-green-400 text-white py-2 px-4 rounded-lg shadow-lg">
            Play
          </button>
          {gameMessage && <p className="mt-4">{gameMessage}</p>}
        </div>
      );
    }

    return (
      <div className="history-component">
        {formsToRender[currentFormIndex]?.component}
        <button onClick={handleContinue} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg mt-4">
          Continue
        </button>
      </div>
    );
  };

  return renderForms();
};

export default HistoryComponent;
