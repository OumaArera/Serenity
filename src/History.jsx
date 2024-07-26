import React, { useState, useEffect } from "react";
import CryptoJS from 'crypto-js';
import countryData from 'country-telephone-data';

const PATIENT_HISTORY_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const History = () => {
  const [data, setData] = useState({});
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState("");
  const [loading, setLoading] = useState(false);
  const [approval, setApproval] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      dateOfBirth: {
        ...prevData.dateOfBirth,
        [name]: value
      }
    }));
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const country = countryData.allCountries.find(
      (country) =>
        country.name.toLowerCase() === value.toLowerCase() ||
        country.dialCode === value
    );
    if (country) {
      setData((prevData) => ({
        ...prevData,
        phoneNumber: {
          ...prevData.phoneNumber,
          countryCode: country.dialCode,
          countryName: country.name,
          number: name === "number" ? value : prevData.phoneNumber.number
        },
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        phoneNumber: {
          ...prevData.phoneNumber,
          [name]: value,
        },
      }));
    }
  };

  const handleNextOfKinPhoneChange = (e) => {
    const { name, value } = e.target;
    const country = countryData.allCountries.find(
      (country) =>
        country.name.toLowerCase() === value.toLowerCase() ||
        country.dialCode === value
    );
    if (country) {
      setData((prevData) => ({
        ...prevData,
        nextOfKinPhoneNumber: {
          ...prevData.nextOfKinPhoneNumber,
          countryCode: country.dialCode,
          countryName: country.name,
          number: name === "nextOfKinNumber" ? value : prevData.nextOfKinPhoneNumber.number
        },
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        nextOfKinPhoneNumber: {
          ...prevData.nextOfKinPhoneNumber,
          [name]: value,
        },
      }));
    }
  };

  const handleSubmit = async () => {
    if (!token || !userId) return;
    setLoading(true);
    const currentDate = new Date().toISOString();

    const dataToSend = {
      userId: userId,
      pageNo: 1,
      questions: data,
      date: currentDate,
      approval: approval
    };
    Object.entries(dataToSend).forEach(([key, value]) => console.log(`${key} : ${JSON.stringify(value)}`));

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
            method: "POST",
            headers:{
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json()

        if (result.successful){
            setSuccessful(result.message);
            setData({});
            setApproval(false);
            setTimeout(() => setSuccessful(""), 5000);
        }else{
            setError(result.message);
            setTimeout(()=>setError(""), 5000);
        }
        
      } catch (error) {
        setError(`There was an error sending your request ${error}`);
        setTimeout(()=>setError(""), 5000);
      }finally{
        setLoading(false);
      }
  };

  const isValidAge = () => {
    if (!data.dateOfBirth) return false;
    const { year, month, day } = data.dateOfBirth;
    const birthDate = new Date(year, month - 1, day);
    const age = currentYear - birthDate.getFullYear();
    return age >= 14;
  };

  const isValidPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || !phoneNumber.countryCode || !phoneNumber.number) return false;
    const phoneLength = phoneNumber.number.length + phoneNumber.countryCode.length;
    return phoneLength >= 10 && phoneLength <= 15;
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Patient Bio Data</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={data.name || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
        <label htmlFor="feltLovedAtHome" className="block text-sm font-medium text-gray-700 mb-2">Sex:</label>
            <label>
              <input
                type="radio"
                name="sex"
                value="Male"
                checked={data.sex === "Male"}
                onChange={handleChange}
                className="mr-2"
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="sex"
                value="Female"
                checked={data.sex === "Female"}
                onChange={handleChange}
                className="mr-2"
              />
              Female
            </label>
        </div>
        <div className="mb-4">
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <div className="flex space-x-2">
            <select
              name="year"
              value={data.dateOfBirth?.year || ""}
              onChange={handleDateChange}
              className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="" disabled>Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              name="month"
              value={data.dateOfBirth?.month || ""}
              onChange={handleDateChange}
              className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="" disabled>Month</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              name="day"
              value={data.dateOfBirth?.day || ""}
              onChange={handleDateChange}
              className="block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="" disabled>Day</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          {!isValidAge() && (
            <p className="text-red-600 text-sm mt-2">Patient must be at least 14 years old.</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Home Address</label>
          <input
            type="text"
            name="address"
            placeholder="Ngomozi, Harare"
            value={data.address || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="flex space-x-2">
            
            <input
              type="text"
              name="phoneNumber"
              placeholder="+263710101010"
              value={data.phoneNumber || ""}
              onChange={handleChange}
              className="block w-2/3 border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          
        </div>
        <div className="mb-4">
          <label htmlFor="nextOfKin" className="block text-sm font-medium text-gray-700 mb-2">Next of Kin Name</label>
          <input
            type="text"
            name="nextOfKin"
            placeholder="Jane Doe"
            value={data.nextOfKin || ""}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nextOfKinPhoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Next of Kin Phone Number</label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="nextOfKinPhoneNumber"
              placeholder="+263710101010"
              value={data.nextOfKinPhoneNumber || ""}
              onChange={handleChange}
              className="block w-1/3 border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          
        </div>
        <div className="mb-4">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="weight"
              placeholder="70"
              value={data.weight || ""}
              onChange={handleChange}
              className="block w-1/2 border-gray-300 rounded-md shadow-sm p-2"
              required
            />
            <select
              name="weightUnit"
              value={data.weightUnit || ""}
              onChange={handleChange}
              className="block w-1/2 border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="" disabled>Unit</option>
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="weightFluctuates" className="block text-sm font-medium text-gray-700 mb-2">Does your weight fluctuate?</label>
          <div className="flex space-x-2">
            <input
              type="checkbox"
              name="weightFluctuates"
              checked={data.weightFluctuates || false}
              onChange={(e) => setData(prevData => ({
                ...prevData,
                weightFluctuates: e.target.checked
              }))}
              className="block border-gray-300 rounded-md shadow-sm p-2"
            />
            {data.weightFluctuates && (
              <input
                type="number"
                name="weightFluctuationMargin"
                placeholder="5"
                value={data.weightFluctuationMargin || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm p-2"
                required={data.weightFluctuates}
              />
            )}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">Height</label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="height"
              placeholder="170"
              value={data.height || ""}
              onChange={handleChange}
              className="block w-1/2 border-gray-300 rounded-md shadow-sm p-2"
              required
            />
            <select
              name="heightUnit"
              value={data.heightUnit || ""}
              onChange={handleChange}
              className="block w-1/2 border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="" disabled>Unit</option>
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </div>
        </div>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {successful && <p className="text-green-600 text-sm mb-4">{successful}</p>}
        <div className="mb-4">
          <label htmlFor="approval" className="block text-sm font-medium text-gray-700 mb-2">I hereby authorize Insight Wellbeing P/L to internally use, and/or share my personal data with external agencies to help manage identified risks, and issues as discussed in sessions.</label>
          <input
            type="checkbox"
            name="approval"
            checked={approval}
            onChange={(e) => setApproval(e.target.checked)}
            className="block border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <button
          onClick={handleSubmit}
          className={`w-full py-2 px-4 rounded-md text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"}`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default History;
