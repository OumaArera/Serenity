import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const EighthQuestionsForm = () => {
  const [formData, setFormData] = useState({
    college: '',
    bulliedOrTeased: '',
    joyRelationship: '',
    griefRelationship: '',
    socialRelaxation: '',
    privateThoughts: '',
    marriageDetails: {
      knownBeforeEngagement: '',
      engagedDuration: '',
      marriedDuration: '',
      spouseAge: '',
      spouseOccupation: '',
      spousePersonality: '',
      likeMost: '',
      likeLeast: '',
      maritalSatisfactionFactors: '',
    },
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const nameParts = name.split('.');

    if (nameParts.length > 1) {
      const [mainKey, subKey] = nameParts;
      setFormData((prevState) => ({
        ...prevState,
        [mainKey]: {
          ...prevState[mainKey],
          [subKey]: value,
        },
      }));
    } else {
      if (type === 'radio') {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value === 'Yes' ? true : false,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    console.log("Collected Data:");
    Object.entries(formData).forEach(([key, value]) => {
      console.log(`${key}: ${JSON.stringify(value, null, 2)}`);
    });

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(formData),
      secretKey
    ).toString();

    console.log("Encrypted Data ",  encryptedData)

    fetch('/users/history/eighth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: encryptedData }),
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
          <h2 className="text-xl font-bold mb-2">College?</h2>
          <div className="mb-2">
            <input
              type="radio"
              name="college"
              value="Yes"
              checked={formData.college === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="college"
              value="No"
              checked={formData.college === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Were you ever bullied or severely teased?</h2>
          <div className="mb-2">
            <input
              type="radio"
              name="bulliedOrTeased"
              value="Yes"
              checked={formData.bulliedOrTeased === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="bulliedOrTeased"
              value="No"
              checked={formData.bulliedOrTeased === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Describe any relationship that gives you joy:</h2>
          <textarea
            name="joyRelationship"
            value={formData.joyRelationship}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Describe any relationship that gives you grief:</h2>
          <textarea
            name="griefRelationship"
            value={formData.griefRelationship}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Social Situations</h2>
          <label className="block mb-2">Rate the degree to which you generally feel relaxed and comfortable in social situations:</label>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mr-2">
                <input
                  type="radio"
                  name="socialRelaxation"
                  value={num}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="mr-2">{num}</label>
              </div>
            ))}
          </div>
          <label className="block mb-2">Do you have one or more friends with whom you feel comfortable sharing your most private thoughts?</label>
          <div className="mb-2">
            <input
              type="radio"
              name="privateThoughts"
              value="Yes"
              checked={formData.privateThoughts === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="privateThoughts"
              value="No"
              checked={formData.privateThoughts === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Marriage/Committed Relationship</h2>
          <label className="block mb-2">How long did you know your spouse before your engagement?</label>
          <input
            type="text"
            name="marriageDetails.knownBeforeEngagement"
            value={formData.marriageDetails.knownBeforeEngagement}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">How long were you engaged before you got married?</label>
          <input
            type="text"
            name="marriageDetails.engagedDuration"
            value={formData.marriageDetails.engagedDuration}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">How long have you been married?</label>
          <input
            type="text"
            name="marriageDetails.marriedDuration"
            value={formData.marriageDetails.marriedDuration}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What is your spouse’s age?</label>
          <input
            type="text"
            name="marriageDetails.spouseAge"
            value={formData.marriageDetails.spouseAge}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">His/her occupation?</label>
          <input
            type="text"
            name="marriageDetails.spouseOccupation"
            value={formData.marriageDetails.spouseOccupation}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Describe your spouse’s personality:</label>
          <textarea
            name="marriageDetails.spousePersonality"
            value={formData.marriageDetails.spousePersonality}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What do you like the most about your spouse?</label>
          <textarea
            name="marriageDetails.likeMost"
            value={formData.marriageDetails.likeMost}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What do you like least about your spouse?</label>
          <textarea
            name="marriageDetails.likeLeast"
            value={formData.marriageDetails.likeLeast}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What factors detract from your marital satisfaction?</label>
          <textarea
            name="marriageDetails.maritalSatisfactionFactors"
            value={formData.marriageDetails.maritalSatisfactionFactors}
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

export default EighthQuestionsForm;
