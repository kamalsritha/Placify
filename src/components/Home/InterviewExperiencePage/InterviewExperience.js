import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';
import Navbar from "../HomeComponents/Navbar.js";

function InterviewExperience() {
  const [interviews, setInterviews] = useState([]);

  const fetchInterviews = async () => {
    try {
      const response = await axios.get('http://localhost:3001/auth/fetchinterviewexperience');
      setInterviews(response.data.data);
    } catch (error) {
      console.error('Error fetching interview experiences:', error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const sanitizeContent = (content) => {
    return sanitizeHtml(content, {
      allowedTags: ['p', 'br', 'b', 'i', 'u', 'em', 'strong'],
      allowedAttributes: {},
    });
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'easy':
        return '#28a745'; // Green
      case 'medium':
        return '#ffc107'; // Yellow
      case 'difficult':
        return '#e70000'; // Red
      default:
        return '#6c757d'; // Grey
    }
  };

  const getResultColor = (result) => {
    return result === 'Successful' ? '#28a745' : '#e70000';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <Navbar />
      <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center' }}>
        <h2
          style={{
            marginBottom: '20px',
            color: '#333',
            fontSize: '32px',
            fontWeight: '600',
          }}
        >
          Interview Experiences
        </h2>
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Link to="/addexperience">
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '25px',
                boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                fontWeight: '500',
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 12px rgba(0, 123, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.2)';
              }}
            >
              + Add Interview Experience
            </button>
          </Link>
        </div>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {interviews.length > 0 ? (
            interviews.map((interview) => (
              <li
                key={interview._id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        marginBottom: '5px',
                        color: '#007bff',
                        fontSize: '20px',
                        fontWeight: '500',
                      }}
                    >
                      Posted by: {interview.username}
                    </h3>
                    <h4
                      style={{
                        marginBottom: '5px',
                        color: '#333',
                        fontSize: '18px',
                        fontWeight: '500',
                      }}
                    >
                      Company: {interview.companyName}
                    </h4>
                    <p
                      style={{
                        marginBottom: '5px',
                        color: '#555',
                        fontSize: '16px',
                      }}
                    >
                      Position: {interview.position}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span
                      style={{
                        backgroundColor: getDifficultyColor(interview.interviewLevel),
                        color: '#fff',
                        padding: '5px 15px',
                        borderRadius: '5px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {interview.interviewLevel}
                    </span>
                    <span
                      style={{
                        backgroundColor: getResultColor(interview.result),
                        color: '#fff',
                        padding: '5px 15px',
                        borderRadius: '5px',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {interview.result}
                    </span>
                  </div>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeContent(interview.experience) }}
                  style={{
                    marginTop: '10px',
                    fontSize: '16px',
                    color: '#555',
                    lineHeight: '1.5',
                  }}
                />
              </li>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#777', fontSize: '18px' }}>
              No interview experiences available yet.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default InterviewExperience;
