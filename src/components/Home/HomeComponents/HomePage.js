import React from "react"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "../../../redux/companySlice.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";
import Navbar from "./Navbar.js";
import BannerImage from "../Assets/interviewimg.png";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);

  const [currentUser, setCurrentUser] = useState(null);
  const [placementStatus, setPlacementStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const verifyResponse = await axios.get("https://placify-server.onrender.com/auth/verify");
        if (!verifyResponse.data.status) {
          navigate("/");
          return;
        }

        const userResponse = await axios.get("https://placify-server.onrender.com/auth/currentUser");
        setCurrentUser(userResponse.data.user);

        if (userResponse.data.user) {
          const placementResponse = await axios.get(
            `https://placify-server.onrender.com/auth/placementStatus/${userResponse.data.user._id}`
          );
          setPlacementStatus(placementResponse.data);
        }

        const companiesResponse = await axios.get("https://placify-server.onrender.com/auth/getCompanies");
        dispatch(getCompanies(companiesResponse.data));
      } catch (err) {
        console.error("Error fetching data:", err);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, dispatch]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Navbar currentUser={currentUser} />

      <div className="welcome-section">
  <div className="welcome-text">
    {currentUser && (
      <>
        <h1>Welcome, {currentUser.name}</h1>
        {placementStatus?.status === "Placed" && (
          <p className="placement-status">
            ✨ Congratulations! You are placed at {placementStatus.companyName}.
          </p>
        )}
      </>
    )}
    <p style={{ fontFamily: "Poppins", textAlign: "justify", margin: "0", width: "100%" }}>
      Welcome to your Placify! Explore career opportunities, company profiles, and upcoming interviews. 
      Manage your profile, upload resumes, and track application progress seamlessly.
    </p>
  </div>

  <div className="banner-image">
    <img src={BannerImage} alt="Banner" />
  </div>
</div>


      <div className="notice-board">
        <h2>📢 Notice Board: Upcoming Drives</h2>
        <div className="notice-grid">
          {companies.length > 0 ? (
            companies.map((drive, index) => (
              <div key={index} className="notice-card">
                <h3>{drive.companyname}</h3>
                <p>Ctc: <strong>{drive.ctc} LPA</strong></p>
                <p>Rounds: <strong>{drive.assessmentRounds.length}</strong></p>
                <p>Expires on: <strong>{new Date(drive.expire).toLocaleDateString()}</strong></p>
              </div>
            ))
          ) : (
            <p className="no-drives">No upcoming drives at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
