import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../HomeComponents/Navbar.js';
import Footer from '../HomeComponents/Footer.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './OffCampusJobs.css'; // Import the updated CSS

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

  const handleApply = (job) => {
    const applyLink = job.apply_link || job.link || job.url || job.apply_options?.[0]?.link;

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
      <div className="offcampus-container">
        <div className="page-heading">Recent Job Openings for Students</div>

        {loading && (
          <div className="loading-container">
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <div className="jobs-list">
          {jobs.map((job, index) => (
            <div key={index} className="job-card">
              <div className="job-card-body">
                <div className="job-header">
                  <h5 className="job-title">{job.title}</h5>
                  <h6 className="job-company">{job.company_name}</h6>
                </div>

                <div className="job-details">
                  <p><strong>Location:</strong> {job.location || 'Not specified'}</p>
                  <p><strong>Experience:</strong> Entry Level</p>
                  <p><strong>Posted:</strong> {job.detected_extensions?.posted_at || 'Recently'}</p>
                </div>

                <button onClick={() => handleApply(job)} className="apply-button">
                  Apply Now
                </button>
                {job.via && <small className="job-source">Via {job.via}</small>}
              </div>
            </div>
          ))}
        </div>

        {!loading && jobs.length === 0 && !error && (
          <div className="no-jobs">
            <p>No entry-level tech jobs available at the moment. Please check back later.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default OffCampusJobs;
