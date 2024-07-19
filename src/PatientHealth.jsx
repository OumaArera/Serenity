import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const PATIENT_HEALTH_URL = "https://insight-backend-8sg2.onrender.com/users/post/response";
const FORM_FILLED_URL = "https://insight-backend-8sg2.onrender.com/users/get/response";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const PatientHealth = ({ setMessage }) => {
    const [responses, setResponses] = useState({
    "Little_interest_or_pleasure_in_doing_things": "",
    "Feeling_down,_depressed,_or_hopeless": "",
    "Trouble_falling_or_staying_asleep,_or_sleeping_too_much": "",
    "Feeling_tired_or_having_little_energy": "",
    "Poor_appetite_or_overeating": "",
    "Feeling_bad_about_yourself_—_or_that_you_are_a_failure_or_have_let_yourself_or_your_family_down": "",
    "Trouble_concentrating_on_things,_such_as_reading_the_newspaper_or_watching_television": "",
    "Moving_or_speaking_so_slowly_that_other_people_could_have_noticed._Or_the_opposite_—_being_so_fidgety_or_restless_that_you_have_been_moving_around_a_lot_more_than_usual": "",
    "Thoughts_that_you_would_be_better_off_dead,_or_of_hurting_yourself": "",
    "If_you_checked_off_any_problems,_how_difficult_have_these_problems_made_it_for_you_to_do_your_work,_take_care_of_things_at_home,_or_get_along_with_other_people": ""
    });
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [status, setStatus] = useState(false);
    const [nextDue, setNextDue] = useState("");

    useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
    }, []);

    useEffect(() => {
        fetchData();
    }, [token, userId]);
  
    const fetchData = async () => {
        if (!token || !userId) return;

        try {
        const response = await fetch(`${FORM_FILLED_URL}/${userId}`, {
            method: "GET",
            headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json',
            }
        });
        const result = await response.json();

        if (result.successful) {
            setStatus(true);
            setNextDue(result.next_due_date);
        } else {
            setStatus(false);
            setNextDue("");
            setMessage(true);
        }
        } catch (error) {
        console.log("Error ", error);
        } finally {
        setIsLoading(false); 
        }
    };
    

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setResponses({
            ...responses,
            [name]: value
        });
    };

  const handleSubmit = async () => {
    if (!token || !userId) return;
    setIsLoading(true);

    const dataToSend = {
      patientId: userId,
      date: new Date().toISOString(),
      responses: responses
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
      const response = await fetch(PATIENT_HEALTH_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.successful) {
        setSuccess(result.message);
        setTimeout(() => setSuccess(""), 5000);
        setTimeout(() => fetchData(), 5000);
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError(`There was an error sending your request. Error: ${error}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const options = [
    { value: "0-Not at all", label: "Not at all" },
    { value: "1-Several days", label: "Several days" },
    { value: "2-More than half of the days", label: "More than half of the days" },
    { value: "3-Nearly every day", label: "Nearly every day" }
  ];

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-700"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Patient Health Questionnaire (PHQ-9)</h2>

      {status ? (
        <div className="text-lg text-gray-700">
          You already filled this form. Next you should fill it on{" "}
          <span>{nextDue ? formatDate(nextDue) : ""}</span>
        </div>
      ) : (
        <>
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <label className="block font-medium mb-2">
                {index + 1}. {question.replace(/_/g, ' ')}
              </label>
              <div className="flex space-x-4">
                {options.map(option => (
                  <label key={option.value} className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name={question}
                      value={option.value}
                      onChange={handleInputChange}
                      className="form-radio"
                      required
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="mb-4">
            <label className="block font-medium mb-2">
              10. If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?
            </label>
            <select
              name="If_you_checked_off_any_problems,_how_difficult_have_these_problems_made_it_for_you_to_do_your_work,_take_care_of_things_at_home,_or_get_along_with_other_people"
              onChange={handleInputChange}
              className="form-select mt-1 block w-full"
            >
              <option value="">Select...</option>
              <option value="Not difficult at all">Not difficult at all</option>
              <option value="Somewhat difficult">Somewhat difficult</option>
              <option value="Very difficult">Very difficult</option>
              <option value="Extremely difficult">Extremely difficult</option>
            </select>
          </div>
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>
          )}
          {success && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">{success}</div>
          )}

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg"
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
};

const questions = [
  "Little_interest_or_pleasure_in_doing_things",
  "Feeling_down,_depressed,_or_hopeless",
  "Trouble_falling_or_staying_asleep,_or_sleeping_too_much",
  "Feeling_tired_or_having_little_energy",
  "Poor_appetite_or_overeating",
  "Feeling_bad_about_yourself_—_or_that_you_are_a_failure_or_have_let_yourself_or_your_family_down",
  "Trouble_concentrating_on_things,_such_as_reading_the_newspaper_or_watching_television",
  "Moving_or_speaking_so_slowly_that_other_people_could_have_noticed._Or_the_opposite_—_being_so_fidgety_or_restless_that_you_have_been_moving_around_a_lot_more_than_usual",
  "Thoughts_that_you_would_be_better_off_dead,_or_of_hurting_yourself"
];

export default PatientHealth;
