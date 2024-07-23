import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const PATIENT_HISTORY_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const TenthQuestionsForm = () => {
  const [formData, setFormData] = useState({
    biologicalFactors: '',
    concernsAboutPhysicalHealth: '',
    physicalHealthConcernsExplanation: '',
    medicationCurrentlyTaking:"",
    balancedDiet:"",
    physicalExercise:"",
    frequencyOfPhysicalExercise:"",
    medicalConditions:"",
    anySurgeryDescription:"",
    anyPhysicalHandicaps:"",
    ageForFirstMenstrual:"",
    whetherInformed:"",
    wasItAShock:"",
    menstrualsRegular:"",
    menstrualduration:"",
    experienceMenstrualPain:"",
    mentrualsAffectMoods:"",
    dateOfLastPeriod:""
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const currentDate = new Date().toISOString();

    const dataToSend = {
      userId: userId,
      pageNo: 10,
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
          <h2 className="text-xl font-bold mb-2">BIOLOGICAL FACTORS:</h2>
          <label className="block mb-2">
            Are you healthy and health conscious? Do you avoid bad habits like smoking too much alcohol, drinking a lot of coffee, overeating, etc.? Do you exercise regularly, get enough sleep, avoid junk foods, and generally take care of your body?
          </label>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mr-2">
                <input
                  type="radio"
                  name="biologicalFactors"
                  value={num}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="mr-2">{num}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            Do you have any current concerns about your physical health?
          </label>
          <div className="flex mb-2">
            <input
              type="radio"
              name="concernsAboutPhysicalHealth"
              value="Yes"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="concernsAboutPhysicalHealth"
              value="No"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">No</label>
          </div>
          <label className="block mb-2">If Yes, please specify:</label>
          <textarea
            name="physicalHealthConcernsExplanation"
            value={formData.physicalHealthConcernsExplanation}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Please list any medications you're currently taking:</label>
          <textarea
            name="medicationCurrentlyTaking"
            value={formData.medicationCurrentlyTaking}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <div className="mb-4">
          <label className="block mb-2">
            Do you eat three well-balanced meals each day?
          </label>
          <div className="flex mb-2">
            <input
              type="radio"
              name="balancedDiet"
              value="Yes"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="balancedDiet"
              value="No"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">No</label>
          </div>
          <label className="block mb-2">
            Do you get regualr physical exercise?
          </label>
          <div className="flex mb-2">
            <input
              type="radio"
              name="physicalExercise"
              value="Yes"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="physicalExercise"
              value="No"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">No</label>
          </div>
          
          <label className="block mb-2">If Yes, what type and how often?</label>
          <textarea
            name="frequencyOfPhysicalExercise"
            value={formData.frequencyOfPhysicalExercise}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Please list any significant medical problems that apply to you or to members of your family</label>
          <textarea
            name="medicalConditions"
            value={formData.medicalConditions}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <h2 className="text-xl font-bold mb-2 italic">Menstrual History</h2>
          <label className="block mb-2">Age at first period:</label>
          <textarea
            name="ageForFirstMenstrual"
            value={formData.ageForFirstMenstrual}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">
            Were you informed about periods?
          </label>
          <div className="flex mb-2">
            <input
              type="radio"
              name="whetherInformed"
              value="Yes"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="whetherInformed"
              value="No"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">No</label>
          </div>
          <label className="block mb-2">
            Did it come as a shock?
          </label>
          <div className="flex mb-2">
            <input
              type="radio"
              name="wasItAShock"
              value="Yes"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="wasItAShock"
              value="No"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">No</label>
          </div>
          <label className="block mb-2">
            Are you regular?
          </label>
          <div className="flex mb-2">
            <input
              type="radio"
              name="menstrualsRegular"
              value="Yes"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="menstrualsRegular"
              value="No"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">No</label>
          </div>
          <label className="block mb-2">Duration:</label>
          <textarea
            name="menstrualduration"
            value={formData.menstrualduration}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">
            Do you have pain?
          </label>
          <div className="flex mb-2">
            <input
              type="radio"
              name="experienceMenstrualPain"
              value="Yes"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="experienceMenstrualPain"
              value="No"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">No</label>
          </div>
          <label className="block mb-2">
            Do your periods affect your moods?
          </label>
          <div className="flex mb-2">
            <input
              type="radio"
              name="mentrualsAffectMoods"
              value="Yes"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="mentrualsAffectMoods"
              value="No"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">No</label>
          </div>
          <label className="block mb-2">Date of last period:</label>
          <input
              type="date"
              name="dateOfLastPeriod"
              value="Yes"
              checked={formData.dateOfLastPeriod}
              onChange={handleChange}
              className="mr-2"
            />
          
        </div>
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

export default TenthQuestionsForm;
