import React from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/interviewimg.png";
import AdminHome from "../AdminHome.js";
import "../Admin-CSS/Home.css"; // Ensure CSS is included

const Home = () => {
  return (
    <div className="home-container">
      <AdminHome />

      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="Banner Background" />
        </div>

        <div className="home-content">
          <div className="home-text-wrapper">
            <h1 className="primary-heading">Welcome Admin</h1>
            <p className="home-description">
              Welcome to your Placify Admin Interface! It enables efficient data
              management for company details. Admins can effortlessly filter student
              data, manage company timelines, and oversee student reports,
              facilitating streamlined placement operations.
            </p>
          </div>
        </div>

        <div className="home-image-section">
          <img src={BannerImage} alt="Interview" />
        </div>
      </div>
    </div>
  );
};

export default Home;
