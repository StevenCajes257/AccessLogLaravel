import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  // Menu items; 'RECORDS' renamed to 'TODAYS RECORDS'
  const menus = ['DASHBOARD', 'USER LIST', 'REPORT MODULE', 'TODAYS RECORDS'];

  return (
    <aside className="app-sidebar">
      {menus.map((menu) => {
        // Highlight if current tab matches, or if viewing official report, highlight 'REPORT MODULE'
        const isActive = activeTab === menu || (activeTab === 'OFFICIAL_REPORT' && menu === 'REPORT MODULE');

        return (
          <button
            key={menu}
            className={isActive ? 'sidebar-btn active' : 'sidebar-btn'}
            onClick={() => setActiveTab(menu)}
          >
            {menu}
          </button>
        );
      })}
    </aside>
  );
}