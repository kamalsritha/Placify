import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Registeration/Register.js";
import Login from "./components/Login/Login.js";
import Home from "./components/Home/Home.js";
import ForgetPassword from "./components/ForgotPassword/ForgetPassword.js";
import AddCompanies from "./components/Admin/Company-CRUD/AddCompanies.js";
import Companycrud from "./components/Admin/Company-CRUD/Companycrud.js";
import UpdateCompany from "./components/Admin/Company-CRUD/UpdateCompany.js";
import ResetPassword from "./components/ForgotPassword/ResetPassword.js";
import AdminDashboard from "./components/Admin/AdminReports/AdminDashboard.js";
import Admin from "./components/Admin/Admin.js";
import CompanyPage from "./components/Home/CompanyPages/CompanyPage.js";
import ScheduledInterview from "./components/Home/CompanyPages/ScheduledInterview.js";
import ScheduledInterviewData from "./components/Admin/AdminReports/ScheduledInterviewData.js";
import CompanyListing from "./components/Home/CompanyPages/CompanyListing.js";
import Faqspage from "./components/Home/FAQs/FaqPage.js";
import InterviewExperience from "./components/Home/InterviewExperiencePage/InterviewExperience.js";
import AddExperience from "./components/Home/InterviewExperiencePage/AddExperience.js";
import OffCampusJobs from './components/Home/CompanyPages/OffCampusJobs.js';
import Profile from "./components/Home/HomeComponents/Profile.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LabAllocation from "./components/Admin/Lab Allocation/LabAllocation.js";
import Applicants from "./components/Admin/AdminReports/Applicants.js";
import List from "./components/Admin/AdminReports/List.js";

function App() {
 
  return (
    <Router>
       <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/companylisting" element={<CompanyListing />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/add-companies" element={<AddCompanies />}/>
        <Route path="/companies" element={<Companycrud />} />
        <Route path="/offcampus-jobs" element={<OffCampusJobs />} />
        <Route path="/forgotpassword" element={<ForgetPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/updatecompany/:id" element={<UpdateCompany />} />
        <Route path="/companypage/:id" element={<CompanyPage />} />
        <Route path="/scheduledInterview" element={<ScheduledInterview />} />
        <Route path="/scheduledInterviewData/:id" element={<ScheduledInterviewData />} />
        <Route path="/applicants" element={<Applicants />}/>
        <Route path="/admin/lab-allocation" element={<LabAllocation />} />
        <Route path="/interviewexperience" element={<InterviewExperience />} />
        <Route path="/addexperience" element={<AddExperience />} />
        <Route path="/faq" element={<Faqspage />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/list" element={<List/>}/>
        <Route path="*" element={<h1>Page Not found</h1>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
