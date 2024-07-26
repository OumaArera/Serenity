import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const FAMILY_PROBLEM_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const FamilyAndProblem = () => {
  const [data, setData] = useState({
    children: [],
    mood: "",
    moodExplanation: "",
    drugs: [],
    significantEvents: "",
    problems: "",
    problemStart: "",
    managementMethods: "",
    worseningFactors: "",
    therapyExpectations: "",
    therapyDuration: ""
  });
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
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddChild = () => {
    setData((prevData) => ({
      ...prevData,
      children: [...prevData.children, { name: "", age: "", hasProblem: false, problem: "" }]
    }));
  };

  const handleChildChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const children = [...data.children];
    children[index][name] = type === "checkbox" ? checked : value;
    setData((prevData) => ({
      ...prevData,
      children
    }));
  };

  const handleAddDrug = () => {
    setData((prevData) => ({
      ...prevData,
      drugs: [...prevData.drugs, { name: "", start: "", stop: "", amount: "", means: "", reason: "" }]
    }));
  };

  const handleDrugChange = (index, e) => {
    const { name, value } = e.target;
    const drugs = [...data.drugs];
    drugs[index][name] = value;
    setData((prevData) => ({
      ...prevData,
      drugs
    }));
  };

  const handleSubmit = async () => {
    if (!token || !userId) return;
    setLoading(true);
    const currentDate = new Date().toISOString();

    const dataToSend = {
      userId: userId,
      pageNo: 5,
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
      const response = await fetch(FAMILY_PROBLEM_URL, {
          method: "POST",
          headers:{
              "Authorization": `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
      });
      const result = await response.json()

      if (result.successful){
          setSuccessful(result.message);
          setData({
            children: [],
            mood: "",
            moodExplanation: "",
            drugs: [],
            significantEvents: "",
            problems: "",
            problemStart: "",
            managementMethods: "",
            worseningFactors: "",
            therapyExpectations: "",
            therapyDuration: ""
          });
          setTimeout(() => setSuccessful(""), 5000);
          // setTimeout(() => navigate('/nextPage'), 5000) 
      }else{
          setError(result.message);
          setTimeout(()=>setError(""), 5000);
      }
      
    } catch (error) {
      setError(`There was an error sending your request ${error}`);
      setTimeout(()=>setError(""), 5000);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">What the problem is</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Do you have children?</label>
          <button onClick={handleAddChild} className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2">Add Child</button>
          {data.children.map((child, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                name="name"
                placeholder="Child's Name"
                value={child.name}
                onChange={(e) => handleChildChange(index, e)}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
              />
              <input
                type="number"
                name="age"
                placeholder="Child's Age"
                value={child.age}
                onChange={(e) => handleChildChange(index, e)}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
              />
              <label className="block text-sm font-medium text-gray-700 mb-2">Does this child have any problems?</label>
              <input
                type="checkbox"
                name="hasProblem"
                checked={child.hasProblem}
                onChange={(e) => handleChildChange(index, e)}
                className="block border-gray-300 rounded-md shadow-sm p-2 mb-2"
              />
              {child.hasProblem && (
                <textarea
                  name="problem"
                  placeholder="Describe the problem"
                  value={child.problem}
                  onChange={(e) => handleChildChange(index, e)}
                  className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mood (1-10)</label>
          <input
            type="number"
            name="mood"
            placeholder="5"
            value={data.mood}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
          />
          <textarea
            name="moodExplanation"
            placeholder="Explain why you chose this number"
            value={data.moodExplanation}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Drug Use and Abuse</label>
          <button onClick={handleAddDrug} className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2">Add Drug</button>
          {data.drugs.map((drug, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                name="name"
                placeholder="Drug Name"
                value={drug.name}
                onChange={(e) => handleDrugChange(index, e)}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
              />
              <input
                type="text"
                name="start"
                placeholder="When you started"
                value={drug.start}
                onChange={(e) => handleDrugChange(index, e)}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
              />
              <input
                type="text"
                name="stop"
                placeholder="When you stopped"
                value={drug.stop}
                onChange={(e) => handleDrugChange(index, e)}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
              />
              <input
                type="text"
                name="amount"
                placeholder="Amount"
                value={drug.amount}
                onChange={(e) => handleDrugChange(index, e)}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
              />
              <input
                type="text"
                name="means"
                placeholder="Means"
                value={drug.means}
                onChange={(e) => handleDrugChange(index, e)}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
              />
              <textarea
                name="reason"
                placeholder="Reason for use"
                value={drug.reason}
                onChange={(e) => handleDrugChange(index, e)}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
                </div>
                ))}
            
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Significant Life Events</label>
                <textarea
                    name="significantEvents"
                    placeholder="Describe any significant life events"
                    value={data.significantEvents}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe your problem</label>
                <textarea
                    name="problems"
                    placeholder="Describe your problems"
                    value={data.problems}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
                <label className="block text-sm font-medium text-gray-700 mb-2">When did it start?</label>
                <input
                    type="text"
                    name="problemStart"
                    placeholder="When did they start?"
                    value={data.problemStart}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
                />
                <label className="block text-sm font-medium text-gray-700 mb-2">What have you used to manage it?</label>
                <textarea
                    name="managementMethods"
                    placeholder="What have you used to manage them?"
                    value={data.managementMethods}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
                />
                <label className="block text-sm font-medium text-gray-700 mb-2">What seems to be worsening it?</label>
                <textarea
                    name="worseningFactors"
                    placeholder="What seems to be worsening them?"
                    value={data.worseningFactors}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
                />
                <label className="block text-sm font-medium text-gray-700 mb-2">What are your expectations of the therapy?</label>
                <textarea
                    name="therapyExpectations"
                    placeholder="What are your expectations of therapy?"
                    value={data.therapyExpectations}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2"
                />
                <input
                    type="text"
                    name="therapyDuration"
                    placeholder="How long do you think therapy should take?"
                    value={data.therapyDuration}
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

                <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded-md shadow-md"
                >
                {loading ? "Submitting..." : "Submit"}
                </button>

                {error && <div className="text-red-500 mt-4">{error}</div>}
                {successful && <div className="text-green-500 mt-4">{successful}</div>}
            </div>
    </div>
);
};

export default FamilyAndProblem;
