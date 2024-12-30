import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "../../../redux/companySlice.jsx";
import Footer from "../HomeComponents/Footer.js";
import Navbar from "../HomeComponents/Navbar.js";
import ApplyJobs from "../Assets/applyjobs.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function CompanyPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const companies = useSelector((state) => state.companies.companies);
  const [hasApplied, setHasApplied] = useState(false);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [atsScore, setAtsScore] = useState(null);

  const location = useLocation();
  const { ids } = location.state || {};

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (1MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size should be less than 2MB");
        return;
      }

       // Check file type
      const validTypes = [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PDF, DOC, DOCX, or TXT file");
        return;
      }
  
      setResumeFile(file);
      setIsResumeUploaded(true);
      toast.success("Resume uploaded successfully!");
    } else {
      setResumeFile(null);
      setIsResumeUploaded(false);
    }
  };

  const handleCheckScore = async () => {
    if (!resumeFile) {
      toast.error("Please upload a resume first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", companies[0].jobdescription);

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/atsScore",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setAtsScore(response.data);
        toast.success(`Resume match score: ${response.data.score}%`);
      } else {
        toast.error("Failed to analyze resume");
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error("Error analyzing resume");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/auth/getCompanies/${id}`
        );
        dispatch(getCompanies(response.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    axios.get("http://localhost:3001/auth/verify").then((res) => {
      if (!res.data.status) {
        navigate("/");
      }
    });

    axios
      .get("http://localhost:3001/auth/currentUser")
      .then((res) => {
        setCurrentUser(res.data.user);
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
      });
  }, [navigate]);

  useEffect(() => {
    const checkIfApplied = async () => {
      if (currentUser && companies.length > 0) {
        const userAppliedCompanies = currentUser.appliedCompanies || [];
        setHasApplied(userAppliedCompanies.includes(id));
      }
    };
    checkIfApplied();
  }, [currentUser, companies, id]);

  const handleApply = async (companyId, userId) => {
    if (!isResumeUploaded) {
      toast.error("Please upload your resume first!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/auth/applyCompany/${userId}/${id}`
      );
      toast.success(response.data.message);
      setHasApplied(true);

      const updatedResponse = await axios.get(
        `http://localhost:3001/auth/getCompanies/${id}`
      );
      dispatch(getCompanies(updatedResponse.data));
      navigate("/scheduledInterview");
    } catch (error) {
      console.error(error);
      toast.error("Error applying to company");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div
        style={{
          marginTop: "100px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          color: "#2c3e50",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700" }}>Apply for Jobs</h1>
        <p style={{ fontSize: "1rem", color: "#7f8c8d" }}>
          Find the right opportunities for you
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "20px",
          padding: "40px",
        }}
      >
        <div style={{ flex: "1", textAlign: "center" }}>
          <img
            src={ApplyJobs}
            alt="Apply for Jobs"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>

        <div style={{ flex: "1", maxWidth: "600px" }}>
          {companies.map((company) => (
            <div
              key={company.id}
              style={{
                marginBottom: "20px",
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: "#ecf0f1",
                color: "#2c3e50",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h2
                style={{
                  color: "#3498db",
                  fontSize: "1.8rem",
                  marginBottom: "10px",
                }}
              >
                {company.companyname}
              </h2>

              <p><strong>CTC:</strong> {company.ctc} LPA</p>
              <p><strong>Assessment Date:</strong> {company.doa}</p>
              <p><strong>Interview Date:</strong> {company.doi}</p>
              <p><strong>Expires On:</strong> {company.expire?.slice(0,10) || "N/A"}</p>
              <p><strong>Job Description:</strong> {company.jobdescription}</p>
              <p>
                <strong>Eligibility:</strong> <br />
                <strong>10th:</strong> {company.tenthPercentage}% <br />
                <strong>12th:</strong> {company.twelfthPercentage}% <br />
                <strong>Graduation:</strong> {company.graduationCGPA}
              </p>

              {hasApplied ? (
                <button
                  disabled
                  style={{
                    marginTop: "15px",
                    backgroundColor: "#bdc3c7",
                    color: "#ffffff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "not-allowed",
                  }}
                >
                  Already Applied
                </button>
              ) : Array.isArray(ids) && ids.includes(company.id) ? (
                <div style={{ marginTop: "15px" }}>
                  <div style={{ marginBottom: "15px" }}>
                    <input
                      type="file"
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={handleResumeUpload}
                      style={{
                        padding: "8px",
                        border: "1px solid #bdc3c7",
                        borderRadius: "4px",
                        width: "100%"
                      }}
                    />
                  </div>

                  <button
                    onClick={handleCheckScore}
                    disabled={!isResumeUploaded}
                    style={{
                      backgroundColor: isResumeUploaded ? "#3498db" : "#bdc3c7",
                      color: "#ffffff",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: isResumeUploaded ? "pointer" : "not-allowed",
                      marginRight: "10px",
                    }}
                  >
                    Check Score
                  </button>

                  {atsScore && (
                    <div style={{ 
                      marginTop: '20px', 
                      padding: '20px', 
                      backgroundColor: '#fff', 
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>
                        ATS Score Analysis
                      </h3>
                      
                      <div style={{ width: '100px', margin: '0 auto 20px' }}>
                        <CircularProgressbar
                          value={atsScore.score}
                          text={`${atsScore.score}%`}
                          styles={buildStyles({
                            pathColor: atsScore.score >= 70 ? '#2ecc71' : '#e74c3c',
                            textColor: '#2c3e50',
                          })}
                        />
                      </div>

                      {atsScore.matches?.length > 0 && (
                        <div style={{ marginTop: '15px' }}>
                          <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>
                            Matching Keywords
                          </h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {atsScore.matches.map((keyword, index) => (
                              <span
                                key={index}
                                style={{
                                  backgroundColor: '#2ecc71',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.9em'
                                }}
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {atsScore.missingKeywords?.length > 0 && (
                        <div style={{ marginTop: '15px' }}>
                          <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>
                            Suggested Keywords to Add
                          </h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {atsScore.missingKeywords.map((keyword, index) => (
                              <span
                                key={index}
                                style={{
                                  backgroundColor: '#e74c3c',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.9em'
                                }}
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleApply(company._id, currentUser._id)}
                    disabled={!isResumeUploaded}
                    style={{
                      backgroundColor: isResumeUploaded ? "#2ecc71" : "#bdc3c7",
                      color: "#ffffff",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: isResumeUploaded ? "pointer" : "not-allowed",
                      marginTop: "10px",
                      width: "100%"
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              ) : (
                <p style={{
                  fontSize: "1.2rem",
                  color: "#e74c3c",
                  fontWeight: "bold",
                  marginTop: "15px"
                }}>
                  Not Eligible for this Job
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CompanyPage;