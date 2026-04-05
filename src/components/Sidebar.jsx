import { useState, useRef, useEffect } from 'react';
import { setSmartLeadKey, setGHLKey, isSmartLeadConnected, isGHLConnected } from '../api/keyStore.js';
import './Sidebar.css';

function ApiKeyPopover({ name, connected, onSave, onClose }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleSave() {
    if (!value.trim()) return;
    onSave(value.trim());
    onClose();
  }

  return (
    <div className="api-popover">
      <div className="api-popover-header">
        <span>{name} API Key</span>
        <button className="api-popover-close" onClick={onClose}>
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <p className="api-popover-hint">
        {connected ? 'Enter a new key to reconnect.' : 'Paste your API key to connect.'}
      </p>
      <input
        ref={inputRef}
        className="api-popover-input"
        type="password"
        placeholder="Paste API key…"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSave()}
      />
      <button
        className="api-popover-save"
        onClick={handleSave}
        disabled={!value.trim()}
      >
        Connect
      </button>
    </div>
  );
}

export default function Sidebar({ collapsed, onToggle, onSmartLeadKeySet, onGHLKeySet }) {
  const [slConnected, setSlConnected] = useState(isSmartLeadConnected());
  const [ghlConnected, setGhlConnected] = useState(isGHLConnected());
  const [openPopover, setOpenPopover] = useState(null); // 'sl' | 'ghl' | null

  function handleSaveSmartLead(key) {
    setSmartLeadKey(key);
    setSlConnected(true);
    if (onSmartLeadKeySet) onSmartLeadKeySet();
  }

  function handleSaveGHL(key) {
    setGHLKey(key);
    setGhlConnected(true);
    if (onGHLKeySet) onGHLKeySet();
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
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

          {/* SmartLead */}
          <div className="sidebar-source-wrap">
            <button
              className="sidebar-source sidebar-source-btn"
              onClick={() => setOpenPopover(openPopover === 'sl' ? null : 'sl')}
              title="Configure SmartLead"
            >
              <div className={`sidebar-source-dot ${slConnected ? 'connected' : 'disconnected'}`} />
              <div className="sidebar-source-info">
                <span className="sidebar-source-name">SmartLead</span>
                <span className="sidebar-source-status">{slConnected ? 'Connected' : 'Click to connect'}</span>
              </div>
              <svg className="sidebar-source-chevron" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            {openPopover === 'sl' && (
              <ApiKeyPopover
                name="SmartLead"
                connected={slConnected}
                onSave={handleSaveSmartLead}
                onClose={() => setOpenPopover(null)}
              />
            )}
          </div>

          {/* GoHighLevel */}
          <div className="sidebar-source-wrap">
            <button
              className="sidebar-source sidebar-source-btn"
              onClick={() => setOpenPopover(openPopover === 'ghl' ? null : 'ghl')}
              title="Configure GoHighLevel"
            >
              <div className={`sidebar-source-dot ${ghlConnected ? 'connected' : 'pending'}`} />
              <div className="sidebar-source-info">
                <span className="sidebar-source-name">GoHighLevel</span>
                <span className="sidebar-source-status">{ghlConnected ? 'Connected' : 'Click to connect'}</span>
              </div>
              <svg className="sidebar-source-chevron" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            {openPopover === 'ghl' && (
              <ApiKeyPopover
                name="GoHighLevel"
                connected={ghlConnected}
                onSave={handleSaveGHL}
                onClose={() => setOpenPopover(null)}
              />
            )}
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
