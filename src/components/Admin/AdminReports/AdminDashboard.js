import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import "../Admin-CSS/AdminDashboard.css";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import AdminHome from "../AdminHome.js";

function AdminDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:3001/auth/verify").then((res) => {
      if (!res.data.status) {
        navigate("/");
      }
    });
  }, []);

  const [users, setUsers] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [list, setList] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filters, setFilters] = useState({
    tenthPercentage: "",
    twelfthPercentage: "",
    graduationCGPA: "",
    placementStatus: "",
    year: ""
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/getUsers")
      .then((response) => {
        const modifiedData = response.data.data.map((user) => ({
          ...user,
          placementStatus: user.placementStatus === null ? "Unplaced" : user.placementStatus,
        }));
        setUsers(modifiedData);
        setOriginalUsers(modifiedData);

        const studentList = modifiedData.map((user) => ({
          name: user.name,
          rollNo: user.rollNo,
          gender: user.gender,
          stream: user.stream,
          year: user.pass,
        }));
        setList(studentList);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(list);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_data.xlsx");
  };

  const applyFilters = () => {
    let filteredUsers = originalUsers.filter((user) => {
      return (
        (!filters.tenthPercentage ||
          user.tenthPercentage >= parseFloat(filters.tenthPercentage)) &&
        (!filters.twelfthPercentage ||
          user.twelfthPercentage >= parseFloat(filters.twelfthPercentage)) &&
        (!filters.graduationCGPA ||
          user.graduationCGPA >= parseFloat(filters.graduationCGPA)) &&
        (!selectedProgram || user.stream === selectedProgram) &&
        (!filters.placementStatus ||
          user.placementStatus === filters.placementStatus) &&
        (!filters.year || new Date(user.pass).getFullYear().toString() === filters.year)
      );
    });
    setSelectedProgram("");
    setUsers(filteredUsers);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleProgramChange = (e) => {
    setSelectedProgram(e.target.value);
  };
  const resetFilters = () => {
    setFilters({
      tenthPercentage: "",
      twelfthPercentage: "",
      graduationCGPA: "",
      placementStatus: "",
      year: ""
    });
    setUsers(originalUsers);
  };

  return (
    <>
      <AdminHome />
      <div className="contain.er" style={{ marginTop: "150px" }}>
        <h1 className="page-heading" style={{fontFamily:"Poppins", fontSize:"28px",fontWeight:"bold"}}>Create Shortlist</h1>
        <div className="filter-container">
          <div className="filter-group">
            <label htmlFor="tenthPercentage" className="filter-label">
              10th Percentage
            </label>
            <input
              type="number"
              id="tenthPercentage"
              name="tenthPercentage"
              value={filters.tenthPercentage}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="twelfthPercentage" className="filter-label">
              12th Percentage
            </label>
            <input
              type="number"
              id="twelfthPercentage"
              name="twelfthPercentage"
              value={filters.twelfthPercentage}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="graduationCGPA" className="filter-label">
              Graduation CGPA
            </label>
            <input
              type="number"
              id="graduationCGPA"
              name="graduationCGPA"
              value={filters.graduationCGPA}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="year" className="filter-label">
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={filters.year}
              onChange={handleChange}
              className="filter-input"
              placeholder="Enter year"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="placementStatus" className="filter-label">
              Placement Status
            </label>
            <select
              id="placementStatus"
              name="placementStatus"
              value={filters.placementStatus}
              onChange={handleChange}
              className="filter-input"
            >
              <option value="">Select Status</option>
              <option value="Placed">Placed</option>
              <option value="Unplaced">Unplaced</option>
            </select>
          </div>

          <div className="filter-buttons">
  <button onClick={applyFilters} className="filter-button">
    Apply Filters
  </button>
  <button onClick={resetFilters} className="filter-button">
    Reset Filters
  </button>
  <button onClick={handleDownload} className="download-button">
    Download
  </button>
</div>

        </div>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Roll No</th>
              <th>Date of Birth</th>
              <th>10th Percentage</th>
              <th>12th Percentage</th>
              <th>Graduation CGPA</th>
              <th>Stream</th>
              <th>passout Year</th>
              <th>Placement Status</th>
              <th>Company Placed</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.contactNumber}</td>
                <td>{user.rollNo}</td>
                <td>{user.dob}</td>
                <td>{user.tenthPercentage}</td>
                <td>{user.twelfthPercentage}</td>
                <td>{user.graduationCGPA}</td>
                <td>{user.stream}</td>
                <td>{user.pass}</td>
                <td>{user.placementStatus}</td>
                <td>{user.companyPlaced}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
