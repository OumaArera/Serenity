import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const EleventhQuestionsForm = () => {
  const [formData, setFormData] = useState({
    explainRejections: '',
    doerLevel: '',
    emotionalLevel: '',
    sensationsLevel: '',
    imageryLevel: '',
    thinkerPlannerLevel: '',
    friendshipsImportance: '',
    generalHealthLevel: '',
    healthConcerns: '',
    medications: '',
    balancedMeals: '',
    exerciseRegularly: '',
    exerciseDetails: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

    // Encrypt form data
    const secretKey = process.env.REACT_APP_SECRET_KEY; // Replace with your secret key
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(formData),
      secretKey
    ).toString();

    // Example POST request to server endpoint
    fetch('/users/history/eleventh', {
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

    // Clear form fields after submission (optional)
    setFormData({
      explainRejections: '',
      doerLevel: '',
      emotionalLevel: '',
      sensationsLevel: '',
      imageryLevel: '',
      thinkerPlannerLevel: '',
      friendshipsImportance: '',
      generalHealthLevel: '',
      healthConcerns: '',
      medications: '',
      balancedMeals: '',
      exerciseRegularly: '',
      exerciseDetails: '',
    });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">EXPLAIN REJECTIONS:</h2>
          <textarea
            name="explainRejections"
            value={formData.explainRejections}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Image 1</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Behaviors:</h3>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mb-2">
                <input
                  type="radio"
                  name="doerLevel"
                  value={num}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="mr-4">{num}</label>
              </div>
            ))}
          </div>

          {/* Other sections of the form omitted for brevity */}

        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Image 2</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Biological Factors:</h3>
            <div className="mb-2">
              <label className="block mb-2">
                Do you have any current concerns about your physical health?
              </label>
              <input
                type="checkbox"
                name="healthConcerns"
                checked={formData.healthConcerns === 'Yes'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">Yes</label>
              <input
                type="checkbox"
                name="healthConcerns"
                checked={formData.healthConcerns === 'No'}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label className="mr-4">No</label>
              {formData.healthConcerns === 'Yes' && (
                <textarea
                  name="healthConcernDetails"
                  value={formData.healthConcernDetails}
                  onChange={handleChange}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md mb-4"
                />
              )}
            </div>

            {/* Other sections of the form omitted for brevity */}

          </div>
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

export default EleventhQuestionsForm;
