import { getSmartLeadKey } from './keyStore.js';

// 🛑 🤖 AI AGENT INSTRUCTION: DO NOT MODIFY SMARTLEAD API ROUTING LOGIC! 🛑
// The BASE_URL strictly relies on 'vite.config.js' for local dev rendering, and
// Edge Network Rewrites in 'vercel.json' for production deployments.
// DO NOT ATTEMPT to build manual serverless functions in '/api/[...path].js' or alter 
// this URL approach without receiving explicit permission from the USER first!
const BASE_URL = '/smartlead-api';

// Always call this inline so it picks up keys entered at runtime
function API_KEY() { return getSmartLeadKey(); }

// ─── Session store ────────────────────────────────────────────────────────────
// Module-level Map — lives for the browser session, gone when the tab closes.
// Key: `${campaignId}|${startDate}|${endDate}`
const sessionStore = new Map();

// ─── Date helpers ─────────────────────────────────────────────────────────────

function fmt(date) {
  return date.toISOString().split('T')[0];
}

export function resolveDates(dateRange, earliestCampaignDate = null) {
  if (dateRange && typeof dateRange === 'object' && dateRange.value === 'custom') {
    return { start: dateRange.start, end: dateRange.end };
  }
  const today = new Date();
  const preset = typeof dateRange === 'object' ? dateRange.value : dateRange;
  const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
  const days = daysMap[preset];
  if (days) {
    const start = new Date(today);
    start.setDate(start.getDate() - days);
    return { start: fmt(start), end: fmt(today) };
  }
  return { start: earliestCampaignDate ?? '2020-01-01', end: fmt(today) };
}

function getPreviousPeriodDates(start, end) {
  const s = new Date(start), e = new Date(end);
  const diff = Math.round((e - s) / 86400000);
  const prevEnd = new Date(s); prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd); prevStart.setDate(prevStart.getDate() - diff);
  return { start: fmt(prevStart), end: fmt(prevEnd) };
}

// ─── Campaigns ────────────────────────────────────────────────────────────────

export async function fetchCampaigns() {
  const res = await fetch(`${BASE_URL}/campaigns?api_key=${API_KEY()}`);
  if (!res.ok) throw new Error(`Failed to fetch campaigns (${res.status})`);
  const data = await res.json();
  const raw = Array.isArray(data) ? data : (data.data ?? data.campaigns ?? []);
  return raw
    .filter(c => !c.name.includes('Scrub'))
    .map(c => ({
      id: c.id,
      name: c.name,
      status: normalizeStatus(c.status),
      startDate: c.created_at ? c.created_at.split('T')[0] : '',
      source: 'smartlead',
    }));
}

function normalizeStatus(s) {
  if (!s) return 'active';
  switch (s.toUpperCase()) {
    case 'ACTIVE': return 'active';
    case 'PAUSED': case 'STOPPED': return 'paused';
    case 'COMPLETED': return 'completed';
    default: return 'active';
  }
}

// ─── Analytics ────────────────────────────────────────────────────────────────

function normalizeAnalytics(raw) {
  if (!raw) return { sentCount: 0, replyCount: 0, positiveReplyCount: 0 };
  const d = Array.isArray(raw) ? (raw[0] ?? {}) : (raw.data ?? raw);
  return {
    sentCount:          Number(d.sent_count             ?? d.total_sent             ?? d.sentCount            ?? 0),
    replyCount:         Number(d.reply_count            ?? d.total_replied          ?? d.replyCount           ?? d.replied_count ?? 0),
    positiveReplyCount: Number(d.positive_reply_count   ?? d.total_positive_replied ?? d.positiveReplyCount   ?? 0),
  };
}

async function fetchCampaignAnalytics(campaignId, startDate, endDate) {
  const key = `${campaignId}|${startDate}|${endDate}`;
  if (sessionStore.has(key)) return sessionStore.get(key);

  const url = `${BASE_URL}/campaigns/${campaignId}/top-level-analytics-by-date` +
    `?api_key=${API_KEY()}&start_date=${startDate}&end_date=${endDate}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Analytics failed for campaign ${campaignId} (${res.status})`);
  const result = normalizeAnalytics(await res.json());
  sessionStore.set(key, result);
  return result;
}

