import { useMemo } from 'react';
import Header from '../components/Header.jsx';
import KPICard from '../components/KPICard.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import useSmartLeadData from '../hooks/useSmartLeadData.js';
import useGHLData from '../hooks/useGHLData.js';
import { getTrendData } from '../data/mockData.js';
import './Dashboard.css';

export default function Dashboard({ slInitKey = 0, ghlInitKey = 0 }) {
  const {
    campaigns,
    selectedCampaignIds,
    setSelectedCampaignIds,
    dateRange,
    setDateRange,
    metrics,
    metricsLoading,
    campaignsLoading,
    error,
    earliestDate,
  } = useSmartLeadData(slInitKey);

  const { ghlMetrics, ghlLoading, ghlError } = useGHLData(
    ghlInitKey,
    selectedCampaignIds,
    dateRange,
    earliestDate
  );

  const trendData = getTrendData();

  const dateRangeLabel = useMemo(() => {
    if (dateRange && typeof dateRange === 'object' && dateRange.value === 'custom') {
      return `${dateRange.start} — ${dateRange.end}`;
    }
    const map = { '7d': 'last 7 days', '30d': 'last 30 days', '90d': 'last 90 days', 'all': 'all time' };
    return map[dateRange] ?? 'last 30 days';
  }, [dateRange]);

  const formatNumber = (n) => (n ?? 0).toLocaleString();
  const formatPct = (n) => `${n ?? '0.0'}%`;

  const selectedPreset = typeof dateRange === 'object' ? dateRange.value : dateRange;

  const isDevUIOnly = false; // Re-enabling actual data fetch wait states

  // ── No API key — prompt to connect ───────────────────────────────────────
  if (!isDevUIOnly && !campaignsLoading && campaigns.length === 0 && !error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-empty">
          <svg viewBox="0 0 24 24">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <h3>Connect Your Data</h3>
          <p>Enter your API key using the SmartLead or GoHighLevel buttons in the bottom left to start seeing your campaign data.</p>
        </div>
      </div>
    );
  }

  // ── Full-screen loading ───────────────────────────────────────────────────
  if (!isDevUIOnly && campaignsLoading) {
    return <LoadingScreen />;
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (!isDevUIOnly && error) {
    return (
      <>
        <Header
          dateRange={selectedPreset}
          onDateRangeChange={setDateRange}
          campaigns={campaigns}
          selectedCampaigns={selectedCampaignIds}
          onCampaignChange={setSelectedCampaignIds}
        />
        <div className="dashboard-page">
          <div className="dashboard-empty">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h3>Failed to Load Data</h3>
            <p>{error}</p>
          </div>
        </div>
      </>
    );
  }

  // ── No campaigns selected ─────────────────────────────────────────────────
  if (!isDevUIOnly && selectedCampaignIds.length === 0) {
    return (
      <>
        <Header
          dateRange={selectedPreset}
          onDateRangeChange={setDateRange}
          campaigns={campaigns}
          selectedCampaigns={selectedCampaignIds}
          onCampaignChange={setSelectedCampaignIds}
        />
        <div className="dashboard-page">
          <div className="dashboard-empty">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 15h8" />
              <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
              <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
            </svg>
            <h3>No Campaigns Selected</h3>
            <p>Select at least one campaign from the filter above to view your metrics.</p>
          </div>
        </div>
      </>
    );
  }

  // ── Main dashboard ────────────────────────────────────────────────────────
  const sl = metrics;
  const slLoading = isDevUIOnly ? false : (metricsLoading || !sl);

  return (
    <>
      <Header
        dateRange={selectedPreset}
        onDateRangeChange={setDateRange}
        campaigns={campaigns}
        selectedCampaigns={selectedCampaignIds}
        onCampaignChange={setSelectedCampaignIds}
      />
      <div className="dashboard-page">
        {/* ── Campaigns Section ── */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-label">Campaigns</h2>
          </div>
          <div className="kpi-grid">
            {/* Total Emails Sent */}
            <KPICard
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              }
              iconColor="blue"
              label="Total Emails Sent"
              value={formatNumber(sl?.totalEmailsSent)}
              trend={sl?.trends.totalEmailsSent}
              sparkData={trendData.emailsSent}
              sparkColor="#1e3a8a"
              loading={slLoading}
            />

            {/* Average Reply Rate */}
            <KPICard
              icon={
                <svg viewBox="0 0 24 24">
                  <polyline points="9 17 4 12 9 7" />
                  <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                </svg>
              }
              iconColor="indigo"
              label="Avg Reply Rate"
              value={formatPct(sl?.avgReplyRate)}
              subText={sl ? `${formatNumber(sl.totalReplies)} total replies` : null}
              trend={sl?.trends.avgReplyRate}
              sparkData={trendData.replyRate}
              sparkColor="#1e3a8a"
              loading={slLoading}
            />

            {/* Average Positive Reply Rate */}
            <KPICard
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                  <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              }
              iconColor="emerald"
              label="Avg Positive Reply Rate"
              value={formatPct(sl?.avgPositiveReplyRate)}
              subText={sl ? `${formatNumber(sl.totalPositiveReplies)} positive replies` : null}
              trend={sl?.trends.avgPositiveReplyRate}
              sparkData={trendData.positiveReplyRate}
              sparkColor="#1e3a8a"
              loading={slLoading}
            />
          </div>
        </div>

        {/* ── Follow-Ups Section ── */}
        <div className="dashboard-section" style={{ marginTop: '32px' }}>
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-label">Follow-Ups</h2>
          </div>
          <div className="kpi-grid">
            {/* Calls Proposed — GHL */}
            <KPICard
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  <path d="M14.05 2a9 9 0 0 1 8 7.94" />
                  <path d="M14.05 6A5 5 0 0 1 18 10" />
                </svg>
              }
              iconColor="amber"
              label="Calls Proposed"
              value={ghlMetrics ? formatNumber(ghlMetrics.callsProposed) : "—"}
              trend={ghlMetrics?.trends?.callsProposed}
              sparkData={trendData.meetingsBooked}
              sparkColor="#1e3a8a"
              loading={ghlLoading}
            />

            {/* 12 Hour Follow-Ups — GHL */}
            <KPICard
              icon={
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              iconColor="amber"
              label="12 Hour Follow-Ups"
              value={ghlMetrics ? formatNumber(ghlMetrics.followUps) : "—"}
              trend={ghlMetrics?.trends?.followUps}
              sparkData={trendData.meetingsShowedUp}
              sparkColor="#1e3a8a"
              loading={ghlLoading}
            />

            {/* Calls Booked — GHL */}
            <KPICard
              icon={
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M8 14h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 14h.01" />
                </svg>
              }
              iconColor="amber"
              label="Calls Booked"
              value={ghlMetrics ? formatNumber(ghlMetrics.callsBooked) : "—"}
              trend={ghlMetrics?.trends?.callsBooked}
              sparkData={trendData.meetingsBooked}
              sparkColor="#1e3a8a"
              loading={ghlLoading}
            />
          </div>
        </div>

        {/* ── Conversions Section ── */}
        <div className="dashboard-section" style={{ marginTop: '32px' }}>
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-label">Conversions</h2>
          </div>
          <div className="kpi-grid">
            {/* Deals Closed — GHL (pending) */}
            <KPICard
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              }
              iconColor="emerald"
              label="Deals Closed"
              value="—"
              disabled
              pendingSource="GHL"
              sparkData={trendData.dealsClosed}
              sparkColor="#1e3a8a"
            />

            {/* Total Upfront Revenue — GHL (pending) */}
            <KPICard
              icon={
                <svg viewBox="0 0 24 24">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
              iconColor="emerald"
              label="Total Upfront Revenue"
              value="—"
              disabled
              pendingSource="GHL"
              sparkData={trendData.upfrontRevenue}
              sparkColor="#1e3a8a"
            />

            {/* Total Contract Revenue — GHL (pending) */}
            <KPICard
              icon={
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  <line x1="6" y1="14" x2="18" y2="14" />
                </svg>
              }
              iconColor="emerald"
              label="Total Contract Revenue"
              value="—"
              disabled
              pendingSource="GHL"
              sparkData={trendData.contractRevenue}
              sparkColor="#1e3a8a"
            />
          </div>
        </div>

        {/* Summary Bar */}
        <div className="dashboard-summary">
          <div className="dashboard-summary-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue-500)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Showing data for <strong>{dateRangeLabel}</strong></span>
          </div>
          <div className="dashboard-summary-divider"></div>
          <div className="dashboard-summary-item">
            <span><strong>{selectedCampaignIds.length}</strong> of <strong>{campaigns.length}</strong> campaigns selected</span>
          </div>
          {metricsLoading && (
            <>
              <div className="dashboard-summary-divider"></div>
              <div className="dashboard-summary-item">
                <span style={{ color: 'var(--slate-400)' }}>Updating…</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
