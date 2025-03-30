import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Applicant.css";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";

function Track() {
    const [companies, setCompanies] = useState([]);
    const [sortOption, setSortOption] = useState("recent");
    const [filterOption, setFilterOption] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [yearFilter,setYearFilter]=useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://placify-server.onrender.com/auth/companies");
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
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDateClass = (date) => {
    if (!date) return "company-date";
    const today = new Date().toISOString().split("T")[0];
    return date < today ? "past-date" : "company-date";
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  const sortCompanies = (companies) => {
    switch (sortOption) {
      case "recent":
        return companies.sort((a, b) => new Date(a.created) - new Date(b.created));
      case "alphabetical":
        return companies.sort((a, b) => a.companyname.localeCompare(b.companyname));
      default:
        return companies;
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCompanies = companies
  .filter((company) =>
    company.companyname.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((company) => {
    if (yearFilter && company.pass !== yearFilter) {
      return false;
    }
      switch (filterOption) {
        case "assessmentComplete":
          return company.doa && company.doa < new Date().toISOString().split("T")[0];
        case "interviewComplete":
          return company.doi && company.doi < new Date().toISOString().split("T")[0];

        default:
          return true;
      }
    });

  const sortedCompanies = sortCompanies(filteredCompanies);

  return (
    <>
      <AdminHome />
      <div className="companytrack-container">
              <h1 className="page-heading">Track Companies</h1>
      
              <div className="controls">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search for a company..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
      
                <div className="dropdowns">
                  <select className="sort-select" value={sortOption} onChange={handleSortChange}>
                    <option value="recent">Most Recent</option>
                    <option value="alphabetical">Alphabetical Order</option>
                  </select>
                </div>
                <input
              type="number"
              className="year-input"
              placeholder="Enter Pass-out Year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            />
              </div>
      
              {loading ? (
                <div className="loader-container">
                  <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : companies.length === 0 ? (
                <p className="no-data-message">No companies found.</p>
              ) : (
                <div className="company-list">
                  {sortedCompanies.map((company) => (
                    <div key={company._id} className="company-card">
                      <h3 className="company-name">{company.companyname}</h3>
                      <hr className="company-divider" />
                      <p className="date-text">
                        Ctc: <span className={(company.ctc)}>{company.ctc || "N/A"}</span>
                      </p>
                      <p className="date-text">
                        Pass Year: <span className={getDateClass(company.pass)}>{company.pass || "N/A"}</span>
                      </p>
                      <p className="date-text">
                        Rounds: <span className={getDateClass(company.assessmentRounds.length)}>{company.assessmentRounds.length || "N/A"}</span>
                      </p>
                      <p className="date-text">
                        Interview location: <span className={getDateClass(company.loc)}>{company.loc===null ? "On-campus":"Off-campus"}</span>
                      </p>
                      <p className="date-text">
        Posted on: <span className="company-date">
          {company.created ? company.created.split("T")[0] : "N/A"}
        </span>
      </p>
      
      
      <Link
                key={company._id}
                to={`/timeline/${company._id}/${company.companyname}`}
                className="track-button"
              >

                        Track
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Footer/>
          </>
  );
}

export default Track;
