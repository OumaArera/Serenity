import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const PATIENT_HISTORY_URL = "https://insight-backend-8sg2.onrender.com/users/patient-history"
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const FirstQuestionsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    address: '',
    telephone: {
      day: '',
      evening: ''
    },
    age: '',
    occupation: '',
    sex: '',
    dateOfBirth: '',
    placeOfBirth: '',
    religion: '',
    height: '',
    weight: '',
    weightFluctuate: '',
    familyPhysician: '',
    physicianTelephone: '',
    referredBy: '',
    maritalStatus: '',
    maritalTimes: '',
    livingIn: '',
    livingWith: [],
    otherLiving: '',
    presentWork: '',
    workSatisfaction: '',
    workSatisfactionExplanation: '',
    pastJobs: '',
    therapyBefore: '',
    hospitalizedBefore: '',
    hospitalizationDetails: '',
    attemptedSuicide: '',
    familyEmotionalDisorder: '',
    familySuicide: ''
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

  const [approval, setApproval] = useState({
    internalUse: false,
    externalUse: false
  });

  const history = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        livingWith: checked ? [...formData.livingWith, name] : formData.livingWith.filter(item => item !== name)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const currentDate = new Date().toISOString();
    // Construct payload
    const dataToSend = {
      userId: userId,
      pageNo: 1,
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
        
        history.goBack(); 
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
    <div className="bg-white text-black p-4 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Patient Information Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <label className="block mb-4">
          Name:
          <input
            type="text"
            name="name"
            placeholder='Joe Doe'
            value={formData.name}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Date */}
        <label className="block mb-4">
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Address */}
        <label className="block mb-4">
          Address:
          <input
            type="text"
            name="address"
            placeholder='eg Goromonzi, Harare'
            value={formData.address}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Telephone numbers */}
        <div className="mb-4">
          <label className="block mb-2">Telephone numbers:</label>
          <div className="flex space-x-4">
            <label className="flex-1">
              Day:
              <input
                type="text"
                name="day"
                placeholder='263775483749'
                value={formData.telephone.day}
                onChange={(e) => setFormData({ ...formData, telephone: { ...formData.telephone, day: e.target.value } })}
                className="ml-2 p-2 rounded bg-white text-black"
                required
              />
            </label>
            <label className="flex-1">
              Evening:
              <input
                type="text"
                name="evening"
                placeholder='263775483749'
                value={formData.telephone.evening}
                onChange={(e) => setFormData({ ...formData, telephone: { ...formData.telephone, evening: e.target.value } })}
                className="ml-2 p-2 rounded bg-white text-black"
                
              />
            </label>
          </div>
        </div>
  
        {/* Age */}
        <label className="block mb-4">
          Age:
          <input
            type="number"
            name="age"
            placeholder='eg 24'
            value={formData.age}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Occupation */}
        <label className="block mb-4">
          Occupation:
          <input
            type="text"
            name="occupation"
            placeholder='eg Teacher'
            value={formData.occupation}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Sex */}
        <div className="mb-4">
          <label className="block mb-2">Sex:</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="sex"
                value="Male"
                checked={formData.sex === 'Male'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sex"
                value="Female"
                checked={formData.sex === 'Female'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Female
            </label>
          </div>
        </div>
  
        {/* Date of Birth */}
        <label className="block mb-4">
          Date of Birth:
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Place of Birth */}
        <label className="block mb-4">
          Place of Birth:
          <input
            type="text"
            name="placeOfBirth"
            placeholder='eg Goromonzi, Harare'
            value={formData.placeOfBirth}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Religion */}
        <label className="block mb-4">
          Religion:
          <input
            type="text"
            name="religion"
            placeholder='eg Christian, Muslim, Traditionalist'
            value={formData.religion}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Height */}
        <label className="block mb-4">
          Height:
          <input
            type="number"
            name="height"
            placeholder='Height in feet and inches'
            value={formData.height}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Weight */}
        <label className="block mb-4">
          Weight:
          <input
            type="number"
            name="weight"
            placeholder='Weight in Kilograms'
            value={formData.weight}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Does your weight fluctuate? */}
        <div className="mb-4">
          <label className="block mb-2">Does your weight fluctuate?</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="weightFluctuate"
                value="Yes"
                checked={formData.weightFluctuate === 'Yes'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="weightFluctuate"
                value="No"
                checked={formData.weightFluctuate === 'No'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              No
            </label>
            {formData.weightFluctuate === 'Yes' && (
              <input
                type="text"
                name="weightFluctuateAmount"
                value={formData.weightFluctuateAmount}
                onChange={handleChange}
                placeholder="By how much?"
                className="ml-2 p-2 rounded bg-white text-black"
                required
              />
            )}
          </div>
        </div>
  
        {/* Do you have a family physician? */}
        <div className="mb-4">
          <label className="block mb-2">Do you have a family physician?</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="familyPhysician"
                value="Yes"
                checked={formData.familyPhysician === 'Yes'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="familyPhysician"
                value="No"
                checked={formData.familyPhysician === 'No'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              No
            </label>
          </div>
        </div>
  
        {/* Name of family physician */}
        {formData.familyPhysician === 'Yes' && (
          <label className="block mb-4">
            Name of family physician:
            <input
              type="text"
              name="physicianName"
              placeholder='eg Lwanda Magere'
              value={formData.physicianName}
              onChange={handleChange}
              className="ml-2 p-2 rounded bg-white text-black"
              required
            />
          </label>
        )}
  
        {/* Telephone number */}
        {formData.familyPhysician === 'Yes' && (
          <label className="block mb-4">
            Telephone number:
            <input
              type="text"
              name="physicianTelephone"
              placeholder='+263775483749 or 0775483749'
              value={formData.physicianTelephone}
              onChange={handleChange}
              className="ml-2 p-2 rounded bg-white text-black"
              required
            />
          </label>
        )}
  
        {/* By whom were you referred? */}
        <label className="block mb-4">
          By whom were you referred?
          <input
            type="text"
            name="referredBy"
            placeholder='eg Ouma John'
            value={formData.referredBy}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Marital Status */}
        <div className="mb-4">
          <label className="block mb-2">Marital Status:</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="maritalStatus"
                value="Single"
                checked={formData.maritalStatus === 'Single'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Single
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="maritalStatus"
                value="Married"
                checked={formData.maritalStatus === 'Married'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Married
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="maritalStatus"
                value="Divorced"
                checked={formData.maritalStatus === 'Divorced'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Divorced
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="maritalStatus"
                value="Widowed"
                checked={formData.maritalStatus === 'Widowed'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Widowed
            </label>
          </div>
        </div>
  
        {/* Spouse Details */}
        {formData.maritalStatus === 'Married' && (
          <label className="block mb-4">
            Spouse's Name:
            <input
              type="text"
              name="spouseName"
              placeholder='eg Jane Doe'
              value={formData.spouseName}
              onChange={handleChange}
              className="ml-2 p-2 rounded bg-white text-black"
              required
            />
          </label>
        )}
        {formData.maritalStatus === 'Married' && (
          <label className="block mb-4">
            Spouse's Age:
            <input
              type="number"
              name="spouseAge"
              placeholder='Age in years'
              value={formData.spouseAge}
              onChange={handleChange}
              className="ml-2 p-2 rounded bg-white text-black"
              required
            />
          </label>
        )}
  
        {/* Spouse's Occupation */}
        {formData.maritalStatus === 'Married' && (
          <label className="block mb-4">
            Spouse's Occupation:
            <input
              type="text"
              placeholder='eg Chef'
              name="spouseOccupation"
              value={formData.spouseOccupation}
              onChange={handleChange}
              className="ml-2 p-2 rounded bg-white text-black"
              required
            />
          </label>
        )}
  
        {/* Number of children */}
        {formData.maritalStatus === 'Married' && (
          <label className="block mb-4">
            Number of children:
            <input
              type="number"
              name="numberOfChildren"
              placeholder='eg. 3'
              value={formData.numberOfChildren}
              onChange={handleChange}
              className="ml-2 p-2 rounded bg-white text-black"
              required
            />
          </label>
        )}
  
        {/* Person to contact in case of emergency */}
        <label className="block mb-4">
          Person to contact in case of emergency:
          <input
            type="text"
            name="emergencyContact"
            placeholder='eg Mercy Nyagoro'
            value={formData.emergencyContact}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Telephone number of emergency contact */}
        <label className="block mb-4">
          Telephone number of emergency contact:
          <input
            type="text"
            placeholder='+263775483749 or 0775483749'
            name="emergencyContactTelephone"
            value={formData.emergencyContactTelephone}
            onChange={handleChange}
            className="ml-2 p-2 rounded bg-white text-black"
            required
          />
        </label>
  
        {/* Hospitalization history */}
        <div className="mb-4">
          <label className="block mb-2">Have you ever been hospitalized before?</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="hospitalizedBefore"
                value="Yes"
                checked={formData.hospitalizedBefore === 'Yes'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="hospitalizedBefore"
                value="No"
                checked={formData.hospitalizedBefore === 'No'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              No
            </label>
          </div>
          {formData.hospitalizedBefore === 'Yes' && (
            <textarea
              name="hospitalizedDetails"
              value={formData.hospitalizedDetails}
              onChange={handleChange}
              placeholder="Please explain the details"
              className="w-full mt-1 p-2 border rounded bg-white text-black"
              rows="4"
              required
            />
          )}
        </div>
  
        {/* Family emotional disorder history */}
        <div className="mb-4">
          <label className="block mb-2">Is there any history of emotional disorder in your family?</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="familyEmotionalDisorder"
                value="Yes"
                checked={formData.familyEmotionalDisorder === 'Yes'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="familyEmotionalDisorder"
                value="No"
                checked={formData.familyEmotionalDisorder === 'No'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              No
            </label>
          </div>
          {formData.familyEmotionalDisorder === 'Yes' && (
            <textarea
              name="familyEmotionalDisorderDetails"
              value={formData.familyEmotionalDisorderDetails}
              onChange={handleChange}
              placeholder="Please explain the details"
              className="w-full mt-1 p-2 border rounded bg-white text-black"
              rows="4"
              required
            />
          )}
        </div>
  
        {/* Family suicide history */}
        <div className="mb-4">
          <label className="block mb-2">Is there any history of suicide in your family?</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="familySuicide"
                value="Yes"
                checked={formData.familySuicide === 'Yes'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="familySuicide"
                value="No"
                checked={formData.familySuicide === 'No'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              No
            </label>
          </div>
          {formData.familySuicide === 'Yes' && (
            <textarea
              name="familySuicideDetails"
              value={formData.familySuicideDetails}
              onChange={handleChange}
              placeholder="Please explain the details"
              className="w-full mt-1 p-2 border rounded bg-white text-black"
              rows="4"
              required
            />
          )}
        </div>
  
        {/* Approvals */}
        <div className="mb-4">
          <label className="block mb-2">Approvals:</label>
          <div className="flex flex-col space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="internalUse"
              required
              checked={approval.internalUse}
              onChange={() => setApproval({ ...approval, internalUse: !approval.internalUse })}
              className="mr-2"
            />
            I hereby authorize Insight Wellbeing P/L to exclusively use my personal data for the purposes of processing my medication, diagnosis, and other related medical treatments. I understand that this information will be handled in accordance with applicable privacy laws and regulations to ensure its confidentiality and security.
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="externalUse"
              checked={approval.externalUse}
              onChange={() => setApproval({ ...approval, externalUse: !approval.externalUse })}
              className="mr-2"
            />
            I hereby authorize Insight Wellbeing P/L to share my personal data with external entities for the purposes of processing my medication. I understand that this information will be handled in accordance with applicable privacy laws and regulations to ensure its confidentiality and security.
          </label>
        </div>

        </div>
        {error && (
          <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
        )}
        {successful && (
          <div className="text-green-500 mt-2 text-sm text-center">{successful}</div>
        )}
  
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
      </form>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-700"></div>
        </div>
      )}
    </div>
  );
  
};

export default FirstQuestionsForm;

