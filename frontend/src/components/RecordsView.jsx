import React, { useState, useEffect } from 'react';

export default function RecordsView() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

  const fetchRecords = async (date) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/attendance?date=${date}`);
      const data = await res.json();
      if (res.ok) {
        setRecords(data.records || []);
        setError("");
      } else {
        setError(data.message || "Failed to fetch records.");
      }
    } catch (err) {
      setError("Network error fetching records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(selectedDate);
  }, [selectedDate]);

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ marginBottom: '20px', color: '#1a1a1a' }}>Attendance Records</h2>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Select Date: </label>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #cbd5e1' }}
        />
      </div>

      {loading && <p>Loading records...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>Name</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>Role</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>Time In</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>Time Out</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>{rec.name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>{rec.role}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>{rec.time_in || '--'}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>{rec.time_out || '--'}</td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}