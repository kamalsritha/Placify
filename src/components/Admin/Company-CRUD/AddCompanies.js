import React from "react"
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Admin-CSS/AddCompanies.css";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import AddCompany from '../Assets/AddCompany.png'
function AddCompanies() {
  useEffect(() => {
    axios.get("http://localhost:3001/auth/verify").then((res) => {
      if (res.data.status) {
      } else {
        navigate("/");
      }
    });
  }, []);
  const [companyname, setCompanyName] = useState("");
  const [jobprofile, setJobProfile] = useState("");
  const [jobdescription, setJobDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [ctc, setCtc] = useState("");

  const [tenthPercentage, setTenthPercentage] = useState("");
  const [twelfthPercentage, setTwelfthPercentage] = useState("");
  const [graduationCGPA, setGraduationCGPA] = useState("");
  const [branches, setBranches] = useState([]);
  const [expire,setExpire]=useState([]);
  const [pass,setPass]=useState([]);
  const [loc,setLoc]=useState("");
  const [rounds, setRounds] = useState([]);

  const navigate = useNavigate();
  const handleBranchChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setBranches((prevBranches) => [...prevBranches, value]);
    } else {
      setBranches((prevBranches) =>
        prevBranches.filter((branch) => branch !== value)
      );
    }
  };
  const handleAddRound = () => {
    setRounds([...rounds, { name: "", date: "" }]);
  };

  const handleRemoveRound = (index) => {
    setRounds(rounds.filter((_, i) => i !== index));
  };

  const handleRoundChange = (index, field, value) => {
    const updatedRounds = [...rounds];
    updatedRounds[index][field] = value;
    setRounds(updatedRounds);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !companyname ||
      !jobprofile ||
      !jobdescription ||
      !website ||
      !tenthPercentage ||
      !ctc ||
      !twelfthPercentage||
      !expire ||
      !pass 
    ) {
      alert("Please fill in all fields");
      return;
    }

    const CompanyData = {
      companyname,
      jobprofile,
      jobdescription,
      website,
      ctc,
      eligibilityCriteria: branches,
      tenthPercentage,
      twelfthPercentage,
      graduationCGPA,
      pass,
      loc,
      expire,
      assessmentRounds: rounds,
    };

    axios
      .post("http://localhost:3001/auth/add-companies", CompanyData)
      .then((result) => {
        console.log(result);
        navigate("/companies");
      })
      .catch((err) => {
        console.error("Error submitting data:", err);
      });
      navigate("/companies");
  };

  return (
    <>
  <AdminHome/>
  <h1 style={{
  marginTop:'150px', 
  color: '#333', 
  fontSize:"28px", 
  fontFamily:"Poppins", 
  fontWeight:"bold", 
  textAlign: 'center'
}}>
  Add Companies
</h1>
<div className="container-fluid d-flex justify-content-center align-items-center" style={{minHeight: '100vh', padding: '0 50px', marginLeft:"0px"}}>
  <div className="row justify-content-center align-items-center" style={{maxWidth: '1200px', width: '100%'}}> 
    <div className="col-lg-4 text-center"> 
      <img 
        src={AddCompany} 
        alt="Add Company" 
        className="img-fluid" 
        style={{ 
          maxWidth: '100%', 
          maxHeight: '400px', 
          objectFit: 'contain' 
        }} 
      />
    </div>

    <div className="col-lg-8 d-flex justify-content-center align-items-center"> 
      <div className="form-container w-100">
        
  <div className="card" style={{maxWidth:"100vh",width:"900%"}}>
    <form onSubmit={handleSubmit}>
    <div className="row">
      <table className="table">
        <tbody>
          <tr>
            <td>
              <div className="form-group">
                <label htmlFor="name">Company Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Company Name"
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            
              <div className="form-group">
                <label htmlFor="jobprofile">Job Profile</label>
                <input
                  type="text"
                  id="jobprofile"
                  className="form-control"
                  placeholder="Job Profile"
                  onChange={(e) => setJobProfile(e.target.value)}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlFor="jobdescription">Job Description</label>
                <textarea
                  id="jobdescription"
                  className="form-control textarea"
                  placeholder="Job Description"
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            
              <div className="form-group">
                <label htmlFor="website">Company Website</label>
                <input
                  type="website"
                  id="website"
                  className="form-control"
                  placeholder="Company Website"
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="form-group">
                <label htmlFor="ctc">Offered CTC</label>
                <input
                  type="number"
                  id="ctc"
                  className="form-control"
                  placeholder="Offered CTC"
                  onChange={(e) => setCtc(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pass">Passout Year</label>
                <input
                  type="text"
                  id="pass"
                  className="form-control"
                  placeholder="Passout Year"
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Interview Location</label>
                <input
                  type="text"
                  id="location"
                  className="form-control"
                  onChange={(e) => setLoc(e.target.value)}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <h4 className="mb-3">Eligibility Criteria</h4>
              <div className="form-group">
                <label htmlFor="Btech-CSIT">
                  <input
                    type="checkbox"
                    id="Btech-CSIT"
                    value="Btech-CSIT"
                    onChange={handleBranchChange}
                  />
                  Btech-CSIT
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="Btech-IT">
                  <input
                    type="checkbox"
                    id="Btech-IT"
                    value="Btech-IT"
                    onChange={handleBranchChange}
                  />
                  Btech-IT
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="Btech-CSE">
                  <input
                    type="checkbox"
                    id="Btech-CSE"
                    value="Btech-CSE"
                    onChange={handleBranchChange}
                  />
                  Btech-CSE
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="Btech-Cybersecurity">
                  <input
                    type="checkbox"
                    id="Btech-Cybersecurity"
                    value="Btech-Cybersecurity"
                    onChange={handleBranchChange}
                  />
                  Btech-CS
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="BTECH-DATA SCIENCE">
                  <input
                    type="checkbox"
                    id="BTECH-DATA SCIENCE"
                    value="BTECH-DATA SCIENCE"
                    onChange={handleBranchChange}
                  />
                  Btech-Data Science
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="Btech-AIML">
                  <input
                    type="checkbox"
                    id="Btech-AIML"
                    value="Btech-AIML"
                    onChange={handleBranchChange}
                  />
                  Btech-AIML
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="Btech-Mechanical">
                  <input
                    type="checkbox"
                    id="Btech-Mechanical"
                    value="Btech-Mechanical"
                    onChange={handleBranchChange}
                  />
                  Btech-Mechanical
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="Btech-ECE">
                  <input
                    type="checkbox"
                    id="Btech-ECE"
                    value="Btech-ECE"
                    onChange={handleBranchChange}
                  />
                  Btech-ECE
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="Btech-EEE">
                  <input
                    type="checkbox"
                    id="Btech-EEE"
                    value="Btech-EEE"
                    onChange={handleBranchChange}
                  />
                 Btech-EEE
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="BTech-Civil">
                  <input
                    type="checkbox"
                    id="BTech-Civil"
                    value="BTech-Civil"
                    onChange={handleBranchChange}
                  />
                 BTech-Civil
                </label>
              </div>
            
              <div className="form-group">
                <label htmlFor="tenthPercentage">10th Percentage</label>
                <input
                  type="number"
                  id="tenthPercentage"
                  className="form-control"
                  placeholder="10th Percentage"
                  step="0.01"
                  onChange={(e) => setTenthPercentage(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="twelfthPercentage">12th Percentage</label>
                <input
                  type="number"
                  id="twelfthPercentage"
                  className="form-control"
                  placeholder="12th Percentage"
                  step="0.01"
                  onChange={(e) => setTwelfthPercentage(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="graduationCGPA">Graduation CGPA</label>
                <input
                  type="number"
                  id="graduationCGPA"
                  className="form-control"
                  placeholder="Graduation CGPA"
                  step="0.01"
                  onChange={(e) => setGraduationCGPA(e.target.value)}
                />
              </div>
            </td>
          </tr>
          <tr>
  <td>
    <h4 className="mb-3">Assessment Rounds</h4>
    {rounds.map((round, index) => (
      <div key={index} className="form-group d-flex align-items-center mb-2">
        <input 
          type="text" 
          className="form-control mr-2" 
          placeholder="Round Name" 
          value={round.name} 
          onChange={(e) => handleRoundChange(index, "name", e.target.value)} 
          style={{
            width: '150px', 
            marginRight: '10px'
          }}
        />
        <input 
          type="date" 
          className="form-control mr-2" 
          value={round.date} 
          onChange={(e) => handleRoundChange(index, "date", e.target.value)} 
          style={{
            width: '120px', 
            marginRight: '10px'
          }}
        />

        <label className="d-flex align-items-center">
          <input 
            type="checkbox" 
            checked={round.lab} 
            onChange={(e) => handleRoundChange(index, "lab", e.target.checked)} 
            className="mr-1 m-2"
          /> 
          Lab Required
        </label>
        <button 
          type="button" 
          className="btn btn-danger mr-2 m-" 
          style={{marginLeft: '10px' ,background:"black", borderRadius:"20px"}}
          onClick={() => handleRemoveRound(index)}
        >
          Remove
        </button>
      </div>
    ))}
    <div className="mt-3">
      <button 
        type="button" 
        className="btn btn-primary"     
        style={{
          minWidth: '80px',
          padding: '4px 8px',
          fontSize: '12px',
          background:"black",
          height:"30px",
          borderRadius:"20px",
          color:"white"
        }} 
        onClick={handleAddRound}
      >
        Add Round
      </button>
    </div>
  </td>
</tr>
          <tr>
            <td> <div className="form-group">
                <label htmlFor="expire">Last Date to Apply</label>
                <input
                  type="date"
                  id="expire"
                  className="form-control"
                  onChange={(e) => setExpire(e.target.value)}
                />
              </div>
              </td>
          </tr>
        </tbody>
      </table>
      </div>
      <div className="text-center mt-3">
  <input 
    type="submit" 
    value="Submit" 
    className="btn" 
    style={{
      minWidth: '80px',
      padding: '4px 8px',
      fontSize: '12px',
      background:"black",
      height:"30px",
      borderRadius:"20px",
      color:"white",
      fontWeight:"bold"

    }} 
  />
</div>
    </form>
  </div>
</div>
</div>
</div>
</div>
  
  <Footer/>
</>

  );
}

export default AddCompanies;
