// src/components/Home/CompanyPages/OffCampusJobs.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../HomeComponents/Navbar.js';
import Footer from '../HomeComponents/Footer.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OffCampusJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/auth/remote-jobs');
        
        if (response.data && response.data.jobs) {
          setJobs(response.data.jobs.slice(0, 30));
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle apply button click
  const handleApply = (job) => {
    const applyLink = job.apply_link || job.link || job.url || job.job_apply_link;
    
    if (!applyLink) {
      toast.error('Application link not available');
      return;
    }

    try {
      window.open(applyLink, '_blank');
      toast.success('Redirecting to application page...');
    } catch (error) {
      toast.error('Error opening application link');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-fluid" style={{ marginTop: "100px", padding: "0 50px" }}>
        
        <div className="text-center mb-4" style={{ color: "#666" }}>
          Recent job openings for students
        </div>

        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <div className="row g-4">
          {jobs.map((job, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card h-100" style={{
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                border: "none"
              }}>
                <div className="card-body d-flex flex-column">
                  <div style={{ 
                    borderBottom: "2px solid #f0f0f0", 
                    paddingBottom: "15px",
                    marginBottom: "15px"
                  }}>
                    <h5 className="card-title" style={{
                      color: "#007bff",
                      fontSize: "1.5rem",
                      marginBottom: "10px"
                    }}>{job.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {job.company_name}
                    </h6>
                  </div>

                  <div className="mb-3">
                    <div className="mb-2">
                      <strong>Location:</strong> {job.location || 'Location not specified'}
                    </div>
                    {job.salary && (
                      <div className="mb-2">
                        <strong>Salary:</strong> {job.salary}
                      </div>
                    )}
                    <div className="mb-2">
                      <strong>Experience:</strong> Entry Level
                    </div>
                    <div className="mb-2">
                      <strong>Posted:</strong> {job.detected_extensions?.posted_at || 'Recently'}
                    </div>
                    {job.detected_extensions?.work_from_home && (
                      <div className="badge bg-info text-white mb-2">
                        Work from home available
                      </div>
                    )}
                  </div>

                  {job.description && (
                    <div className="card-text" style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      marginBottom: "20px"
                    }}>
                      {job.description.slice(0, 150)}...
                    </div>
                  )}

                  <div className="mt-auto"> {/* This pushes the button to the bottom */}
                    <button
                      onClick={() => handleApply(job)}
                      className="btn btn-primary w-100"
                      style={{
                        backgroundColor: "#001f3f",
                        border: "none",
                        padding: "10px",
                        borderRadius: "5px",
                        fontWeight: "500",
                        cursor: "pointer",
                        marginBottom: "10px"
                      }}
                    >
                      Apply Now
                    </button>
                    {job.via && (
                      <small className="text-muted text-center d-block">
                        Via {job.via}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && jobs.length === 0 && !error && (
          <div className="text-center my-5">
            <p className="h4">No entry-level tech jobs available at the moment. Please check back later.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default OffCampusJobs;