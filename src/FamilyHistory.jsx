import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const FAMILY_HISTORY_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const FamilyHistory = () => {
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
    const { name, value, type, checked } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!token || !userId) return;
    setLoading(true);
    const currentDate = new Date().toISOString();

    const dataToSend = {
      userId: userId,
      pageNo: 2,
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
        const response = await fetch(FAMILY_HISTORY_URL, {
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
        <h2 className="text-2xl font-bold mb-4">Family History</h2>
        {/* Father's Information */}
        <div className="mb-4">
          <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
          <input
            type="text"
            name="fatherName"
            placeholder="John Doe Sr."
            value={data.fatherName || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fatherAlive" className="block text-sm font-medium text-gray-700 mb-2">Is your father alive?</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="fatherAlive"
                value="yes"
                checked={data.fatherAlive === "yes"}
                onChange={handleChange}
                className="mr-2"
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="fatherAlive"
                value="no"
                checked={data.fatherAlive === "no"}
                onChange={handleChange}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>
        {data.fatherAlive === "yes" && (
          <>
            <div className="mb-4">
              <label htmlFor="fatherAge" className="block text-sm font-medium text-gray-700 mb-2">Father's Age</label>
              <input
                type="number"
                name="fatherAge"
                value={data.fatherAge || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fatherOccupation" className="block text-sm font-medium text-gray-700 mb-2">Father's Occupation</label>
              <input
                type="text"
                name="fatherOccupation"
                value={data.fatherOccupation || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fatherPersonality" className="block text-sm font-medium text-gray-700 mb-2">Father's Personality</label>
              <input
                type="text"
                name="fatherPersonality"
                value={data.fatherPersonality || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fatherHealth" className="block text-sm font-medium text-gray-700 mb-2">Father's Health</label>
              <input
                type="text"
                name="fatherHealth"
                value={data.fatherHealth || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </>
        )}
        {data.fatherAlive === "no" && (
          <>
            <div className="mb-4">
              <label htmlFor="fatherCauseOfDeath" className="block text-sm font-medium text-gray-700 mb-2">Cause of Death</label>
              <input
                type="text"
                name="fatherCauseOfDeath"
                value={data.fatherCauseOfDeath || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fatherPersonality" className="block text-sm font-medium text-gray-700 mb-2">Father's Personality</label>
              <input
                type="text"
                name="fatherPersonality"
                value={data.fatherPersonality || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fatherOccupation" className="block text-sm font-medium text-gray-700 mb-2">Father's Occupation</label>
              <input
                type="text"
                name="fatherOccupation"
                value={data.fatherOccupation || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ageOfUserWhenFatherDied" className="block text-sm font-medium text-gray-700 mb-2">Your Age When Father Died</label>
              <input
                type="number"
                name="ageOfUserWhenFatherDied"
                value={data.ageOfUserWhenFatherDied || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ageOfFatherWhenDied" className="block text-sm font-medium text-gray-700 mb-2">Father's Age When He Died</label>
              <input
                type="number"
                name="ageOfFatherWhenDied"
                value={data.ageOfFatherWhenDied || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="feltLovedByFather" className="block text-sm font-medium text-gray-700 mb-2">Did You Feel Loved by Your Father?</label>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    name="feltLovedByFather"
                    value="yes"
                    checked={data.feltLovedByFather === "yes"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="feltLovedByFather"
                    value="no"
                    checked={data.feltLovedByFather === "no"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="relationshipWithFather" className="block text-sm font-medium text-gray-700 mb-2">Your Relationship with Father</label>
              <input
                type="text"
                name="relationshipWithFather"
                value={data.relationshipWithFather || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </>
        )}
        {/* Mother's Information */}
        <div className="mb-4">
          <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
          <input
            type="text"
            name="motherName"
            placeholder="Jane Doe"
            value={data.motherName || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="motherAlive" className="block text-sm font-medium text-gray-700 mb-2">Is your mother alive?</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="motherAlive"
                value="yes"
                checked={data.motherAlive === "yes"}
                onChange={handleChange}
                className="mr-2"
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="motherAlive"
                value="no"
                checked={data.motherAlive === "no"}
                onChange={handleChange}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>
        {data.motherAlive === "yes" && (
          <>
            <div className="mb-4">
              <label htmlFor="motherAge" className="block text-sm font-medium text-gray-700 mb-2">Mother's Age</label>
              <input
                type="number"
                name="motherAge"
                value={data.motherAge || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="motherOccupation" className="block text-sm font-medium text-gray-700 mb-2">Mother's Occupation</label>
              <input
                type="text"
                name="motherOccupation"
                value={data.motherOccupation || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="motherPersonality" className="block text-sm font-medium text-gray-700 mb-2">Mother's Personality</label>
              <input
                type="text"
                name="motherPersonality"
                value={data.motherPersonality || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="motherHealth" className="block text-sm font-medium text-gray-700 mb-2">Mother's Health</label>
              <input
                type="text"
                name="motherHealth"
                value={data.motherHealth || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </>
        )}
        {data.motherAlive === "no" && (
          <>
            <div className="mb-4">
              <label htmlFor="motherCauseOfDeath" className="block text-sm font-medium text-gray-700 mb-2">Cause of Death</label>
              <input
                type="text"
                name="motherCauseOfDeath"
                value={data.motherCauseOfDeath || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="motherPersonality" className="block text-sm font-medium text-gray-700 mb-2">Mother's Personality</label>
              <input
                type="text"
                name="motherPersonality"
                value={data.motherPersonality || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="motherOccupation" className="block text-sm font-medium text-gray-700 mb-2">Mother's Occupation</label>
              <input
                type="text"
                name="motherOccupation"
                value={data.motherOccupation || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ageOfUserWhenMotherDied" className="block text-sm font-medium text-gray-700 mb-2">Your Age When Mother Died</label>
              <input
                type="number"
                name="ageOfUserWhenMotherDied"
                value={data.ageOfUserWhenMotherDied || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ageOfMotherWhenDied" className="block text-sm font-medium text-gray-700 mb-2">Mother's Age When She Died</label>
              <input
                type="number"
                name="ageOfMotherWhenDied"
                value={data.ageOfMotherWhenDied || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="feltLovedByMother" className="block text-sm font-medium text-gray-700 mb-2">Did You Feel Loved by Your Mother?</label>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    name="feltLovedByMother"
                    value="yes"
                    checked={data.feltLovedByMother === "yes"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="feltLovedByMother"
                    value="no"
                    checked={data.feltLovedByMother === "no"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="relationshipWithMother" className="block text-sm font-medium text-gray-700 mb-2">Your Relationship with Mother</label>
              <input
                type="text"
                name="relationshipWithMother"
                value={data.relationshipWithMother || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </>
        )}
        {/* Siblings Information */}
        <div className="mb-4">
          <label htmlFor="hasSiblings" className="block text-sm font-medium text-gray-700 mb-2">Do you have siblings?</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="hasSiblings"
                value="yes"
                checked={data.hasSiblings === "yes"}
                onChange={handleChange}
                className="mr-2"
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="hasSiblings"
                value="no"
                checked={data.hasSiblings === "no"}
                onChange={handleChange}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>
        {data.hasSiblings === "yes" && (
          <>
            <div className="mb-4">
              <label htmlFor="brothersAgeRanges" className="block text-sm font-medium text-gray-700 mb-2">Brothers' Age Ranges</label>
              <input
                type="text"
                name="brothersAgeRanges"
                placeholder="e.g., 10-20, 20-30"
                value={data.brothersAgeRanges || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="sistersAgeRanges" className="block text-sm font-medium text-gray-700 mb-2">Sisters' Age Ranges</label>
              <input
                type="text"
                name="sistersAgeRanges"
                placeholder="e.g., 10-20, 20-30"
                value={data.sistersAgeRanges || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </>
        )}
        {/* Additional Information */}
        <div className="mb-4">
          <label htmlFor="raisedByStepParents" className="block text-sm font-medium text-gray-700 mb-2">Were you raised by step-parents?</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="raisedByStepParents"
                value="yes"
                checked={data.raisedByStepParents === "yes"}
                onChange={handleChange}
                className="mr-2"
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="raisedByStepParents"
                value="no"
                checked={data.raisedByStepParents === "no"}
                onChange={handleChange}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="relationshipWithParents" className="block text-sm font-medium text-gray-700 mb-2">Describe your relationship with parents</label>
          <textarea
            name="relationshipWithParents"
            value={data.relationshipWithParents || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="parentsDivorced" className="block text-sm font-medium text-gray-700 mb-2">Did your parents divorce or live together?</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="parentsDivorced"
                value="divorced"
                checked={data.parentsDivorced === "divorced"}
                onChange={handleChange}
                className="mr-2"
              />
              Divorced
            </label>
            <label>
              <input
                type="radio"
                name="parentsDivorced"
                value="together"
                checked={data.parentsDivorced === "together"}
                onChange={handleChange}
                className="mr-2"
              />
              Together
            </label>
          </div>
        </div>
        {data.parentsDivorced === "divorced" && (
          <div className="mb-4">
            <label htmlFor="ageWhenDivorced" className="block text-sm font-medium text-gray-700 mb-2">Your Age When Parents Divorced</label>
            <input
              type="number"
              name="ageWhenDivorced"
              value={data.ageWhenDivorced || ""}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
            <div className="mb-4">
              <label htmlFor="lifeDuringDivorce" className="block text-sm font-medium text-gray-700 mb-2">Describe how life was during the divorce compared to before</label>
              <textarea
                name="lifeDuringDivorce"
                value={data.lifeDuringDivorce || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              ></textarea>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="relevantInfoAboutSiblings" className="block text-sm font-medium text-gray-700 mb-2">Any relevant information about siblings</label>
          <textarea
            name="relevantInfoAboutSiblings"
            value={data.relevantInfoAboutSiblings || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="homeEnvironment" className="block text-sm font-medium text-gray-700 mb-2">Describe the home environment</label>
          <textarea
            name="homeEnvironment"
            value={data.homeEnvironment || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="feltLovedAtHome" className="block text-sm font-medium text-gray-700 mb-2">Did you feel loved at home?</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="feltLovedAtHome"
                value="yes"
                checked={data.feltLovedAtHome === "yes"}
                onChange={handleChange}
                className="mr-2"
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="feltLovedAtHome"
                value="no"
                checked={data.feltLovedAtHome === "no"}
                onChange={handleChange}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">Any additional relevant information</label>
          <textarea
            name="additionalInfo"
            value={data.additionalInfo || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="approval" className="block text-sm font-medium text-gray-700 mb-2">I hereby authorize Insight Wellbeing P/L to internally use, and/or share my personal data with external agencies to help manage identified risks, and issues as discussed in sessions.</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="checkbox"
                name="approval"
                checked={approval}
                onChange={() => setApproval(!approval)}
                className="mr-2"
              />
              Yes
            </label>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className={`w-full bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 rounded-md ${loading && "opacity-50 cursor-not-allowed"}`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {successful && <p className="text-green-500 mt-2">{successful}</p>}
      </div>
    </div>
  );
};

export default FamilyHistory
