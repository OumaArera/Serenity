import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const PATIENT_HISTORY_URL = "https://insight-backend-8sg2.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

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
