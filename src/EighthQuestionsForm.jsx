import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const PATIENT_HISTORY_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const EighthQuestionsForm = () => {
  const [formData, setFormData] = useState({
    easeMakingFriends: "",
    keepfriends: "",
    dateDuringHighSchool: "",
    dateDuringCollege: '',
    bulliedOrTeased: '',
    joyRelationship: '',
    griefRelationship: '',
    socialRelaxationDegree: '',
    friendsToSharePrivateThoughts: '',
    marriageDetails: {
      knownBeforeEngagement: '',
      engagedDuration: '',
      marriedDuration: '',
      spouseAge: '',
      spouseOccupation: '',
      spousePersonality: '',
      likeMostAboutSpouse: '',
      likeLeastAboutSpouse: '',
      maritalSatisfactionFactors: '',
      howPleasedWithMarriage: "",
      howYouGetAlongWithSpouseFriendsAndFamily: "",
      numberOfChildren: "",
      namesAndAgesOfChildren: "",
      anyChildrenPresentSpecialProblems: "",
      problemDescriprion:"",
      anyDedailsAboutPreviousMariages:"",

    },
    sexualRelationships: {
      parentsAttitudeTowardsSex:"",
      whenAndHowKnewOfSex:"",
      whenBecameAwareofPersonalSexualImpulses:"",
      experiencedAnxietyOrGuiltOutOfSexOrMasturbation:"",
      anxietyExplanation: "",
      anyOtherDetailsAboutFirstOrSubsequentSexualExperiences:"",
      presentSexLifeSatisfactory:"",
      presentSexLifeSatisfactoryExplanation:"",
      anySignificantHomosexualReactionsOrRelationships:"",
      anyOtherSexualConcern:""
    },
    otherRelationships:{
      anyProblemsInRelationshipWithOtherPeople:"",
      problemsWithRelationshipsExplanation:"",
      oneWayPeopleHurtMe:"",
      iCouldShockYouBy:"",
      mySpauseDescribesMeAs:"",
      myBestFriendThinksIAm:"",
      peopleWhoDislikeMe:"",
      currentlyDisturbedByAnyPastRejectionsOrLossofLove:"",
      rejectionExplanation:""

    }
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
    const { name, value, type } = e.target;
    const nameParts = name.split('.');

    if (nameParts.length > 1) {
      const [mainKey, subKey] = nameParts;
      setFormData((prevState) => ({
        ...prevState,
        [mainKey]: {
          ...prevState[mainKey],
          [subKey]: value,
        },
      }));
    } else {
      if (type === 'radio') {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value === 'Yes' ? true : false,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const currentDate = new Date().toISOString();

    const dataToSend = {
      userId: userId,
      pageNo: 8,
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
        <h2 className="text-xl font-bold mb-2">INTERPERSONAL RELATIONSHIPS</h2>
        <h2 className="text-xl font-bold mb-2 italic">Friendships</h2>
          <h2 className="text-xl font-bold mb-2">Do you make friends easily?</h2>
          <div className="mb-2">
            <input
              type="radio"
              name="easeMakingFriends"
              value="Yes"
              checked={formData.easeMakingFriends === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="easeMakingFriends"
              value="No"
              checked={formData.easeMakingFriends === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
          <h2 className="text-xl font-bold mb-2">Do you keep them?</h2>
          <div className="mb-2">
            <input
              type="radio"
              name="keepfriends"
              value="Yes"
              checked={formData.keepfriends === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="keepfriends"
              value="No"
              checked={formData.keepfriends === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
          <h2 className="text-xl font-bold mb-2">Did you date much during high school?</h2>
          <div className="mb-2">
            <input
              type="radio"
              name="dateDuringHighSchool"
              value="Yes"
              checked={formData.dateDuringHighSchool === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="dateDuringHighSchool"
              value="No"
              checked={formData.dateDuringHighSchool === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
          <h2 className="text-xl font-bold mb-2">Did you date much during college?</h2>
          <div className="mb-2">
            <input
              type="radio"
              name="dateDuringCollege"
              value="Yes"
              checked={formData.dateDuringCollege === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="dateDuringCollege"
              value="No"
              checked={formData.dateDuringCollege === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Were you ever bullied or severely teased?</h2>
          <div className="mb-2">
            <input
              type="radio"
              name="bulliedOrTeased"
              value="Yes"
              checked={formData.bulliedOrTeased === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="bulliedOrTeased"
              value="No"
              checked={formData.bulliedOrTeased === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Describe any relationship that gives you joy:</h2>
          <textarea
            name="joyRelationship"
            value={formData.joyRelationship}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Describe any relationship that gives you grief:</h2>
          <textarea
            name="griefRelationship"
            value={formData.griefRelationship}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 italic">Social Situations</h2>
          <label className="block mb-2">Rate the degree to which you generally feel relaxed and comfortable in social situations:</label>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mr-2">
                <input
                  type="radio"
                  name="socialRelaxationDegree"
                  value={num}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="mr-2">{num}</label>
              </div>
            ))}
          </div>
          <label className="block mb-2">Do you have one or more friends with whom you feel comfortable sharing your most private thoughts?</label>
          <div className="mb-2">
            <input
              type="radio"
              name="friendsToSharePrivateThoughts"
              value="Yes"
              checked={formData.friendsToSharePrivateThoughts === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="privateThoughts"
              value="No"
              checked={formData.privateThoughts === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 italic">Marriage/Committed Relationship</h2>
          <label className="block mb-2">How long did you know your spouse before your engagement?</label>
          <input
            type="text"
            name="marriageDetails.knownBeforeEngagement"
            value={formData.marriageDetails.knownBeforeEngagement}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">How long were you engaged before you got married?</label>
          <input
            type="text"
            name="marriageDetails.engagedDuration"
            value={formData.marriageDetails.engagedDuration}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">How long have you been married?</label>
          <input
            type="text"
            name="marriageDetails.marriedDuration"
            value={formData.marriageDetails.marriedDuration}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What is your spouse’s age?</label>
          <input
            type="text"
            name="marriageDetails.spouseAge"
            value={formData.marriageDetails.spouseAge}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">His/her occupation?</label>
          <input
            type="text"
            name="marriageDetails.spouseOccupation"
            value={formData.marriageDetails.spouseOccupation}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Describe your spouse’s personality:</label>
          <textarea
            name="marriageDetails.spousePersonality"
            value={formData.marriageDetails.spousePersonality}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What do you like the most about your spouse?</label>
          <textarea
            name="marriageDetails.likeMost"
            value={formData.marriageDetails.likeMostAboutSpouse}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What do you like least about your spouse?</label>
          <textarea
            name="marriageDetails.likeLeast"
            value={formData.marriageDetails.likeLeastAboutSpouse}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What factors detract from your marital satisfaction?</label>
          <textarea
            name="marriageDetails.maritalSatisfactionFactors"
            value={formData.marriageDetails.maritalSatisfactionFactors}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>
        <label className="block mb-2">On the scale below, please indicate how satisfied you're with your marriage:</label>
          <div className="flex mb-2">
            <h4>Very dissatisfied</h4>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mr-2">
                <input
                  type="radio"
                  name="howPleasedWithMarriage"
                  value={num}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="mr-2">{num}</label>
                <h4>Very satisfied</h4>
              </div>
            ))}
          </div>
          <label className="block mb-2">How do get along with your partner's friend and family</label>
          <div className="flex mb-2">
            <h4>Very dissatisfied</h4>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="mr-2">
                <input
                  type="radio"
                  name="howPleasedWithMarriage"
                  value={num}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="mr-2">{num}</label>
                <h4>Very satisfied</h4>
              </div>
            ))}
          </div>
          <label className="block mb-2">How many children do you have?</label>
          <textarea
            name="marriageDetails.numberOfChildren"
            value={formData.marriageDetails.numberOfChildren}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Please provide their names and ages:</label>
          <textarea
            name="marriageDetails.namesAndAgesOfChildren"
            value={formData.marriageDetails.namesAndAgesOfChildren}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <h2 className="text-xl font-bold mb-2">Do any of your children present special problems?</h2>
          <div className="mb-2">
            <input
              type="radio"
              name="marriageDetails.anyChildrenPresentSpecialProblems"
              value="Yes"
              checked={formData.marriageDetails.anyChildrenPresentSpecialProblems === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="marriageDetails.anyChildrenPresentSpecialProblems"
              value="No"
              checked={formData.marriageDetails.anyChildrenPresentSpecialProblems === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
          <label className="block mb-2">If yes, please describe the special problem:</label>
          <textarea
            name="marriageDetails.problemDescriprion"
            value={formData.marriageDetails.problemDescriprion}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Any significant details about a previous marriage(s):</label>
          <textarea
            name="marriageDetails.anyDedailsAboutPreviousMariages"
            value={formData.marriageDetails.anyDedailsAboutPreviousMariages}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <h2 className="text-xl font-bold mb-2 italic">Sexual Relationships</h2>
          <label className="block mb-2">Describe your parent's attitude towards sex. Was sex discussed in your home?</label>
          <textarea
            name="sexualRelationships.parentsAttitudeTowardsSex"
            value={formData.sexualRelationships.parentsAttitudeTowardsSex}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">When and how did you derive your first knowledge of sex?</label>
          <textarea
            name="sexualRelationships.whenAndHowKnewOfSex"
            value={formData.sexualRelationships.whenAndHowKnewOfSex}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">When did you first become aware of your own sexual impulses?</label>
          <textarea
            name="sexualRelationships.whenBecameAwareofPersonalSexualImpulses"
            value={formData.sexualRelationships.whenBecameAwareofPersonalSexualImpulses}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <h2 className="text-xl font-bold mb-2">Have you ever experienced any anxiety or guilt arising out of sex or masturbation?</h2>
          <div className="mb-2">
            <input
              type="radio"
              name="sexualRelationships.experiencedAnxietyOrGuiltOutOfSexOrMasturbation"
              value="Yes"
              checked={formData.sexualRelationships.experiencedAnxietyOrGuiltOutOfSexOrMasturbation === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="sexualRelationships.experiencedAnxietyOrGuiltOutOfSexOrMasturbation"
              value="No"
              checked={formData.sexualRelationships.experiencedAnxietyOrGuiltOutOfSexOrMasturbation === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
          <label className="block mb-2">If yes, please explain:</label>
          <textarea
            name="sexualRelationships.anxietyExplanation"
            value={formData.sexualRelationships.anxietyExplanation}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Any relevant details regarding your first or subsequent sexual experiences</label>
          <textarea
            name="sexualRelationships.anyOtherDetailsAboutFirstOrSubsequentSexualExperiences"
            value={formData.sexualRelationships.anyOtherDetailsAboutFirstOrSubsequentSexualExperiences}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <h2 className="text-xl font-bold mb-2">Is your present sex life satisfactory?</h2>
          <div className="mb-2">
            <input
              type="radio"
              name="sexualRelationships.presentSexLifeSatisfactory"
              value="Yes"
              checked={formData.sexualRelationships.presentSexLifeSatisfactory === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="sexualRelationships.presentSexLifeSatisfactory"
              value="No"
              checked={formData.sexualRelationships.presentSexLifeSatisfactory === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
          <label className="block mb-2">If No, please explain</label>
          <textarea
            name="sexualRelationships.presentSexLifeSatisfactoryExplanation"
            value={formData.sexualRelationships.presentSexLifeSatisfactoryExplanation}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Provide information about any significant homosexual reactions or relationships:</label>
          <textarea
            name="sexualRelationships.anySignificantHomosexualReactionsOrRelationships"
            value={formData.sexualRelationships.anySignificantHomosexualReactionsOrRelationships}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Please note any sexual concerns not discussed above:</label>
          <textarea
            name="sexualRelationships.anyOtherSexualConcern"
            value={formData.sexualRelationships.anyOtherSexualConcern}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <h2 className="text-xl font-bold mb-2 italic">Other Relationships</h2>
          <h2 className="text-xl font-bold mb-2">Are there any problems in your relationships with people at work?</h2>
          <div className="mb-2">
            <input
              type="radio"
              name="otherRelationships.anyProblemsInRelationshipWithOtherPeople"
              value="Yes"
              checked={formData.otherRelationships.anyProblemsInRelationshipWithOtherPeople === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="otherRelationships.anyProblemsInRelationshipWithOtherPeople"
              value="No"
              checked={formData.otherRelationships.anyProblemsInRelationshipWithOtherPeople === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
          <label className="block mb-2">If Yes, please describe: </label>
          <textarea
            name="otherRelationships.problemsWithRelationshipsExplanation"
            value={formData.otherRelationships.problemsWithRelationshipsExplanation}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <h2 className="text-xl font-bold mb-2">Please complete the following:</h2>
          <label className="block mb-2">One of the ways people hurt me is:</label>
          <textarea
            name="otherRelationships.oneWayPeopleHurtMe"
            value={formData.otherRelationships.oneWayPeopleHurtMe}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">I could shock you by:</label>
          <textarea
            name="otherRelationships.iCouldShockYouBy"
            value={formData.otherRelationships.iCouldShockYouBy}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">My spouse (or boyfriend/girlfriend) would describe me as:</label>
          <textarea
            name="otherRelationships.mySpauseDescribesMeAs"
            value={formData.otherRelationships.mySpauseDescribesMeAs}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">My best friend thinks i am:</label>
          <textarea
            name="otherRelationships.myBestFriendThinksIAm"
            value={formData.otherRelationships.myBestFriendThinksIAm}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">People who dislike me:</label>
          <textarea
            name="otherRelationships.peopleWhoDislikeMe"
            value={formData.otherRelationships.peopleWhoDislikeMe}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <h2 className="text-xl font-bold mb-2">Are you currently troubled by any past rejections or loss of a love relationship?</h2>
          <div className="mb-2">
            <input
              type="radio"
              name="otherRelationships.currentlyDisturbedByAnyPastRejectionsOrLossofLove"
              value="Yes"
              checked={formData.otherRelationships.currentlyDisturbedByAnyPastRejectionsOrLossofLove === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="otherRelationships.currentlyDisturbedByAnyPastRejectionsOrLossofLove"
              value="No"
              checked={formData.otherRelationships.currentlyDisturbedByAnyPastRejectionsOrLossofLove === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
          <label className="block mb-2">If yes please explain:</label>
          <textarea
            name="otherRelationships.rejectionExplanation"
            value={formData.otherRelationships.rejectionExplanation}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
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

export default EighthQuestionsForm;
