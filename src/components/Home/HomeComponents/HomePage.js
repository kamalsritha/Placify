import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "../../../redux/companySlice.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BannerImage from "../Assets/interviewimg.png";
import Navbar from "./Navbar.js";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);

  const [currentUser, setCurrentUser] = useState(null);
  const [placementStatus, setPlacementStatus] = useState(null);
  const [AssessmentStatus, setAssessmentStatus]=useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/auth/verify").then((res) => {
      if (!res.data.status) {
        navigate("/");
      }
    });

    axios
      .get("http://localhost:3001/auth/currentUser")
      .then((res) => {
        setCurrentUser(res.data.user);
        fetchPlacementStatus(res.data.user._id);
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
      });
  }, []);

  const fetchPlacementStatus = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/auth/placementStatus/${userId}`
      );
      setPlacementStatus(response.data);
    } catch (error) {
      console.error("Error fetching placement status:", error);
    }
  };

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

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <div
        style={{
          marginTop: "100px",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "90%",
            maxWidth: "1200px",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              flex: 1,
              textAlign: "left",
              color: "#2c3e50",
              paddingRight: "20px",
            }}
          >
            {currentUser && (
              <>
                <h1
                  style={{
                    color: "#34495e",
                    fontSize: "48px",
                    fontWeight: "700",
                    marginBottom: "20px",
                  }}
                >
                  Welcome, {currentUser.name}
                </h1>
                {placementStatus && placementStatus.status === "Placed" && (
                  <p
                    style={{
                      fontSize: "20px",
                      color: "#27ae60",
                      fontWeight: "bold",
                      marginBottom: "20px",
                      padding: "10px 20px",
                      backgroundColor: "#eafaf1",
                      borderRadius: "5px",
                      display: "inline-block",
                    }}
                  >
                    ✨ Congratulations! You are placed at{" "}
                    {placementStatus.companyName}.
                  </p>
                )}
              </>
            )}
            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                color: "#7f8c8d",
                marginTop: "10px",
              }}
            >
              Welcome to your Placement Management System! Explore career
              opportunities, company profiles, and upcoming interviews. Manage
              your profile, upload resumes, and track application progress
              seamlessly.
            </p>
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <img
              src={BannerImage}
              alt="Banner"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
        </div>

        {/* Notice Board Section */}
        <div
          style={{
            width: "90%",
            maxWidth: "1200px",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            padding: "20px",
            marginTop: "30px",
            border: "1px solid #e0e0e0",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              color: "#2c3e50",
              marginBottom: "20px",
              textAlign: "center",
              borderBottom: "2px solid #2c3e50",
              paddingBottom: "10px",
            }}
          >
            📢 Notice Board: Upcoming Drives
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {companies.length > 0 ? (
              companies.map((drive, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      color: "#34495e",
                      marginBottom: "10px",
                    }}
                  >
                    {drive.companyname}
                  </h3>
                  <p style={{ margin: "5px 0", color: "#7f8c8d" }}>
                    Position: <strong>{drive.doi}</strong>
                  </p>
                  <p style={{ margin: "5px 0", color: "#7f8c8d" }}>
                    Date:{" "}
                    <strong>
                      {new Date(drive.doa).toLocaleDateString()}
                    </strong>
                  </p>
                  <p style={{ margin: "5px 0", color: "#7f8c8d" }}>
                    Expires on:{" "}
                    <strong>
                      {new Date(drive.expire).toLocaleDateString()}
                    </strong>
                  </p>
                </div>
              ))
            ) : (
              <p
                style={{
                  fontSize: "16px",
                  color: "#7f8c8d",
                  textAlign: "center",
                  margin: "20px 0",
                }}
              >
                No upcoming drives at the moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;