import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

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

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userData = localStorage.getItem("userId");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData));
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      userId: userId,
      pageNo: 12,
      questions: formData
    };

    // Encrypt form data
    const secretKey = process.env.REACT_APP_SECRET_KEY; // Replace with your secret key
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToSend),
      secretKey
    ).toString();

    const payload={
      data:encryptedData
    };
    console.log("Collected Data:");
    Object.entries(dataToSend).forEach(([key, value]) => {
      console.log(`${key}: ${JSON.stringify(value, null, 2)}`);
    });

    console.log("Encrypted Data:");
    Object.entries(payload).forEach(([key, value]) => console.log(`${key} : ${value}`));

    // Example POST request to server endpoint
    fetch('/users/history/twelfth', {
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

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TwelfthQuestionsForm;
