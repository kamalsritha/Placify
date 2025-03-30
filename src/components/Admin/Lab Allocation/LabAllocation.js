// src/components/Admin/LabAllocation/LabAllocation.js
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import './LabAllocation.css';
import AdminHome from "../AdminHome.js";
import Footer from '../AdminReusableComponents/AdminFooter.js';

function LabAllocation() {
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [studentList, setStudentList] = useState(null);
  const [loading, setLoading] = useState(false);

 
  const blocks = {
    CM: {
      name: "CM Block",
      labs: [
        { id: "CM1", capacity: 65 },
        { id: "CM2", capacity: 65 },
        { id: "CM3", capacity: 65 },
        { id: "CM4", capacity: 65 },
        { id: "CM5", capacity: 65 },
        { id: "CM6", capacity: 65 }
      ]
    },
    MB: {
      name: "MB Block",
      labs: [
        { id: "MB1", capacity: 65 },
        { id: "MB2", capacity: 65 },
        { id: "MB3", capacity: 65 },
        { id: "MB4", capacity: 65 }
      ]
    },
    PG: {
      name: "PG Block",
      labs: [
        { id: "PG1", capacity: 65 },
        { id: "PG2", capacity: 65 },
        { id: "PG3", capacity: 65 },
        { id: "PG4", capacity: 65 },
        { id: "PG5", capacity: 65 },
        { id: "PG6", capacity: 65 }
      ]
    },
    CV: {
      name: "Civil Block",
      labs: [
        { id: "CV1", capacity: 65 },
        { id: "CV2", capacity: 65 },
        { id: "CV3", capacity: 65 },
        { id: "CV4", capacity: 65 },
        { id: "CV5", capacity: 65 },
        { id: "CV6", capacity: 65 }
      ]
    }
  };

  // Handle lab selection
  const handleLabSelection = (labId) => {
    setSelectedLabs(prev => 
      prev.includes(labId) 
        ? prev.filter(id => id !== labId)
        : [...prev, labId]
    );
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setStudentList(jsonData);
        toast.success(`Successfully loaded ${jsonData.length} student records`);
      } catch (error) {
        toast.error('Error reading file. Please check the format.');
        console.error('File reading error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Get block code from lab ID
  const getBlockFromLabId = (labId) => {
    const match = labId.match(/^[A-Z]+/);
    return match ? match[0] : null;
  };

  // Get lab capacity
  const getLabCapacity = (labId) => {
    const blockCode = getBlockFromLabId(labId);
    if (!blockCode || !blocks[blockCode]) return null;
    const lab = blocks[blockCode].labs.find(l => l.id === labId);
    return lab ? lab.capacity : null;
  };

  // Generate venues
  const generateVenues = () => {
    if (!studentList || selectedLabs.length === 0) {
      toast.error('Please upload student list and select labs');
      return;
    }

    setLoading(true);
    try {
      // Calculate total capacity
      const totalCapacity = selectedLabs.reduce((sum, labId) => {
        const capacity = getLabCapacity(labId);
        if (capacity === null) {
          throw new Error(`Invalid lab ID: ${labId}`);
        }
        return sum + capacity;
      }, 0);

      if (studentList.length > totalCapacity) {
        toast.error(`Selected labs cannot accommodate all students (${studentList.length} students, ${totalCapacity} capacity)`);
        return;
      }

      // Distribute students
      let currentLabIndex = 0;
      let studentsInCurrentLab = 0;
      const studentsWithVenues = studentList.map((student) => {
        const currentLab = selectedLabs[currentLabIndex];
        const capacity = getLabCapacity(currentLab);

        if (studentsInCurrentLab >= capacity) {
          currentLabIndex++;
          studentsInCurrentLab = 0;
        }
        studentsInCurrentLab++;

        return {
          ...student,
          Venue: selectedLabs[currentLabIndex]
        };
      });

      // Create Excel file
      const ws = XLSX.utils.json_to_sheet(studentsWithVenues);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Venue Allocation");
      
      // Download file
      const fileName = `venue_allocation_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
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
          <br></br><br></br><br></br><br></br>
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
                    <input
                      type="checkbox"
                      id={lab.id}
                      checked={selectedLabs.includes(lab.id)}
                      onChange={() => handleLabSelection(lab.id)}
                    />
                    <label htmlFor={lab.id}>
                      {lab.id} (Capacity: {lab.capacity})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="action-section">
          <div className="file-upload">
            <h3>Upload Student List</h3>
            <p className="file-format">Format: Excel file (.xlsx, .xls)</p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="file-input"
            />
          </div>

          <button
            className={`generate-btn ${(!studentList || selectedLabs.length === 0) ? 'disabled' : ''}`}
            onClick={generateVenues}
            disabled={!studentList || selectedLabs.length === 0 || loading}
          >
            {loading ? 'Generating...' : 'Generate Venues'}
          </button>
        </div>

        {selectedLabs.length > 0 && (
          <div className="selected-labs">
            <h3>Selected Labs Summary</h3>
            <div className="labs-summary">
              {selectedLabs.map(labId => (
                <div key={labId} className="lab-item">
                  <span className="lab-name">{labId}</span>
                  <span className="lab-capacity">
                    Capacity: {getLabCapacity(labId)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}

export default LabAllocation;