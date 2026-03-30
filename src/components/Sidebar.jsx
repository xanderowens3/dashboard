import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hermes wing icon */}
            <circle cx="20" cy="20" r="18" stroke="#3b82f6" strokeWidth="2" fill="none" />
            <path d="M14 26c0-6 3-10 6-13 1.5-1.5 3.5-2.5 5-2s2 2.5 0.5 5c-1.5 2.5-3 4-4 5.5s-1 3.5 0.5 4c1.5 0.5 3.5-0.5 5.5-2.5" 
                  stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <path d="M20 13c2-1 5-1.5 7 0s1.5 4-0.5 5.5" 
                  stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M18 15c-2 1-4.5 1-5.5-0.5s0-3.5 2-4.5" 
                  stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">HERMES</span>
          <span className="sidebar-brand-subtitle">Campaign Analytics</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <button className="sidebar-nav-item active">
          <span className="sidebar-nav-icon">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
          <span className="sidebar-nav-label">Dashboard</span>
        </button>

        <button className="sidebar-nav-item" disabled style={{ opacity: 0.4 }}>
          <span className="sidebar-nav-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
          </span>
          <span className="sidebar-nav-label">Reports</span>
        </button>

        <button className="sidebar-nav-item" disabled style={{ opacity: 0.4 }}>
          <span className="sidebar-nav-icon">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <span className="sidebar-nav-label">Settings</span>
        </button>
      </nav>

      {/* Data Sources */}
      <div className="sidebar-footer">
        <div className="sidebar-sources">
          <div className="sidebar-source">
            <div className="sidebar-source-dot connected"></div>
            <div className="sidebar-source-info">
              <span className="sidebar-source-name">SmartLead</span>
              <span className="sidebar-source-status">Connected</span>
            </div>
          </div>
          <div className="sidebar-source">
            <div className="sidebar-source-dot pending"></div>
            <div className="sidebar-source-info">
              <span className="sidebar-source-name">GoHighLevel</span>
              <span className="sidebar-source-status">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
        <svg viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </aside>
  );
}
