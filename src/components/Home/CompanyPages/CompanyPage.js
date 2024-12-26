import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "../../../redux/companySlice.jsx";
import Footer from "../HomeComponents/Footer.js";
import Navbar from "../HomeComponents/Navbar.js";
import ApplyJobs from "../Assets/applyjobs.png";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom"

function CompanyPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const companies = useSelector((state) => state.companies.companies);
  const [hasApplied, setHasApplied] = useState(false);

  const location = useLocation(); // Access location
  const { ids } = location.state || {}; 

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
  }, []);

  useEffect(() => {
    const checkEligibleJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/auth/jobs/eligible');

        if (response.data.length > 0) {
          toast.info('You have new job opportunities available!', {
            position: "top-right",
            autoClose: 5000
          });
        }
      } catch (error) {
        console.error('Error checking eligible jobs:', error);
      }
    };

    if (currentUser) {
      checkEligibleJobs();
    }
  }, [currentUser]);

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
      <h1 style={{ alignContent: "center", marginTop: "150px", color: "navy", fontSize: "3rem" }}>Apply Jobs</h1>
      <div
        className="company-list-container"
        style={{ padding: "20px", display: "flex" }}
      >
        {/* Image */}
        <div style={{ flex: "0 0 50%", marginRight: "30px", marginTop: "45px" }}>
          <img
            src={ApplyJobs}
            alt="Apply Job Image"
            style={{
              width: "500px",
              height: "500px",
              borderRadius: "10px",
              marginLeft: "150px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>

        {/* Card View */}
        <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", marginTop: "10px" }}>
          {companies.map((company) => (
            <div
              key={company.id}
              className="company-card"
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "30px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <h1
                className="company-name"
                style={{
                  fontSize: "3rem",
                  marginBottom: "20px",
                  textAlign: "center",
                  color: "#007bff",
                }}
              >
                {company.companyname}
              </h1>
              <div className="company-info" style={{ marginBottom: "20px" }}>
                <p style={{ color: "#333", fontSize: "1.5rem", marginBottom: "10px" }}>
                  <strong>CTC:</strong> {company.ctc} LPA
                </p>
                <p style={{ color: "#333", fontSize: "1.5rem", marginBottom: "10px" }}>
                  <strong>Assessment Date:</strong> {company.doa}
                </p>
                <p style={{ color: "#333", fontSize: "1.5rem", marginBottom: "10px" }}>
                  <strong>Interview Date:</strong> {company.doi}
                </p>
                <p style={{ color: "#333", fontSize: "1.5rem", marginBottom: "10px" }}>
                  <strong>Job Description:</strong> {company.jobdescription}
                </p>
                <p style={{ color: "#333", fontSize: "1.5rem", marginBottom: "10px" }}>
                  <strong>Eligibility Criteria</strong> <br />
                  <strong>10th Percentage:</strong> {company.tenthPercentage}<br />
                  <strong>12th Percentage:</strong> {company.twelfthPercentage}<br />
                  <strong>Graduation CGPA:</strong> {company.graduationCGPA}<br />
                </p>
                <p style={{ color: "#333", fontSize: "1.5rem", marginBottom: "10px" }}>
                  <strong>Expires on:</strong> {company.expire.slice(0,10)}
                </p>
              </div>
              {hasApplied ? (
                  <button
                    className="apply-btn"
                    disabled
                    style={{
                      backgroundColor: "#cccccc",
                      color: "#666666",
                      padding: "12px 24px",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "1.5rem",
                      alignSelf: "center",
                      cursor: "not-allowed",
                    }}
                  >
                    Already Applied
                  </button>
                ) : Array.isArray(ids) && ids.includes(company.id) ? (
                  <button
                    onClick={() => handleApply(company._id, currentUser._id)}
                    className="apply-btn"
                    style={{
                      backgroundColor: "#001f3f",
                      color: "#fff",
                      padding: "12px 24px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      alignSelf: "center",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    Apply Now
                  </button>
                ) : (
                  <p style={{
                    fontSize: "1.5rem",
                    color: "red",
                    fontWeight: "bold",
                    marginTop: "10px",
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