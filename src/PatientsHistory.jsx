import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const PATIENTS_HISTORY_URL = "https://insight-backend-8sg2.onrender.com/users/patient/history";
const PRESCRIPTION_URL = "https://insight-backend-8sg2.onrender.com/users/prescription";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const PatientsHistory = () => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [loading, setLoading] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  useEffect(() => {
    getPatientsHistory();
  }, [token, userId]);

  const getPatientsHistory = async () => {
    if (!token || !userId) return;

    setLoading(true); // Start loading state

    try {
      const response = await fetch(PATIENTS_HISTORY_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();

      setLoading(false); // End loading state

      if (result.successful) {
        const decryptedBytes = CryptoJS.AES.decrypt(result.ciphertext, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
          iv: CryptoJS.enc.Hex.parse(result.iv),
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        });

        let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        decryptedData = decryptedData.replace(/\0+$/, '');
        const userData = JSON.parse(decryptedData);

        // Merge patient data based on patientId to avoid duplication
        const uniquePatients = mergePatientsData(userData);

        setHistory(uniquePatients);
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }

    } catch (error) {
      setError(`There is an error making your request ${error}`);
      setTimeout(() => setError(""), 5000);
    }
  };

  const mergePatientsData = (patientsData) => {
    const uniquePatients = [];

    patientsData.forEach(patient => {
      const existingPatient = uniquePatients.find(p => p.patientId === patient.patientId);

      if (existingPatient) {
        // Merge history data
        existingPatient.history = { ...existingPatient.history, ...patient.history };
      } else {
        uniquePatients.push(patient);
      }
    });

    return uniquePatients;
  };

  const handlePatientClick = (patientId) => {
    const patientData = history.find(item => item.patientId === patientId);
    setSelectedPatient(patientData);
  };

  const handlePrescriptionSubmit = async () => {
    if (!token || !userId || !selectedPatient) return;
    setIsLoading(true);

    const dataToSend = {
      patientId: selectedPatient.patientId,
      doctorId: userId,
      date: new Date().toISOString(), // Use ISO format for the current date and time
      prescription: prescription
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
      const response = await fetch(PRESCRIPTION_URL, {
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
        setPrescription("");
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }

    } catch (error) {
      setError(`There was an error making your request ${error}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl text-gray-900 font-bold mb-4 text-center">Patients History</h2>
      {loading && <p className="text-center">Loading...</p>}
      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-500 text-white p-2 rounded mb-4">{success}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((patient) => (
          <button
            key={patient.patientId}
            className="bg-blue-700 hover:bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => handlePatientClick(patient.patientId)}
          >
            {patient.patientName}
          </button>
        ))}
      </div>
      {selectedPatient && (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-900 text-white">
          <h3 className="text-xl font-bold mb-4">Patient Details: {selectedPatient.patientName}</h3>
          {Object.entries(selectedPatient.history).map(([key, value], index) => (
            <p key={index}><strong>{key}:</strong> {JSON.stringify(value)}</p>
          ))}
          <div className="mt-4">
            <label className="block mb-2">
              Prescription:
              <input
                type="text"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="block w-full mt-1 p-2 border rounded text-black"
                required
              />
            </label>
            <button
              className="bg-blue-700 hover:bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
              onClick={handlePrescriptionSubmit}
            >
              Submit Prescription
            </button>
          </div>
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-700"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientsHistory;
