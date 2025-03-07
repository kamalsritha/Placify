import React, { useEffect, useState } from "react";
import AdminHome from "../AdminHome.js";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Footer from "../AdminReusableComponents/AdminFooter.js";

const List = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/list/${selectedYear}`);
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
  }, [selectedYear]);

  return (
    <>
      <AdminHome />
      <div className="container text-center mt-4 d-flex align-items-center justify-content-center gap-3">
        <h2 style={{color:"#333",fontFamily:"Poppins" , fontWeight:"bold", fontSize:"28px"}}>Placements</h2>
        <DatePicker
          selected={new Date(selectedYear, 0, 1)}
          onChange={(date) => setSelectedYear(date.getFullYear())}
          showYearPicker
          dateFormat="yyyy"
          className="form-control w-auto"
          style={{ marginTop: "10px" }}
        />
      </div>
      <div className="container">
  {loading ? (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : companies.length > 0 ? (
    <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
      <table className="table table-bordered table-hover text-center custom-table">
        <thead className="table-dark position-sticky top-0">
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
              <td>{company.finalSelectCount || 0}</td>
              <td>{company.ctc ? company.ctc.toFixed(2) + " LPA" : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-center fs-5 fw-semibold text-secondary">
      No data available for {selectedYear}
    </p>
  )}
</div>

      <Footer/>
    </>
  );
};

export default List;