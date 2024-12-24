import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Navbar from "./Navbar.js";
import { useParams, useNavigate } from "react-router-dom";

function Profile() {
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    phone: "",
    tenthPercentage: "",
    twelfthPercentage: "",
    graduationCGPA: "",
    skills: [],
    companiesApplied: [], // Initialize as an empty array
  });

  const [companyNames, setCompanyNames] = useState([]); // To store company names
  const [showCompanies, setShowCompanies] = useState(false); // To toggle companies list visibility

  useEffect(() => {
    // Fetch the current user data from the backend
    axios
      .get("http://localhost:3001/auth/currentUser")
      .then((res) => {
        // Ensure companiesApplied is always an array
        setCurrentUser({
          ...res.data.user,
          companiesApplied: res.data.user.appliedCompanies
        });
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
      });
  }, []);

  // Fetch company names based on company IDs when companiesApplied changes
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.post("http://localhost:3001/auth/getCompaniesByIds", {
          companyIds: currentUser.companiesApplied,
        });
        console.log(res.data); // This is the resolved data from the response
        setCompanyNames(res.data); // Set the company names in state
      } catch (err) {
        console.error("Error fetching company names:", err);
      }
    };
  
    fetchCompanies(); // Call the async function
  }, [currentUser.companiesApplied]);

  const handleShowCompanies = () => {
    setShowCompanies(true); // Open modal
  };

  const handleCloseModal = () => {
    setShowCompanies(false); // Close modal
  };

  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{
          textAlign: "center",
          marginTop: "120px", // Ensure content starts below navbar
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 120px)", // Adjust the height for vertical centering
        }}
      >
        <div
          style={{
            width: "500px",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 style={{ fontSize: "3rem", color: "navy", marginBottom: "40px" }}>My Profile</h1>
          <h3 style={{ color: "#007bff", marginBottom: "20px" }}>Candidate Details</h3>
          <p>
            <strong>Name:</strong> {currentUser.name || "Not Provided"}
          </p>
          <p>
            <strong>Email:</strong> {currentUser.email || "Not Provided"}
          </p>
          <p>
            <strong>Phone:</strong> {currentUser.contactNumber || "Not Provided"}
          </p>
          <p>
            <strong>Stream:</strong> {currentUser.stream || "Not Provided"}
          </p>
          <p>
            <strong>10th Percentage:</strong> {currentUser.tenthPercentage || "Not Provided"}
          </p>
          <p>
            <strong>12th Percentage:</strong> {currentUser.twelfthPercentage || "Not Provided"}
          </p>
          <p>
            <strong>Graduation CGPA:</strong> {currentUser.graduationCGPA || "Not Provided"}
          </p>
          <p>
            <strong>Placement Status:</strong> {currentUser.placementStatus || "Not Placed"}
          </p>
          <p>
            <strong>Placed Company:</strong> {currentUser.companyPlaced || "Not Placed"}
          </p>

          <div>
            <button
              onClick={handleShowCompanies}
              className="btn btn-primary"
              style={{ marginTop: "20px" }}
            >
              {showCompanies ? "Hide Companies" : "Show Companies Applied"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal to show companies */}
      <div
        className={`modal fade ${showCompanies ? "show" : ""}`}
        id="companyModal"
        tabIndex="-1"
        aria-labelledby="companyModalLabel"
        aria-hidden="true"
        style={{ display: showCompanies ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="companyModalLabel">
                List of Companies Applied
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              {companyNames.length > 0 ? (
                <ul>
                  {companyNames.map((company, index) => (
                    <li key={index}>{company}</li>
                  ))}
                </ul>
              ) : (
                <p>No companies applied yet.</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
