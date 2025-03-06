import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './CompanyTimeline.css';
import AdminHome from "../AdminHome.js";
import Footer from '../AdminReusableComponents/AdminFooter.js';

function CompanyTimeline() {
  const { id, name } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assessmentRounds, setAssessmentRounds] = useState([]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/auth/companies/${id}`);
        setCompany(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    const checkCompanyStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/auth/companies/${id}/status-check`);
        setAssessmentRounds(response.data.assessmentRounds);
      } catch (error) {
        console.error('Error checking company status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
    checkCompanyStatus();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!company) return <p>Company not found.</p>;

  return (
    <div>
      <AdminHome />
      <div className="timeline-container">
        <h1 className="timeline-title">{name} - Recruitment Timeline</h1>
        <div className="timeline">
          {assessmentRounds.map((round, index) => {
            const roundDate = new Date(round.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit'
            });

          
            const previousRoundCompleted = index === 0 || assessmentRounds[index - 1].completed;

            return (
              <div key={index} className="timeline-item">
                <div className="timeline-dot-container">
                  <div className={`timeline-dot ${round.completed ? 'completed' : ''}`} />
                  {index !== assessmentRounds.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <div className="timeline-stage">
                    <div className="timeline-stage-row">
                      <p className={`timeline-text ${round.completed ? 'completed-text' : ''}`}>
                        {round.roundName} ({roundDate})
                      </p>

                      {round.lab === true && previousRoundCompleted ? (
                        <Link to={`/admin/allocation/${id}/${name}/${round.roundName}`} className="stage-button">
                          Allocate Lab
                        </Link>
                      ) : round.lab === false && round.completed && !round.done ? (
                        <Link to={`/scheduledInterviewData/${id}/${name}/${round.roundName}`} className="stage-button">
                          Announce Selects
                        </Link>
                      ) : round.lab === null && round.completed && !round.done ? (
                        <Link to={`/scheduledInterviewData/${id}/${name}/${round.roundName}`} className="stage-button">
                          Announce Selects
                        </Link>
                      ) : round.done === true ? (
                        <p><b>Results Announced</b></p>
                      ) : round.lab === false ? (
                        <h6><b>Lab Allocated</b></h6>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default CompanyTimeline;
