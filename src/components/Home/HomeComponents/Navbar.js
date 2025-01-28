import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Home-CSS/AdminNav.css';
import icon from "../Assets/profile.jpg";
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assume the user is logged in initially
  const [errorMessage, setErrorMessage] = useState(""); // Error state for logout issues
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .post("http://localhost:3001/auth/logout", {}, { withCredentials: true })
      .then(() => {
        console.log("Logging out...");
        setIsLoggedIn(false);
        navigate("/"); // Redirect to the login page or home
      })
      .catch(() => setErrorMessage("Failed to logout. Please try again."));
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <Link to="/home" className="navbar-brand me-auto">Placify</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">PlaceX</h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
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
                  <Link className="nav-link mx-lg-2" to="/offcampus-jobs">Off-Campus Jobs</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/scheduledInterview">Scheduled Interviews</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/faq">FAQ</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/interviewexperience">Interview Experience</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/" onClick={handleLogout}>Logout</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/profile">
                    <img src={icon} alt="Profile" width="30px" height="30px" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      ></script>
    </div>
  );
};

export default Navbar;
