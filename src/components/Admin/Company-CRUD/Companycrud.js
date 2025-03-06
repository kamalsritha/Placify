import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, deleteCompany } from "../../../redux/companySlice.jsx";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import "../Admin-CSS/Companycrud.css";

function Companycrud() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companiesFromStore = useSelector((state) => state.companies.companies);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [filterOption, setFilterOption] = useState("all");
  const [yearFilter,setYearFilter]=useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/auth/verify").then((res) => {
      if (!res.data.status) {
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/auth/getCompanies"
        );

        dispatch(getCompanies(response.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const filteredCompanies = companiesFromStore
    .filter((company) =>
      company.companyname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((company) => {
      if (yearFilter && company.pass !== yearFilter) {
        return false;
      }
      switch (filterOption) {
        case "recentlyAdded":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return new Date(company.created) >= thirtyDaysAgo;
        case "highCTC":
          return parseFloat(company.ctc) > 10;
        default:
          return true;
      }
    });

  const sortedCompanies = filteredCompanies.sort((a, b) => {
    switch (sortOption) {
      case "recent":
        return new Date(b.created) - new Date(a.created);
      case "alphabetical":
        return a.companyname.localeCompare(b.companyname);
      case "ctc":
        return parseFloat(b.ctc) - parseFloat(a.ctc);
      default:
        return 0;
    }
  });

  const toggleDetails = (company) => {
    setSelectedCompany(
      selectedCompany?.id === company.id ? null : company
    );
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/auth/deletecompany/${id}`)
      .then((res) => {
        dispatch(deleteCompany({ id }));
      })
      .catch((err) => console.log(err));
  };

  const handleApplicants = () => {
    navigate(`/applicants/${selectedCompany.id}`);
  };

  const handleDownloadShortlist = async () => {
    try {
      const companyName = selectedCompany.companyname;
      const tenthPercentage = selectedCompany.tenthPercentage;
      const twelfthPercentage = selectedCompany.twelfthPercentage;
      const graduationCGPA = selectedCompany.graduationCGPA;
      const pass = selectedCompany.pass;
      const eligibilityCriteria = selectedCompany.eligibilityCriteria;

      const response = await axios.get(
        `http://localhost:3001/auth/download-shortlist?companyName=${companyName}&tenthPercentage=${tenthPercentage}&twelfthPercentage=${twelfthPercentage}&graduationCGPA=${graduationCGPA}&pass=${pass}&eligibilityCriteria=${eligibilityCriteria}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${companyName}_shortlist.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error downloading shortlist:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  return (
    <>
      <AdminHome />
      <div className="companycrud-container">
        <div className="companies-main-container">
          <h1 className="page-heading">Company Management</h1>
          
          <div className="controls">
            <input
              type="text"
              className="search-input"
              placeholder="Search for a company..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
              <input
              type="number"
              className="year-input"
              placeholder="Enter Pass-out Year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              style={{borderRadius:"5px"}}
            />
            
            <div className="dropdowns">
              <select 
                className="sort-select" 
                value={sortOption} 
                onChange={handleSortChange}
              >
                <option value="recent">Most Recent</option>
                <option value="alphabetical">Alphabetical Order</option>
                <option value="ctc">Highest CTC</option>
              </select>
              
              <select 
                className="filter-select" 
                value={filterOption} 
                onChange={handleFilterChange}
              >
                <option value="all">All Companies</option>
                <option value="recentlyAdded">Recently Added</option>
                <option value="highCTC">High CTC</option>
              </select>
            </div>
          </div>

          <div className="add-button-container">
            <Link 
              to="/add-companies" 
              className="btn add-button"
            >
              Add New Company +
            </Link>
          </div>

          <div className="company-list">
            {sortedCompanies.map((company) => (
              <div
                key={company.id}
                className="company-card"
                onClick={() => toggleDetails(company)}
              >
                <div className="company-card-content">
                  <h5 className="company-name">{company.companyname}</h5>
                  <hr className="company-divider" />
                  <p>Ctc : {company.ctc} LPA</p>
                  <p>Pass year : {company.pass}</p>
                  <p>Rounds : {company.assessmentRounds.length}</p>
                  <p>Posted on : {company.created ? company.created.split("T")[0] : "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCompany && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
          aria-labelledby="companyModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="companyModalLabel">
                  {selectedCompany.companyname} Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setSelectedCompany(null)}
                />
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                </div>
                <p><strong>Job Role:</strong> {selectedCompany.jobprofile}</p>
                <p><strong>CTC:</strong> {selectedCompany.ctc}</p>
                <p><strong>Eligibility Criteria:</strong> {selectedCompany.eligibilityCriteria?.join(", ")}</p>
                <p><strong>10th %:</strong> {selectedCompany.tenthPercentage}</p>
                <p><strong>12th %:</strong> {selectedCompany.twelfthPercentage}</p>
                <p><strong>Graduation CGPA:</strong> {selectedCompany.graduationCGPA}</p>
                <p><strong>Passout Year : </strong>{selectedCompany.pass}</p>
                <p><strong>Interview location:</strong>{selectedCompany.loc==null?" On-campus":" Off-campus"}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-dark" onClick={handleApplicants} style={{borderRadius:"25px"}}>
                  Applicants
                </button>
              
                <Link
                  to={`/updatecompany/${selectedCompany.id}`}
                  className="btn btn-dark" style={{borderRadius:"25px"}}
                >
                  Update
                </Link>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => handleDelete(selectedCompany.id)} style={{borderRadius:"25px"}}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={handleDownloadShortlist} style={{ borderRadius:"25px"}}
                >
                  Download Shortlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Companycrud;