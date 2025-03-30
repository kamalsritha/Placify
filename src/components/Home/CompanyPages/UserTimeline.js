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
  const { id, name:companyName} = useParams();
  const location = useLocation();
  const { user } = location.state || {};
  const [loc,setLoc]=useState(null);

  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    if (!user) return;
    console.log(companyName);
    const fetchTimelineData = async () => {
      try {
        const response = await axios.get(`https://placify-server.onrender.com/auth/timeline/${id}/${user.rollNo}`);
        setTimelineData(response.data);

        const res=await axios.get(`https://placify-server.onrender.com/auth/loc/${id}`);
        setLoc(res.data.location);
      } catch (error) {
        console.error("Error fetching timeline data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, [id, user]);

  const addToCalendar = (company,name, date) => {
    console.log(company + " " + date);
    
    if (company && name && date) {
      const startDate = new Date(date); 
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1); 
  
    
      const formatDate = (d) => 
        d.getUTCFullYear().toString() +
        (d.getUTCMonth() + 1).toString().padStart(2, "0") +
        d.getUTCDate().toString().padStart(2, "0");
  
      const startStr = formatDate(startDate);
      const endStr = formatDate(endDate);
  
  
      const calendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        company+" "+name
      )}&dates=${startStr}/${endStr}&allDay=true`;
  
      window.open(calendarLink, "_blank");
    }
  };
  

  if (!user) return <p className="error-message">User data not available. Please log in again.</p>;
  if (loading) return <Spinner />;

  let stopTimeline = false;
  let previousStageSelectedAndCompleted = false;

  return (
    <div>
      <Navbar />
      <div className="timeline-container" style={{ marginTop: "150px", borderRadius: "20px" }}>
        <h1 className="timeline-title">{companyName} - Application Timeline</h1>
        <div className="timeline">
          {timelineData.map((round, index) => {
            if (stopTimeline) return null;

            const { name, completed, lab, selected, date } = round;
            let statusClass = selected === "Selected" ? "status-green" :
                              selected === "Not Selected" ? "status-red" : "status-gray";

            if (selected === "Not Selected") stopTimeline = true;
            
            
            const showButtons = previousStageSelectedAndCompleted && lab === null && !completed;
            
          
            if (completed && selected === "Selected") {
              previousStageSelectedAndCompleted = true;
            } else {
              previousStageSelectedAndCompleted = false;
            }

            return (
              <div key={index} className="timeline-item">
                <div className="timeline-dot-container">
                  <div className={`timeline-dot ${completed ? "completed" : ""}`} />
                  {index !== timelineData.length - 1 && !stopTimeline && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <div className="timeline-stage">
                    <div className="timeline-stage-row">
                      <p className={`timeline-text ${completed ? "completed-text" : ""}`}>
                        {name} {date ? `(${new Date(date).toLocaleDateString()})` : ""}
                      </p>
                      {lab !== null && <span className={`lab-status ${lab ? "lab-green" : "lab-red"}`}>
                        <p><b>{lab ? "Lab Not Allocated" : "Lab Allocated"}</b></p>
                      </span>}
                      {selected && <span className={`status-text ${statusClass}`}>{selected}</span>}
                    </div>
                    
                    {showButtons && (
                      <div className="interview-buttons">
                      <button className="interview-button" onClick={() => addToCalendar(companyName,name, date)}>
  Add
</button>

                        {loc!=null ? (
                          <Link to={`/location/${encodeURIComponent(loc)}`} className="interview-button">
                            Location
                          </Link>
                        ) : (
                          <span className="interview-button">Oncampus</span>
                        )}
                      </div>
                    )}
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