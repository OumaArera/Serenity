import React, { useState, useEffect, useMemo } from 'react';

import History from "./History";
import FamilyHistory from "./FamilyHistory"
import FamilyAndProblem from './FamilyAndProblem';
import PersonalAndFamilyHealth from "./PersonalAndFamilyHealth"
import SexualAndRelationshipLife from './SexualAndRelationshipLife';

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
    { component: <History onContinue={handleContinue} />, pageNo: 1 },
    { component: <FamilyHistory onContinue={handleContinue} />, pageNo: 2 },
    { component: <PersonalAndFamilyHealth onContinue={handleContinue} />, pageNo: 3 },
    { component: <SexualAndRelationshipLife onContinue={handleContinue} />, pageNo: 4 },
    { component: <FamilyAndProblem onContinue={handleContinue} />, pageNo: 5 },
    
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
