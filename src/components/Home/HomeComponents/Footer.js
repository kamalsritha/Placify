import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import logo from "../Assets/placify_logo.png";
import "../Home-CSS/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
       
        <div className="footer-brand">
          <center><img src={logo} alt="Placify Logo" className="footer-logo" /></center>
          <h2 style={{textAlign:"center"}}>Placify</h2>
          <p>Transforming Campus Recruitment</p>
        </div>

       
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>


      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Placify</p>
      </div>
    </footer>
  );
};

export default Footer;
