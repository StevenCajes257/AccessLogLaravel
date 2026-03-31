import React, { useState, useEffect } from 'react';

export default function ReportModule({ onGenerate }) {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState('ALL');
  const [yearLevel, setYearLevel] = useState('ALL');
  const [departments, setDepartments] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);

  // Fetch departments and year levels from Laravel API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch('/api/filters');
        const data = await res.json();
        if (res.ok) {
          setDepartments(['ALL', ...data.departments]);
          setYearLevels(['ALL', ...data.year_levels]);
        }
      } catch (err) {
        console.error("Failed to fetch filters.");
      }
    };
    fetchFilters();
  }, []);

  const handleGenerateReport = async () => {
    // Optional: Validate dates
    if (startDate > endDate) {
      alert("Start Date cannot be after End Date.");
      return;
    }

    // Fetch report dates from Laravel API
    try {
      const query = `?start=${startDate}&end=${endDate}&dept=${department}&year=${yearLevel}`;
      const res = await fetch(`/api/reports${query}`);
      const data = await res.json();
      if (res.ok) {
        // Send data back to parent App.jsx for OfficialReportView
        onGenerate(data.dates, department, yearLevel);
      } else {
        alert(data.message || "Failed to generate report.");
      }
    } catch (err) {
      alert("Network error generating report.");
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ marginBottom: '20px', color: '#1a1a1a' }}>Generate Report</h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div>
          <label>Start Date:</label><br/>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>End Date:</label><br/>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div>
          <label>Department:</label><br/>
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Year Level:</label><br/>
          <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)}>
            {yearLevels.map((year, idx) => (
              <option key={idx} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <button 
        style={{ padding: '10px 20px', background: '#3498db', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        onClick={handleGenerateReport}
      >
        Generate Report
      </button>
    </div>
  );
}