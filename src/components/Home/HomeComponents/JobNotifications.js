import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function JobNotifications() {
    const [eligibleJobs, setEligibleJobs] = useState([]);

    useEffect(() => {
        const fetchEligibleJobs = async () => {
            try {
                const response = await axios.get('https://placify-server.onrender.com/auth/jobs/eligible');
                const jobs = response.data?.data || []; 
                setEligibleJobs(jobs);
            } catch (error) {
                console.error('Error fetching eligible jobs:', error);
                setEligibleJobs([]); 
            }
        };

        fetchEligibleJobs();
    }, []);

    return (
        <div className="job-notifications-section">
            {eligibleJobs && eligibleJobs.length > 0 && (
                <div className="container">
                    <h2 className="section-title">Available Job Opportunities</h2>
                    <div className="row">
                        {eligibleJobs.map((job) => (
                            <div key={job._id} className="col-md-4 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{job.companyname}</h5>
                                        <p className="card-text">
                                            <strong>Profile:</strong> {job.jobprofile}<br />
                                            <strong>CTC:</strong> {job.ctc} LPA<br />
                                            <strong>Interview Date:</strong> {job.doi}
                                        </p>
                                        <Link 
                                            to={`/companypage/${job._id}`} 
                                            className="btn btn-primary"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default JobNotifications;