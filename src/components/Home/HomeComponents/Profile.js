import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Navbar from "./Navbar.js";

function Profile() {
  const [companyNames, setCompanyNames] = useState([]);
  const [showCompanies, setShowCompanies] = useState(false);
  const [newCGPA, setNewCGPA] = useState("");
  const [user, setUser] = useState([])

  useEffect(() => {
    const fetchData = async () => {
    const userResponse = await axios.get("https://placify-server.onrender.com/auth/currentUser");
        setUser(userResponse.data.user);
    
    
    if (user?.appliedCompanies?.length > 0) {
      axios
        .post("https://placify-server.onrender.com/auth/getCompaniesApplied", {
          companyIds: user.appliedCompanies,
        })
        .then((res) => setCompanyNames(res.data))
        .catch((err) => console.error("Error fetching company names:", err));
    }
  }
  fetchData();
  }, [user]);

  const handleUpdateCGPA = () => {
    if (!newCGPA) return;
    axios
      .post("https://placify-server.onrender.com/auth/updateCGPA", {
        userId: user._id,  
        cgpa: newCGPA
      }, { withCredentials: true })
      .then((res) => {
        setUser((prev) => ({ ...prev, graduationCGPA: newCGPA }));
        setNewCGPA("");
      })
      .catch((err) => console.error("Error updating CGPA:", err));
  };

  if (!user)
    return (
      <div className="loading-container">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="profile-container d-flex align-items-center justify-content-center mt-5 mb-5">
        <div className="profile-card p-4 shadow-lg bg-white rounded">
          <h1 className="text-center mb-4" style={{fontFamily:"Poppins", fontWeight:"bold",fontSize:"28px",color:"#333"}}>My Profile</h1>

          <div className="d-flex flex-wrap justify-content-between">
            {[
              { label: "Name", value: user.name },
              { label: "Email", value: user.email },
              { label: "Phone", value: user.contactNumber },
              { label: "Stream", value: user.stream },
              { label: "10th Percentage", value: user.tenthPercentage },
              { label: "12th Percentage", value: user.twelfthPercentage },
              { label: "Passout Year", value: user.pass },
              { label: "Placement Status", value: user.placementStatus || "Not Placed" },
              { label: "Placed Company", value: user.companyPlaced || "Not Placed" },
            ].map((item, index) => (
              <div key={index} className="info-box p-3 m-2">
                <strong>{item.label}:</strong>
                <p>{item.value || "Not Provided"}</p>
              </div>
            ))}

            <div className="info-box p-3 m-2 d-flex align-items-center">
              <div>
                <strong>Graduation CGPA:</strong>
                <p>{user.graduationCGPA || "Not Provided"}</p>
              </div>
              <input
                type="text"
                className="form-control ms-2"
                placeholder="Update CGPA"
                value={newCGPA}
                onChange={(e) => setNewCGPA(e.target.value)}
                style={{ width: "100px" }}
              />
              <button className="btn ms-3 mb-3" style={{color:"white",background:"black" , borderRadius:"20px"}} onClick={handleUpdateCGPA}>
                Update
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-3">
  <button 
    onClick={() => setShowCompanies(true)} 
    className="btn btn-dark btn-sm"
    style={{ width: "150px" , color:"white", background:"black", borderRadius:"20px"}} 
  >
    Show Companies
  </button>
</div>


        </div>
      </div>

      {showCompanies && (
        <div className="modal fade show d-block" id="companyModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                  List of Companies Applied
                </h5>
                <button className="btn-close" onClick={() => setShowCompanies(false)}></button>
              </div>
              <div className="modal-body">
                {companyNames.length > 0 ? (
                  <ul>
                    {companyNames.map((company, index) => (
                      <li key={index}>{company}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No companies applied yet.</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" style={{color:"white", background:"black"}} onClick={() => setShowCompanies(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f6f9;
  }
  .profile-container {
    min-height: 100vh;
    padding-top: 80px; 
    background-color: #f5f5f5;
  }
  .profile-card {
    width: 80%;
    max-width: 800px;
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
  .info-box {
    flex: 1;
    min-width: 250px;
    background: #ffffff;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    text-align: center;
  }
  .info-box:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
  }
  .modal {
    background: rgba(0, 0, 0, 0.4);
  }
  .modal-title {
    font-family: "Poppins";
    font-weight: bold;
  }
`}</style>
    </>
  );
}

export default Profile;