import React, { useEffect, useState } from "react";
import AdminHome from "../AdminHome.js";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const List = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/list"); 
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <>
      <AdminHome />
      
      <div className="container" style={{ marginTop: "50px" }}>
        <h1>Placements</h1>
      </div>

      <div className="container">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : companies.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center custom-table">
              <thead className="table-primary">
                <tr>
                  <th>Company Name</th>
                  <th>Students Placed</th>
                  <th>CTC (LPA)</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={index}>
                    <td>{company.companyName || "N/A"}</td>
                    <td>{company.count || 0}</td>
                    <td>{company.ctc ? company.ctc.toFixed(2) + " LPA" : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center fs-5 fw-semibold text-secondary">
            No data available
          </p>
        )}
      </div>
    </>
  );
};

export default List;
