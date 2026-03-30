// Mock data simulating SmartLead campaign data
// GHL metrics are set to 0 as placeholders

const campaigns = [
  { id: 'camp_001', name: 'SaaS Decision Makers — Q1', source: 'smartlead', status: 'active', startDate: '2026-01-05' },
  { id: 'camp_002', name: 'eCommerce Founders Outreach', source: 'smartlead', status: 'active', startDate: '2026-01-15' },
  { id: 'camp_003', name: 'Agency Owners — LinkedIn Warm', source: 'smartlead', status: 'active', startDate: '2026-02-01' },
  { id: 'camp_004', name: 'Real Estate Investors — US', source: 'smartlead', status: 'paused', startDate: '2026-02-10' },
  { id: 'camp_005', name: 'FinTech CTOs — Series A+', source: 'smartlead', status: 'active', startDate: '2026-02-20' },
  { id: 'camp_006', name: 'Healthcare Clinic Owners', source: 'smartlead', status: 'completed', startDate: '2026-03-01' },
  { id: 'camp_007', name: 'Legal Services — Attorneys', source: 'smartlead', status: 'active', startDate: '2026-03-10' },
  { id: 'camp_008', name: 'Coaches & Consultants — Warm', source: 'smartlead', status: 'active', startDate: '2026-03-15' },
];

// Per-campaign metrics from SmartLead
const campaignMetrics = {
  camp_001: { emailsSent: 4520, replies: 312, positiveReplies: 87, bounces: 136 },
  camp_002: { emailsSent: 3890, replies: 245, positiveReplies: 68, bounces: 97 },
  camp_003: { emailsSent: 2750, replies: 198, positiveReplies: 72, bounces: 55 },
  camp_004: { emailsSent: 1820, replies: 91, positiveReplies: 23, bounces: 82 },
  camp_005: { emailsSent: 3200, replies: 256, positiveReplies: 89, bounces: 64 },
  camp_006: { emailsSent: 5100, replies: 357, positiveReplies: 112, bounces: 204 },
  camp_007: { emailsSent: 1950, replies: 137, positiveReplies: 48, bounces: 39 },
  camp_008: { emailsSent: 1280, replies: 109, positiveReplies: 41, bounces: 26 },
};

