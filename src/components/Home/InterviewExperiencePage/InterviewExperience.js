import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';
import { Oval } from 'react-loader-spinner';
import Navbar from "../HomeComponents/Navbar.js";

function InterviewExperience() {
  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  const fetchInterviews = async () => {
    try {
      const response = await axios.get('http://localhost:3001/auth/fetchinterviewexperience');
      setInterviews(response.data.data);
      setFilteredInterviews(response.data.data);
    } catch (error) {
      console.error('Error fetching interview experiences:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleSearch = () => {
    const filtered = interviews.filter(interview => 
      interview.companyName && interview.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInterviews(filtered);
  };

  const sanitizeContent = (content) => {
    return sanitizeHtml(content, {
      allowedTags: ['p', 'br', 'b', 'i', 'u', 'em', 'strong'],
      allowedAttributes: {},
    });
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'easy': return '#28a745';
      case 'medium': return '#ffc107';
      case 'difficult': return '#e70000';
      default: return '#6c757d';
    }
  };

  const getResultColor = (result) => {
    return result === 'Successful' ? '#28a745' : '#e70000';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px', backgroundColor: '#f5f5f5', fontFamily: '"Poppins", sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', color: '#333', fontSize: '32px', fontWeight: '600' }}>Interview Experiences</h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Search by company name..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ padding: '10px', width: '300px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '16px' }}
          />
          <button 
            onClick={handleSearch} 
            style={{ padding: '10px 20px', backgroundColor: 'black', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
          >
            Search
          </button>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Link to="/addexperience">
            <button style={{ padding: '10px 20px', backgroundColor: 'black', color: 'white', border: '2px solid black', borderRadius: '25px', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}>+ Add Interview Experience</button>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Oval height={50} width={50} color="black" secondaryColor="gray" />
          </div>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {filteredInterviews.length > 0 ? (
              filteredInterviews.map((interview) => (
                <li key={interview._id} style={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', marginBottom: '20px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ marginBottom: '5px', color: 'navy', fontSize: '20px', fontWeight: 'Bold', fontFamily: "Poppins" }}>Posted by: {interview.username}</h3>
                      <h4 style={{ marginBottom: '5px', color: 'black', fontSize: '18px', fontWeight: 'Bold', fontFamily: "Poppins" }}>Company: {interview.companyName}</h4>
                      <p style={{ marginBottom: '5px', color: '#555', fontSize: '16px', fontWeight: 'Bold', fontFamily: "Poppins" }}>Position: {interview.position}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ backgroundColor: getDifficultyColor(interview.interviewLevel), color: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'Bold', fontFamily: "Poppins" }}>{interview.interviewLevel}</span>
                      <span style={{ backgroundColor: getResultColor(interview.result), color: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'Bold', fontFamily: "Poppins" }}>{interview.result}</span>
                    </div>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeContent(interview.experience) }} style={{ marginTop: '10px', fontSize: '16px', color: '#555', lineHeight: '1.5', fontWeight: 'Bold', fontFamily: "Poppins" }} />
                </li>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#777', fontSize: '18px' }}>No interview experiences found for this company.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default InterviewExperience;
