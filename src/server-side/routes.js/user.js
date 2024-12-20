import express from "express";
import bcryt from "bcrypt";
const router = express.Router();
import { User } from "../models/user.js";
import { Company } from "../models/Company.js";
import { Interview } from "../models/Experience.js";
import jwt from "jsonwebtoken";
import axios from 'axios';
import nodemailer from "nodemailer";


//User EndPoints and Admin EndPoints

//---------------------------------------------USER ENDPOINTS--------------------------------------------------//

//User Registeration API
router.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    contactNumber,
    sapId,
    rollNo,
    gender,
    dob,
    tenthPercentage,
    tenthSchool,
    twelfthPercentage,
    twelfthCollege,
    graduationCollege,
    graduationCGPA,
    stream,
    sixthSemesterCGPA,
    isAdmin,
  } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ message: "User already existed" });
  }

  const hashpassword = await bcryt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashpassword,
    contactNumber,
    sapId,
    rollNo,
    gender,
    dob,
    tenthPercentage,
    tenthSchool,
    twelfthPercentage,
    twelfthCollege,
    graduationCollege,
    graduationCGPA,
    stream,
    sixthSemesterCGPA,
    isAdmin,
  });

  await newUser.save();
  return res.json({ message: "User Registered" });
});

//User and Admin Login API
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    console.log("Invalid User");
    return res.json("Invalid User");
  }

  const validPassword = await bcryt.compare(password, user.password);
  if (!validPassword) {
    console.log("Password Incorrect");
    return res.json("Password Incorrect");
  }

  if (user.isAdmin === "1") {
    console.log("User is admin");
  }

  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.KEY,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, { httpOnly: true, maxAge: 300000 });

  return res.json(user.isAdmin === "1" ? "Admin" : "Success");
});

// Middleware function to verify the authenticity of a user's token before granting access to protected routes.
const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "No Token" });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    next();
  } catch (err) {
    return res.json(err);
  }
};

// Route to verify the authenticity of a user's token.
// It utilizes the verifyUser middleware to ensure that the user is authenticated.
router.get("/verify", verifyUser, (req, res) => {
  return res.json({ status: true, message: "Authorized" });
});

