import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoImage from './logo.jpeg';

const Progress = ({ userId }) => {
  const [monthlyActivities, setMonthlyActivities] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 10;
  const surveyQuestions = [
    "How do you feel about your progress this week?",
    "Have you noticed any improvements?",
    "Is there any feedback you would like to give to the doctor?"
  ];

  const handleGeneratePDF = async (contentId, filename, includePrescription = false) => {
    if (includePrescription) {
      generatePrescriptionPDF();
      return;
    }

    const input = document.getElementById(contentId);
    const canvas = await html2canvas(input, { scale: 2 }); // Increase scale for better quality

    const pdf = new jsPDF();
    
    pdf.setFontSize(16);
    pdf.setTextColor(255, 0, 0); // Red color for company name
    pdf.setFont('helvetica', 'bold');
    pdf.text("Insight Wellbeing P/L", 105, 15, null, null, 'center');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(0, 0, 0); // Black color for tagline
    pdf.text("Your Balanced Perspective", 105, 22, null, null, 'center');
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0); // Black color for date
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 105, 29, null, null, 'center');

    const logoWidth = 20; // Adjust size as needed
    const logoHeight = 20; // Adjust size as needed
    pdf.addImage(logoImage, 'JPEG', 20, 10, logoWidth, logoHeight);

    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 10, 40, pdfWidth - 20, pdfHeight - 50);

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0); // Black color for footer
    pdf.text("Learn to choose the way you feel…", 105, pdfHeight - 10, null, null, 'center');
    pdf.text("www.i-wellbeing.weebly.com +263777279702 / +263782237537 insightwellbeing.mo@gmail.com", 105, pdfHeight, null, null, 'center');
    
    pdf.save(`${filename}.pdf`);
  };

  const generatePrescriptionPDF = () => {
    const pdf = new jsPDF();
    
    pdf.setFontSize(16);
    pdf.setTextColor(255, 0, 0); // Red color for company name
    pdf.setFont('helvetica', 'bold');
    pdf.text("Insight Wellbeing P/L", 105, 15, null, null, 'center');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(0, 0, 0); // Black color for tagline
    pdf.text("Your Balanced Perspective", 105, 22, null, null, 'center');
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0); // Black color for date
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 105, 29, null, null, 'center');

    const logoWidth = 20; // Adjust size as needed
    const logoHeight = 20; // Adjust size as needed
    pdf.addImage(logoImage, 'JPEG', 20, 10, logoWidth, logoHeight);

    if (prescriptions.length > 0) {
      const prescription = prescriptions[0];
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Patient's Name: ${prescription.name}`, 10, 50);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Prescription: ${prescription.prescription.join(', ')}`, 105, 60, null, null, 'center');
      
      pdf.text(`Dr. ${prescription.doctorName}`, 105, 90, null, null, 'center');
      pdf.text(`${prescription.doctorPhone}`, 105, 100, null, null, 'center');
      pdf.text(`${prescription.doctorEmail}`, 105, 110, null, null, 'center');
    }

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0); // Black color for footer
    pdf.text("Learn to choose the way you feel…", 105, 250, null, null, 'center');
    pdf.text("www.i-wellbeing.weebly.com +263 7754 83749 insightwellbeing.mo@gmail.com", 105, 260, null, null, 'center');
    
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150); // Grey color for disclaimer
    pdf.text("This prescription is electronically generated and does not require a stamp.", 105, 270, null, null, 'center');

    pdf.save('Prescriptions.pdf');
  };

  useEffect(() => {
    const activitiesData = [
      {
        activities: 'Yoga',
        date_time: '2024-07-12T09:00:00',
        status: 'pending',
        duration: 0.025,
        start_time: '09:00',
        end_time: '10:00',
        progress: 0,
        remaining_time: 90,
      },
      {
        activities: 'Meditation',
        date_time: '2024-07-13T10:00:00',
        status: 'completed',
        duration: 1,
        start_time: '10:00',
        end_time: '11:00',
        progress: 100,
        remaining_time: 0,
      },
    ];

    const prescriptionsData = [
      {
        name: 'John Doe',
        prescription: ['Take one pill of X', 'Apply Y ointment'],
        date: '2024-07-12',
        doctorName: 'Dr. Smith',
        doctorPhone: '123-456-7890',
        doctorEmail: 'dr.smith@example.com',
      },
    ];

    const progressData = [
      {
        activity: 'Yoga',
        dateCompleted: '2024-07-12',
        impact: 'calming',
      },
      {
        activity: 'Meditation',
        dateCompleted: '2024-07-13',
        impact: 'improving self awareness',
      },
    ];

    setMonthlyActivities(activitiesData);
    setPrescriptions(prescriptionsData);
    setProgressData(progressData);
  }, [userId]);

  const currentActivities = monthlyActivities.slice(
    (currentPage - 1) * activitiesPerPage,
    currentPage * activitiesPerPage
  );

  const totalPages = Math.ceil(monthlyActivities.length / activitiesPerPage);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Monthly Activities</h2>
      <div>
        {currentActivities.map((activity, index) => (
          <div key={index} className="card bg-white p-4 rounded-lg shadow-md mb-4 text-center">
            <p><strong>Activity:</strong> {activity.activities}</p>
            <p><strong>Date:</strong> {activity.date_time}</p>
            <p><strong>Status:</strong> {activity.status}</p>
            <p><strong>Duration:</strong> {activity.duration} hours</p>
            <p><strong>Progress:</strong> {activity.progress}%</p>
            <p><strong>Remaining Time:</strong> {activity.remaining_time} minutes</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} onClick={() => setCurrentPage(index + 1)} className={`py-2 px-4 rounded-md shadow-md mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
            {index + 1}
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Progress Data</h2>
      <div>
        {progressData.map((data, index) => (
          <div key={index} className="card bg-white p-4 rounded-lg shadow-md mb-4">
            <p><strong>Activity:</strong> {data.activity}</p>
            <p><strong>Date Completed:</strong> {data.dateCompleted}</p>
            <p><strong>Impact:</strong> {data.impact}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Weekly Survey</h2>
      <form className="bg-white p-4 rounded-lg shadow-md mb-4">
        {surveyQuestions.map((question, index) => (
          <div key={index} className="mb-4">
            <label className="block text-lg font-medium mb-2">{question}</label>
            <input type="text" name={`question${index + 1}`} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        ))}
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition duration-200">
          Submit
        </button>
      </form>

      <button onClick={generatePrescriptionPDF} className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-200 mb-4">
        Download Prescription PDF
      </button>
    </div>
  );
};

export default Progress;
