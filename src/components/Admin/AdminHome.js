import 'bootstrap/dist/css/bootstrap.min.css';
import '../Admin/Admin-CSS/AdminNav.css';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminHome() {
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
      .catch((error) => {
        console.error("Logout failed:", error);
        setErrorMessage("Failed to logout. Please try again.");
      });
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand me-auto" to="/">Placify</Link>
          <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Placify</h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/admin">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/admindashboard">Reports</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/companies">Manage Companies</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/track">Track</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/admin/lab-allocation">Lab Allocation</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/list">Placements</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/" onClick={handleLogout}>Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <button
          className="navbar-toggler login-button pe-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon login-button"></span>
        </button>
      </nav>

      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      ></script>
    </div>
  );
}

export default AdminHome;
