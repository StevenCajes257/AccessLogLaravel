import React, { useState, useEffect } from 'react';
import './App.css';
import { verifyAdmin } from './api'; // your Laravel API helper

// Import sub-components
import DashboardView from './components/DashboardView';
import RecordsView from './components/RecordsView';
import UserListView from './components/UserListView';
import ReportModule from './components/ReportModule'; 
import OfficialReportView from './components/OfficialReportView'; 
import AboutUs from './components/AboutUs'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ user: '', pass: '' });
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [showMenu, setShowMenu] = useState(false);
  
  const [reportDates, setReportDates] = useState([]); 
  const [selectedDept, setSelectedDept] = useState('ALL'); 
  const [selectedYear, setSelectedYear] = useState('ALL'); 
  
  const [showRfidModal, setShowRfidModal] = useState(false);
  const [loginError, setLoginError] = useState("");

  // RFID Listener via Laravel API
  useEffect(() => {
    let interval;
    if (showRfidModal) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/admin/rfid-status'); // returns { uid: 'xxx' } or { uid: null }
          const data = await res.json();
          if (data.uid) {
            await verifyAdminCard(data.uid);
          }
        } catch (err) {
          console.error("RFID API Error:", err);
        }
      }, 1000);
    }
    return () => interval && clearInterval(interval);
  }, [showRfidModal]);

  // Handle login via Laravel API
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await verifyAdmin(credentials.user, credentials.pass);
      if (result.success) {
        setIsLoggedIn(true);
        setActiveTab('DASHBOARD');
        setLoginError('');
      } else {
        setLoginError(result.message || 'Invalid Credentials');
      }
    } catch (error) {
      setLoginError('Server error. Try again later.');
    }
  };

  // Verify RFID card via Laravel API
  const verifyAdminCard = async (uid) => {
    try {
      const res = await fetch(`/api/admin/verify-rfid/${uid}`);
      const data = await res.json();

      if (res.ok && data.isAdmin) {
        setIsLoggedIn(true);
        setShowRfidModal(false);
        setActiveTab('DASHBOARD');
      } else {
        setLoginError(data.message || `ACCESS DENIED: UID ${uid}`);
        setShowRfidModal(false);
      }
    } catch (err) {
      setLoginError('Server Error.');
      setShowRfidModal(false);
      console.error(err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowMenu(false);
  };

  const renderMainForm = () => {
    switch (activeTab) {
      case 'DASHBOARD': return <DashboardView />;
      case 'REPORT MODULE': 
        return (
          <ReportModule 
            onGenerate={(dates, dept, year) => {
              setReportDates(dates);
              setSelectedDept(dept); 
              setSelectedYear(year); 
              setActiveTab('OFFICIAL_REPORT');
            }} 
          />
        );
      case 'OFFICIAL_REPORT': 
        return (
          <OfficialReportView 
            selectedDates={reportDates} 
            deptFilter={selectedDept} 
            yearFilter={selectedYear} 
            onBack={() => setActiveTab('REPORT MODULE')} 
          />
        );
      case 'USER LIST': return <UserListView />;
      case 'RECORDS': return <RecordsView />;
      case 'ABOUT US': return <AboutUs />; 
      default: return <DashboardView />;
    }
  };

  // Login page
  if (!isLoggedIn) {
    return (
      <div className="login-page-wrapper">
        <div className="login-card-container">
          <div className="login-header-pill">SIGN IN</div>
          <div className="user-avatar-placeholder">
            <div className="avatar-icon">👤</div>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-with-icon">
              <span className="icon">👤</span>
              <input 
                type="text" 
                placeholder="Username" 
                value={credentials.user}
                onChange={(e) => setCredentials({...credentials, user: e.target.value})} 
              />
            </div>
            <div className="input-with-icon">
              <span className="icon">🔒</span>
              <input 
                type="password" 
                placeholder="Password" 
                value={credentials.pass}
                onChange={(e) => setCredentials({...credentials, pass: e.target.value})} 
              />
            </div>
            <button type="submit" className="login-action-btn">LOGIN</button>
            {loginError && <p className="error-text-popup">{loginError}</p>}
          </form>
        </div>

        {showRfidModal && (
          <div className="modal-overlay">
            <div className="modal-content admin-verify">
              <div className="radar active"></div>
              <h2 className="modal-title">Security Authentication</h2>
              <p className="modal-info">Tap Admin RFID Card to continue.</p>
              <button className="cancel-link" onClick={() => setShowRfidModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main app layout
  return (
    <div className="app-container-full">
      <header className="main-navbar">
        <div className="nav-left">
          <div className="brand-logo-pill">ACCESS LOG</div>
          <span className="welcome-text">Welcome Admin !</span>
        </div>
        <div className="nav-right">
          <div 
            className="user-menu-wrapper"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <button className="user-menu-trigger">
              Administrator ▾
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button 
                  className="dropdown-item" 
                  onClick={() => handleTabChange('ABOUT US')}
                >
                  About Us
                </button>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item logout" 
                  onClick={() => { 
                    setIsLoggedIn(false); 
                    setCredentials({user:'', pass:''}); 
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className="main-layout-body">
        <aside className="app-sidebar">
          {['DASHBOARD', 'USER LIST', 'REPORT MODULE', 'RECORDS'].map((tab) => (
            <button 
              key={tab}
              className={activeTab === tab || (activeTab === 'OFFICIAL_REPORT' && tab === 'REPORT MODULE') ? 'sidebar-btn active' : 'sidebar-btn'}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </aside>
        
        <main className="form-content-viewer">
          <div className="form-canvas-a4">
            {renderMainForm()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;