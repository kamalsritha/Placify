import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "../../../redux/companySlice.jsx";
import Navbar from "../HomeComponents/Navbar.js";
import Footer from "../HomeComponents/Footer.js";
import { Spinner } from "react-bootstrap";

function CompanyListing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);
  const [ids, setIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [filterOption, setFilterOption] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [sortOption, setSortOption] = useState("none");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEligibleJobs = async () => {
      try {
        const response = await axios.get("https://placify-server.onrender.com/auth/jobs/eligible");
        setIds(response.data.map((job) => job._id));
      } catch (error) {
        console.error("Error checking eligible jobs:", error);
      }
    };

    fetchEligibleJobs();
  }, []);

  useEffect(() => {
    axios.get("https://placify-server.onrender.com/auth/verify").then((res) => {
      if (!res.data.status) {
        navigate("/");
      }
    });

    axios
      .get("https://placify-server.onrender.com/auth/currentUser")
      .then((res) => setCurrentUser(res.data.user))
      .catch((err) => console.error("Error fetching current user:", err));
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://placify-server.onrender.com/auth/getCompanies");
        console.log(response.data)
        dispatch(getCompanies(response.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleSearch = () => {
    setSearchTerm(searchQuery);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  const filteredCompanies = companies
    .filter((company) =>
      company.companyname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((company) => {
      switch (filterOption) {
        case "My Year":
          return company.pass===currentUser.pass
        default:
          return true;
      }
    });



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

    const sortedCompanies = sortCompanies(filteredCompanies);



  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "150px", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "28px", color: "#333", marginBottom: "30px", fontFamily: "Poppins", fontWeight: "bold" }}>
          Ongoing Drives
        </h1>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <Spinner animation="border" variant="dark" />
          </div>
        ) : (
          <div className="company-container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="search-filter-container" style={{ marginBottom: "30px" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Search for a company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "10px",
                    width: "250px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <button
                  onClick={handleSearch}
                  style={{
                    padding: "10px 15px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "black",
                    color: "white",
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Search
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "15px" }}>
                <label style={{ fontWeight: "bold", color: "#555", marginRight: "10px" }}>Sort by:</label>
                <select
                  onChange={(e) => setSortOption(e.target.value)}
                  value={sortOption}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <option value="none">Most Recent</option>
                  <option value="alphabetical">Alphabetical Order</option>
                  <option value="recent">Expiry Soon</option>
                  
                </select>
                <select className="filter-select" value={filterOption} onChange={handleFilterChange} style={{margin:"5px"}}>
              <option value="all">All</option>
              <option value="My Year">My Year</option>
            </select>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", flexWrap: "wrap", gap: "30px" }}>
              {sortedCompanies.map((company) => (
                <div
                  key={company.id}
                  style={{
                    width: "320px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "10px",
                    margin: "20px",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div style={{ padding: "20px", textAlign: "left" }}>
                    <h3
                      style={{
                        fontSize: "1.5rem",
                        fontFamily: "Poppins",
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "15px",
                      }}
                    >
                      {company.companyname}
                    </h3>
                    <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
                    <p>Profile: {company.jobprofile}</p>
                    <p>CTC: {company.ctc} LPA</p>
                    <p>Rounds: {company.assessmentRounds?.length ? company.assessmentRounds.length : "N/A"}</p>
                    <p>Pass Year: {company.pass}</p>
                  </div>
                  <div style={{ textAlign: "center", paddingBottom: "25px" }}>
                    <Link
                      to={`/companypage/${company.id}`}
                      state={{ ids }}
                      style={{
                        textDecoration: "none",
                        backgroundColor: "black",
                        color: "#fff",
                        padding: "12px 22px",
                        borderRadius: "20px",
                        display: "inline-block",
                        cursor: "pointer",
                      }}
                    >
                      Show Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CompanyListing;
