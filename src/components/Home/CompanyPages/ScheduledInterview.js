import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../HomeComponents/Navbar.js";
import Footer from "../HomeComponents/Footer.js";
import scheduleimage from "../Assets/scheduleding.png";
import { Oval } from "react-loader-spinner";

function ScheduledInterview() {
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    if (currentUser) {
      const fetchScheduledInterviews = async () => {
        try {
          const userId = currentUser._id;
          const response = await axios.get(
            `http://localhost:3001/auth/scheduledInterviews/${userId}`
          );
          setScheduledInterviews(response.data.scheduledInterviews);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchScheduledInterviews();
    }
  }, [currentUser]);

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Oval height={80} width={80} color="black" visible={true} />
        </div>
      ) : (
        <div
          className="container d-flex flex-column align-items-center justify-content-center my-1"
          style={{ minHeight: "100vh" }}
        >
          <h1
            className="text-center mb-4"
            style={{ fontSize: "28px", color: "#333", fontFamily: "Poppins", fontWeight: "bold" }}
          >
            Scheduled Assessments
          </h1>
          <br />
          <div className="row w-100 justify-content-center">
            {/* Left Part with Image */}
            <div className="col-12 col-md-6 d-flex justify-content-center align-items-center mb-4">
              <img
                src={scheduleimage}
                alt="Scheduled Interviews"
                style={{
                  maxWidth: "50%", 
                  height: "auto",
                  borderRadius: "15px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>

            {/* Right Part with List of Interviews */}
            <div className="col-12 col-md-6">
              <div className="list-group">
                {scheduledInterviews.length > 0 ? (
                  scheduledInterviews.map((interview, index) => (
                    <div
                      key={index}
                      className="list-group-item"
                      style={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "15px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <h5 className="mb-2" style={{ color: "black", fontFamily: "Poppins", fontWeight: "Bold" }}>
                        {interview.companyName}
                      </h5>
                      <p className="mb-1" style={{ fontSize: "1.1rem", color: "#555" }}>
                        <strong style={{ color: "black" }}>Assessment Date:</strong> {interview.interviewDate}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center" style={{ fontSize: "1.2rem", color: "#888", fontFamily:"Poppins",fontWeight:"bold"}}>
                    You have no scheduled Assessments.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default ScheduledInterview;