// ─── Rate-limited queue ───────────────────────────────────────────────────────
// Single global queue — all calls share one rate limit window.

async function runQueue(tasks, batchSize = 5, delayMs = 250) {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(fn => fn()));
    results.push(...batchResults);
    if (i + batchSize < tasks.length) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  return results;
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

function aggregate(analyticsArray) {
  let totalSent = 0, totalReplies = 0, totalPositiveReplies = 0;
  analyticsArray.forEach(a => {
    totalSent            += a.sentCount;
    totalReplies         += a.replyCount;
    totalPositiveReplies += a.positiveReplyCount;
  });
  return { totalSent, totalReplies, totalPositiveReplies };
}

function buildMetrics(current, previous) {
  const avgReplyRate         = current.totalSent    > 0 ? +((current.totalReplies / current.totalSent) * 100).toFixed(1) : 0;
  const avgPositiveReplyRate = current.totalReplies > 0 ? +((current.totalPositiveReplies / current.totalReplies) * 100).toFixed(1) : 0;
  const prevReplyRate         = previous.totalSent    > 0 ? (previous.totalReplies / previous.totalSent) * 100 : 0;
  const prevPositiveReplyRate = previous.totalReplies > 0 ? (previous.totalPositiveReplies / previous.totalReplies) * 100 : 0;

  const pct = (c, p) => p === 0 ? null : +(((c - p) / p) * 100).toFixed(1);

  return {
    totalEmailsSent:      current.totalSent,
    totalReplies:         current.totalReplies,
    avgReplyRate,
    totalPositiveReplies: current.totalPositiveReplies,
    avgPositiveReplyRate,
    trends: {
      totalEmailsSent:      pct(current.totalSent, previous.totalSent),
      avgReplyRate:         pct(avgReplyRate, prevReplyRate),
      avgPositiveReplyRate: pct(avgPositiveReplyRate, prevPositiveReplyRate),
    },
  };
}

// ─── Cache management ─────────────────────────────────────────────────────────

export function clearSessionCache() {
  sessionStore.clear();
}

// ─── Public API ───────────────────────────────────────────────────────────────

// Reads from session store — cached entries resolve instantly with no network call.
// Uncached entries go through the rate-limited queue to avoid 429s.
export async function fetchDashboardMetrics(campaignIds, dateRange, earliestCampaignDate = null) {
  const { start, end } = resolveDates(dateRange, earliestCampaignDate);
  const prev = getPreviousPeriodDates(start, end);

  // Run current then previous sequentially through the queue so we never
  // fire 2N parallel calls when the cache is cold.
  const currentResults = await runQueue(
    campaignIds.map(id => () => fetchCampaignAnalytics(id, start, end))
  );
  const previousResults = await runQueue(
    campaignIds.map(id => () => fetchCampaignAnalytics(id, prev.start, prev.end))
  );

  const ok = r => r.status === 'fulfilled';
  if (!currentResults.some(ok) && campaignIds.length > 0) {
    const err = currentResults.find(r => !ok(r))?.reason?.message ?? 'Unknown error';
    throw new Error(`Analytics requests failed. ${err}`);
  }

  return buildMetrics(
    aggregate(currentResults.filter(ok).map(r => r.value)),
    aggregate(previousResults.filter(ok).map(r => r.value)),
  );
}

// Fetches 30d upfront (shown immediately), then warms 7d + 90d in the background.
// All tasks share one queue so we never flood the API.
export async function warmSessionCache(campaignIds, earliestCampaignDate = null) {
  const presets = ['90d', 'all'];

  // Build all (campaign, window) pairs
  const windows = new Map();
  for (const preset of presets) {
    const { start, end } = resolveDates(preset, earliestCampaignDate);
    const prev = getPreviousPeriodDates(start, end);
    windows.set(`${start}|${end}`, { start, end });
    windows.set(`${prev.start}|${prev.end}`, { start: prev.start, end: prev.end });
  }

  // Flatten into one task list — cached entries resolve instantly, no network call
  const tasks = [];
  for (const { start, end } of windows.values()) {
    for (const id of campaignIds) {
      tasks.push(() => fetchCampaignAnalytics(id, start, end));
    }
  }

  await runQueue(tasks, 5, 250);
}
