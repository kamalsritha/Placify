import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, deleteCompany } from "../../../redux/companySlice.jsx";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import interviewimg from "../Assets/company.png"; // Static image for the left side
import "../Admin-CSS/Companycrud.css";

function Companycrud() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);
  const [selectedCompany, setSelectedCompany] = useState(null);

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
        console.log(response.data);
        dispatch(getCompanies(response.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const toggleDetails = (company) => {
    console.log(company);
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

  return (
    <>
      <AdminHome />
      <h2 className="header-title text-center mb-5">Companies</h2>
      <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="row w-100 justify-content-center">
          {/* Left Side - Static Image */}
          <div className="col-lg-4 d-flex justify-content-center align-items-center mb-4">
            <img
              src={interviewimg}
              alt="Company"
              className="img-fluid"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>

          {/* Right Side - Companies List */}
          <div className="col-lg-8 d-flex flex-column justify-content-center">
            <div className="mb-4">
              <Link to="/add-companies" className="btn btn-success btn-sm">
                Add +
              </Link>
            </div>

            {/* List of Companies */}
            <div className="d-flex flex-wrap justify-content-center">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="company-card capsule m-3 p-3 d-flex align-items-center justify-content-between"
                  onClick={() => toggleDetails(company)}
                  style={{
                    cursor: "pointer",
                    border: selectedCompany?.id === company.id ? "2px solid #007bff" : "1px solid #ddd",
                    borderRadius: "50px",  // Capsule shape
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    width: "350px",
                    background: "#f9f9f9",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: "10px 20px",
                  }}
                >
                  {/* Company Logo */}
                  <img
                    src={company.logo || interviewimg}  // Default to a generic image if no logo is available
                    alt={company.companyname}
                    className="img-fluid rounded-circle"
                    style={{ width: "50px", height: "50px", marginRight: "20px" }}
                  />

                  {/* Company Name */}
                  <div style={{ flexGrow: 1 }}>
                    <h5 className="mb-0">{company.companyname}</h5>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the toggleDetails from triggering
                      handleDelete(company.id);
                    }}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal to show company details */}
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
                  <img
                    src={selectedCompany.logo || interviewimg}
                    alt={selectedCompany.companyname}
                    className="img-fluid rounded-circle"
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
                <p><strong>Job Role:</strong> {selectedCompany.jobprofile}</p>
                <p><strong>CTC:</strong> {selectedCompany.ctc}</p>
                <p><strong>Assessment Date:</strong> {selectedCompany.doa}</p>
                <p><strong>Interview Date:</strong> {selectedCompany.doi}</p>
                <p><strong>Eligibility Criteria:</strong> {selectedCompany.eligibilityCriteria?.join(", ")}</p>
                <p><strong>10th %:</strong> {selectedCompany.tenthPercentage}</p>
                <p><strong>12th %:</strong> {selectedCompany.twelfthPercentage}</p>
                <p><strong>Graduation CGPA:</strong> {selectedCompany.graduationCGPA}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setSelectedCompany(null)}
                >
                  Close
                </button>
                {/* Update Button */}
                <Link
                  to={`/updatecompany/${selectedCompany.id}`}
                  className="btn btn-danger"
                >
                  Update
                </Link>
                {/* Delete Button */}
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(selectedCompany.id)}
                >
                  Delete
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
