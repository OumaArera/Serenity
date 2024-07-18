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
          <h3 className="text-xl font-bold mb-4">GENERAL INFORMATION</h3>
          <h4 className="text-md font-bold mb-4"><strong>Name: </strong>{selectedPatient.patientName}</h4>
          <div className="space-y-2">
            <div className="bg-gray-100 p-2 rounded shadow-md break-words">
              <p className="text-sm sm:text-base"><strong>Date:</strong> {selectedPatient.history.date}</p>
              <p className="text-sm sm:text-base"><strong>Address:</strong> {selectedPatient.history.address}</p>
              <p className="text-sm sm:text-base"><strong>Telephone Day:</strong> {selectedPatient.history.telephone.day}</p>
              <p className="text-sm sm:text-base"><strong>Telephone Evening:</strong> {selectedPatient.history.telephone.evening}</p>
              <p className="text-sm sm:text-base"><strong>Age:</strong> {selectedPatient.history.age}</p>
              <p className="text-sm sm:text-base"><strong>Occupation:</strong> {selectedPatient.history.occupation}</p>
              <p className="text-sm sm:text-base"><strong>Sex:</strong> {selectedPatient.history.sex}</p>
              <p className="text-sm sm:text-base"><strong>Date of Birth:</strong> {selectedPatient.history.dateOfBirth}</p>
              <p className="text-sm sm:text-base"><strong>Place of Birth:</strong> {selectedPatient.history.placeOfBirth}</p>
              <p className="text-sm sm:text-base"><strong>Religion:</strong> {selectedPatient.history.religion}</p>
              <p className="text-sm sm:text-base"><strong>Height:</strong> {selectedPatient.history.height}</p>
              <p className="text-sm sm:text-base"><strong>Weight:</strong> {selectedPatient.history.weight}</p>
              <p className="text-sm sm:text-base"><strong>Weight Fluctuate:</strong> {selectedPatient.history.weightFluctuate}</p>
              <p className="text-sm sm:text-base"><strong>Weight Fluctuate Amount:</strong> {selectedPatient.history.weightFluctuateAmount}</p>
              <p className="text-sm sm:text-base"><strong>Family Physician:</strong> {selectedPatient.history.familyPhysician}</p>
              <p className="text-sm sm:text-base"><strong>Physician Name:</strong> {selectedPatient.history.physicianName}</p>
              <p className="text-sm sm:text-base"><strong>Physician Telephone:</strong> {selectedPatient.history.physicianTelephone}</p>
              <p className="text-sm sm:text-base"><strong>Referred By:</strong> {selectedPatient.history.referredBy}</p>
              <p className="text-sm sm:text-base"><strong>Marital Status:</strong> {selectedPatient.history.maritalStatus}</p>
              <p className="text-sm sm:text-base"><strong>Marital Times:</strong> {selectedPatient.history.maritalTimes}</p>
              <p className="text-sm sm:text-base"><strong>Living In:</strong> {selectedPatient.history.livingIn}</p>
              <p className="text-sm sm:text-base"><strong>Living With:</strong> {selectedPatient.history.livingWith.join(', ')}</p>
              <p className="text-sm sm:text-base"><strong>Present Work:</strong> {selectedPatient.history.presentWork}</p>
              <p className="text-sm sm:text-base"><strong>Work Satisfaction:</strong> {selectedPatient.history.workSatisfaction}</p>
              <p className="text-sm sm:text-base"><strong>Work Satisfaction Explanation:</strong> {selectedPatient.history.workSatisfactionExplanation}</p>
              <p className="text-sm sm:text-base"><strong>Past Jobs:</strong> {selectedPatient.history.pastJobs}</p> 
              <p className="text-sm sm:text-base"><strong>Therapy Before:</strong> {selectedPatient.history.therapyBefore}</p>
              {/* <p className="text-sm sm:text-base"><strong>Hospitalization Details:</strong> {selectedPatient.history.hospitalizationDetails}</p> */}
              <p className="text-sm sm:text-base"><strong>Hospitalized Before:</strong> {selectedPatient.history.hospitalizedBefore}</p>
              <p className="text-sm sm:text-base"><strong>Hospitalized Details:</strong> {selectedPatient.history.hospitalizedDetails}</p>
              <p className="text-sm sm:text-base"><strong>Attempted Suicide:</strong> {selectedPatient.history.attemptedSuicide}</p>
              <p className="text-sm sm:text-base"><strong>Family Emotional Disorder Details:</strong> {selectedPatient.history.familyEmotionalDisorderDetails}</p>
              <p className="text-sm sm:text-base"><strong>Family Suicide:</strong> {selectedPatient.history.familySuicide}</p>
              <p className="text-sm sm:text-base"><strong>Family Suicide Details:</strong> {selectedPatient.history.familySuicideDetails}</p>

              <h4 className="text-xl font-bold mb-4">PERSONAL AND SOCIAL HISTORY</h4>
              <p className="text-sm sm:text-base"><strong>Father's name: </strong>{selectedPatient.history.fatherName}</p>
              <p className="text-sm sm:text-base"><strong>Father's age: </strong>{selectedPatient.history.fatherAge}</p>
              <p className="text-sm sm:text-base"><strong>Father's age when he died: </strong>{selectedPatient.history.fatherDeathTime}</p>
              <p className="text-sm sm:text-base"><strong>Father's occupation: </strong>{selectedPatient.history.fatherOccupation}</p>
              <p className="text-sm sm:text-base"><strong>Father's health: </strong>{selectedPatient.history.fatherHealth}</p>
              <p className="text-sm sm:text-base"><strong>Age when father died: </strong>{selectedPatient.history.fatherDeathAge}</p>
              <p className="text-sm sm:text-base"><strong>Cause of father's death: </strong>{selectedPatient.history.fatherDeathCause}</p>
              <p className="text-sm sm:text-base"><strong>Mother's name: </strong>{selectedPatient.history.motherName}</p>
              <p className="text-sm sm:text-base"><strong>Mother's age: </strong>{selectedPatient.history.motherAge}</p>
              <p className="text-sm sm:text-base"><strong>Mother's occupation: </strong>{selectedPatient.history.motherOccupation}</p>
              <p className="text-sm sm:text-base"><strong>Mother's health: </strong>{selectedPatient.history.motherHealth}</p>
              <p className="text-sm sm:text-base"><strong>Mother's age when she died: </strong>{selectedPatient.history.motherDeathTime}</p>
              <p className="text-sm sm:text-base"><strong>Age when mother died: </strong>{selectedPatient.history.motherDeathAge}</p>
              <p className="text-sm sm:text-base"><strong>Mother's cause of death: </strong>{selectedPatient.history.motherDeathCause}</p>
              <p className="text-sm sm:text-base"><strong>Brothers ages range: </strong>{selectedPatient.history.brothersAges}</p>
              <p className="text-sm sm:text-base"><strong>Sisters ages range: </strong>{selectedPatient.history.sistersAges}</p>
              <p className="text-sm sm:text-base"><strong>Significant details about siblings: </strong>{selectedPatient.history.siblingsDetails}</p>
              <p className="text-sm sm:text-base"><strong>Who raised you?: </strong>{selectedPatient.history.raisedBy}</p>
              <p className="text-sm sm:text-base"><strong>Age when raised by step parents: </strong>{selectedPatient.history.stepParentAge}</p>
              <p className="text-sm sm:text-base"><strong>Father's personality: </strong>{selectedPatient.history.fatherPersonality}</p>
              <p className="text-sm sm:text-base"><strong>Mother's personality: </strong>{selectedPatient.history.motherPersonality}</p>
              <p className="text-sm sm:text-base"><strong>How parents administered discipline: </strong>{selectedPatient.history.discipline}</p>
              <p className="text-sm sm:text-base"><strong>Atmosphere at home: </strong>{selectedPatient.history.homeAtmosphere}</p>
              <p className="text-sm sm:text-base"><strong>Could confide in parents: </strong>{selectedPatient.history.confideParents}</p>
              <p className="text-sm sm:text-base"><strong>Feeling loved and respected by parents: </strong>{selectedPatient.history.feelLoved}</p>
              <p className="text-sm sm:text-base"><strong>Interferance at home: </strong>{selectedPatient.history.interference}</p>
              <p className="text-sm sm:text-base"><strong>Interferance details: </strong>{selectedPatient.history.interferenceDetails}</p>
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

              <h4 className="text-xl font-bold mb-4">DESCRIPTION OF PRESENTING PROBLEMS</h4>
              <p className="text-sm sm:text-base"><strong>Presenting Problems - Main Problems:</strong> {selectedPatient.history.presentingProblems.mainProblems}</p>
              <p className="text-sm sm:text-base"><strong>Presenting Problems - Severity:</strong> {selectedPatient.history.presentingProblems.severity}</p>
              <p className="text-sm sm:text-base"><strong>Presenting Problems - Problem Start:</strong> {selectedPatient.history.presentingProblems.problemStart}</p>
              <p className="text-sm sm:text-base"><strong>Presenting Problems - What is worsening it:</strong> {selectedPatient.history.presentingProblems.problemWorsen}</p>
              <p className="text-sm sm:text-base"><strong>Presenting Problems - Helpful Intervention:</strong> {selectedPatient.history.presentingProblems.helpfulAttempts}</p>
              <p className="text-sm sm:text-base"><strong>Satisfaction With Life: </strong> {selectedPatient.history.satisfactionAndTension.lifeSatisfaction} 1(Not satisfied)- 7(Very satisfied)</p>
              <p className="text-sm sm:text-base"><strong>Overall Tension Rating: </strong> {selectedPatient.history.satisfactionAndTension.overallTension} 1(Relaxed)- 7(Tensed)</p>
              
              <h4 className="text-xl font-bold mb-4">EXPECTATIONS REGARDING THERAPY</h4>
              <p className="text-sm sm:text-base"><strong>Therapy Expectations - About Therapy:</strong> {selectedPatient.history.therapyExpectations.aboutTherapy}</p>
              <p className="text-sm sm:text-base"><strong>Therapy Expectations - Therapist Qualities:</strong> {selectedPatient.history.therapyExpectations.therapistQualities}</p>
              <p className="text-sm sm:text-base"><strong>Therapy Expectations - Therapy Duration:</strong> {selectedPatient.history.therapyExpectations.therapyDuration}</p>
              <br />
              <h4 className="text-xl font-bold mb-4">MODALITY ANALYSIS OF CURRENT PROBLEMS</h4>
              <h5 className="text-md font-bold mb-4">Behaviour</h5>
              <p className="text-sm sm:text-base"><strong>Aggressive Behavior:</strong>{selectedPatient.history.modalityAnalysis.behaviors.aggressiveBehavior ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Can't Keep a Job:</strong>{selectedPatient.history.modalityAnalysis.behaviors.cantKeepAJob ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Compulsions:</strong>{selectedPatient.history.modalityAnalysis.behaviors.compulsions ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Concentration Difficulties:</strong>{selectedPatient.history.modalityAnalysis.behaviors.concentrationDifficulties ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Crying:</strong>{selectedPatient.history.modalityAnalysis.behaviors.crying ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Drink Too Much:</strong>{selectedPatient.history.modalityAnalysis.behaviors.drinkTooMuch ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Eating Problems:</strong> {selectedPatient.history.modalityAnalysis.behaviors.eatingProblems ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Impulsive Reactions:</strong> {selectedPatient.history.modalityAnalysis.behaviors.impulsiveReactions ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Insomnia:</strong> {selectedPatient.history.modalityAnalysis.behaviors.insomnia ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Lazy:</strong> {selectedPatient.history.modalityAnalysis.behaviors.lazy ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Loss of Control:</strong> {selectedPatient.history.modalityAnalysis.behaviors.lossOfControl ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Nervous Tics:</strong> {selectedPatient.history.modalityAnalysis.behaviors.nervousTics ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Odd Behavior:</strong> {selectedPatient.history.modalityAnalysis.behaviors.oddBehavior ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Others:</strong> {selectedPatient.history.modalityAnalysis.behaviors.others}</p>
              <p className="text-sm sm:text-base"><strong>Outbursts of Temper:</strong> {selectedPatient.history.modalityAnalysis.behaviors.outburstsOfTemper ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Overeat:</strong> {selectedPatient.history.modalityAnalysis.behaviors.overEat ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Phobic Avoidance:</strong> {selectedPatient.history.modalityAnalysis.behaviors.phobicAvoidance ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Procrastination:</strong> {selectedPatient.history.modalityAnalysis.behaviors.procrastination ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Sleep Disturbance:</strong> {selectedPatient.history.modalityAnalysis.behaviors.sleepDisturbance ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Smoke:</strong> {selectedPatient.history.modalityAnalysis.behaviors.smoke ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Spend Too Much Money:</strong> {selectedPatient.history.modalityAnalysis.behaviors.spendTooMuchMoney ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Suicidal Attempts:</strong> {selectedPatient.history.modalityAnalysis.behaviors.suicidalAttempts ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Take Drugs:</strong> {selectedPatient.history.modalityAnalysis.behaviors.takeDrugs ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Take Too Many Risks:</strong> {selectedPatient.history.modalityAnalysis.behaviors.takeTooManyRisks ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Unassertive:</strong> {selectedPatient.history.modalityAnalysis.behaviors.unassertive ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Withdrawal:</strong> {selectedPatient.history.modalityAnalysis.behaviors.withdrawal ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Work Too Hard:</strong> {selectedPatient.history.modalityAnalysis.behaviors.workTooHard ? "Yes" : "No"}</p>
              <br />
              <p className="text-sm sm:text-base"><strong>Skills and Special talents: </strong> {selectedPatient.history.talentsAndSkills.specialTalents}</p>
              <p className="text-sm sm:text-base"><strong>What to start doing: </strong> {selectedPatient.history.talentsAndSkills.startDoing}</p>
              <p className="text-sm sm:text-base"><strong>What to stop doing: </strong> {selectedPatient.history.talentsAndSkills.stopDoing}</p>
              <p className="text-sm sm:text-base"><strong>How free time is spent: </strong> {selectedPatient.history.talentsAndSkills.freeTimeSpent}</p>
              <p className="text-sm sm:text-base"><strong>Hobbies and leisure: </strong> {selectedPatient.history.talentsAndSkills.hobbies}</p>
              <p className="text-sm sm:text-base"><strong>Trouble relaxing: </strong> {selectedPatient.history.talentsAndSkills.troubleRelaxing}</p>
              <p className="text-sm sm:text-base"><strong>Reason for trouble relaxing: </strong> {selectedPatient.history.talentsAndSkills.troubleRelaxingExplanation}</p>
              <p className="text-sm sm:text-base"><strong>Two wishes: </strong> {selectedPatient.history.talentsAndSkills.twoWishes}</p>
              <br />
              <h5 className="text-md font-bold mb-4">Feelings</h5>
              <p className="text-sm sm:text-base"><strong>Angry:</strong> {selectedPatient.history.feelings.angry ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Annoyed:</strong> {selectedPatient.history.feelings.annoyed ? "Yes" : "No"}</p> 
              <p className="text-sm sm:text-base"><strong>Anxious:</strong> {selectedPatient.history.feelings.anxious ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Bored:</strong> {selectedPatient.history.feelings.bored ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Conflicted:</strong> {selectedPatient.history.feelings.conflicted ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Contented:</strong> {selectedPatient.history.feelings.contented ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Depressed:</strong> {selectedPatient.history.feelings.depressed ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Energetic:</strong> {selectedPatient.history.feelings.energetic ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Envious:</strong> {selectedPatient.history.feelings.envious ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Excited:</strong> {selectedPatient.history.feelings.excited ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Fearful:</strong> {selectedPatient.history.feelings.fearful ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Guilty:</strong> {selectedPatient.history.feelings.guilty ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Happy:</strong> {selectedPatient.history.feelings.happy ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Helpless:</strong> {selectedPatient.history.feelings.helpless ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Hopeful:</strong> {selectedPatient.history.feelings.hopeful ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Hopeless:</strong> {selectedPatient.history.feelings.hopeless ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Jealous:</strong> {selectedPatient.history.feelings.jealous ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Lonely:</strong> {selectedPatient.history.feelings.lonely ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Optimistic:</strong> {selectedPatient.history.feelings.optimistic ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Panicky:</strong> {selectedPatient.history.feelings.panicky ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Regretful:</strong> {selectedPatient.history.feelings.regretful ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Relaxed:</strong> {selectedPatient.history.feelings.relaxed ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Restless:</strong> {selectedPatient.history.feelings.restless ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Sad:</strong> {selectedPatient.history.feelings.sad ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Shameful:</strong> {selectedPatient.history.feelings.shameful ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Tense:</strong> {selectedPatient.history.feelings.tense ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Unhappy:</strong> {selectedPatient.history.feelings.unhappy ? "Yes" : "No"}</p>
              <br />
              <p className="text-md font-bold mb-4">Fears</p>
              {selectedPatient.history.fears.map((fear, index) => (
                <p className="text-sm sm:text-base" key={index}><strong>Fear {index + 1}:</strong> {fear}</p>
              ))}
              <p className="text-sm sm:text-base"><strong>Positive feelings about self: </strong> {selectedPatient.history.positiveFeelings}</p>
              <p className="text-sm sm:text-base"><strong>When most likely to lose control of feelings: </strong> {selectedPatient.history.loseControlSituations}</p>
              <p className="text-sm sm:text-base"><strong>Situation that makes feel calm or relax: </strong> {selectedPatient.history.calmSituations}</p>
              <h5 className="text-md font-bold mb-4">Physical Sensations</h5>
              <p className="text-sm sm:text-base"><strong>Abdominal Pain:</strong> {selectedPatient.history.physicalSensations.abdominalPain ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Back Pain:</strong> {selectedPatient.history.physicalSensations.backPain ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Blackouts:</strong> {selectedPatient.history.physicalSensations.blackouts ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Bowel Disturbances:</strong> {selectedPatient.history.physicalSensations.bowelDisturbances ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Burning or Itching Skin:</strong> {selectedPatient.history.physicalSensations.burningOrItchingSkin ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Chest Pain:</strong> {selectedPatient.history.physicalSensations.chestPain ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Dizziness:</strong> {selectedPatient.history.physicalSensations.dizziness ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Dry Mouth:</strong> {selectedPatient.history.physicalSensations.dryMouth ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Excessive Sweating:</strong> {selectedPatient.history.physicalSensations.excessiveSweating ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Fainting Spells:</strong> {selectedPatient.history.physicalSensations.faintingSpells ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Fatigue:</strong> {selectedPatient.history.physicalSensations.fatigue ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Flushes:</strong> {selectedPatient.history.physicalSensations.flushes ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Headaches:</strong> {selectedPatient.history.physicalSensations.headaches ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Hear Things:</strong> {selectedPatient.history.physicalSensations.hearThings ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Hearing Problems:</strong> {selectedPatient.history.physicalSensations.hearingProblems ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Menstrual Difficulties:</strong> {selectedPatient.history.physicalSensations.menstrualDifficulties ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Muscle Spasms:</strong> {selectedPatient.history.physicalSensations.muscleSpasms ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Nausea:</strong> {selectedPatient.history.physicalSensations.nausea ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Numbness:</strong> {selectedPatient.history.physicalSensations.numbness ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Burning paing during urination: </strong> {selectedPatient.history.physicalSensations.painOrBurningWithUrination ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Rapid Heart Beat:</strong> {selectedPatient.history.physicalSensations.rapidHeartBeat ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Nausea:</strong> {selectedPatient.history.physicalSensations.nausea ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Neck Pain:</strong> {selectedPatient.history.physicalSensations.neckPain ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Palpitations:</strong> {selectedPatient.history.physicalSensations.palpitations ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Sexual Problems:</strong> {selectedPatient.history.physicalSensations.sexualProblems ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Shortness of Breath:</strong> {selectedPatient.history.physicalSensations.shortnessOfBreath ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Skin Problems:</strong> {selectedPatient.history.physicalSensations.skinProblems ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Stomach Trouble:</strong> {selectedPatient.history.physicalSensations.stomachTrouble ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Tension:</strong> {selectedPatient.history.physicalSensations.tension ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Tics:</strong> {selectedPatient.history.physicalSensations.tics ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Tingling:</strong> {selectedPatient.history.physicalSensations.tingling ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Tremors: </strong> {selectedPatient.history.physicalSensations.tremors ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Twitches: </strong> {selectedPatient.history.physicalSensations.twitches ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Unable to relax: </strong> {selectedPatient.history.physicalSensations.unableToRelax ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Visual Disturbances: </strong> {selectedPatient.history.physicalSensations.visualDisturbances ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Watery Eyes: </strong> {selectedPatient.history.physicalSensations.wateryEyes ? "Yes" : "No"}</p>
              
              <br />
              <h5 className="text-md font-bold mb-4">Images</h5>
              {/* Add images later */}
              <br />
              <p className="text-sm sm:text-base"><strong>Pleasant Image:</strong> {selectedPatient.history.pleasantImage}</p>
              <p className="text-sm sm:text-base"><strong>Unpleasant Image:</strong> {selectedPatient.history.unpleasantImage}</p>
              <p className="text-sm sm:text-base"><strong>image of completely safe place:</strong> {selectedPatient.history.safePlace}</p>
              <p className="text-sm sm:text-base"><strong>Persistent or disturbing images that interfere with daily functioning: </strong> {selectedPatient.history.disturbingImages}</p>
              <p className="text-sm sm:text-base"><strong>Nightmares frequency:</strong> {selectedPatient.history.nightmaresFrequency}</p>
              <br />
              <h5 className="text-md font-bold mb-4">Thoughts</h5>
              <p className="text-sm sm:text-base"><strong>Ulcers:</strong> {selectedPatient.history.physicalSensations.ulcers ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Visual Problems:</strong> {selectedPatient.history.physicalSensations.visualProblems ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Vomiting:</strong> {selectedPatient.history.physicalSensations.vomiting ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Weakness:</strong> {selectedPatient.history.physicalSensations.weakness ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Abandoned:</strong> {selectedPatient.history.thoughts.abandoned ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Afraid:</strong> {selectedPatient.history.thoughts.afraid ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Ashamed:</strong> {selectedPatient.history.thoughts.ashamed ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Conflicted:</strong> {selectedPatient.history.thoughts.conflicted ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Contented:</strong> {selectedPatient.history.thoughts.contented ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Depressed:</strong> {selectedPatient.history.thoughts.depressed ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Disappointed:</strong> {selectedPatient.history.thoughts.disappointed ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Energetic:</strong> {selectedPatient.history.thoughts.energetic ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Fearful:</strong> {selectedPatient.history.thoughts.fearful ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Frustrated:</strong> {selectedPatient.history.thoughts.frustrated ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Guilty:</strong> {selectedPatient.history.thoughts.guilty ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Happy:</strong> {selectedPatient.history.thoughts.happy ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Helpless:</strong> {selectedPatient.history.thoughts.helpless ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Hopeful:</strong> {selectedPatient.history.thoughts.hopeful ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Hopeless:</strong> {selectedPatient.history.thoughts.hopeless ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Inadequate:</strong> {selectedPatient.history.thoughts.inadequate ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Insecure:</strong> {selectedPatient.history.thoughts.insecure ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Lonely:</strong> {selectedPatient.history.thoughts.lonely ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Overwhelmed:</strong> {selectedPatient.history.thoughts.overwhelmed ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Panicky:</strong> {selectedPatient.history.thoughts.panicky ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Relaxed:</strong> {selectedPatient.history.thoughts.relaxed ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Sad:</strong> {selectedPatient.history.thoughts.sad ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Shameful:</strong> {selectedPatient.history.thoughts.shameful ? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Bothered by thoughts that occur over and over again:</strong> {selectedPatient.history.botheredByThoughts? "Yes" : "No"}</p>
              <p className="text-sm sm:text-base"><strong>Thoughts description:</strong> {selectedPatient.history.botheredThoughtsDescription}</p>
              <p className="text-sm sm:text-base"><strong>Negative worries:</strong> {selectedPatient.history.negativeWorries}</p>
              <h4 className="text-xl font-bold mb-4">INTERPERSONAL RELATIONSHIPS</h4>
              
              
              
              
              {/* <p className="text-sm sm:text-base"><strong>Name:</strong> {selectedPatient.history.name}</p> */}
              {/* <p className="text-sm sm:text-base"><strong>Number of Children:</strong> {selectedPatient.history.numberOfChildren}</p> */}
              
              {/* <p className="text-sm sm:text-base"><strong>Other Living:</strong> {selectedPatient.history.otherLiving}</p> */}
                   
              
              
              {/* <p className="text-sm sm:text-base"><strong>Spouse Age:</strong> {selectedPatient.history.spouseAge}</p> */}
              {/* <p className="text-sm sm:text-base"><strong>Spouse Name:</strong> {selectedPatient.history.spouseName}</p> */}
              {/* <p className="text-sm sm:text-base"><strong>Spouse Occupation:</strong> {selectedPatient.history.spouseOccupation}</p> */}
              
              
              


              {/* <p className="text-sm sm:text-base"><strong>Last Grade in school: </strong>{selectedPatient.history.lastGrade}</p> */}
              
              
              

              
              

              
              
              
              
              {/* <p className="text-sm sm:text-base"><strong>Lose Control Situations:</strong> {selectedPatient.history.loseControlSituations}</p> */}
              



              {/* <p className="text-sm sm:text-base"><strong>Sleep Difficulties:</strong> {selectedPatient.history.physicalSensations.sleepDifficulties ? "Yes" : "No"}</p> */}
              {/* <p className="text-sm sm:text-base"><strong>Speech Difficulties:</strong> {selectedPatient.history.physicalSensations.speechDifficulties ? "Yes" : "No"}</p> */}
              
              
              
              {/* <p className="text-sm sm:text-base"><strong>Traumatic Events:</strong></p> */}
              {/* {selectedPatient.history.traumaticEvents.map((event, index) => (
                <p className="text-sm sm:text-base" key={index}><strong>Event {index + 1}:</strong> {event}</p>
              ))} */}
              {/* <p className="text-sm sm:text-base"><strong>Challenges:</strong> {selectedPatient.history.challenges}</p>  */}

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
