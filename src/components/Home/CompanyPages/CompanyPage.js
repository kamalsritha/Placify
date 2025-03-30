import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "../../../redux/companySlice.jsx";
import Footer from "../HomeComponents/Footer.js";
import Navbar from "../HomeComponents/Navbar.js";
import ApplyJobs from "../Assets/applyjobs.png";
import { toast, ToastContainer } from "react-toastify";
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFWorker } from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFWorker;
const CircularProgress = ({ value }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#2ecc71';
    if (score >= 60) return '#f1c40f';
    return '#e74c3c';
  };

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="#e2e8f0"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke={getScoreColor(value)}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{value}%</span>
      </div>
    </div>
  );
};

function CompanyPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { ids } = location.state || {};

  const [currentUser, setCurrentUser] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [parsedResumeText, setParsedResumeText] = useState("");
  
  const companies = useSelector((state) => state.companies.companies);

  const parsePdfText = async (file) => {
    try {

      if (file.size > 10 * 1024 * 1024) {  
        toast.error("PDF file is too large");
        return null;
      }
  
      const arrayBuffer = await file.arrayBuffer();
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const textPages = [];
     
      const maxPages = Math.min(pdf.numPages, 50);
      
      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ');
        
        textPages.push(pageText);
      }
      
      const combinedText = textPages.join(' ')
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return combinedText;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      
      if (error.name === 'InvalidPDFException') {
        toast.error("Invalid PDF file");
      } else if (error.name === 'MissingPDFException') {
        toast.error("PDF file is corrupted");
      } else {
        toast.error("Failed to parse PDF");
      }
      
      return null;
    }
  };

  const parseResumeText = async (file) => {
    try {
      switch (file.type) {
        case 'application/pdf':
          return await parsePdfText(file);
        
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'text/plain':
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          
          const cleanedText = result.value
            .replace(/\n+/g, ' ')  
            .replace(/\s+/g, ' ')  
            .trim();
            toast.success("Resume uploaded successfully!");
          
          return cleanedText;
        
        default:
          throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast.error("Failed to parse resume");
      return null;
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size should be less than 2MB");
        return;
      }
  
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
      
      const parsedText = await parseResumeText(file);
      if (parsedText) {
        setParsedResumeText(parsedText);
        console.log("Parsed Resume Text:", parsedText);
        toast.success("Resume uploaded and parsed successfully!");
      }
    }
  };

  const handleCheckScore = async () => {
    if (!resumeFile) {
      toast.error("Please upload a resume first!");
      return;
    }
  
    try {
      const response = await axios.post(
        "https://placify-server.onrender.com/auth/atsScore",
        {
          parsedResumeText,
          jobDescription: companies[0].jobdescription
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
     
      if (response.data && response.data.analysis) {
        setAtsScore(response.data.analysis);
        toast.success(`Resume match score: ${response.data.analysis.score}%`);
      } else {
        toast.error("Failed to analyze resume");
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error(error.response?.data?.message || "Error analyzing resume");
    }
  };

  const handleApply = async () => {
    if (!isResumeUploaded) {
      toast.error("Please upload your resume first!");
      return;
    }

    if (!currentUser?._id) {
      toast.error("Please log in to apply");
      return;
    }

    try {
      const response = await axios.post(
        `https://placify-server.onrender.com/auth/applyCompany/${currentUser._id}/${id}`
      );
      toast.success(response.data.message);
      setHasApplied(true);
      navigate("/scheduledInterview");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error applying to company");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://placify-server.onrender.com/auth/getCompanies/${id}`
        );
        dispatch(getCompanies(response.data));
      } catch (err) {
        console.error("Error fetching company data:", err);
        toast.error("Error loading company data");
      }
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    axios.get("https://placify-server.onrender.com/auth/verify")
      .then((res) => {
        if (!res.data.status) {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Error verifying auth:", err);
        navigate("/");
      });

    axios.get("https://placify-server.onrender.com/auth/currentUser")
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
        <h1 style={{ fontSize: "28px", fontWeight: "bold" , color:"#333" }}>Apply for Jobs</h1>
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
                backgroundColor: "#f5f5f5",
                color: "#2c3e50",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h2
                style={{
                  color: "black",
                  fontSize: "1.8rem",
                  marginBottom: "10px",
                  fontFamily:"Poppins",
                  fontWeight:"bold"
                }}
              >
                {company.companyname}
              </h2>

              <p><strong>CTC:</strong> {company.ctc} LPA</p>
              <p><strong>Expires On:</strong> {company.expire?.slice(0,10) || "N/A"}</p>
              <p><strong>Job Description:</strong> {company.jobdescription}</p>
              <p>
                <strong>Eligibility:</strong> <br />
                <strong>10th:</strong> {company.tenthPercentage}% <br />
                <strong>12th:</strong> {company.twelfthPercentage}% <br />
                <strong>Graduation:</strong> {company.graduationCGPA}
              </p>
              <p><strong>Interview Location : </strong>{company.loc===null?"On-campus" : "Off-campus"}</p>
              <p><strong>Rounds:</strong></p>
<ul>
  {company.assessmentRounds?.length
    ? company.assessmentRounds.map((round, index) => <li key={index}>{round.name} {round.date ? `(${round.date.split("T")[0]})` : "(N/A)"}
</li>)
    : <li>N/A</li>}
</ul>


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
                      backgroundColor: isResumeUploaded ? "#333" : "#bdc3c7",
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
     Resume Score Analysis
    </h3>
    <div style={{ width: '100px', margin: '0 190px 20px' }}>
      <CircularProgress
        value={atsScore.score} 
      />
    </div>
    {atsScore.recommendations && atsScore.recommendations.length > 0 && (
      <div>
        <h4 style={{ fontWeight: 'semibold', marginBottom: '12px' }}>Recommendations</h4>
        <ul style={{ 
          listStyleType: 'disc', 
          paddingLeft: '20px', 
          color: '#718096' 
        }}>
          {atsScore.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    )}

    {atsScore.missingKeywords && atsScore.missingKeywords.length > 0 && (
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
                    backgroundColor: isResumeUploaded ? "black" : "#bdc3c7",
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