import 'bootstrap/dist/css/bootstrap.min.css';
import '../Admin/Admin-CSS/AdminNav.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../Home/Assets/placify_logo.png";

function AdminHome() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:3001/auth/validate", { withCredentials: true })
      .then((response) => {
        if (response.data.status) {
          setIsLoggedIn(true);
        } else {
          navigate("/"); 
        }
      })
      .catch((error) => {
        console.error("Authentication check failed:", error);
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/logout",
        {},
        { withCredentials: true }
      );

      if (response.data.status) {
        setIsLoggedIn(false);
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/"); 
      } else {
        setErrorMessage("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setErrorMessage("Logout failed. Please try again.");
    }
  };

  return (
    isLoggedIn ? (
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="Placify Logo" className="navbar-logo" />
            <span className="navbar-text ms-2">Placify</span>
          </Link>

          
          <button className="navbar-toggler" type="button" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="navbar-toggler-icon"></span>
          </button>

        
          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link mx-lg-2" to="/admin">Home</Link></li>
              <li className="nav-item"><Link className="nav-link mx-lg-2" to="/companies">Manage Companies</Link></li>
              <li className="nav-item"><Link className="nav-link mx-lg-2" to="/track">Track</Link></li>
              <li className="nav-item"><Link className="nav-link mx-lg-2" to="/admindashboard">Shortlist</Link></li>
              <li className="nav-item"><Link className="nav-link mx-lg-2" to="/admin/lab-allocation">Lab Allocation</Link></li>
              <li className="nav-item"><Link className="nav-link mx-lg-2" to="/list">Placements</Link></li>
              <li className="nav-item"><Link className="nav-link mx-lg-2" to="/" onClick={handleLogout}>Logout</Link></li>
            </ul>
          </div>
        </div>

        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
      </nav>
    ) : null
  );
}

export default AdminHome;