// Sparkline trend data (last 14 data points) for SmartLead metrics
const trendData = {
  emailsSent: [
    { day: 1, value: 820 }, { day: 2, value: 945 }, { day: 3, value: 1102 },
    { day: 4, value: 890 }, { day: 5, value: 1250 }, { day: 6, value: 1180 },
    { day: 7, value: 1340 }, { day: 8, value: 1050 }, { day: 9, value: 1420 },
    { day: 10, value: 1380 }, { day: 11, value: 1560 }, { day: 12, value: 1290 },
    { day: 13, value: 1680 }, { day: 14, value: 1605 },
  ],
  replyRate: [
    { day: 1, value: 5.2 }, { day: 2, value: 5.8 }, { day: 3, value: 6.1 },
    { day: 4, value: 5.5 }, { day: 5, value: 6.4 }, { day: 6, value: 7.0 },
    { day: 7, value: 6.8 }, { day: 8, value: 7.2 }, { day: 9, value: 6.9 },
    { day: 10, value: 7.5 }, { day: 11, value: 7.1 }, { day: 12, value: 7.8 },
    { day: 13, value: 7.3 }, { day: 14, value: 7.0 },
  ],
  positiveReplyRate: [
    { day: 1, value: 1.4 }, { day: 2, value: 1.8 }, { day: 3, value: 2.0 },
    { day: 4, value: 1.6 }, { day: 5, value: 2.2 }, { day: 6, value: 2.5 },
    { day: 7, value: 2.3 }, { day: 8, value: 2.7 }, { day: 9, value: 2.4 },
    { day: 10, value: 2.9 }, { day: 11, value: 2.6 }, { day: 12, value: 3.1 },
    { day: 13, value: 2.8 }, { day: 14, value: 2.6 },
  ],
  bounceRate: [
    { day: 1, value: 4.2 }, { day: 2, value: 3.8 }, { day: 3, value: 3.5 },
    { day: 4, value: 4.0 }, { day: 5, value: 3.2 }, { day: 6, value: 2.9 },
    { day: 7, value: 3.1 }, { day: 8, value: 2.8 }, { day: 9, value: 2.6 },
    { day: 10, value: 2.9 }, { day: 11, value: 2.4 }, { day: 12, value: 2.7 },
    { day: 13, value: 2.3 }, { day: 14, value: 2.5 },
  ],
  meetingsBooked: [
    { day: 1, value: 2 }, { day: 2, value: 3 }, { day: 3, value: 1 },
    { day: 4, value: 4 }, { day: 5, value: 3 }, { day: 6, value: 5 },
    { day: 7, value: 2 }, { day: 8, value: 4 }, { day: 9, value: 6 },
    { day: 10, value: 3 }, { day: 11, value: 5 }, { day: 12, value: 4 },
    { day: 13, value: 3 }, { day: 14, value: 2 },
  ],
  meetingsShowedUp: [
    { day: 1, value: 2 }, { day: 2, value: 2 }, { day: 3, value: 1 },
    { day: 4, value: 3 }, { day: 5, value: 3 }, { day: 6, value: 4 },
    { day: 7, value: 2 }, { day: 8, value: 3 }, { day: 9, value: 5 },
    { day: 10, value: 2 }, { day: 11, value: 4 }, { day: 12, value: 3 },
    { day: 13, value: 3 }, { day: 14, value: 2 },
  ],
  dealsClosed: [
    { day: 1, value: 0 }, { day: 2, value: 1 }, { day: 3, value: 0 },
    { day: 4, value: 1 }, { day: 5, value: 2 }, { day: 6, value: 1 },
    { day: 7, value: 0 }, { day: 8, value: 1 }, { day: 9, value: 2 },
    { day: 10, value: 1 }, { day: 11, value: 0 }, { day: 12, value: 1 },
    { day: 13, value: 1 }, { day: 14, value: 1 },
  ],
  upfrontRevenue: [
    { day: 1, value: 0 }, { day: 2, value: 4500 }, { day: 3, value: 0 },
    { day: 4, value: 4500 }, { day: 5, value: 9000 }, { day: 6, value: 4500 },
    { day: 7, value: 0 }, { day: 8, value: 4500 }, { day: 9, value: 9000 },
    { day: 10, value: 4500 }, { day: 11, value: 0 }, { day: 12, value: 4500 },
    { day: 13, value: 4500 }, { day: 14, value: 4500 },
  ],
  contractRevenue: [
    { day: 1, value: 0 }, { day: 2, value: 15000 }, { day: 3, value: 0 },
    { day: 4, value: 18000 }, { day: 5, value: 30000 }, { day: 6, value: 15000 },
    { day: 7, value: 0 }, { day: 8, value: 18000 }, { day: 9, value: 24000 },
    { day: 10, value: 15000 }, { day: 11, value: 0 }, { day: 12, value: 18000 },
    { day: 13, value: 15000 }, { day: 14, value: 18000 },
  ],
};

// Helper: compute aggregated metrics for selected campaigns
export function getAggregatedMetrics(selectedCampaignIds = null) {
  const ids = selectedCampaignIds || Object.keys(campaignMetrics);

  let totalSent = 0;
  let totalReplies = 0;
  let totalPositiveReplies = 0;
  let totalBounces = 0;

  ids.forEach(id => {
    const m = campaignMetrics[id];
    if (m) {
      totalSent += m.emailsSent;
      totalReplies += m.replies;
      totalPositiveReplies += m.positiveReplies;
      totalBounces += m.bounces;
    }
  });

  const avgReplyRate = totalSent > 0 ? ((totalReplies / totalSent) * 100) : 0;
  const avgPositiveReplyRate = totalSent > 0 ? ((totalPositiveReplies / totalSent) * 100) : 0;
  const bounceRate = totalSent > 0 ? ((totalBounces / totalSent) * 100) : 0;

  return {
    // SmartLead metrics
    totalEmailsSent: totalSent,
    totalReplies,
    avgReplyRate: avgReplyRate.toFixed(1),
    totalPositiveReplies,
    avgPositiveReplyRate: avgPositiveReplyRate.toFixed(1),
    bounceRate: bounceRate.toFixed(1),
    totalBounces,

    // GHL metrics (dummy data for preview)
    meetingsBooked: 47,
    meetingsShowedUp: 38,
    meetingShowRate: '80.9',
    dealsClosed: 12,
    totalUpfrontRevenue: 54000,
    totalContractRevenue: 186000,
  };
}

export function getCampaigns() {
  return campaigns;
}

export function getTrendData() {
  return trendData;
}

// Simulate previous period comparison
export function getPreviousPeriodChange() {
  return {
    totalEmailsSent: 12.4,
    avgReplyRate: 8.2,
    avgPositiveReplyRate: 15.6,
    bounceRate: -11.3,
    meetingsBooked: 22.5,
    meetingsShowedUp: 18.4,
    dealsClosed: 33.3,
    totalUpfrontRevenue: 28.6,
    totalContractRevenue: 41.2,
  };
}
