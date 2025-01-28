import React from "react";
import AboutBackground from "../Assets/aboutus.png";
import AboutBackgroundImage from "../Assets/aboutusimg.png";
import '../Admin-CSS/About.css';
const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>

      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <p className="primary-subheading" style={{ color: "navy", fontSize: "50px",marginTop:"-450px",marginRight:"-450px"}}>About</p>
      <div className="about-section-text-container">
        <div className="card-container" style={{marginTop:"150px",marginRight:"60px"}}>
          <div className="card" style={{height:"400px",width:"250px"}}>
            <img src="" className="card-img-top" alt="..." />
            <div className="card-body">
              <p className="card-text" style={{fontSize:"1.2rem"}}><b>M.Kamalsritha</b><br></br>Student-1</p>
            </div>
          </div>
          <div className="card" style={{height:"400px",width:"250px"}}>
            <img src="" className="card-img-top" alt="..." />
            <div className="card-body">
            <p className="card-text" style={{fontSize:"1.2rem"}}><b>K.Sai Shriya</b><br></br>Student-2</p>
            </div>
          </div>
          <div className="card" style={{height:"400px",width:"250px"}}>
            <img src="" className="card-img-top" alt="..." />
            <div className="card-body">
            <p className="card-text" style={{fontSize:"1.2rem"}}><b>CH.Sathvik</b><br></br>Student-3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
