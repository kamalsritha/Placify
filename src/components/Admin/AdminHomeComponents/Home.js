import React from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/interviewimg.png";
import AdminHome from "../AdminHome.js";

const Home = () => {
  return (

    <div className="home-container" style={{marginTop:'100px'}}>
      <AdminHome/>
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading" style={{color:"#2c3e50",fontFamily:"Poppins",fontSize:"50px", fontWeight:"bold",marginLeft:"150px",fontFamily:"Poppins"}} >
            Welcome Admin
          </h1>
          <p
  style={{
    textAlign: "left",
    maxWidth: "800px",
    margin: "20px auto",
    lineHeight: "1.6",
    fontSize: "1rem",
  }}
>
  Welcome to your Placify Admin Interface! It enables 
  efficient data management for company details. 
  Admins can effortlessly filter student data, manage company timelines, 
  and oversee student reports, facilitating streamlined placement operations.
</p>

          
        </div>
        <div className="home-image-section">
          <img src={BannerImage} style={{width:"570px",height:"550px"}} />
        </div>
      </div>
    </div>
  
  );
};

export default Home;
