import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../UserContext.js"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "../Home-CSS/AdminNav.css";
import icon from "../Assets/profile.png";
import logo from "../Assets/placify_logo.png"; 
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext); 

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/auth/logout", {}, { withCredentials: true });
      setUser(null); 
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <Link to="/home" className="navbar-brand me-auto d-flex align-items-center">
          <img src={logo} alt="Placify Logo" className="navbar-logo" />
          <span className="navbar-text ms-2">Placify</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="offcanvas offcanvas-end" id="offcanvasNavbar">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Placify</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>
          
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/companylisting">Company Listing</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/companytrack" state={{ user }}>Track</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/offcampus-jobs">Off-Campus Jobs</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/scheduledInterview">Schedule</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/faq">FAQ</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/interviewexperience">Experiences</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/" onClick={handleLogout}>Logout</Link>
              </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/profile">
                    <img src={icon} alt="Profile" width="30px" height="30px" className="rounded-circle" />
                  </Link>
                </li>
              
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
