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

  const handleApply = (job) => {
    const applyLink = job.apply_link || job.link || job.url || job.apply_options[0].link;

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
      <div className="container-fluid" style={{ marginTop: '100px', padding: '0 30px' }}>
        <div className="text-center mb-4" style={{ color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>
          Recent Job Openings for Students
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

        <div className="row g-2 justify-content-center"> {/* Adjusted gap for better spacing */}
          {jobs.map((job, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 d-flex justify-content-center mb-4"> {/* Increased vertical margin */}
              <div
                className="card h-100"
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #ddd',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <div className="card-body d-flex flex-column">
                  <div
                    style={{
                      borderBottom: '2px solid #e0e0e0',
                      paddingBottom: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <h5
                      className="card-title"
                      style={{
                        color: '#001f3f',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}
                    >
                      {job.title}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                      {job.company_name}
                    </h6>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#555' }}>
                    <div className="mb-1">
                      <strong>Location:</strong> {job.location || 'Not specified'}
                    </div>
                    <div className="mb-1">
                      <strong>Experience:</strong> Entry Level
                    </div>
                    <div className="mb-1">
                      <strong>Posted:</strong> {job.detected_extensions?.posted_at || 'Recently'}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <button
                      onClick={() => handleApply(job)}
                      className="btn w-100"
                      style={{
                        backgroundColor: '#001f3f',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 0',
                        borderRadius: '5px',
                        fontWeight: '500',
                        marginTop: '10px',
                      }}
                    >
                      Apply Now
                    </button>
                    {job.via && (
                      <small className="text-muted text-center d-block" style={{ marginTop: '5px' }}>
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
            <p className="h5">No entry-level tech jobs available at the moment. Please check back later.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default OffCampusJobs;

