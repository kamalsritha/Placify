import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Applicant.css";
import AdminHome from "../AdminHome.js";

function Track() {
  const [companies, setCompanies] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/companies");
        console.log("API Response:", response.data); 

        if (response.data) {
          setCompanies(response.data);
        } else {
          setCompanies([]); 
        }
      } catch (err) {
        console.error("Error fetching expired companies:", err);
        setCompanies([]); 
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <AdminHome />
      <div className="applicants-wrapper">
        <h1 className="heading">Track Companies</h1>
        {companies.length === 0 ? (
          <p className="no-data-message">No companies found.</p>
        ) : (
          <div className="company-container">
            {companies.map((company) => (
              <Link
                key={company._id}
                to={`/timeline/${company._id}/${company.companyname}`}
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

export default Track;
