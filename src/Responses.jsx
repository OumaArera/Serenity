import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const RESPONSES_URL = "https://insight-backend-g7dg.onrender.com/users/get/response";
const RATING_URL ="https://insight-backend-g7dg.onrender.com/users/rating";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const Responses = () => {
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("");
    const [responses, setResponses] = useState([]);
    const [error, setError] = useState("");
    const [expandedProfiles, setExpandedProfiles] = useState({});
    const [remarks, setRemarks] = useState("");
    const [progressRatings, setProgressRatings] = useState({});
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("userData");

        if (accessToken) setToken(JSON.parse(accessToken));
        if (userData) {
            const parsedData = JSON.parse(userData);
            setUserId(parsedData.userId);
        }
    }, []);

    useEffect(() => { getResponses(); }, [token, userId]);

    const getResponses = async () => {
        if (!token || !userId) return;

        try {
            const res = await fetch(RESPONSES_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await res.json();
            if (result.successful) {
                const decryptedBytes = CryptoJS.AES.decrypt(result.ciphertext, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
                    iv: CryptoJS.enc.Hex.parse(result.iv),
                    padding: CryptoJS.pad.Pkcs7,
                    mode: CryptoJS.mode.CBC
                });
                let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
                decryptedData = decryptedData.replace(/\0+$/, '');
                
                try {
                    const userData = JSON.parse(decryptedData);

                    setResponses(userData);
                } catch (jsonError) {
                    setError("Failed to parse JSON data");
                    console.error(jsonError);
                }
            } else {
                setError(result.message);
                setTimeout(() => setError(""), 5000);
            }
        } catch (error) {
            setError(`There was an error getting the data. Error ${error}`);
            setTimeout(() => setError(""), 5000);
        }
    };

    const formatResponseKey = (key) => {
        return key.replace(/_/g, ' ').replace(/,/g, ', ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    };

    const handleProfileToggle = (id) => {
        setExpandedProfiles(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const handleRemarksChange = (e) => {
        setRemarks(e.target.value);
    };

    const handleProgressChange = (patientId, question, value) => {
        setProgressRatings(prevState => ({
            ...prevState,
            [patientId]: {
                ...prevState[patientId],
                [question]: value
            }
        }));
    };

    const handleProgress = async patientId => {
        if (!token || !userId) return;
        setLoading(true);

        const dataToSend={
            patientId: parseInt(patientId),
            doctorId: userId,
            remarks: remarks,
            rating: progressRatings[patientId],
            dateTime: new Date().toISOString()
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
            const resp = await fetch(RATING_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const result = await resp.json();
            if (result.successful){
                setProgressRatings({});
                setRemarks("");
                setSuccess(result.message);
                setTimeout(() => setSuccess(""), 5000);
            }else{
                setError(result.message);
                setTimeout(() => setError(""), 5000);
            }
            
        } catch (error) {
            setError(`Failed to make request ${error}`);
            setTimeout(() => setError(""), 5000);
        }finally{
            setLoading(false);
        }

    };

    const progressQuestionsList = [
        "How has the patient's mood been?",
        "How has the patient's sleep been?",
        "How has the patient's appetite been?",
        "How has the patient's energy level been?",
        "How has the patient's concentration been?"
    ];

    const groupedResponses = responses.reduce((acc, response) => {
        if (!acc[response.patientId]) {
            acc[response.patientId] = {
                patientName: response.patientName,
                data: []
            };
        }
        acc[response.patientId].data.push(response);
        return acc;
    }, {});

    return (
        <div className="p-4">
            {Object.entries(groupedResponses).map(([patientId, { patientName, data }]) => (
                <div key={patientId} className="border rounded-lg p-4 mb-4 shadow">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{patientName}</h2>
                        <button
                            className="text-blue-500"
                            onClick={() => handleProfileToggle(patientId)}
                        >
                            {expandedProfiles[patientId] ? 'Hide' : 'View'} Details
                        </button>
                    </div>
                    {expandedProfiles[patientId] && (
                        <div className="mt-4">
                            {data.map((response) => (
                                <div key={response.id} className="border p-2 mb-2 rounded shadow-sm">
                                    <p className="text-sm text-gray-500">Date: {new Date(response.dateTime).toLocaleString()}</p>
                                    {Object.entries(JSON.parse(response.responses.replace(/'/g, '"'))).map(([key, value]) => (
                                        <p key={key} className="text-sm"><span className="font-semibold">{formatResponseKey(key)}:</span> {value}</p>
                                    ))}
                                </div>
                            ))}
                            <div className="mt-4">
                                <textarea
                                    className="w-full p-2 border rounded mb-2"
                                    placeholder="Enter remarks"
                                    value={remarks}
                                    onChange={handleRemarksChange}
                                    required
                                ></textarea>
                                {progressQuestionsList.map((question, index) => (
                                    <div key={index} className="mb-2">
                                        <p className="font-semibold">{question}</p>
                                        <div className="flex justify-around items-center">
                                            <label className="flex items-center">
                                                <input 
                                                    type="radio" 
                                                    name={`progress-${patientId}-${index}`} 
                                                    value="1" 
                                                    className="mr-1" 
                                                    onChange={() => handleProgressChange(patientId, question.replace(/\s+/g, '_'), 1)}
                                                /> 1 - Poor
                                            </label>
                                            <label className="flex items-center">
                                                <input 
                                                    type="radio" 
                                                    name={`progress-${patientId}-${index}`} 
                                                    value="2" 
                                                    className="mr-1" 
                                                    onChange={() => handleProgressChange(patientId, question.replace(/\s+/g, '_'), 2)}
                                                /> 2 - Average
                                            </label>
                                            <label className="flex items-center">
                                                <input 
                                                    type="radio" 
                                                    name={`progress-${patientId}-${index}`} 
                                                    value="3" 
                                                    className="mr-1" 
                                                    onChange={() => handleProgressChange(patientId, question.replace(/\s+/g, '_'), 3)}
                                                /> 3 - Good
                                            </label>
                                            <label className="flex items-center">
                                                <input 
                                                    type="radio" 
                                                    name={`progress-${patientId}-${index}`} 
                                                    value="4" 
                                                    className="mr-1" 
                                                    onChange={() => handleProgressChange(patientId, question.replace(/\s+/g, '_'), 4)}
                                                /> 4 - Better
                                            </label>
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    className="bg-blue-500 text-white p-2 rounded"
                                    onClick={() => handleProgress(patientId)}
                                >
                                    Submit Progress
                                </button>
                                {error && <p className="text-red-500">{error}</p>}
                                {success && <p className="text-green-700">{success}</p>}
                            </div>
                            {loading && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                                    <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-700"></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Responses;
