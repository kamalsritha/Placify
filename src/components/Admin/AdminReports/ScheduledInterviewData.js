import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Admin-CSS/ScheduledInterviewData.css";

function ScheduledInterviewData() {
  const [uploadedData, setUploadedData] = useState([]); 
  const { id, name, activity } = useParams();  // Get activity from URL

  // Define activity-based configurations
  const activityConfig = {
    assessment: "Assessment Selects",
    interview: "Interview Selects",
    final: "Final Selects"
  };

  const activityTitle = activityConfig[activity] || "Assessment Selects"; // Default to assessment

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      setUploadedData(sheetData);
    };
    reader.readAsBinaryString(file);
  };

  const handleMarkCleared = async () => {
    if (uploadedData.length === 0) {
      toast.error("Please upload an Excel sheet first.");
      return;
    }
  
    const rollNumbers = uploadedData.map((data) => data.rollNo.toString()).join(",");
    const rolls = uploadedData.map((data) => data.rollNo.toString());
  
    try {
      if (activity === "final") {
        
          await axios.post("http://localhost:3001/auth/updatePlacementStatus", {
            userIds: rolls,
            companyId: id,
            status: "Placed",
          });
        
        toast.success(`${uploadedData.length} students' placement statuses updated!`);
      }
      

        await axios.post(`http://localhost:3001/auth/updateShortlisting/${id}/${activity}/${rollNumbers}`);
        toast.success(`${uploadedData.length} students have been added to ${activityTitle}!`);

    } catch (error) {
      console.error(`Error updating ${activityTitle.toLowerCase()}:`, error);
      toast.error(`Failed to update ${activityTitle.toLowerCase()}.`);
    }
  };
  

  return (
    <>
      <AdminHome />
      <h1 className="page-heading" style={{ marginTop: "150px" }}>
        {name} {activityTitle}
      </h1>
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
          <button className="btn btn-primary mt-3" onClick={handleMarkCleared}>
            Mark Cleared
          </button>
        </div>

        <div className="right">
          {uploadedData.length > 0 && (
            <div className="table-wrapper">
              <h2>Uploaded Student Data</h2>
              <table className="styled-table">
                <thead>
                  <tr>
                    {Object.keys(uploadedData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uploadedData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default ScheduledInterviewData;
