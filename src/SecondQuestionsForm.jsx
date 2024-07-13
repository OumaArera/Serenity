import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const SecondQuestionsForm = () => {
  const [formData, setFormData] = useState({
    fatherName: '',
    fatherAge: '',
    fatherOccupation: '',
    fatherHealth: '',
    fatherDeathAge: '',
    fatherDeathTime: '',
    fatherDeathCause: '',
    motherName: '',
    motherAge: '',
    motherOccupation: '',
    motherHealth: '',
    motherDeathAge: '',
    motherDeathTime: '',
    motherDeathCause: '',
    brothersAges: '',
    sistersAges: '',
    siblingsDetails: '',
    raisedBy: '',
    fatherPersonality: '',
    motherPersonality: '',
    discipline: '',
    homeAtmosphere: '',
    confideParents: '',
    feelLoved: '',
    stepParentAge: '',
    interference: '',
    interferenceDetails: '',
    scholasticStrengths: '',
    scholasticWeaknesses: '',
    lastGrade: ''
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    // Construct payload
    const dataToSend = {
      userId: userId,
      pageNo: 2,
      questions: formData
    };

    

    // Encrypt the form data
    const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dataToSend), SECRET_KEY).toString();

    // Prepare the payload for submission
    const payload = {
      data: encryptedData,
    };

    // Print collected data
    console.log("Collected Data:");
    Object.entries(dataToSend).forEach(([key, value]) => {
      console.log(`${key}: ${JSON.stringify(value, null, 2)}`);
    });

    console.log("Encrypted Data:");
    Object.entries(payload).forEach(([key, value]) => console.log(`${key} : ${value}`));

    // Simulate POST request to a fake endpoint
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      alert('Form submitted successfully.');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="p-8 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6">Family and Background Information</h2>
      <form onSubmit={handleSubmit}>
        {/* Father */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Father</h3>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Age</label>
          <input
            type="number"
            name="fatherAge"
            value={formData.fatherAge}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Occupation</label>
          <input
            type="text"
            name="fatherOccupation"
            value={formData.fatherOccupation}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Health</label>
          <input
            type="text"
            name="fatherHealth"
            value={formData.fatherHealth}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">If deceased, give his age at the time of death</label>
          <input
            type="number"
            name="fatherDeathAge"
            value={formData.fatherDeathAge}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">How old were you at the time?</label>
          <input
            type="number"
            name="fatherDeathTime"
            value={formData.fatherDeathTime}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Cause of death</label>
          <input
            type="text"
            name="fatherDeathCause"
            value={formData.fatherDeathCause}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Mother */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Mother</h3>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Age</label>
          <input
            type="number"
            name="motherAge"
            value={formData.motherAge}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Occupation</label>
          <input
            type="text"
            name="motherOccupation"
            value={formData.motherOccupation}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Health</label>
          <input
            type="text"
            name="motherHealth"
            value={formData.motherHealth}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">If deceased, give her age at the time of death</label>
          <input
            type="number"
            name="motherDeathAge"
            value={formData.motherDeathAge}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">How old were you at the time?</label>
          <input
            type="number"
            name="motherDeathTime"
            value={formData.motherDeathTime}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Cause of death</label>
          <input
            type="text"
            name="motherDeathCause"
            value={formData.motherDeathCause}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Siblings */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Siblings</h3>
          <label className="block mb-2">Age(s) of brother(s)</label>
          <input
            type="text"
            name="brothersAges"
            value={formData.brothersAges}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Age(s) of sister(s)</label>
          <input
            type="text"
            name="sistersAges"
            value={formData.sistersAges}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Any significant details about siblings</label>
          <textarea
            name="siblingsDetails"
            value={formData.siblingsDetails}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        {/* If not raised by parents */}
        <div className="mb-4">
          <label className="block mb-2">If you were not brought up by your parents, who raised you and between what years?</label>
          <input
            type="text"
            name="raisedBy"
            value={formData.raisedBy}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Father personality */}
        <div className="mb-4">
          <label className="block mb-2">Give a description of your father’s (or father substitute’s) personality and his attitude toward you (past and present)</label>
          <textarea
            name="fatherPersonality"
            value={formData.fatherPersonality}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        {/* Mother personality */}
        <div className="mb-4">
          <label className="block mb-2">Give a description of your mother’s (or mother substitute’s) personality and her attitude toward you (past and present)</label>
          <textarea
            name="motherPersonality"
            value={formData.motherPersonality}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        {/* Discipline */}
        <div className="mb-4">
          <label className="block mb-2">In what ways were you disciplined or punished by your parents?</label>
          <textarea
            name="discipline"
            value={formData.discipline}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        {/* Home atmosphere */}
        <div className="mb-4">
          <label className="block mb-2">Give an impression of your home atmosphere (i.e., the home in which you grew up). Mention state of compatibility between parents and between children</label>
          <textarea
            name="homeAtmosphere"
            value={formData.homeAtmosphere}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        {/* Confide in parents */}
        <div className="mb-4">
          <label className="block mb-2">Were you able to confide in your parents?</label>
          <div className="flex items-center space-x-4">
            <label>
              <input
                type="radio"
                name="confideParents"
                value="Yes"
                checked={formData.confideParents === 'Yes'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="confideParents"
                value="No"
                checked={formData.confideParents === 'No'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              No
            </label>
          </div>
        </div>

        {/* Loved and respected */}
        <div className="mb-4">
          <label className="block mb-2">Basically, did you feel loved and respected by your parents?</label>
          <div className="flex items-center space-x-4">
            <label>
              <input
                type="radio"
                name="feelLoved"
                value="Yes"
                checked={formData.feelLoved === 'Yes'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="feelLoved"
                value="No"
                checked={formData.feelLoved === 'No'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              No
            </label>
          </div>
        </div>

        {/* Step parent */}
        <div className="mb-4">
          <label className="block mb-2">If you have a stepparent, give your age when your parent remarried</label>
          <input
            type="number"
            name="stepParentAge"
            value={formData.stepParentAge}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Interference */}
        <div className="mb-4">
          <label className="block mb-2">Has anyone (parents, relatives, friends) ever interfered in your marriage, occupation, etc?</label>
          <div className="flex items-center space-x-4">
            <label>
              <input
                type="radio"
                name="interference"
                value="Yes"
                checked={formData.interference === 'Yes'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="interference"
                value="No"
                checked={formData.interference === 'No'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              No
            </label>
          </div>
          {formData.interference === 'Yes' && (
            <textarea
              name="interferenceDetails"
              value={formData.interferenceDetails}
              onChange={handleChange}
              placeholder="Please describe briefly"
              className="w-full mt-1 p-2 border rounded bg-gray-100 text-black"
              rows="4"
              required
            />
          )}
        </div>

        {/* Scholastic strengths */}
        <div className="mb-4">
          <label className="block mb-2">Scholastic strengths</label>
          <textarea
            name="scholasticStrengths"
            value={formData.scholasticStrengths}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        {/* Scholastic weaknesses */}
        <div className="mb-4">
          <label className="block mb-2">Scholastic weaknesses</label>
          <textarea
            name="scholasticWeaknesses"
            value={formData.scholasticWeaknesses}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        {/* Last grade */}
        <div className="mb-4">
          <label className="block mb-2">What was the last grade completed (or highest degree)?</label>
          <input
            type="text"
            name="lastGrade"
            value={formData.lastGrade}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SecondQuestionsForm;
