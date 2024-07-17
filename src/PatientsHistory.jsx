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

    setLoading(true);

    try {
      const response = await fetch(PATIENTS_HISTORY_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();

      setLoading(false);

      if (result.successful) {
        const decryptedBytes = CryptoJS.AES.decrypt(result.ciphertext, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
          iv: CryptoJS.enc.Hex.parse(result.iv),
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        });

        let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        decryptedData = decryptedData.replace(/\0+$/, '');
        const userData = JSON.parse(decryptedData);

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
      date: new Date().toISOString(),
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
      <h2 className="text-2xl font-bold mb-4 text-center">Patients History</h2>
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
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white text-black w-full mx-auto md:max-w-2xl">
          <h3 className="text-xl font-bold mb-4">Patient Details: {selectedPatient.patientName}</h3>
          <div className="space-y-2">
            <div className="bg-gray-100 p-2 rounded shadow-md break-words">
              <p className="text-sm sm:text-base"><strong>Date:</strong> {selectedPatient.history.date}</p>
              <p className="text-sm sm:text-base"><strong>Address:</strong> {selectedPatient.history.address}</p>
              <p className="text-sm sm:text-base"><strong>Age:</strong> {selectedPatient.history.age}</p>
              <p className="text-sm sm:text-base"><strong>Attempted Suicide:</strong> {selectedPatient.history.attemptedSuicide}</p>
              <p className="text-sm sm:text-base"><strong>Date of Birth:</strong> {selectedPatient.history.dateOfBirth}</p>
              <p className="text-sm sm:text-base"><strong>Emergency Contact:</strong> {selectedPatient.history.emergencyContact}</p>
              <p className="text-sm sm:text-base"><strong>Emergency Contact Telephone:</strong> {selectedPatient.history.emergencyContactTelephone}</p>
              <p className="text-sm sm:text-base"><strong>Family Emotional Disorder:</strong> {selectedPatient.history.familyEmotionalDisorder}</p>
              <p className="text-sm sm:text-base"><strong>Family Emotional Disorder Details:</strong> {selectedPatient.history.familyEmotionalDisorderDetails}</p>
              <p className="text-sm sm:text-base"><strong>Family Physician:</strong> {selectedPatient.history.familyPhysician}</p>
              <p className="text-sm sm:text-base"><strong>Family Suicide:</strong> {selectedPatient.history.familySuicide}</p>
              <p className="text-sm sm:text-base"><strong>Family Suicide Details:</strong> {selectedPatient.history.familySuicideDetails}</p>
              <p className="text-sm sm:text-base"><strong>Height:</strong> {selectedPatient.history.height}</p>
              <p className="text-sm sm:text-base"><strong>Hospitalization Details:</strong> {selectedPatient.history.hospitalizationDetails}</p>
              <p className="text-sm sm:text-base"><strong>Hospitalized Before:</strong> {selectedPatient.history.hospitalizedBefore}</p>
              <p className="text-sm sm:text-base"><strong>Hospitalized Details:</strong> {selectedPatient.history.hospitalizedDetails}</p>
              <p className="text-sm sm:text-base"><strong>Living In:</strong> {selectedPatient.history.livingIn}</p>
              <p className="text-sm sm:text-base"><strong>Living With:</strong> {selectedPatient.history.livingWith.join(', ')}</p>
              <p className="text-sm sm:text-base"><strong>Marital Status:</strong> {selectedPatient.history.maritalStatus}</p>
              <p className="text-sm sm:text-base"><strong>Marital Times:</strong> {selectedPatient.history.maritalTimes}</p>
              <p className="text-sm sm:text-base"><strong>Name:</strong> {selectedPatient.history.name}</p>
              <p className="text-sm sm:text-base"><strong>Number of Children:</strong> {selectedPatient.history.numberOfChildren}</p>
              <p className="text-sm sm:text-base"><strong>Occupation:</strong> {selectedPatient.history.occupation}</p>
              <p className="text-sm sm:text-base"><strong>Other Living:</strong> {selectedPatient.history.otherLiving}</p>
              <p className="text-sm sm:text-base"><strong>Past Jobs:</strong> {selectedPatient.history.pastJobs}</p>
              <p className="text-sm sm:text-base"><strong>Physician Name:</strong> {selectedPatient.history.physicianName}</p>
              <p className="text-sm sm:text-base"><strong>Physician Telephone:</strong> {selectedPatient.history.physicianTelephone}</p>
              <p className="text-sm sm:text-base"><strong>Place of Birth:</strong> {selectedPatient.history.placeOfBirth}</p>
              <p className="text-sm sm:text-base"><strong>Present Work:</strong> {selectedPatient.history.presentWork}</p>
              <p className="text-sm sm:text-base"><strong>Referred By:</strong> {selectedPatient.history.referredBy}</p>
              <p className="text-sm sm:text-base"><strong>Religion:</strong> {selectedPatient.history.religion}</p>
              <p className="text-sm sm:text-base"><strong>Sex:</strong> {selectedPatient.history.sex}</p>
              <p className="text-sm sm:text-base"><strong>Spouse Age:</strong> {selectedPatient.history.spouseAge}</p>
              <p className="text-sm sm:text-base"><strong>Spouse Name:</strong> {selectedPatient.history.spouseName}</p>
              <p className="text-sm sm:text-base"><strong>Spouse Occupation:</strong> {selectedPatient.history.spouseOccupation}</p>
              <p className="text-sm sm:text-base"><strong>Telephone Day:</strong> {selectedPatient.history.telephone.day}</p>
              <p className="text-sm sm:text-base"><strong>Telephone Evening:</strong> {selectedPatient.history.telephone.evening}</p>
              <p className="text-sm sm:text-base"><strong>Therapy Before:</strong> {selectedPatient.history.therapyBefore}</p>
              <p className="text-sm sm:text-base"><strong>Weight:</strong> {selectedPatient.history.weight}</p>
              <p className="text-sm sm:text-base"><strong>Weight Fluctuate:</strong> {selectedPatient.history.weightFluctuate}</p>
              <p className="text-sm sm:text-base"><strong>Weight Fluctuate Amount:</strong> {selectedPatient.history.weightFluctuateAmount}</p>
              <p className="text-sm sm:text-base"><strong>Work Satisfaction:</strong> {selectedPatient.history.workSatisfaction}</p>
              <p className="text-sm sm:text-base"><strong>Work Satisfaction Explanation:</strong> {selectedPatient.history.workSatisfactionExplanation}</p>
              <p className="text-sm sm:text-base"><strong>Brothers ages range: </strong>{selectedPatient.history.brothersAges}</p>
              <p className="text-sm sm:text-base"><strong>Sisters ages range: </strong>{selectedPatient.history.sistersAges}</p>
              <p className="text-sm sm:text-base"><strong>Could confide in parents: </strong>{selectedPatient.history.confideParents}</p>
              <p className="text-sm sm:text-base"><strong>How parents administered discipline: </strong>{selectedPatient.history.discipline}</p>
              <p className="text-sm sm:text-base"><strong>Father's age: </strong>{selectedPatient.history.fatherAge}</p>
              <p className="text-sm sm:text-base"><strong>Age when father died: </strong>{selectedPatient.history.fatherDeathAge}</p>
              <p className="text-sm sm:text-base"><strong>Cause of father's death: </strong>{selectedPatient.history.fatherDeathCause}</p>
              <p className="text-sm sm:text-base"><strong>When father died: </strong>{selectedPatient.history.fatherDeathTime}</p>
              <p className="text-sm sm:text-base"><strong>Father's health: </strong>{selectedPatient.history.fatherHealth}</p>
              <p className="text-sm sm:text-base"><strong>Father's name: </strong>{selectedPatient.history.fatherName}</p>
              <p className="text-sm sm:text-base"><strong>Father's occupation: </strong>{selectedPatient.history.fatherOccupation}</p>
              <p className="text-sm sm:text-base"><strong>Father's personality: </strong>{selectedPatient.history.fatherPersonality}</p>
              <p className="text-sm sm:text-base"><strong>Mother's age: </strong>{selectedPatient.history.motherAge}</p>
              <p className="text-sm sm:text-base"><strong>Age when mother died: </strong>{selectedPatient.history.motherDeathAge}</p>
              <p className="text-sm sm:text-base"><strong>Mother's cause of death: </strong>{selectedPatient.history.motherDeathCause}</p>
              <p className="text-sm sm:text-base"><strong>When mother died: </strong>{selectedPatient.history.motherDeathTime}</p>
              <p className="text-sm sm:text-base"><strong>Mother's health: </strong>{selectedPatient.history.motherHealth}</p>
              <p className="text-sm sm:text-base"><strong>Mother's name: </strong>{selectedPatient.history.motherName}</p>
              <p className="text-sm sm:text-base"><strong>Mother's occupation: </strong>{selectedPatient.history.motherOccupation}</p>
              <p className="text-sm sm:text-base"><strong>Mother's personality: </strong>{selectedPatient.history.motherPersonality}</p>
              <p className="text-sm sm:text-base"><strong>Who raised you?: </strong>{selectedPatient.history.raisedBy}</p>
              <p className="text-sm sm:text-base"><strong>Who raised you?: </strong>{selectedPatient.history.stepParentAge}</p>
              <p className="text-sm sm:text-base"><strong>Feeling loved at home: </strong>{selectedPatient.history.feelLoved}</p>
              <p className="text-sm sm:text-base"><strong>Atmosphere at home: </strong>{selectedPatient.history.homeAtmosphere}</p>
              <p className="text-sm sm:text-base"><strong>Interferance at home: </strong>{selectedPatient.history.interference}</p>
              <p className="text-sm sm:text-base"><strong>Interferance details: </strong>{selectedPatient.history.interferenceDetails}</p><p className="text-sm sm:text-base"><strong>Father's name: </strong>{selectedPatient.history.fatherName}</p>
              <p className="text-sm sm:text-base"><strong>Last Grade in school: </strong>{selectedPatient.history.lastGrade}</p>
              <p className="text-sm sm:text-base"><strong>Scholastic strengths: </strong>{selectedPatient.history.scholasticStrengths}</p>
              <p className="text-sm sm:text-base"><strong>Scholastic weaknesses: </strong>{selectedPatient.history.scholasticWeaknesses}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Death In Family:</strong> {selectedPatient.history.childhoodIssues.deathInFamily ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Drug Use:</strong> {selectedPatient.history.childhoodIssues.drugUse ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Eating Disorder:</strong> {selectedPatient.history.childhoodIssues.eatingDisorder ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Emotional Problems:</strong> {selectedPatient.history.childhoodIssues.emotionalProblems ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Financial Problems:</strong> {selectedPatient.history.childhoodIssues.financialProblems ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Happy Childhood:</strong> {selectedPatient.history.childhoodIssues.happyChildhood ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Ignored:</strong> {selectedPatient.history.childhoodIssues.ignored ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Legal Trouble:</strong> {selectedPatient.history.childhoodIssues.legalTrouble ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Medical Problems:</strong> {selectedPatient.history.childhoodIssues.medicalProblems ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Not Enough Friends:</strong> {selectedPatient.history.childhoodIssues.notEnoughFriends ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Others:</strong> {selectedPatient.history.childhoodIssues.others}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - School Problems:</strong> {selectedPatient.history.childhoodIssues.schoolProblems ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Severely Bullied:</strong> {selectedPatient.history.childhoodIssues.severelyBullied ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Severely Punished:</strong> {selectedPatient.history.childhoodIssues.severelyPunished ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Sexually Abused:</strong> {selectedPatient.history.childhoodIssues.sexuallyAbused ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Strong Religious Convictions:</strong> {selectedPatient.history.childhoodIssues.strongReligiousConvictions ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Unhappy Childhood:</strong> {selectedPatient.history.childhoodIssues.unhappyChildhood ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Childhood Issues - Used Alcohol:</strong> {selectedPatient.history.childhoodIssues.usedAlcohol ? "Yes" : "No"}</p>

              <p className="text-sm sm:text-base"><strong>Presenting Problems - Helpful Attempts:</strong> {selectedPatient.history.presentingProblems.helpfulAttempts}</p>
              <p className="text-sm sm:text-base"><strong>Presenting Problems - Main Problems:</strong> {selectedPatient.history.presentingProblems.mainProblems}</p>
              <p className="text-sm sm:text-base"><strong>Presenting Problems - Problem Start:</strong> {selectedPatient.history.presentingProblems.problemStart}</p>
              <p className="text-sm sm:text-base"><strong>Presenting Problems - Problem Worsen:</strong> {selectedPatient.history.presentingProblems.problemWorsen}</p>
              <p className="text-sm sm:text-base"><strong>Presenting Problems - Severity:</strong> {selectedPatient.history.presentingProblems.severity}</p>

              <p className="text-sm sm:text-base"><strong>Satisfaction and Tension - Life Satisfaction:</strong> {selectedPatient.history.satisfactionAndTension.lifeSatisfaction}</p>
              <p className="text-sm sm:text-base"><strong>Satisfaction and Tension - Overall Tension:</strong> {selectedPatient.history.satisfactionAndTension.overallTension}</p>

              <p className="text-sm sm:text-base"><strong>Therapy Expectations - About Therapy:</strong> {selectedPatient.history.therapyExpectations.aboutTherapy}</p>
              <p className="text-sm sm:text-base"><strong>Therapy Expectations - Therapist Qualities:</strong> {selectedPatient.history.therapyExpectations.therapistQualities}</p>
              <p className="text-sm sm:text-base"><strong>Therapy Expectations - Therapy Duration:</strong> {selectedPatient.history.therapyExpectations.therapyDuration}</p>
              <p className="text-sm sm:text-base"><strong>Aggressive Behavior:</strong> false</p>
              <p className="text-sm sm:text-base"><strong>Can't Keep a Job:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Compulsions:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Concentration Difficulties:</strong> false</p>
              <p className="text-sm sm:text-base"><strong>Crying:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Drink Too Much:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Eating Problems:</strong> false</p>
              <p className="text-sm sm:text-base"><strong>Impulsive Reactions:</strong> false</p>
              <p className="text-sm sm:text-base"><strong>Insomnia:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Lazy:</strong> false</p>
              <p className="text-sm sm:text-base"><strong>Loss of Control:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Nervous Tics:</strong> false</p>
              <p className="text-sm sm:text-base"><strong>Odd Behavior:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Others:</strong> </p>
              <p className="text-sm sm:text-base"><strong>Outbursts of Temper:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Overeat:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Phobic Avoidance:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Procrastination:</strong> false</p>
              <p className="text-sm sm:text-base"><strong>Sleep Disturbance:</strong> false</p>
              <p className="text-sm sm:text-base"><strong>Smoke:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Spend Too Much Money:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Suicidal Attempts:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Take Drugs:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Take Too Many Risks:</strong> false</p>
              <p className="text-sm sm:text-base"><strong>Unassertive:</strong> true</p>
              <p className="text-sm sm:text-base"><strong>Withdrawal:</strong> false</p>
              <p className="text-sm sm:text-base"><strong>Work Too Hard:</strong> false</p>


            </div>
          </div>
          <div className="mt-4">
            <label className="block mb-2">
              Prescription:
              <input
                type="text"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
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
