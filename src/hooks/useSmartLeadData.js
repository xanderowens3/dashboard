import { useState, useEffect, useRef } from 'react';
import { fetchCampaigns, fetchDashboardMetrics, warmSessionCache } from '../api/smartlead';

export default function useSmartLeadData() {
  const [campaigns, setCampaigns] = useState([]);
  const [earliestDate, setEarliestDate] = useState(null);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState([]);
  const [dateRange, setDateRange] = useState('7d');

  const [metrics, setMetrics] = useState(null);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        setCampaignsLoading(true);
        setError(null);

        const data = await fetchCampaigns();
        const dates = data.map(c => c.startDate).filter(Boolean).sort();
        const earliest = dates[0] ?? '2020-01-01';
        const allIds = data.map(c => c.id);

        // Fetch 7d and 30d together before showing dashboard — both instantly switchable on load
        const [initialMetrics] = await Promise.all([
          fetchDashboardMetrics(allIds, '7d', earliest),
          fetchDashboardMetrics(allIds, '30d', earliest),
        ]);

        setCampaigns(data);
        setEarliestDate(earliest);
        setSelectedCampaignIds(allIds);
        setMetrics(initialMetrics);
        setCampaignsLoading(false);

        // Warm 90d and all time in the background
        warmSessionCache(allIds, earliest).catch(() => {});
      } catch (err) {
        setError(err.message);
        setCampaignsLoading(false);
      }
    }
    init();
  }, []);

  const fetchId = useRef(0);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (campaignsLoading) return;
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      return;
    }
    if (selectedCampaignIds.length === 0) {
      setMetrics(null);
      return;
    }

    const id = ++fetchId.current;

    async function loadMetrics() {
      try {
        setMetricsLoading(true);
        setError(null);
        const data = await fetchDashboardMetrics(selectedCampaignIds, dateRange, earliestDate);
        if (id === fetchId.current) setMetrics(data);
      } catch (err) {
        if (id === fetchId.current) setError(err.message);
      } finally {
        if (id === fetchId.current) setMetricsLoading(false);
      }
    }

    loadMetrics();
  }, [selectedCampaignIds, dateRange, campaignsLoading]);

  return {
    campaigns,
    selectedCampaignIds,
    setSelectedCampaignIds,
    dateRange,
    setDateRange,
    metrics,
    metricsLoading,
    campaignsLoading,
    error,
  };
}
