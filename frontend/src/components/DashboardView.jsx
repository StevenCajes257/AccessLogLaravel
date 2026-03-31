import React, { useState, useEffect } from 'react';

export default function DashboardView() {
  const [stats, setStats] = useState({ signedIn: 0, signedOut: 0 });
  const [liveFeed, setLiveFeed] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastSync, setLastSync] = useState('');
  const [isOnline, setIsOnline] = useState(true); // Assume online, can add ping check

  const fetchDashboard = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const res = await fetch(`/api/attendance/dashboard?date=${today}`);
      const data = await res.json();

      if (res.ok) {
        setStats({
          signedIn: data.signedIn || 0,
          signedOut: data.signedOut || 0,
        });

        const sortedEvents = (data.recentEvents || []).sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        ).slice(0, 5);

        setLiveFeed(sortedEvents);
        setLastSync(new Date().toLocaleTimeString());
      } else {
        console.error('Dashboard fetch error:', data.message);
      }
    } catch (err) {
      console.error('Network error fetching dashboard:', err);
      setIsOnline(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboard(); // Initial fetch
    const interval = setInterval(fetchDashboard, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '1100px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>System Oversight</h1>
          <p style={{ color: '#64748b' }}>Real-time campus analytics.</p>
        </div>
        <div style={{ textAlign: 'right', background: '#fff', padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', fontFamily: 'monospace' }}>{currentTime.toLocaleTimeString()}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>LIVE SYSTEM TIME</div>
        </div>
      </header>

      <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="stat-box" style={{ borderLeft: '5px solid #3b82f6', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Total Entered Today</h4>
          <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: '10px 0' }}>{stats.signedIn.toString().padStart(2,'0')}</p>
          <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: '700' }}>DAILY FOOTFALL</span>
        </div>

        <div className="stat-box" style={{ borderLeft: '5px solid #10b981', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Signed Out</h4>
          <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: '10px 0' }}>{stats.signedOut.toString().padStart(2,'0')}</p>
          <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700' }}>EXITED CAMPUS</span>
        </div>

        <div className="stat-box" style={{ borderLeft: '5px solid #f59e0b', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>On Campus</h4>
          <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: '10px 0' }}>{(stats.signedIn - stats.signedOut).toString().padStart(2,'0')}</p>
          <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: '700' }}>CURRENTLY PRESENT</span>
        </div>

        <div className="stat-box" style={{ borderLeft: `5px solid ${isOnline ? '#10b981' : '#ef4444'}`, background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>System Sync</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '20px 0' }}>
            <span style={{ width: '12px', height: '12px', background: isOnline ? '#10b981' : '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
            <p style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: isOnline ? '#10b981' : '#ef4444' }}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </p>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>LAST SYNC: {lastSync}</span>
        </div>
      </div>

      <div style={{ marginTop: '30px', background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>
          Recent Activity Feed
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {liveFeed.length > 0 ? liveFeed.map((event, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderRadius: '8px', background: '#f8fafc', borderLeft: `4px solid ${event.type === 'IN' ? '#3b82f6' : '#10b981'}` }}>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{event.name}</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{event.type === 'IN' ? 'Entered' : 'Exited'}</div>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )) : (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Waiting for card taps...</p>
          )}
        </div>
      </div>
    </div>
  );
}