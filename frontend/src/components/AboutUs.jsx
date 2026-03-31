import React, { useState, useEffect } from 'react';
 // Keep your CSS as is

export default function AboutUs() {
  const [vision, setVision] = useState([]);
  const [mission, setMission] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch('/api/about'); // Laravel API endpoint
        if (!res.ok) throw new Error('Failed to fetch About Us data');
        const data = await res.json();

        setVision(data.vision || []);
        setMission(data.mission || []);
        setTeam(data.team || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching About Us:', err);
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading About Us...</div>;

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
        <p className="subtitle">Learn more about our vision, mission, and team.</p>
      </div>

      <div className="vision-grid">
        {vision.map((item, idx) => (
          <div key={`vision-${idx}`} className="vision-item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
        {mission.map((item, idx) => (
          <div key={`mission-${idx}`} className="vision-item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <div className="section-title">Our Team</div>
      <div className="team-grid">
        {team.map((member, idx) => (
          <div key={`member-${idx}`} className="member-card">
            <div className="image-wrapper">
              <img src={member.photo} alt={member.name} />
            </div>
            <div className="role-badge">{member.role}</div>
            <h3>{member.name}</h3>
            <p>{member.bio}</p>
          </div>
        ))}
      </div>

      <div className="about-footer">
        &copy; {new Date().getFullYear()} Trinidad Municipal College. All rights reserved.
      </div>
    </div>
  );
}