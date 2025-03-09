import React from "react"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import placifyLogo from "../Home/Assets/placify_logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login-CSS/login.css";

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Add login-specific styles to body
    document.body.classList.add("placify-login-body");

    // Cleanup function to remove styles when leaving login page
    return () => {
      document.body.classList.remove("placify-login-body");
    };
  }, []);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);

    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/validate", {
          withCredentials: true,
        });
        if (response.data.status) {
          navigate(response.data.user.isAdmin === "1" ? "/admin" : "/home");
        }
      } catch (error) {
        console.log("User is not authenticated");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    try {
      const result = await axios.post("http://localhost:3001/auth", { email, password });

      if (result.data === "Success") {
        navigate("/home");
      } else if (result.data === "Password Incorrect") {
        setErrorMessage("Incorrect Password");
      } else if (result.data === "Admin") {
        navigate("/admin");
      } else {
        setErrorMessage("Invalid User");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={`placify-login-container ${isLoaded ? "placify-login-fade-in" : ""}`}>
      <div className="placify-login-box">
        <div className="placify-login-title-section text-center">
          <img src={placifyLogo} alt="Placify Logo" className="placify-logo" />
          <h1 className="placify-login-title">Placify</h1>
          <p className="placify-login-tagline">Transforming Campus Recruitment</p>
        </div>
        <div className="placify-login-form-section">
          <h2 className="placify-login-heading">Login</h2>
          {errorMessage && <div className="placify-login-error-message">{errorMessage}</div>}
          <div className="placify-login-content">
            <div className="placify-login-card">
              <form onSubmit={handleSubmit}>
                <div className="placify-login-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    id="email"
                    className="placify-login-form-control"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="placify-login-form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="placify-login-form-control"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="placify-login-btn-primary">Login</button>
              </form>
              <div className="placify-login-links-container">
                <button className="placify-login-btn-secondary" onClick={() => navigate("/register")}>
                  Register
                </button>
                <button className="placify-login-btn-secondary" onClick={() => navigate("/forgotpassword")}>
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
