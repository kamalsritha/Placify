import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Registeration-CSS/RegistrationPage.css"; // Updated CSS file name

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repass, setRpass] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [tenthPercentage, setTenthPercentage] = useState("");
  const [twelfthPercentage, setTwelfthPercentage] = useState("");
  const [graduationCGPA, setGraduationCGPA] = useState("");
  const [stream, setStream] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    //Checking if password and repeat password match
    if (password !== repass) {
      alert("Passwords do not match");
      return;
    }
    //using regular expressions to set conditions on password
    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      alert(
        "Password should contain at least one uppercase, one lowercase, one special character, and one number, with a minimum length of 8 characters."
      );
      return;
    }

    if (
      !name ||
      !email ||
      !password ||
      !repass ||
      !contactNumber ||
      !rollNo ||
      !gender ||
      !dob ||
      !tenthPercentage ||
      !twelfthPercentage ||
      !graduationCGPA||
      !stream 
    ) {
      alert("Please fill in all fields");
      return;
    }

    const userData = {
      name,
      email,
      password,
      contactNumber,
      rollNo,
      gender,
      dob,
      tenthPercentage,
      twelfthPercentage,
      graduationCGPA,
      stream,
      isAdmin: null,
    };
    axios
      .post("http://localhost:3001/auth/register", userData)
      .then((result) => {
        console.log(result);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const handleStreamChange = (e) => {
    setStream(e.target.value);

    setGraduationCGPA("");
  };

  return (
    <div className="registration-container"> 
      <h1>Registration Page</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            className="form-control"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="repass">Re-enter Password</label>
          <input
            type="password"
            id="repass"
            className="form-control"
            placeholder="Re-enter Password"
            onChange={(e) => setRpass(e.target.value)}
          />
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
          <label htmlFor="stream">Stream</label>
          <select
            id="stream"
            className="form-control"
            onChange={handleStreamChange}
          >
            <option value="">Select Stream</option>
            <option value="Btech-CSIT">Btech-CSIT</option>
            <option value="Btech-IT">Btech-IT</option>
            <option value="Btech-CSE">Btech-CSE</option>
            <option value="Btech-Cybersecurity">Btech-Cybersecurity</option>
            <option value="Btech-Data Science">Btech-Data Science</option>
            <option value="Btech-AIML">Btech-AIML</option>
            <option value="Btech-Mechanical">Btech-Mechanical</option>
            <option value="Btech-ECE">Btech-ECE</option>
            <option value="Btech-ECE">Btech-EEE</option>
            <option value="BTech-Civil">BTech-Civil</option>
          </select>
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

        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number</label>
          <input
            type="number"
            id="contactNumber"
            className="form-control"
            placeholder="Contact Number"
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="rollNo">Roll No</label>
          <input
            type="text"
            id="rollNo"
            className="form-control"
            placeholder="Roll No"
            onChange={(e) => setRollNo(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            className="form-control"
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            className="form-control"
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <input type="submit" value="Submit" className="btn btn-primary" />
      </form>
    </div>
  );
}

export default Registration;