// Route to fetch the current user's details.
// It verifies the user's token and retrieves the user's information.
router.get("/currentUser", verifyUser, async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.KEY);
    console.log(decoded);
    const userId = decoded._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// This API is designed to handle the functionality of sending a reset password link via email to the user which is valid till 5mins.
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not registered" });
    }
    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "", //The email id you want the mail to be sent from
        pass: "", // Generate a special password from your google account
      },
    });

    var mailOptions = {
      from: "jashmehtaa@gmail.com",
      to: email,
      subject: "Reset Password Link",
      text: `http://localhost:3000/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ status: true, message: "Error sending the email" });
      } else {
        return res.json({ status: true, message: "Email Sent" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// This API endpoint is responsible for resetting the password of a user. It verifies the provided token,
// then updates the user's password with the new hashed password. If the token is invalid, it returns an
// error response indicating the token is invalid.
router.post("/resetPassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = await jwt.verify(token, process.env.KEY);
    const id = decoded.id;

    const hashPassword = await bcryt.hash(password, 10);

    await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });

    return res.json({ status: true, message: "Updated Password Successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: false, message: "Invalid Token" });
  }
});

//API to add a company ID to appliedCompanies array for a user
router.post("/applyCompany/:userId/:companyId", async (req, res) => {
  const { userId, companyId } = req.params;
  console.log("User ID: ", userId);
  console.log("Company ID:", companyId);

  try {
    const user = await User.findById(userId);
    console.log("User:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.appliedCompanies) {
      user.appliedCompanies = [];
    }

    if (user.appliedCompanies.includes(companyId)) {
      return res
        .status(400)
        .json({ message: "User already applied to this company" });
    }

    user.appliedCompanies.push(companyId);
    await user.save();

    return res.json({ message: "Company applied successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to retrieve scheduled interviews for a user
router.get("/scheduledInterviews/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const appliedCompanyIds = user.appliedCompanies;
    const companies = await Company.find({ _id: { $in: appliedCompanyIds } });

    const scheduledInterviews = companies.map((company) => ({
      companyName: company.companyname,
      interviewDate: company.doi,
    }));

    return res.json({ scheduledInterviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//API to post interview experience
router.post("/add-interview", async (req, res) => {
  try {
    const {
      username,
      companyName,
      position,
      experience,
      interviewLevel,
      result,
    } = req.body;

    const newInterview = new Interview({
      username,
      companyName,
      position,
      experience,
      interviewLevel,
      result,
    });

    await newInterview.save();

    return res.json({ message: "Interview experience added successfully" });
  } catch (error) {
    console.error("Error adding interview experience:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// 

// In server-side/routes/user.js
  router.get("/remote-jobs", async (req, res) => {
    try {
      const response = await axios.get('https://serpapi.com/search?engine=google_jobs', {
        params: {
          engine: 'google_jobs',
          q: 'freshers entry level software engineer btech computer science',
          location: 'India',
          api_key: process.env.SERP_API_KEY,
          chips: 'date_posted:week,experience_level:ENTRY_LEVEL',
          hl: 'en',    // Number of results
        }
      });
  
      // Add keywords to filter more specifically for fresher roles
      const fresherKeywords = [
        'fresher',
        'entry level',
        'entry-level',
        'graduate',
        'new grad',
        'trainee',
        '0-1 year',
        '0-2 years',
        'btech',
        'b.tech',
        'computer science',
      ];
  
      const jobs = response.data?.jobs_results || [];
      
      // Filter jobs specifically for freshers/entry-level
      const filteredJobs = jobs.filter(job => {
        const jobText = `${job.title} ${job.description}`.toLowerCase();
        return fresherKeywords.some(keyword => jobText.includes(keyword.toLowerCase()));
      }).slice(0, 30);
  
      res.json({ jobs: filteredJobs });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ message: 'Failed to fetch jobs' });
    }
  });

  router.get("/fetchinterviewexperience", async (req, res) => {
    try {
      const interviews = await Interview.find({});
      return res.json({ data: interviews });
    } catch (error) {
      console.error("Error fetching interview experiences:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });


router.get('/placementStatus/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get the placement status
    const status = user.placementStatus;

    if (status === 'Placed') {
      // If the status is placed, get the company name from the user document
      const companyName = user.companyPlaced;
      return res.json({ status, companyName });
    }

    return res.json({ status });
  } catch (error) {
    console.error('Error fetching placement status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//---------------------------------------------ADMIN ENDPOINTS--------------------------------------------------//

// This API endpoint is responsible for adding new company details to the database.
// Modify the existing add-companies endpoint
router.post("/add-companies", async (req, res) => {
  const {
    companyname,
    jobprofile,
    jobdescription,
    website,
    ctc,
    doi,
    eligibilityCriteria,
    tenthPercentage,
    twelfthPercentage,
    graduationCGPA,
    sixthSemesterCGPA,
  } = req.body;

  try {
    const newCompany = new Company({
      companyname,
      jobprofile,
      jobdescription,
      website,
      ctc,
      doi,
      eligibilityCriteria,
      tenthPercentage,
      twelfthPercentage,
      graduationCGPA,
      sixthSemesterCGPA,
    });

    await newCompany.save();

    // Find eligible students based on criteria
    const eligibleStudents = await User.find({
      isAdmin: { $ne: "1" }, // Exclude admin users
      tenthPercentage: { $gte: tenthPercentage },
      twelfthPercentage: { $gte: twelfthPercentage },
      graduationCGPA: { $gte: graduationCGPA },
      sixthSemesterCGPA: { $gte: sixthSemesterCGPA }
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,  // Changed from 587 to 465
      secure: true, // Changed from false to true
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD  // This should be your app password
      },
      debug: true // Add this to see detailed logs
    });
    
    // Add this verification step before using the transporter
    transporter.verify(function (error, success) {
      if (error) {
        console.log("Transporter verification error:", error);
      } else {
        console.log("Server is ready to send emails");
      }
    });
    // Send emails to eligible students
    for (const student of eligibleStudents) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: `New Job Opportunity from ${companyname}`,
        html: `
          <h2>Congratulations! You've been shortlisted!</h2>
          <p>Dear ${student.name},</p>
          <p>You have been shortlisted for a new job opportunity at ${companyname}.</p>
          <h3>Job Details:</h3>
          <ul>
            <li><strong>Job Profile:</strong> ${jobprofile}</li>
            <li><strong>CTC:</strong> ${ctc} LPA</li>
            <li><strong>Interview Date:</strong> ${doi}</li>
            <li><strong>Job Description:</strong> ${jobdescription}</li>
            <li><strong>Company Website:</strong> ${website}</li>
          </ul>
          <p>Please log in to your dashboard to apply for this position.</p>
          <p><strong>Note:</strong> This opportunity is available based on your academic credentials meeting the company's criteria.</p>
          <p>Best regards,<br>Campus Recruitment Team</p>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error(`Failed to send email to ${student.email}:`, error);
      }
    }

    return res.json({ 
      message: "Company Registered and Notifications Sent",
      notifiedStudents: eligibleStudents.length 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



// Add this new endpoint for fetching eligible jobs
router.get("/jobs/eligible", verifyUser, async (req, res) => {
  try {
    // Get current user from token
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.KEY);
    const userId = decoded._id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find companies where user meets criteria
    const eligibleCompanies = await Company.find({
      tenthPercentage: { $lte: user.tenthPercentage },
      twelfthPercentage: { $lte: user.twelfthPercentage },
      graduationCGPA: { $lte: user.graduationCGPA },
      sixthSemesterCGPA: { $lte: user.sixthSemesterCGPA },
      _id: { $nin: user.appliedCompanies } // Exclude already applied companies
    });

    return res.json(eligibleCompanies);
  } catch (error) {
    console.error('Error fetching eligible jobs:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



// Route to fetch all users and generate user reports.
// It retrieves all users from the database and sends them as a response.
router.get("/getUsers", async (req, res) => {
  try {
    const allUsers = await User.find({isAdmin : null});
    console.log(allUsers);
    res.send({ data: allUsers });
  } catch (error) {
    console.log(error);
  }
});

// Route to fetch all companies.
// It retrieves all companies from the database and sends them as a response.
router.get("/getCompanies", async (req, res) => {
  try {
    const allCompanies = await Company.find({});

    res.send({ data: allCompanies });
  } catch (error) {
    console.log(error);
  }
});

// Route to update company data.
// It updates the company details based on the provided ID.
router.put("/updatecompany/:id", (req, res) => {
  const id = req.params.id;
  Company.findByIdAndUpdate(id, {
    companyname: req.body.companyname,
    jobprofile: req.body.jobprofile,
    ctc: req.body.ctc,
    doi: req.body.doi,
    tenthPercentage: req.body.tenthPercentage,
    twelfthPercentage: req.body.twelfthPercentage,
    graduationCGPA: req.body.graduationCGPA,
  })
    .then((company) => res.json(company))
    .catch((err) => res.json(err));
});

// Route to delete company data.
// It deletes the company based on the provided ID.
router.delete("/deletecompany/:id", (req, res) => {
  const id = req.params.id;
  Company.findByIdAndDelete({ _id: id })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// Route to fetch a specific company by ID.
// It retrieves the company details based on the provided ID.
router.get("/getCompanies/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const company = await Company.findById(id);

    res.send({ data: company });
  } catch (error) {
    console.log(error);
  }
});

//This API fetches the users and the companies they have applied to
router.get("/companyApplicants", async (req, res) => {
  try {
    const companies = await Company.find(); // Assuming you have a Company model

    const companyData = [];

    for (const company of companies) {
      const applicants = await User.find({ appliedCompanies: company._id });

      const companyInfo = {
        companyId: company._id,
        companyName: company.companyname,
        applicants: applicants.map((applicant) => ({
          userId: applicant._id,
          name: applicant.name,
          email: applicant.email,
        })),
      };

      companyData.push(companyInfo);
    }

    res.json(companyData);
  } catch (error) {
    console.error("Error fetching company applicants:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Backend API to update placementStatus
router.post("/updatePlacementStatus", async (req, res) => {
  try {
    const { userId, companyId, status } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.placementStatus === "Placed" && status === "Placed") {
      return res.status(200).json({ message: "User is already placed." });
    }
    const company = await Company.findById(companyId);
    console.log(company.companyname);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    user.placementStatus = status;
    user.companyPlaced = company.companyname;
    await user.save();
    res.json({
      message: `Placement status updated to ${status} successfully.`,
    });
  } catch (error) {
    console.error("Error updating placement status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export { router as UserRouter };