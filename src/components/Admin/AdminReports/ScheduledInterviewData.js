import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import for reading Excel files
import { useParams } from "react-router-dom";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import '../Admin-CSS/ScheduledInterviewData.css';
import { toast, ToastContainer } from 'react-toastify';

function ScheduledInterviewData() {
  const [companyData, setCompanyData] = useState([]);
  const [uploadedNames, setUploadedNames] = useState([]); // Store uploaded student names
  const { id } = useParams();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/auth/companyApplicants');
        const filteredData = response.data.filter(company => company.companyId === id); // Filter data by company ID
        setCompanyData(filteredData);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanyData();
  }, [id]);

  const handleUpdatePlacementStatus = async (userId, companyId, status) => {
    try {
      const response = await axios.post('http://localhost:3001/auth/updatePlacementStatus', {
        userId,
        companyId,
        status
      });
      console.log(response.data); // Logging the response for debug
      toast.success(`1 student have been marked as Assessment Cleared!`);
      
    } catch (error) {
      console.error('Error updating placement status:', error.response?.data?.message || error.message);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0]; // Use the first sheet
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const studentNames = sheetData.map(row => row.name); // Assume 'Name' column has student names
      setUploadedNames(studentNames); // Store the names in state
    };
    reader.readAsBinaryString(file);
  };

  const handleMarkCleared = () => {
    if (uploadedNames.length === 0) {
      alert("Please upload an Excel sheet first.");
      return;
    }

    updateClearedStatusForStudents(uploadedNames);
  };

  const updateClearedStatusForStudents = (studentNames) => {
    let updatedCount = 0; // To track the number of students updated

    companyData.forEach((company) => {
      company.applicants.forEach((applicant) => {
        if (studentNames.includes(applicant.name)) {
          handleUpdatePlacementStatus(applicant.userId, company.companyId, 'Placed');
          updatedCount++;
        }
      });
    });

    if (updatedCount > 0) {
      toast.success(`${updatedCount} students have been marked as Assessment Cleared!`);
    } else {
      toast.error('No matching students found in the uploaded file.');
    }
  };

  return (
    <>
      <AdminHome />
      <h1 className="page-heading" style={{ marginTop: "150px" }}>Student Applications</h1>
      <div className="split">
        <div className="file-upload-wrapper">
          <label htmlFor="file-upload" className="file-upload-label">
            Upload Excel Sheet
          </label>
          <input
            type="file"
            id="file-upload"
            className="file-upload-input"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
          <button
            className="btn btn-primary mt-3"
            onClick={handleMarkCleared}
          >
            Mark Cleared
          </button>
        </div>
        <div className="right">
          <div className="table-wrapper">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companyData.map((company) => (
                  company.applicants.map((applicant) => (
                    <tr key={applicant.userId}>
                      <td>{applicant.rollNo}</td>
                      <td>{applicant.name}</td>
                      <td>{applicant.email}</td>
                      <td className="actions-column">
                        <button
                          className="btn btn-success"
                          onClick={() => handleUpdatePlacementStatus(applicant.userId, company.companyId, 'Placed')}
                        >
                          Interview Cleared
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleUpdatePlacementStatus(applicant.userId, company.companyId, 'Unplaced')}
                        >
                          Interview Failed
                        </button>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
      {/* Toast Container for displaying notifications */}
      <ToastContainer />
    </>
  );
}

export default ScheduledInterviewData;
