import React, { useState, useEffect } from "react";
import CryptoJS from 'crypto-js';

const SEXUAL_AND_RELATIONSHIP_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const SexualAndRelationshipLife = () => {
  const [data, setData] = useState({});
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState("");
  const [loading, setLoading] = useState(false);
  const [approval, setApproval] = useState(false);

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
      pageNo: 4,
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
      const response = await fetch(SEXUAL_AND_RELATIONSHIP_URL, {
        method: "POST",
        headers:{
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.successful) {
        setSuccessful(result.message);
        setData({});
        setTimeout(() => setSuccessful(""), 5000);
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
        <h2 className="text-2xl font-bold mb-4">Sexual and Relationship Life</h2>
        <div className="mb-4">
          <label htmlFor="parentsPerception" className="block text-sm font-medium text-gray-700 mb-2">What was your parents' perception of sex and was it discussed at home?</label>
          <textarea
            name="parentsPerception"
            value={data.parentsPerception || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="discoveredSexualImpulses" className="block text-sm font-medium text-gray-700 mb-2">When and how did you first discover your sexual impulses?</label>
          <textarea
            name="discoveredSexualImpulses"
            value={data.discoveredSexualImpulses || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="anxietyOrGuilt" className="block text-sm font-medium text-gray-700 mb-2">Have you ever experienced anxiety or guilt arising out of sex or masturbation? If yes, please explain.</label>
          <textarea
            name="anxietyOrGuilt"
            value={data.anxietyOrGuilt || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="pastSexExperiences" className="block text-sm font-medium text-gray-700 mb-2">Please provide any other information about past sexual experiences, including relationships, and if they affect you.</label>
          <textarea
            name="pastSexExperiences"
            value={data.pastSexExperiences || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="makingFriends" className="block text-sm font-medium text-gray-700 mb-2">Do you easily make friends and retain them?</label>
          <textarea
            name="makingFriends"
            value={data.makingFriends || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="closeFriends" className="block text-sm font-medium text-gray-700 mb-2">Do you have close friends you can confide in?</label>
          <textarea
            name="closeFriends"
            value={data.closeFriends || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="relationshipWithFriends" className="block text-sm font-medium text-gray-700 mb-2">Please provide any other details about your relationships with friends.</label>
          <textarea
            name="relationshipWithFriends"
            value={data.relationshipWithFriends || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-2">What is your marital status?</label>
          <select
            name="maritalStatus"
            value={data.maritalStatus || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="" disabled>Select</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="engaged">Engaged</option>
            <option value="single">Single</option>
          </select>
        </div>
        {data.maritalStatus === "married" && (
          <>
            <div className="mb-4">
              <label htmlFor="spouseDetails" className="block text-sm font-medium text-gray-700 mb-2">Please provide details about your spouse including name, age, dating history, family of spouse, what you like and hate about your spouse, occupation, and personality.</label>
              <textarea
                name="spouseDetails"
                value={data.spouseDetails || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="feelLovedBySpouse" className="block text-sm font-medium text-gray-700 mb-2">Do you feel loved by your spouse?</label>
              <textarea
                name="feelLovedBySpouse"
                value={data.feelLovedBySpouse || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="marriageSatisfaction" className="block text-sm font-medium text-gray-700 mb-2">How satisfied are you with your marriage on a scale of 1-7 (1 being least and 7 being most)?</label>
              <input
                type="number"
                name="marriageSatisfaction"
                value={data.marriageSatisfaction || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
                min="1"
                max="7"
              />
            </div>
          </>
        )}
        {data.maritalStatus === "divorced" && (
          <div className="mb-4">
            <label htmlFor="divorceDetails" className="block text-sm font-medium text-gray-700 mb-2">Please provide details about your divorce, including the reason, feelings associated with it, and how you are coping.</label>
            <textarea
              name="divorceDetails"
              value={data.divorceDetails || ""}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        )}
        {data.maritalStatus === "engaged" && (
          <div className="mb-4">
            <label htmlFor="fianceDetails" className="block text-sm font-medium text-gray-700 mb-2">Please provide details about your fiancé/fiancée, including name, age, dating history, family of fiancé/fiancée, what you like and hate about them, occupation, and personality.</label>
            <textarea
              name="fianceDetails"
              value={data.fianceDetails || ""}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        )}
        {data.maritalStatus === "single" && (
          <div className="mb-4">
            <label htmlFor="singleDetails" className="block text-sm font-medium text-gray-700 mb-2">Please provide details about your single status, including if you are dating, your feelings about being single, and any other relevant information.</label>
            <textarea
              name="singleDetails"
              value={data.singleDetails || ""}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="otherDetails" className="block text-sm font-medium text-gray-700 mb-2">Please provide any other relevant details about your sexual and relationship life.</label>
          <textarea
            name="otherDetails"
            value={data.otherDetails || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="approval" className="block text-sm font-medium text-gray-700 mb-2">I hereby authorize Insight Wellbeing P/L to internally use, and/or share my personal data with external agencies to help manage identified risks, and issues as discussed in sessions.</label>
          <input
            type="checkbox"
            name="approval"
            checked={approval}
            onChange={(e) => setApproval(e.target.checked)}
            className="block border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          {loading ? (
            <button disabled className="w-full bg-blue-500 text-white py-2 px-4 rounded-md">Submitting...</button>
          ) : (
            <button onClick={handleSubmit} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md">Submit</button>
          )}
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {successful && <div className="text-green-500 text-center">{successful}</div>}
      </div>
    </div>
  );
};

export default SexualAndRelationshipLife;
