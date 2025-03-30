import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";
import * as XLSX from "xlsx";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";

function ApplicantsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appliedStudents, setAppliedStudents] = useState([]);
  const [notAppliedStudents, setNotAppliedStudents] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`https://placify-server.onrender.com/auth/Applicants/${id}`);
        setAppliedStudents(response.data.applied);
        setNotAppliedStudents(response.data.notApplied);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchApplicants();
  }, [id]);

  const downloadExcel = () => {
    const appliedSheet = appliedStudents.map(student => ({
      RollNo: student.rollNo,
      Name: student.name,
    }));

    const notAppliedSheet = notAppliedStudents.map(student => ({
      RollNo: student.rollNo,
      Name: student.name,
    }));

    const workbook = XLSX.utils.book_new();
    const appliedWorksheet = XLSX.utils.json_to_sheet(appliedSheet);
    const notAppliedWorksheet = XLSX.utils.json_to_sheet(notAppliedSheet);

    XLSX.utils.book_append_sheet(workbook, appliedWorksheet, "Applied Students");
    XLSX.utils.book_append_sheet(workbook, notAppliedWorksheet, "Not Applied Students");

    XLSX.writeFile(workbook, "Applicants.xlsx");
  };

  return (
    <>
      <AdminHome/>
    <div className="d-flex align-items-center justify-content-center vh-100 mt-5">
      <div className="card p-4 shadow-lg" style={{ width: "500px" }}>
        <h2 className="text-center mb-4">Applicants for Company</h2>
        
        
        <Tabs defaultActiveKey="applied" id="applicants-tabs" className="mb-3">
          <Tab eventKey="applied" title={<span style={{ color: "black", fontWeight: "bold" }}>Applied Students</span>}>
            <ul className="list-group mt-3">
              {appliedStudents.length ? (
                appliedStudents.map((student) => (
                  <li key={student.id} className="list-group-item">
                    {student.rollNo} ({student.name})
                  </li>
                ))
              ) : (
                <p className="text-center mt-3">No students have applied yet.</p>
              )}
            </ul>
          </Tab>

          <Tab eventKey="notApplied" title={<span style={{ color: "black", fontWeight: "bold" }}>Not Applied Students</span>}>
            <ul className="list-group mt-3">
              {notAppliedStudents.length ? (
                notAppliedStudents.map((student) => (
                  <li key={student.id} className="list-group-item">
                    {student.rollNo} ({student.name})
                  </li>
                ))
              ) : (
                <p className="text-center mt-3">All eligible students have applied.</p>
              )}
            </ul>
          </Tab>
        </Tabs>

        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-dark" onClick={downloadExcel}>
            <FaDownload className="me-2" /> Download
          </button>
          <button className="btn btn-dark" onClick={() => navigate(-1)}>
            <FaArrowLeft className="me-2" /> Back
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default ApplicantsPage;
