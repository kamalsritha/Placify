import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, deleteCompany } from "../../redux/companySlice.jsx";
import ScheduledInterview from "./CompanyPages/ScheduledInterview.js";
import HomePage from './HomeComponents/HomePage.js';
import About from "./HomeComponents/About.js";
import Work from "./HomeComponents/Work.js";
import Feedback from "./HomeComponents/Feedback.js";
import Contact from "./HomeComponents/Contact.js";
import Footer from "./HomeComponents/Footer.js";
import JobNotifications from "./HomeComponents/JobNotifications.js";
import { toast, ToastContainer } from 'react-toastify';
import "./Home-CSS/Application.css";


function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/auth/verify").then((res) => {
      if (!res.data.status) {
        navigate("/");
      }
    });

    axios
      .get("http://localhost:3001/auth/currentUser")
      .then((res) => {
        setCurrentUser(res.data.user);
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/auth/getCompanies"
        );
        dispatch(getCompanies(response.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const checkEligibleJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/auth/jobs/eligible');
        if (response.data.length > 0 && !toast.isActive('newJobs')) {
          toast.info(`You have ${response.data.length} new job opportunities!`, {
            position: "top-right",
            autoClose: 5000,
            toastId: 'newJobs',
            pauseOnFocusLoss: false,
            draggable: false
          });
        }
      } catch (error) {
        console.error('Error checking eligible jobs:', error);
      }
    };

    // Only check for jobs if user is logged in
    if (currentUser) {
      checkEligibleJobs();
    }

    return () => {
      toast.dismiss('newJobs');
    };
  }, [currentUser]); // Depend on currentUser

  return (
    <div className="App">
      <ToastContainer limit={1} /> {/* Limit to 1 toast at a time */}
      <HomePage />
      <About />
      <JobNotifications />
      <Work />
      <Feedback />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;