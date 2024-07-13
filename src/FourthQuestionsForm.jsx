import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

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

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userData = localStorage.getItem("userId");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    
    const dataToSend = {
      userId: userId,
      pageNo: 4,
      questions: formData
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToSend),
      secretKey
    ).toString();

    const payload = {
      data: encryptedData
    }
    

    // Print collected data
    console.log("Collected Data:");
    Object.entries(dataToSend).forEach(([key, value]) => {
      console.log(`${key}: ${JSON.stringify(value, null, 2)}`);
    });

    console.log("Encrypted Data:");
    Object.entries(payload).forEach(([key, value]) => console.log(`${key} : ${value}`));

    fetch('/users/history/first', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FourthQuestionsForm;
