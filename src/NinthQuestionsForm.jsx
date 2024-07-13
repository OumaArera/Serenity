import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const NinthQuestionsForm = () => {
  const [formData, setFormData] = useState({
    doer: '',
    emotional: '',
    sensations: '',
    imagery: '',
    thinker: '',
    interpersonal: '',
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
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const dataToSend = {
      userId: userId,
      pageNo: 9,
      questions: formData
    };

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

    fetch('/users/history/ninth', {
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
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">BEHAVIORS:</h2>
          <label className="block mb-2">
            Some people may be described as “doers” – they are action oriented, they like to busy themselves, get things done, take on various projects. How much of a doer are you?
          </label>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mr-2">
                <input
                  type="radio"
                  name="doer"
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
          <h2 className="text-xl font-bold mb-2">FEELINGS:</h2>
          <label className="block mb-2">
            Some people are very emotional and may or may not express it. How emotional are you? How deeply do you feel things? How passionate are you?
          </label>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mr-2">
                <input
                  type="radio"
                  name="emotional"
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
          <h2 className="text-xl font-bold mb-2">PHYSICAL SENSATIONS:</h2>
          <label className="block mb-2">
            Some people attach a lot of value to sensory experiences, such as sex, food, music, art, and other “sensory delights.” Others are very much aware of minor aches, pains, and discomforts. How “tuned into” your sensations are you?
          </label>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mr-2">
                <input
                  type="radio"
                  name="sensations"
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
          <h2 className="text-xl font-bold mb-2">MENTAL IMAGES:</h2>
          <label className="block mb-2">
            How much fantasy or daydreaming do you engage in? This is separate from thinking or planning. This “thinking in pictures,” visualizing real or imagined experiences, letting your mind roam. How much are you into imagery?
          </label>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mr-2">
                <input
                  type="radio"
                  name="imagery"
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
          <h2 className="text-xl font-bold mb-2">THOUGHTS:</h2>
          <label className="block mb-2">
            Some people are very analytical and like to plan things. They like to reason things through. How much of a “thinker” and “planner” are you?
          </label>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mr-2">
                <input
                  type="radio"
                  name="thinker"
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
          <h2 className="text-xl font-bold mb-2">INTERPERSONAL RELATIONSHIPS:</h2>
          <label className="block mb-2">
            How important are other people to you? This is your self-rating as a social being. How important are close friendships to you, the tendency to gravitate toward people, the desire for intimacy? The opposite of this is being a “loner.”
          </label>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mr-2">
                <input
                  type="radio"
                  name="interpersonal"
                  value={num}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="mr-2">{num}</label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NinthQuestionsForm;
