import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./Applicant.css"; 
import Navbar from "../HomeComponents/Navbar.js";

function CompanyTrack() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return location.state?.user || (storedUser ? JSON.parse(storedUser) : null);
  });
  const [companies, setCompanies] = useState([]);
  const [sortOption, setSortOption] = useState("recent");
  const [filterOption, setFilterOption] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/auth/track/companies/${user._id}`);
        setCompanies(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

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
      <Navbar />
      <div className="companytrack-container">
        <h1 className="page-heading">Track Your Applications</h1>

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

            <select className="filter-select" value={filterOption} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="assessmentComplete">Assessment Complete</option>
              <option value="interviewComplete">Interview Complete</option>
            </select>
          </div>
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
                  Assessment Date: <span className={getDateClass(company.doa)}>{company.doa || "N/A"}</span>
                </p>
                <p className="date-text">
                  Interview Date: <span className={getDateClass(company.doi)}>{company.doi || "N/A"}</span>
                </p>
                <p className="date-text">
  Posted on: <span className="company-date">
    {company.created ? company.created.split("T")[0] : "N/A"}
  </span>
</p>


                <Link 
                  to={`/user/timeline/${company._id}/${company.companyname}`} 
                  state={{ user }}  
                  className="track-button"
                >
                  Track
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CompanyTrack;
