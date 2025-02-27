import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "../../../redux/companySlice.jsx";
import Navbar from "../HomeComponents/Navbar.js";
import Footer from "../HomeComponents/Footer.js";

function CompanyListing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);
  const [ids, setIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchEligibleJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/jobs/eligible");
        const data = response.data;
        const jobIds = data.map((job) => job._id); 
        setIds(jobIds); 
      } catch (error) {
        console.error("Error checking eligible jobs:", error);
      }
    };

    fetchEligibleJobs();
  }, []);

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
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/getCompanies");
        dispatch(getCompanies(response.data));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1 style={{ fontSize: "3rem", color: "navy" }}>Ongoing Drives</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap", 
            gap: "20px", 
          }}
        >
          {companies.map((company) => (
            <div
              key={company.id}
              style={{
                width: "300px",
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
                margin: "10px",
                overflow: "hidden", 
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
              }}
            >
              <div style={{ padding: "20px" }}>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    color: "#007bff",
                    marginBottom: "10px",
                  }}
                >
                  {company.companyname}
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  Profile: {company.jobprofile}
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  CTC: {company.ctc} LPA
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  Assessment Date: {company.doa}
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  Interview Date: {company.doi}
                </p>
              </div>
              <div style={{ textAlign: "center", paddingBottom: "20px" }}>
                <Link
                  to={`/companypage/${company.id}`}
                  state={{ ids }} 
                  style={{
                    textDecoration: "none",
                    backgroundColor: "#001f3f", 
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    display: "inline-block",
                    cursor: "pointer",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
                    transition: "transform 0.3s ease", 
                  }}
                >
                  Show Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CompanyListing;
