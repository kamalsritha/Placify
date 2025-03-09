import React from "react"
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "../../redux/companySlice.jsx";
import HomePage from './HomeComponents/HomePage.js';
import Work from "./HomeComponents/Work.js";
import Feedback from "./HomeComponents/Feedback.js";
import { useNavigate } from "react-router-dom";
import JobNotifications from "./HomeComponents/JobNotifications.js";
import { toast, ToastContainer } from 'react-toastify';
import "./Home-CSS/Application.css";
import Footer from "./HomeComponents/Footer.js";


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

    if (currentUser) {
      checkEligibleJobs();
    }

    return () => {
      toast.dismiss('newJobs');
    };
  }, [currentUser]); 

  return (
    <div className="App">
      <ToastContainer limit={1} /> 
      <HomePage />
      <JobNotifications />
      <Work />
      <Feedback />
      <Footer/>
    </div>
  );
}

export default Home;
