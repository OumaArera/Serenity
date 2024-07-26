import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const PERSONAL_AND_FAMILY_HEALTH_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const PersonalAndFamilyHealth = () => {
  const [data, setData] = useState({});
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState("");
  const [loading, setLoading] = useState(false);
  const [approval, setApproval] = useState(false);

  // const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!token || !userId) return;
    setLoading(true);
    const currentDate = new Date().toISOString();

    const dataToSend = {
      userId: userId,
      pageNo: 3,
      questions: data,
      date: currentDate,
      approval: approval
    };
    Object.entries(dataToSend).forEach(([key, value]) => console.log(`${key} : ${JSON.stringify(value)}`));

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
      const response = await fetch(PERSONAL_AND_FAMILY_HEALTH_URL, {
        method: "POST",
        headers:{
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.successful){
        setSuccessful(result.message);
        setData({});
        setApproval(false);
        setTimeout(() => setSuccessful(""), 5000);
        // setTimeout(() => navigate('/next-step'), 5000);
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
      
    } catch (error) {
      setError(`There was an error sending your request ${error}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Personal and Family Health</h2>
        <div className="mb-4">
          <label htmlFor="healthConcerns" className="block text-sm font-medium text-gray-700 mb-2">Are you concerned about your health?</label>
          <textarea
            name="healthConcerns"
            placeholder="Explain your health concerns"
            value={data.healthConcerns || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="surgicalHistory" className="block text-sm font-medium text-gray-700 mb-2">Have you ever undergone any surgery?</label>
          <textarea
            name="surgicalHistory"
            placeholder="Explain your surgical history"
            value={data.surgicalHistory || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="otherHealthConcerns" className="block text-sm font-medium text-gray-700 mb-2">Any other health concerns?</label>
          <textarea
            name="otherHealthConcerns"
            placeholder="Explain any other health concerns"
            value={data.otherHealthConcerns || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="familyHealthProblems" className="block text-sm font-medium text-gray-700 mb-2">Does any member of your family have health problems?</label>
          <textarea
            name="familyHealthProblems"
            placeholder="Explain your family health problems"
            value={data.familyHealthProblems || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="familySuicide" className="block text-sm font-medium text-gray-700 mb-2">Has anyone in your family committed suicide or been suicidal?</label>
          <textarea
            name="familySuicide"
            placeholder="Explain any family experiences with suicide"
            value={data.familySuicide || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="selfSuicide" className="block text-sm font-medium text-gray-700 mb-2">Have you considered suicide or been suicidal?</label>
          <textarea
            name="selfSuicide"
            placeholder="Explain your experiences with suicide"
            value={data.selfSuicide || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="anxiety" className="block text-sm font-medium text-gray-700 mb-2">Do you experience anxiety?</label>
          <textarea
            name="anxiety"
            placeholder="Explain your experiences with anxiety"
            value={data.anxiety || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="depression" className="block text-sm font-medium text-gray-700 mb-2">Do you experience depression?</label>
          <textarea
            name="depression"
            placeholder="Explain your experiences with depression"
            value={data.depression || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="psychosis" className="block text-sm font-medium text-gray-700 mb-2">Do you experience psychosis?</label>
          <textarea
            name="psychosis"
            placeholder="Explain your experiences with psychosis"
            value={data.psychosis || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="accidentsAndScars" className="block text-sm font-medium text-gray-700 mb-2">Have you or your family had any accidents or scars?</label>
          <textarea
            name="accidentsAndScars"
            placeholder="Explain any accidents or scars"
            value={data.accidentsAndScars || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="selfHarm" className="block text-sm font-medium text-gray-700 mb-2">Do you sometimes consider harming others or yourself?</label>
          <textarea
            name="selfHarm"
            placeholder="Explain if you sometimes consider harming others or yourself"
            value={data.selfHarm || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="otherFamilyHealthData" className="block text-sm font-medium text-gray-700 mb-2">Any other data about family health?</label>
          <textarea
            name="otherFamilyHealthData"
            placeholder="Provide any other data about family health"
            value={data.otherFamilyHealthData || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="approval" className="block text-sm font-medium text-gray-700 mb-2">I hereby authorize Insight Wellbeing P/L to internally use, and/or share my personal data with external agencies to help manage identified risks, and issues as discussed in sessions.</label>
          <input
            type="checkbox"
            name="approval"
            checked={approval}
            onChange={() => setApproval(!approval)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {successful && <p className="text-green-500 mt-4">{successful}</p>}
      </div>
    </div>
  );
};

export default PersonalAndFamilyHealth;
