import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const PATIENTS_HISTORY_URL = "https://insight-backend-g7dg.onrender.com/users/patient/history";
const PRESCRIPTION_URL = "https://insight-backend-g7dg.onrender.com/users/prescription";
const IMPRESSION_URL = "https://insight-backend-g7dg.onrender.com/users/post/impressions";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const PatientsHistory = () => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [impression, setImpression] = useState("");
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
    if (!prescription) return;
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

  const handleSubmitImpression = async () => {
    if (!token || !userId || !selectedPatient) return;
    if (!impression) return;
    setIsLoading(true);

    const dataToSend = {
      patientId: selectedPatient.patientId,
      doctorId: userId,
      date: new Date().toISOString(),
      impression: impression
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
      const response = await fetch(IMPRESSION_URL, {
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
        setImpression("");
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
          <h3 className="text-xl font-bold mb-4">BIO DATA</h3>
          <h4 className="text-md font-bold mb-4"><strong>Name: </strong>{selectedPatient.patientName}</h4>
          <div className="space-y-2">
            <div className="bg-gray-100 p-2 rounded shadow-md break-words">
              <p className="text-sm sm:text-base"><strong>Sex:</strong> {selectedPatient.history.sex}</p>
              <p className="text-sm sm:text-base"><strong>Date of Birth:</strong> {selectedPatient.history.dateOfBirth.day}/{selectedPatient.history.dateOfBirth.month}/{selectedPatient.history.dateOfBirth.year}</p>
              <p className="text-sm sm:text-base"><strong>Address:</strong> {selectedPatient.history.address}</p>
              <p className="text-sm sm:text-base"><strong>Phone number:</strong> {selectedPatient.history.phoneNumber}</p>
              <p className="text-sm sm:text-base"><strong>Height:</strong> {selectedPatient.history.height} {selectedPatient.history.heightUnit}</p>
              <p className="text-sm sm:text-base"><strong>Weight:</strong> {selectedPatient.history.weight} {selectedPatient.history.weightUnit}</p>
              <p className="text-sm sm:text-base"><strong>Weight flactuation margin:</strong> {selectedPatient.history.weightFluctuationMargin} {selectedPatient.history.weightUnit}</p>
              <p className="text-sm sm:text-base"><strong>Next of kin name:</strong> {selectedPatient.history.nextOfKin}</p>
              <p className="text-sm sm:text-base"><strong>Next of kin phone number:</strong> {selectedPatient.history.nextOfKinPhoneNumber}</p>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-4">FAMILY INFORMATION</h3>
          <div className="space-y-2">
            <div className="bg-gray-100 p-2 rounded shadow-md break-words">
            
              <p className="text-sm sm:text-base"><strong>Father's name:</strong> {selectedPatient.history.fatherName}</p>
              {selectedPatient.history.fatherAlive === "yes"? (
                <div>
                  <p className="text-sm sm:text-base"><strong>Father alive:</strong> {selectedPatient.history.fatherAlive}</p>
                  <p className="text-sm sm:text-base"><strong>Father's age:</strong> {selectedPatient.history.fatherAge}</p>
                  <p className="text-sm sm:text-base"><strong>Father's occupation:</strong> {selectedPatient.history.fatherOccupation}</p>
                  <p className="text-sm sm:text-base"><strong>Father's health:</strong> {selectedPatient.history.fatherHealth}</p>
                  <p className="text-sm sm:text-base"><strong>Father's personality:</strong> {selectedPatient.history.fatherPersonality}</p>
                  
                </div>
              ):(
                <div>
                  <p className="text-sm sm:text-base"><strong>Father alive:</strong> {selectedPatient.history.fatherAlive}</p>
                  <p className="text-sm sm:text-base"><strong>Cause of death:</strong> {selectedPatient.history.fatherCauseOfDeath}</p>
                  <p className="text-sm sm:text-base"><strong>Father's occupation:</strong> {selectedPatient.history.fatherOccupation}</p>
                  <p className="text-sm sm:text-base"><strong>Father's personality:</strong> {selectedPatient.history.fatherPersonality}</p>
                  <p className="text-sm sm:text-base"><strong>Age of father when he died:</strong> {selectedPatient.history.ageOfFatherWhenDied}</p>
                  <p className="text-sm sm:text-base"><strong>My age when father died:</strong> {selectedPatient.history.ageOfUserWhenFatherDied}</p>
                  <p className="text-sm sm:text-base"><strong>Felt loved by father:</strong> {selectedPatient.history.feltLovedByFather}</p>
                  <p className="text-sm sm:text-base"><strong>Relationship with father:</strong> {selectedPatient.history.relationshipWithFather}</p>
                </div>
              )}
              <p className="text-sm sm:text-base"><strong>Mother's name:</strong> {selectedPatient.history.motherName}</p>
              {selectedPatient.history.motherAlive === "yes"? (
                <div>
                  <p className="text-sm sm:text-base"><strong>Mother alive:</strong> {selectedPatient.history.motherAlive}</p>
                  <p className="text-sm sm:text-base"><strong>Mother's age:</strong> {selectedPatient.history.motherAge}</p>
                  <p className="text-sm sm:text-base"><strong>Mother's occupation:</strong> {selectedPatient.history.motherOccupation}</p>
                  <p className="text-sm sm:text-base"><strong>Mother's health:</strong> {selectedPatient.history.motherHealth}</p>
                  <p className="text-sm sm:text-base"><strong>Mother's personality:</strong> {selectedPatient.history.motherPersonality}</p>
                  <p className="text-sm sm:text-base"><strong>Mother's occupation:</strong> {selectedPatient.history.fatherOccupation}</p>
                </div>
              ):(
                <div>
                  <p className="text-sm sm:text-base"><strong>Mother alive:</strong> {selectedPatient.history.motherAlive}</p>
                  <p className="text-sm sm:text-base"><strong>Cause of death:</strong> {selectedPatient.history.motherCauseOfDeath}</p>
                  <p className="text-sm sm:text-base"><strong>Mother's occupation:</strong> {selectedPatient.history.motherOccupation}</p>
                  <p className="text-sm sm:text-base"><strong>Mother's personality:</strong> {selectedPatient.history.motherPersonality}</p>
                  <p className="text-sm sm:text-base"><strong>Age of mother when she died:</strong> {selectedPatient.history.ageOfMotherWhenDied}</p>
                  <p className="text-sm sm:text-base"><strong>My age when mother died:</strong> {selectedPatient.history.ageOfUserWhenMotherDied}</p>
                  <p className="text-sm sm:text-base"><strong>Felt loved by mother:</strong> {selectedPatient.history.feltLovedByMother}</p>
                  <p className="text-sm sm:text-base"><strong>Relationship with mother:</strong> {selectedPatient.history.relationshipWithMother}</p>
                </div>
              )}
              {selectedPatient.history.hasSiblings === "yes"? (
                <div>
                  <p className="text-sm sm:text-base"><strong>Has siblings:</strong> {selectedPatient.history.hasSiblings}</p>
                  <p className="text-sm sm:text-base"><strong>Brothers age range:</strong> {selectedPatient.history.brothersAgeRanges}</p>
                  <p className="text-sm sm:text-base"><strong>Sisters age range:</strong> {selectedPatient.history.sistersAgeRanges}</p>
                  <p className="text-sm sm:text-base"><strong>Relevant information about siblings:</strong> {selectedPatient.history.relevantInfoAboutSiblings}</p>
                </div>
              ): (
                <p className="text-sm sm:text-base"><strong>Has siblings:</strong> {selectedPatient.history.hasSiblings}</p>
              )}
              <p className="text-sm sm:text-base"><strong>Felt loved at home:</strong> {selectedPatient.history.feltLovedAtHome}</p>
              <p className="text-sm sm:text-base"><strong>Home environment:</strong> {selectedPatient.history.homeEnvironment}</p>
              <p className="text-sm sm:text-base"><strong>Relationship with parents:</strong> {selectedPatient.history.relationshipWithParents}</p>

              {selectedPatient.history.parentsDivorced === "divorced" ? (
                <div>
                  <p className="text-sm sm:text-base"><strong>Parents divorced:</strong> {selectedPatient.history.parentsDivorced}</p>
                  <p className="text-sm sm:text-base"><strong>Age when parents divorced:</strong> {selectedPatient.history.ageWhenDivorced}</p>
                  <p className="text-sm sm:text-base"><strong>Life during divorce:</strong> {selectedPatient.history.lifeDuringDivorce}</p>
                  <p className="text-sm sm:text-base"><strong>Raised by step parents:</strong> {selectedPatient.history.raisedByStepParents}</p>
                  <p className="text-sm sm:text-base"><strong>Relationship with parents:</strong> {selectedPatient.history.relationshipWithParents}</p>
                </div>
              ): (
                <p className="text-sm sm:text-base"><strong>Parents divorced:</strong> {selectedPatient.history.parentsDivorced}</p>
              )}
              
              <p className="text-sm sm:text-base"><strong>Any other information:</strong> {selectedPatient.history.additionalInfo}</p> 
            </div>
            <h3 className="text-xl font-bold mb-4">FAMILY HEALTH</h3>
            <div className="space-y-2">
              <div className="bg-gray-100 p-2 rounded shadow-md break-words">
                <p className="text-sm sm:text-base"><strong>Family health problems:</strong> {selectedPatient.history.familyHealthProblems}</p>
                <p className="text-sm sm:text-base"><strong>History of accidents or scars in family:</strong> {selectedPatient.history.accidentsAndScars}</p>
                <p className="text-sm sm:text-base"><strong>Family history of surgeries:</strong> {selectedPatient.history.surgicalHistory}</p>
                <p className="text-sm sm:text-base"><strong>Family history of suicide:</strong> {selectedPatient.history.familySuicide}</p>
                <p className="text-sm sm:text-base"><strong>Any other family information:</strong> {selectedPatient.history.otherFamilyHealthData}</p>
                <p className="text-sm sm:text-base"><strong>Feeling concerned about personal health:</strong> {selectedPatient.history.healthConcerns}</p>
                <p className="text-sm sm:text-base"><strong>Other health concerns:</strong> {selectedPatient.history.otherHealthConcerns}</p>
                <p className="text-sm sm:text-base"><strong>Feeling anxious:</strong> {selectedPatient.history.anxiety}</p>
                <p className="text-sm sm:text-base"><strong>Feeling depressed:</strong> {selectedPatient.history.depression}</p>
                <p className="text-sm sm:text-base"><strong>Feeling suicidal:</strong> {selectedPatient.history.selfSuicide}</p>
                <p className="text-sm sm:text-base"><strong>Feeling like self harming:</strong> {selectedPatient.history.selfHarm}</p>
                <p className="text-sm sm:text-base"><strong>Feeling psychotic:</strong> {selectedPatient.history.psychosis}</p>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4">SEXUAL LIFE</h3>
            <div className="space-y-2">
              <div className="bg-gray-100 p-2 rounded shadow-md break-words">
                <p className="text-sm sm:text-base"><strong>Ease of making and retaining friends:</strong> {selectedPatient.history.makingFriends}</p>
                <p className="text-sm sm:text-base"><strong>Have close friends to confide in:</strong> {selectedPatient.history.closeFriends}</p>
                <p className="text-sm sm:text-base"><strong>Parents perception of sex:</strong> {selectedPatient.history.parentsPerception}</p>
                <p className="text-sm sm:text-base"><strong>When dicovered sexual impulses:</strong> {selectedPatient.history.discoveredSexualImpulses}</p>
                <p className="text-sm sm:text-base"><strong>Relationships with friends:</strong> {selectedPatient.history.relationshipWithFriends}</p>
                <p className="text-sm sm:text-base"><strong>Anxiety or guilt over sex or masturbation:</strong> {selectedPatient.history.anxietyOrGuilt}</p>
                <p className="text-sm sm:text-base"><strong>Marital status:</strong> {selectedPatient.history.maritalStatus}</p>
                <p className="text-sm sm:text-base"><strong>Feel loved by spouse:</strong> {selectedPatient.history.feelLovedBySpouse}</p>
                <p className="text-sm sm:text-base"><strong>Spouse details:</strong> {selectedPatient.history.spouseDetails}</p>
                <p className="text-sm sm:text-base"><strong>Relationship satisfaction out of 10:</strong> {selectedPatient.history.marriageSatisfaction}</p>
                <p className="text-sm sm:text-base"><strong>Bothered by past sexual experiences:</strong> {selectedPatient.history.pastSexExperiences}</p>
                <p className="text-sm sm:text-base"><strong>Other relationship details:</strong> {selectedPatient.history.otherDetails}</p>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4">PROBLEM DESCRIPTION</h3>
            <div className="space-y-2">
              <div className="bg-gray-100 p-2 rounded shadow-md break-words">
              <h5 className="text-md font-bold mb-4">Children information</h5>
                {selectedPatient.history.children.map((child, index) => (
                  <div className="bg-white p-2 rounded shadow-md break-words mb-2" key={index}>
                      <p className="text-sm sm:text-base"><strong>Name:</strong> {child.name} | <strong>Age:</strong> {child.age} | <strong>Has problem:</strong> {child.hasProblem ? "YES" : "NO"} |  <strong>Problem:</strong> {child.problem}</p>
                      
                  </div>
                ))}
                <br />
                <h5 className="text-md font-bold mb-4">Drug abuse information</h5>
                {selectedPatient.history.drugs.map((drug, key) =>(
                  <div className="bg-white p-2 rounded shadow-md break-words mb-2" key={key}>
                    <p className="text-sm sm:text-base"><strong>Name:</strong> {drug.name} | <strong>When started:</strong> {drug.start} | <strong>When stopped:</strong> {drug.stop} | <strong>Reason for taking:</strong> {drug.reason} | <strong>Means of taking:</strong> {drug.means} | <strong>Amounts takens:</strong> {drug.amount}</p>
                  </div>
                ))}
                <br />
                <p className="text-sm sm:text-base"><strong>Mood out of 10:</strong> {selectedPatient.history.mood}</p>
                <p className="text-sm sm:text-base"><strong>Mood explanation:</strong> {selectedPatient.history.moodExplanation}</p>
                <p className="text-sm sm:text-base"><strong>Problem description:</strong> {selectedPatient.history.problems}</p>
                <p className="text-sm sm:text-base"><strong>Problem start:</strong> {selectedPatient.history.problemStart}</p>
                <p className="text-sm sm:text-base"><strong>Management methods that seem to work:</strong> {selectedPatient.history.managementMethods}</p>
                <p className="text-sm sm:text-base"><strong>What is worsening the problem:</strong> {selectedPatient.history.worseningFactors}</p>
                <p className="text-sm sm:text-base"><strong>Any other significant life event:</strong> {selectedPatient.history.mood}</p>
                <p className="text-sm sm:text-base"><strong>Therapy expectations:</strong> {selectedPatient.history.therapyExpectations}</p>
                <p className="text-sm sm:text-base"><strong>Expected therapy duration:</strong> {selectedPatient.history.therapyDuration}</p>
              </div>
            </div>

          </div>
          <div className="mt-4">
            <label className="block mb-2">
              Provide an impression/ formulation:
              <input
                type="text"
                value={impression}
                onChange={(e) => setImpression(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
                required
              />
            </label>
            <button
              className="bg-blue-700 hover:bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
              onClick={handleSubmitImpression}
            >
              Submit Impression
            </button>
          </div>
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>
          )}
          {success && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">{success}</div>
          )}
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
