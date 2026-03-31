import React, { useEffect, useState } from 'react';

export default function OfficialReportView({ selectedDates, deptFilter, yearFilter, onBack }) {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const query = `?dates=${selectedDates.join(',')}&dept=${deptFilter}&year=${yearFilter}`;
        const res = await fetch(`/api/official-report${query}`);
        const data = await res.json();

        if (res.ok) {
          setReportData(data.records || []);
        } else {
          alert(data.message || "Failed to fetch report.");
        }
      } catch (err) {
        alert("Network error fetching report.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedDates.length > 0) fetchReport();
  }, [selectedDates, deptFilter, yearFilter]);

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <button 
        onClick={onBack}
        style={{ marginBottom: '20px', padding: '8px 15px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        ← Back
      </button>

      <h2 style={{ marginBottom: '20px', color: '#1a1a1a' }}>Official Report</h2>

      {loading ? (
        <p>Loading report...</p>
      ) : reportData.length === 0 ? (
        <p>No records found for the selected filters.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#3498db', color: '#fff' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Department</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Year Level</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Time In</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Time Out</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((record, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? '#f8fafc' : '#fff' }}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{record.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{record.department}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{record.year_level}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{record.date}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{record.time_in || '--'}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{record.time_out || '--'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}