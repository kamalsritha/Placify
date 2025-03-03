import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import './LabAllocation.css';
import AdminHome from "../AdminHome.js";
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Allocation() {
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [doa, setDoa] = useState("");
  const [loading, setLoading] = useState(false);
  const { id, name } = useParams();
  const companyName = decodeURIComponent(name)

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/auth/applicant/${id}`);
        setStudentList(response.data.applied);
        setDoa(response.data.doa);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchApplicants();
  }, [id]);

  const blocks = {
    CM: { name: "CM Block", labs: Array.from({ length: 6 }, (_, i) => ({ id: `CM${i + 1}`, capacity: 65 })) },
    MB: { name: "MB Block", labs: Array.from({ length: 4 }, (_, i) => ({ id: `MB${i + 1}`, capacity: 65 })) },
    PG: { name: "PG Block", labs: Array.from({ length: 6 }, (_, i) => ({ id: `PG${i + 1}`, capacity: 65 })) },
    CV: { name: "Civil Block", labs: Array.from({ length: 6 }, (_, i) => ({ id: `CV${i + 1}`, capacity: 65 })) },
  };

  const handleLabSelection = (labId) => {
    setSelectedLabs(prev => prev.includes(labId) ? prev.filter(id => id !== labId) : [...prev, labId]);
  };

  const getLabCapacity = (labId) => {
    const blockCode = labId.match(/^[A-Z]+/)[0];
    return blocks[blockCode]?.labs.find(l => l.id === labId)?.capacity || null;
  };

  const generateVenues = async () => {
    if (!studentList.length || selectedLabs.length === 0) {
      toast.error('Please upload student list and select labs');
      return;
    }

    setLoading(true);
    try {
      let currentLabIndex = 0, studentsInCurrentLab = 0;
      const studentsWithVenues = studentList.map((student, index) => {
        const currentLab = selectedLabs[currentLabIndex];
        const capacity = getLabCapacity(currentLab);

        if (studentsInCurrentLab >= capacity) {
          currentLabIndex++;
          studentsInCurrentLab = 0;
        }
        studentsInCurrentLab++;

        return { RollNo: student.rollNo, Name: student.name, Email: student.email,Venue: selectedLabs[currentLabIndex] };
      });

      const ws = XLSX.utils.json_to_sheet([]);
      XLSX.utils.sheet_add_aoa(ws, [[`${companyName} Venues`]], { origin: 'A1' });
      XLSX.utils.sheet_add_json(ws, studentsWithVenues, { origin: 'A3', skipHeader: false });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Lab Venues");
      XLSX.writeFile(wb, `${companyName}_Lab_Venues.xlsx`);
      
      await axios.put(`http://localhost:3001/auth/labAllocation/${id}`);
      await axios.post('http://localhost:3001/auth/sendLabEmails', { studentsWithVenues, companyName, doa});

      toast.success('Venue allocation completed and downloaded');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error('Venue generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHome />
      <div className="lab-allocation-container">
        <ToastContainer />
        <div className="page-header">
          <h1 className="page-title">Lab Allocation</h1>
        </div>

        <div className="blocks-container">
          {Object.entries(blocks).map(([blockKey, block]) => (
            <div key={blockKey} className="block-card">
              <div className="block-header">
                <h2>{block.name}</h2>
              </div>
              <div className="labs-grid">
                {block.labs.map(lab => (
                  <div key={lab.id} className="lab-checkbox">
                    <input type="checkbox" id={lab.id} checked={selectedLabs.includes(lab.id)} onChange={() => handleLabSelection(lab.id)} />
                    <label htmlFor={lab.id}>{lab.id} (Capacity: {lab.capacity})</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="action-section">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            Number of Students Applied: {studentList.length}
          </h1>

          <button className={`generate-btn ${(!studentList.length || selectedLabs.length === 0) ? 'disabled' : ''}`} onClick={generateVenues} disabled={!studentList.length || selectedLabs.length === 0 || loading}>
            {loading ? 'Generating...' : 'Generate Venues'}
          </button>
        </div>
      </div>
    </>
  );
}

export default Allocation;
