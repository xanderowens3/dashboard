import { getGHLKey } from './keyStore.js';
import { resolveDates } from './smartlead.js';

const BASE_URL = '/ghl-api';
const LOCATION_ID = 'vvfsDK13peLjeDMg5M0U';

function API_KEY() { return getGHLKey(); }

// Custom Field IDs mapped from GHL Logic Document
const CF = {
  CAMPAIGN: 'IyS6bhX7hdUcg81AfRda', // SmartLead Campaign ID for Pipeline
  PROPOSED: 'SjdCvQ9cTILmG8MKqIyd', // Call Proposed At
  FOLLOWUP: 'syJfDi9KwrqolBasfOwC', // Day 1 Follow-Up At
  BOOKED: 'sQUdyW4BzV6U5OLHRpeX',   // Booked Call At
};

// Simple fast memory cache for contacts data during the session
let cachedContacts = null;

async function fetchAllContacts() {
  if (cachedContacts) return cachedContacts;
  if (!API_KEY()) return [];
  
  let allContacts = [];
  let url = `${BASE_URL}/contacts/?locationId=${LOCATION_ID}&limit=100`;

  while (url) {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY()}`,
        'Version': '2021-07-28'
      }
    });

    if (!res.ok) throw new Error(`HighLevel API returned ${res.status}`);
    const data = await res.json();
    if (data.contacts) {
      allContacts.push(...data.contacts);
    }
    
    if (data.meta && data.meta.nextPageUrl) {
      // Very Important: Replace domain with our proxy to avoid CORS
      url = data.meta.nextPageUrl.replace('https://services.leadconnectorhq.com', BASE_URL);
    } else {
      url = null;
    }
  }

  // Pre-process contacts into simplified usable structure to save memory & filtering time
  cachedContacts = allContacts.map(c => {
    let campaignId = '', proposed = null, followup = null, booked = null;
    
    if (c.customFields && Array.isArray(c.customFields)) {
      c.customFields.forEach(field => {
        if (field.id === CF.CAMPAIGN && field.value) campaignId = String(field.value).trim();
        if (field.id === CF.PROPOSED && field.value) proposed = new Date(field.value);
        if (field.id === CF.FOLLOWUP && field.value) followup = new Date(field.value);
        if (field.id === CF.BOOKED && field.value) booked = new Date(field.value);
      });
    }

    // Fallback: sometimes v2 API returns custom_fields
    if (!c.customFields && c.custom_fields && Array.isArray(c.custom_fields)) {
      c.custom_fields.forEach(field => {
        if (field.id === CF.CAMPAIGN && field.value) campaignId = String(field.value).trim();
        if (field.id === CF.PROPOSED && field.value) proposed = new Date(field.value);
        if (field.id === CF.FOLLOWUP && field.value) followup = new Date(field.value);
        if (field.id === CF.BOOKED && field.value) booked = new Date(field.value);
      });
    }

    return {
      id: c.id,
      campaignId,
      proposed,
      followup,
      booked
    };
  });

  return cachedContacts;
}

export function clearGHLSessionCache() {
  cachedContacts = null;
}

function processMetrics(contacts, campaignIds, startStr, endStr) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  end.setHours(23, 59, 59, 999); // ensure date includes end boundary

  let callsProposed = 0;
  let followUps = 0;
  let callsBooked = 0;

  // Convert all selected campaign IDs into uniform strings for safe matching
  const safeCampaignIds = campaignIds.map(id => String(id).trim());

  contacts.forEach(c => {
    // 1. Campaign ID Matching: Only process contacts belonging to selected SmartLead campaigns
    if (!c.campaignId || !safeCampaignIds.includes(c.campaignId)) return;

    // 2. Time Matching: Fix logic to match events by the time they occurred, 
    // ensuring GHL metrics perfectly sync with SmartLead analytics for the same period.
    
    // Check Proposed
    if (c.proposed && !isNaN(c.proposed.getTime())) {
      if (c.proposed >= start && c.proposed <= end) {
        callsProposed++;
      }
    }

    // Check Follow-Up
    if (c.followup && !isNaN(c.followup.getTime())) {
      if (c.followup >= start && c.followup <= end) {
        followUps++;
      }
    }

    // Check Booked
    if (c.booked && !isNaN(c.booked.getTime())) {
      if (c.booked >= start && c.booked <= end) {
        callsBooked++;
      }
    }
  });

  return { callsProposed, followUps, callsBooked };
}

function getPreviousPeriodDates(startStr, endStr) {
  const s = new Date(startStr), e = new Date(endStr);
  const diff = Math.round((e - s) / 86400000);
  const prevEnd = new Date(s); prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd); prevStart.setDate(prevStart.getDate() - diff);
  
  const fmt = (d) => d.toISOString().split('T')[0];
  return { start: fmt(prevStart), end: fmt(prevEnd) };
}

export async function fetchGHLMetrics(campaignIds, dateRange, earliestCampaignDate = null) {
  // Use exact same date resolution as SmartLead for perfect syncing
  const { start, end } = resolveDates(dateRange, earliestCampaignDate);
  const prev = getPreviousPeriodDates(start, end);

  const contacts = await fetchAllContacts();

  const current = processMetrics(contacts, campaignIds, start, end);
  const previous = processMetrics(contacts, campaignIds, prev.start, prev.end);

  const pct = (c, p) => p === 0 ? null : +(((c - p) / p) * 100).toFixed(1);

  return {
    callsProposed: current.callsProposed,
    followUps: current.followUps,
    callsBooked: current.callsBooked,
    trends: {
      callsProposed: pct(current.callsProposed, previous.callsProposed),
      followUps: pct(current.followUps, previous.followUps),
      callsBooked: pct(current.callsBooked, previous.callsBooked)
    }
  };
}
