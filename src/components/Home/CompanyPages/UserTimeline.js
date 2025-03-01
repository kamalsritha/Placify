import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./Timeline.css";
import Navbar from "../HomeComponents/Navbar.js";

function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function UserTimeline() {
  const { id, name } = useParams();
  const location = useLocation();
  const user = location.state?.user || null;

  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [statusChecks, setStatusChecks] = useState({
    isExpired: false,
    isLabAllocated: false,
    isAssessmentCompleted: false,
    isInterviewCompleted: false,
    isFinalCompleted: false,
    assessmentSelected: "Waiting for Result",
    interviewSelected: "Waiting for Result",
    finalSelected: "Waiting for Result",
  });

  const timelineStages = ["Expired", "Lab Allocation", "Assessment", "Interview", "Result"];

  useEffect(() => {
    if (!user) return;

    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/auth/companies/${id}`);
        setCompany(response.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    const checkCompanyStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/auth/company-status/${id}/${user.rollNo}`);
        setStatusChecks(response.data);
      } catch (error) {
        console.error("Error checking company status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
    checkCompanyStatus();
  }, [id, user]);

  const addToCalendar = () => {
    if (company?.doi) {
      const event = {
        title: `${name} Interview`,
        start: new Date(company.doi),
        allDay: true,
      };

      const calendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start.toISOString().replace(/[-:]/g, '').split('.')[0]}/${event.start.toISOString().replace(/[-:]/g, '').split('.')[0]}`;
      window.open(calendarLink, "_blank");
    }
  };

  if (!user) return <p className="error-message">User data not available. Please log in again.</p>;
  if (loading) return <Spinner />;

  let stopTimeline = false;

  return (
    <div>
      <Navbar />
      <div className="timeline-container" style={{ marginTop: "150px", borderRadius:"20px" }}>
        <h1 className="timeline-title">{name} - Application Timeline</h1>
        <div className="timeline">
          {timelineStages.map((stage, index) => {
            if (stopTimeline) return null;

            let statusText = "";
            let statusClass = "";
            let isCompleted = false;
            let dateInfo = "";

            if (stage === "Expired") isCompleted = statusChecks.isExpired;
            if (stage === "Lab Allocation") isCompleted = statusChecks.isLabAllocated;
            if (stage === "Assessment") {
              isCompleted = statusChecks.isAssessmentCompleted;
              statusText = statusChecks.assessmentSelected;
              dateInfo = company?.doa ? `(${new Date(company.doa).toLocaleDateString()})` : "";
            }
            if (stage === "Interview") {
              isCompleted = statusChecks.isInterviewCompleted;
              statusText = statusChecks.interviewSelected;
              dateInfo = company?.doi ? `(${new Date(company.doi).toLocaleDateString()})` : "";
            }
            if (stage === "Result") {
              isCompleted = statusChecks.isFinalCompleted;
              statusText = statusChecks.finalSelected;
            }

            if (statusText === "Selected") statusClass = "status-green";
            else if (statusText === "Not Selected") {
              statusClass = "status-red";
              stopTimeline = true;
            } else statusClass = "status-gray";

            return (
              <div key={index} className="timeline-item">
                <div className="timeline-dot-container">
                  <div className={`timeline-dot ${isCompleted ? "completed" : ""}`} />
                  {index !== timelineStages.length - 1 && !stopTimeline && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <div className="timeline-stage">
                    <div className="timeline-stage-row">
                      <p className={`timeline-text ${isCompleted ? "completed-text" : ""}`}>
                        {stage} {dateInfo}
                      </p>
                      {stage === "Interview" && statusText === "Waiting for Result" && (
                        <div className="interview-buttons">
                          <button className="interview-button" onClick={addToCalendar}>Add</button>
                          {company?.loc ? (
                            <Link to={`/location/${encodeURIComponent(company.loc)}`} className="interview-button">
                              Location
                            </Link>
                          ) : (
                            <span className="interview-button">Oncampus</span>
                          )}
                        </div>
                      )}
                      {statusText && <span className={`status-text ${statusClass}`}>{statusText}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UserTimeline;