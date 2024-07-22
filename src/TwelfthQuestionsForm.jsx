import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const PATIENT_HISTORY_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const TwelfthQuestionsForm = () => {
  const [formData, setFormData] = useState({
    medicalProblems: '',
    surgeries: '',
    physicalHandicaps: '',
    ageAtFirstPeriod: '',
    informedAboutPeriod: '',
    shockedAboutPeriod: '',
    regularPeriods: '',
    periodDuration: '',
    periodPain: '',
    periodMoodEffects: '',
    lastPeriodDate: '',
    muscleWeakness: '',
    tranquilizersFrequency: '',
    diureticsFrequency: '',
    dietPillsFrequency: '',
    marijuanaFrequency: '',
    hormonesFrequency: '',
    sleepingPillsFrequency: '',
    aspirinFrequency: '',
    cocaineFrequency: '',
    painKillersFrequency: '',
    narcoticsFrequency: '',
    stimulantsFrequency: '',
    hallucinogensFrequency: '',
    laxativesFrequency: '',
    cigarettesFrequency: '',
    tobacco: '',
    coffeeFrequency: '',
    alcoholFrequency: '',
    birthControlPillsFrequency: '',
    vitaminsFrequency: '',
    undereatFrequency: '',
    overeatFrequency: '',
    eatJunkFoodsFrequency: '',
    diarrheaFrequency: '',
    constipationFrequency: '',
    gasFrequency: '',
    indigestionFrequency: '',
    nauseaFrequency: '',
    vomitingFrequency: '',
    heartburnFrequency: '',
    dizzinessFrequency: '',
    palpitationsFrequency: '',
    fatigueFrequency: '',
    allergiesFrequency: '',
    highBloodPressureFrequency: '',
    chestPainFrequency: '',
    shortnessOfBreathFrequency: '',
    insomniaFrequency: '',
    sleepTooMuchFrequency: '',
    fitfulSleepFrequency: '',
    earlyMorningAwakeningFrequency: '',
    earachesFrequency: '',
    headachesFrequency: '',
    backachesFrequency: '',
    bruiseBleedEasilyFrequency: '',
    weightProblemsFrequency: '',
    significantMemories: '',
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? value : '') : value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked ? 'Yes' : 'No',
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const currentDate = new Date().toISOString();

    const dataToSend = {
      userId: userId,
      pageNo: 12,
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

    // Clear form fields after submission (optional)
    setFormData({
      medicalProblems: '',
      surgeries: '',
      physicalHandicaps: '',
      ageAtFirstPeriod: '',
      informedAboutPeriod: '',
      shockedAboutPeriod: '',
      regularPeriods: '',
      periodDuration: '',
      periodPain: '',
      periodMoodEffects: '',
      lastPeriodDate: '',
      muscleWeakness: '',
      tranquilizersFrequency: '',
      diureticsFrequency: '',
      dietPillsFrequency: '',
      marijuanaFrequency: '',
      hormonesFrequency: '',
      sleepingPillsFrequency: '',
      aspirinFrequency: '',
      cocaineFrequency: '',
      painKillersFrequency: '',
      narcoticsFrequency: '',
      stimulantsFrequency: '',
      hallucinogensFrequency: '',
      laxativesFrequency: '',
      cigarettesFrequency: '',
      tobacco: '',
      coffeeFrequency: '',
      alcoholFrequency: '',
      birthControlPillsFrequency: '',
      vitaminsFrequency: '',
      undereatFrequency: '',
      overeatFrequency: '',
      eatJunkFoodsFrequency: '',
      diarrheaFrequency: '',
      constipationFrequency: '',
      gasFrequency: '',
      indigestionFrequency: '',
      nauseaFrequency: '',
      vomitingFrequency: '',
      heartburnFrequency: '',
      dizzinessFrequency: '',
      palpitationsFrequency: '',
      fatigueFrequency: '',
      allergiesFrequency: '',
      highBloodPressureFrequency: '',
      chestPainFrequency: '',
      shortnessOfBreathFrequency: '',
      insomniaFrequency: '',
      sleepTooMuchFrequency: '',
      fitfulSleepFrequency: '',
      earlyMorningAwakeningFrequency: '',
      earachesFrequency: '',
      headachesFrequency: '',
      backachesFrequency: '',
      bruiseBleedEasilyFrequency: '',
      weightProblemsFrequency: '',
      significantMemories: '',
    });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Significant Medical Problems:</h2>
          <textarea
            name="medicalProblems"
            value={formData.medicalProblems}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Surgeries Description:</h2>
          <textarea
            name="surgeries"
            value={formData.surgeries}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Physical Handicaps:</h2>
          <textarea
            name="physicalHandicaps"
            value={formData.physicalHandicaps}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Menstrual History:</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Age at first period:</label>
              <input
                type="number"
                name="ageAtFirstPeriod"
                value={formData.ageAtFirstPeriod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              />
            </div>
            <div>
              <label className="block mb-2">Were you informed?</label>
              <input
                type="checkbox"
                name="informedAboutPeriod"
                value="Yes"
                checked={formData.informedAboutPeriod === 'Yes'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">Yes</label>
              <input
                type="checkbox"
                name="informedAboutPeriod"
                value="No"
                checked={formData.informedAboutPeriod === 'No'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">No</label>
            </div>
            <div>
              <label className="block mb-2">Did it come as a shock?</label>
              <input
                type="checkbox"
                name="shockedAboutPeriod"
                value="Yes"
                checked={formData.shockedAboutPeriod === 'Yes'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">Yes</label>
              <input
                type="checkbox"
                name="shockedAboutPeriod"
                value="No"
                checked={formData.shockedAboutPeriod === 'No'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">No</label>
            </div>
            <div>
              <label className="block mb-2">Are you regular?</label>
              <input
                type="checkbox"
                name="regularPeriods"
                value="Yes"
                checked={formData.regularPeriods === 'Yes'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">Yes</label>
              <input
                type="checkbox"
                name="regularPeriods"
                value="No"
                checked={formData.regularPeriods === 'No'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">No</label>
              {formData.regularPeriods === 'Yes' && (
                <>
                  <label className="block mb-2">Duration (days):</label>
                  <input
                    type="number"
                    name="periodDuration"
                    value={formData.periodDuration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  />
                </>
              )}
            </div>
            <div>
              <label className="block mb-2">Do you have pain?</label>
              <input
                type="checkbox"
                name="periodPain"
                value="Yes"
                checked={formData.periodPain === 'Yes'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">Yes</label>
              <input
                type="checkbox"
                name="periodPain"
                value="No"
                checked={formData.periodPain === 'No'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">No</label>
            </div>
            <div>
              <label className="block mb-2">Do your periods affect your moods?</label>
              <input
                type="checkbox"
                name="periodMoodEffects"
                value="Yes"
                checked={formData.periodMoodEffects === 'Yes'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">Yes</label>
              <input
                type="checkbox"
                name="periodMoodEffects"
                value="No"
                checked={formData.periodMoodEffects === 'No'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">No</label>
            </div>
            <div>
              <label className="block mb-2">Date of last period:</label>
              <input
                type="date"
                name="lastPeriodDate"
                value={formData.lastPeriodDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Image 3</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Muscle weakness:</label>
              <input
                type="checkbox"
                name="muscleWeakness"
                value="Muscle weakness"
                checked={formData.muscleWeakness === 'Muscle weakness'}
                onChange={handleChange}
                className="mr-2"
              />
            </div>
            {/* Repeat similar checkboxes for other options */}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Significant Childhood (or other) Memories:</h2>
          <textarea
            name="significantMemories"
            value={formData.significantMemories}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>
        {error && (
          <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
        )}
        {successful && (
          <div className="text-green-500 mt-2 text-sm text-center">{successful}</div>
        )}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
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

export default TwelfthQuestionsForm;
