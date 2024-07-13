import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const ThirdQuestionsForm = () => {
  const [formData, setFormData] = useState({
    childhoodIssues: {
      happyChildhood: false,
      unhappyChildhood: false,
      emotionalProblems: false,
      legalTrouble: false,
      deathInFamily: false,
      medicalProblems: false,
      ignored: false,
      notEnoughFriends: false,
      schoolProblems: false,
      financialProblems: false,
      strongReligiousConvictions: false,
      drugUse: false,
      usedAlcohol: false,
      severelyPunished: false,
      sexuallyAbused: false,
      severelyBullied: false,
      eatingDisorder: false,
      others: '',
    },
    presentingProblems: {
      mainProblems: '',
      severity: '',
      problemStart: '',
      problemWorsen: '',
      helpfulAttempts: '',
    },
    satisfactionAndTension: {
      lifeSatisfaction: '',
      overallTension: '',
    },
    therapyExpectations: {
      aboutTherapy: '',
      therapyDuration: '',
      therapistQualities: '',
    }
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
    const [section, field] = name.split('.');

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      userId: userId,
      pageNo: 3,
      questions: formData
    };


    const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dataToSend), SECRET_KEY).toString();

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

    fetch('/users/history/third', {
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
      <h2 className="text-2xl font-bold mb-6">Personal History and Therapy Expectations</h2>
      <form onSubmit={handleSubmit}>
        {/* Childhood/Adolescence */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Childhood/Adolescence</h3>
          {['happyChildhood', 'unhappyChildhood', 'emotionalProblems', 'legalTrouble', 'deathInFamily', 'medicalProblems', 'ignored', 'notEnoughFriends', 'schoolProblems', 'financialProblems', 'strongReligiousConvictions', 'drugUse', 'usedAlcohol', 'severelyPunished', 'sexuallyAbused', 'severelyBullied', 'eatingDisorder'].map(issue => (
            <div key={issue} className="mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name={`childhoodIssues.${issue}`}
                  checked={formData.childhoodIssues[issue]}
                  onChange={handleChange}
                  className="mr-2"
                />
                {issue.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </label>
            </div>
          ))}
          <label className="block mb-2">Others (specify)</label>
          <input
            type="text"
            name="childhoodIssues.others"
            value={formData.childhoodIssues.others}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Presenting Problems */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Description of Presenting Problems</h3>
          <label className="block mb-2">State in your own words the nature of your main problems</label>
          <textarea
            name="presentingProblems.mainProblems"
            value={formData.presentingProblems.mainProblems}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            rows="4"
          />
          <label className="block mb-2">On the scale below, please estimate the severity of your problem(s)</label>
          {['Mildly upsetting', 'Moderately upsetting', 'Very severe', 'Extremely severe', 'Totally incapacitating'].map(severity => (
            <div key={severity} className="mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="presentingProblems.severity"
                  value={severity}
                  checked={formData.presentingProblems.severity === severity}
                  onChange={handleChange}
                  className="mr-2"
                />
                {severity}
              </label>
            </div>
          ))}
          <label className="block mb-2">When did your problems begin?</label>
          <input
            type="text"
            name="presentingProblems.problemStart"
            value={formData.presentingProblems.problemStart}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What seems to worsen your problems?</label>
          <input
            type="text"
            name="presentingProblems.problemWorsen"
            value={formData.presentingProblems.problemWorsen}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What have you tried that has been helpful?</label>
          <input
            type="text"
            name="presentingProblems.helpfulAttempts"
            value={formData.presentingProblems.helpfulAttempts}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Satisfaction and Tension Levels */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Satisfaction and Tension Levels</h3>
          <label className="block mb-2">How satisfied are you with your life as a whole these days?</label>
          {Array.from({ length: 7 }, (_, i) => i + 1).map(level => (
            <div key={level} className="mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="satisfactionAndTension.lifeSatisfaction"
                  value={level}
                  checked={formData.satisfactionAndTension.lifeSatisfaction === String(level)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {level} {level === 1 ? '(Not at all satisfied)' : level === 7 ? '(Very satisfied)' : ''}
              </label>
            </div>
          ))}
          <label className="block mb-2">How would you rate your overall level of tension during the past month?</label>
          {Array.from({ length: 7 }, (_, i) => i + 1).map(level => (
            <div key={level} className="mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="satisfactionAndTension.overallTension"
                  value={level}
                  checked={formData.satisfactionAndTension.overallTension === String(level)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {level} {level === 1 ? '(Relaxed)' : level === 7 ? '(Tense)' : ''}
              </label>
            </div>
          ))}
        </div>

        {/* Expectations Regarding Therapy */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Expectations Regarding Therapy</h3>
          <label className="block mb-2">In a few words, what do you think therapy is all about?</label>
          <textarea
            name="therapyExpectations.aboutTherapy"
            value={formData.therapyExpectations.aboutTherapy}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            rows="4"
          />
          <label className="block mb-2">How long do you think your therapy should last?</label>
          <input
            type="text"
            name="therapyExpectations.therapyDuration"
            value={formData.therapyExpectations.therapyDuration}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What personal qualities do you think the ideal therapist should possess?</label>
          <input
            type="text"
            name="therapyExpectations.therapistQualities"
            value={formData.therapyExpectations.therapistQualities}
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

export default ThirdQuestionsForm;
