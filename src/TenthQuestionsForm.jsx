import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const TenthQuestionsForm = () => {
  const [formData, setFormData] = useState({
    biologicalFactors: '',
    socialFactors: '',
    sexLifeSatisfactory: '',
    homosexualReactions: '',
    sexualConcerns: '',
    problemsAtWork: '',
    peopleHurtYou: '',
    shockYou: '',
    spouseDescription: '',
    bestFriendDescription: '',
    peopleDislikeYou: '',
    pastRejections: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

    console.log("Encrypted Data ",  encryptedData);

    fetch('/users/history/tenth', {
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
          <h2 className="text-xl font-bold mb-2">SOCIAL FACTORS:</h2>
          <label className="block mb-2">
            Are you currently satisfied with your social life? Do you have enough social interactions, friends, and activities? How socially active are you?
          </label>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mr-2">
                <input
                  type="radio"
                  name="socialFactors"
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
          <h2 className="text-xl font-bold mb-2">SEX LIFE:</h2>
          <label className="block mb-2">
            Is your present sex life satisfactory?
          </label>
          <div className="flex mb-2">
            <input
              type="radio"
              name="sexLifeSatisfactory"
              value="Yes"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="sexLifeSatisfactory"
              value="No"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">No</label>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">HOMOSEXUAL REACTIONS:</h2>
          <label className="block mb-2">
            Provide information about any significant homosexual reactions or relationships.
          </label>
          <textarea
            name="homosexualReactions"
            value={formData.homosexualReactions}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">SEXUAL CONCERNS:</h2>
          <label className="block mb-2">
            Please note any sexual concerns not discussed above.
          </label>
          <textarea
            name="sexualConcerns"
            value={formData.sexualConcerns}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">PROBLEMS AT WORK:</h2>
          <label className="block mb-2">
            Are there any problems in your relationships with people at work?
          </label>
          <div className="flex mb-2">
            <input
              type="radio"
              name="problemsAtWork"
              value="Yes"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="problemsAtWork"
              value="No"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">No</label>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">PEOPLE HURT YOU:</h2>
          <label className="block mb-2">
            One of the ways people hurt me is:
          </label>
          <textarea
            name="peopleHurtYou"
            value={formData.peopleHurtYou}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">SHOCK YOU:</h2>
          <label className="block mb-2">
            I could shock you by:
          </label>
          <textarea
            name="shockYou"
            value={formData.shockYou}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">SPOUSE DESCRIPTION:</h2>
          <label className="block mb-2">
            My spouse (or boyfriend/girlfriend) would describe me as:
          </label>
          <textarea
            name="spouseDescription"
            value={formData.spouseDescription}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">BEST FRIEND DESCRIPTION:</h2>
          <label className="block mb-2">
            My best friend thinks I am:
          </label>
          <textarea
            name="bestFriendDescription"
            value={formData.bestFriendDescription}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">PEOPLE DISLIKE YOU:</h2>
          <label className="block mb-2">
            People who dislike me:
          </label>
          <textarea
            name="peopleDislikeYou"
            value={formData.peopleDislikeYou}
            onChange={handleChange}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">PAST REJECTIONS:</h2>
          <label className="block mb-2">
            Are you currently troubled by any past rejections or loss of a love relationship?
          </label>
          <div className="flex mb-2">
            <input
              type="radio"
              name="pastRejections"
              value="Yes"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="pastRejections"
              value="No"
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">No</label>
          </div>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TenthQuestionsForm;
