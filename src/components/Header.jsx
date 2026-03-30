import { useState, useRef, useEffect } from 'react';
import './Header.css';

/* ===========================
   Date Range Picker
   =========================== */
const DATE_PRESETS = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'All Time', value: 'all' },
];

export function DateRangePicker({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activeLabel = selected === 'custom'
    ? `${customStart} — ${customEnd}`
    : DATE_PRESETS.find(p => p.value === selected)?.label || 'Last 30 Days';

  return (
    <div className="date-range-picker" ref={ref}>
      <button
        className={`date-range-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        id="date-range-picker"
      >
        <svg viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {activeLabel}
        <svg className="chevron" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="date-range-dropdown">
          {DATE_PRESETS.map(p => (
            <button
              key={p.value}
              className={`date-range-option ${selected === p.value ? 'active' : ''}`}
              onClick={() => { onChange(p.value); setOpen(false); }}
            >
              {p.label}
            </button>
          ))}
          <div className="date-range-custom">
            <label>Custom Range</label>
            <div className="date-range-custom-inputs">
              <input
                type="date"
                value={customStart}
                onChange={e => setCustomStart(e.target.value)}
                aria-label="Start date"
              />
              <input
                type="date"
                value={customEnd}
                onChange={e => setCustomEnd(e.target.value)}
                aria-label="End date"
              />
            </div>
            <button
              className="date-range-option active"
              style={{ textAlign: 'center', marginTop: 4 }}
              onClick={() => {
                if (customStart && customEnd) {
                  onChange({ value: 'custom', start: customStart, end: customEnd });
                  setOpen(false);
                }
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/* ===========================
   Campaign Multi-Select
   =========================== */
export function CampaignSelector({ campaigns, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [pending, setPending] = useState(selected);
  const ref = useRef(null);

  // Sync pending to selected whenever the dropdown opens
  function handleOpen() {
    setPending(selected);
    setSearch('');
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleApply() {
    onChange(pending);
    setOpen(false);
  }

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) handleClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCampaign = (id) => {
    if (pending.includes(id)) {
      setPending(pending.filter(s => s !== id));
    } else {
      setPending([...pending, id]);
    }
  };

  const selectAll = () => setPending(campaigns.map(c => c.id));
  const clearAll = () => setPending([]);

  const displayLabel = selected.length === campaigns.length
    ? 'All Campaigns'
    : selected.length === 0
      ? 'No Campaigns'
      : `${selected.length} Campaign${selected.length > 1 ? 's' : ''}`;

  return (
    <div className="campaign-selector" ref={ref}>
      <button
        className={`campaign-trigger ${open ? 'open' : ''}`}
        onClick={() => open ? handleClose() : handleOpen()}
        id="campaign-selector"
      >
        <svg viewBox="0 0 24 24">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
        </svg>
        {displayLabel}
        {selected.length > 0 && selected.length < campaigns.length && (
          <span className="campaign-count-badge">{selected.length}</span>
        )}
        <svg className="chevron" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="campaign-dropdown">
          <input
            className="campaign-search"
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <div className="campaign-actions">
            <button className="campaign-action-btn" onClick={selectAll}>Select All</button>
            <button className="campaign-action-btn" onClick={clearAll}>Clear All</button>
          </div>
          <div className="campaign-list">
            {filtered.map(c => (
              <div
                key={c.id}
                className={`campaign-item ${pending.includes(c.id) ? 'selected' : ''}`}
                onClick={() => toggleCampaign(c.id)}
              >
                <div className="campaign-checkbox">
                  <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="campaign-item-info">
                  <span className="campaign-item-name">{c.name}</span>
                  <span className="campaign-item-meta">Started {c.startDate}</span>
                </div>
                <div className={`campaign-status-dot ${c.status}`} title={c.status}></div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.82rem' }}>
                No campaigns found
              </div>
            )}
          </div>
          <div className="campaign-apply-row">
            <span className="campaign-apply-count">
              {pending.length} campaign{pending.length !== 1 ? 's' : ''} selected
            </span>
            <button
              className="campaign-apply-btn"
              onClick={handleApply}
              disabled={pending.length === 0}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/* ===========================
   Combined Header
   =========================== */
export default function Header({
  dateRange, onDateRangeChange,
  campaigns, selectedCampaigns, onCampaignChange,
}) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <h1 className="dashboard-title">Campaign Dashboard</h1>
        <p className="dashboard-subtitle">
          Track your cold email outreach performance across all active campaigns
        </p>
      </div>
      <div className="dashboard-filters">
        <DateRangePicker selected={dateRange} onChange={onDateRangeChange} />
        <CampaignSelector
          campaigns={campaigns}
          selected={selectedCampaigns}
          onChange={onCampaignChange}
        />
      </div>
    </header>
  );
}
