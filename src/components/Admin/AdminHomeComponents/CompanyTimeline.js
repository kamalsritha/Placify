import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './CompanyTimeline.css';

function CompanyTimeline() {
  const { id, name } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusChecks, setStatusChecks] = useState({
    isPresent: false,
    isLabAllocated: false,
    isAssessmentExpired: false,
    isInterviewExpired: false,
    asmt: true // Default to true
  });

  const timelineStages = ['Expired', 'Lab Allocation', 'Assessment', 'Interview', 'Result'];

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
        setStatusChecks(response.data);
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

  let currentStageIndex = 0;
  if (statusChecks.isPresent) currentStageIndex = 1;
  if (statusChecks.isLabAllocated) currentStageIndex = 2;
  if (statusChecks.isAssessmentExpired) currentStageIndex = 3;
  if (statusChecks.isInterviewExpired) currentStageIndex = 4;
  if (!statusChecks.fintr) currentStageIndex = 5;

  return (
    <div className="timeline-container">
      <h1 className="timeline-title">{name} - Recruitment Timeline</h1>
      <div className="timeline">
        {timelineStages.map((stage, index) => {
          let dateInfo = '';

          if (stage === 'Assessment' && company?.doa) {
            dateInfo = `(${new Date(company.doa).toLocaleDateString()})`;
          }
          if (stage === 'Interview' && company?.doi) {
            dateInfo = `(${new Date(company.doi).toLocaleDateString()})`;
          }

          return (
            <div key={index} className="timeline-item">
              <div className="timeline-dot-container">
                <div className={`timeline-dot ${index <= currentStageIndex - 1 ? 'completed' : ''}`} />
                {index !== timelineStages.length - 1 && <div className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <div className="timeline-stage">
                  <div className="timeline-stage-row">
                    <p className={`timeline-text ${index <= currentStageIndex - 1 ? 'completed-text' : ''}`}>
                      {stage} {dateInfo}
                    </p>

                    {statusChecks.isPresent && stage === 'Lab Allocation' && (
                      statusChecks.isLabAllocated ? (
                        <div className="stage-button disabled-link">Allocated</div>
                      ) : (
                        <Link to={`/admin/allocation/${id}/${name}`} className="stage-button">
                          Allocate
                        </Link>
                      )
                    )}

                    {stage === 'Assessment' && statusChecks.isLabAllocated && statusChecks.isAssessmentExpired && (
                      statusChecks.asmt ? (
                        <Link to={`/scheduledInterviewData/${id}/${name}/assesment`} className="stage-button">
                          Details
                        </Link>
                      ) : (
                        <div className="stage-button disabled-link">Announce Selects</div>
                      )
                    )}

                    
                    {stage === 'Interview' && statusChecks.isAssessmentExpired && statusChecks.isInterviewExpired && (
                      statusChecks.intr1 ? (
                        <Link to={`/scheduledInterviewData/${id}/${name}/interview`} className="stage-button">
                        Announce Selects
                        </Link>
                      ) : (
                        <div className="stage-button disabled-link">Announce Selects</div>
                      )
                    )}

                    {stage === 'Result' && statusChecks.isInterviewExpired && (statusChecks.fintr ? (
                      <Link to={`/scheduledInterviewData/${id}/${name}/final`} className="stage-button">
                        Announce Selects
                      </Link>
                    ) : (
                      <div className="stage-button disabled-link">Announce Selects</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CompanyTimeline;
