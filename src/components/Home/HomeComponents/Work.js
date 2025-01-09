import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [placedStudents, setPlacedStudents] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const studentsResponse = await axios.get("http://localhost:3001/auth/students");
        setPlacedStudents(studentsResponse.data.placedCount)
        setTotalStudents(studentsResponse.data.totalCount)
        setTotalCompanies(studentsResponse.data.companiesCount)
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const calculatePlacementPercentage = () => {
    return totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        fontFamily: "'Poppins', sans-serif",
        padding: "20px",
      }}
    >
      {/* Dashboard Boxes */}
      <div
        style={{
          display: "flex",
          width: "90%",
          maxWidth: "900px",
          border: "1px solid #e0e0e0",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Total Companies */}
        <div
          style={{
            flex: 1,
            padding: "30px",
            textAlign: "center",
            backgroundColor: "#f4f4f4",
            color: "#333",
            borderRight: "1px solid #e0e0e0",
          }}
        >
          <h2 style={{ fontSize: "48px", margin: "10px 0", fontWeight: "700" }}>
            {totalCompanies}
          </h2>
          <p style={{ fontSize: "18px", margin: "0", fontWeight: "500" }}>
            Companies Arrived
          </p>
        </div>

        {/* Total Students Placed */}
        <div
          style={{
            flex: 1,
            padding: "30px",
            textAlign: "center",
            backgroundColor: "#ffffff",
            color: "#333",
            borderRight: "1px solid #e0e0e0",
          }}
        >
          <h2 style={{ fontSize: "48px", margin: "10px 0", fontWeight: "700" }}>
            {placedStudents}
          </h2>
          <p style={{ fontSize: "18px", margin: "0", fontWeight: "500" }}>
            Students Placed
          </p>
        </div>

        {/* Placement Percentage */}
        <div
          style={{
            flex: 1,
            padding: "30px",
            textAlign: "center",
            backgroundColor: "#f4f4f4",
            color: "#333",
          }}
        >
          <h2 style={{ fontSize: "48px", margin: "10px 0", fontWeight: "700" }}>
            {calculatePlacementPercentage()}%
          </h2>
          <p style={{ fontSize: "18px", margin: "0", fontWeight: "500" }}>
            Placement Rate
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;