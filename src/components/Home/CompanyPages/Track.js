import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import "./Applicant.css";
import Navbar from "../HomeComponents/Navbar.js";

function CompanyTrack() {
  const location = useLocation();
  const user = location.state?.user || null;  
  const [companies, setCompanies] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/auth/track/companies/${user._id}`);
        setCompanies(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setCompanies([]);
      }
    };
    fetchData();
  }, [user._id]);

  return (
    <>
      <Navbar />
      <div className="applicants-wrapper">
        <h1 className="heading">Track Companies</h1>

        {!user ? (
          <p className="error-message">User data not available. Please log in again.</p>
        ) : companies.length === 0 ? (
          <p className="no-data-message">No companies found.</p>
        ) : (
          <div className="company-container">
            {companies.map((company) => (
              <Link 
                key={company._id} 
                to={`/user/timeline/${company._id}/${company.companyname}`} 
                state={{ user }}  
                className="company-box"
              >
                {company.companyname}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CompanyTrack;
