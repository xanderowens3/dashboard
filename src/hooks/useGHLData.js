import { useState, useEffect, useRef } from 'react';
import { fetchGHLMetrics, clearGHLSessionCache } from '../api/ghl';
import { isGHLConnected } from '../api/keyStore.js';

export default function useGHLData(initKey = 0, selectedCampaignIds = [], dateRange = '7d', earliestDate = null) {
  const [ghlMetrics, setGhlMetrics] = useState(null);
  const [ghlLoading, setGhlLoading] = useState(false);
  const [ghlError, setGhlError] = useState(null);

  useEffect(() => {
    // Clear the global cache when the user submits a new API key
    clearGHLSessionCache();
  }, [initKey]);

  const fetchId = useRef(0);

  useEffect(() => {
    if (!isGHLConnected()) {
      setGhlLoading(false);
      return;
    }

    if (selectedCampaignIds.length === 0) {
      setGhlMetrics(null);
      return;
    }

    const id = ++fetchId.current;

    async function loadMetrics() {
      try {
        setGhlLoading(true);
        setGhlError(null);
        
        const data = await fetchGHLMetrics(selectedCampaignIds, dateRange, earliestDate);
        
        // Ensure stale responses don't override new ones
        if (id === fetchId.current) {
          setGhlMetrics(data);
        }
      } catch (err) {
        if (id === fetchId.current) {
          setGhlError(err.message);
        }
      } finally {
        if (id === fetchId.current) {
          setGhlLoading(false);
        }
      }
    }

    loadMetrics();
  }, [selectedCampaignIds, dateRange, earliestDate, initKey]);

  return {
    ghlMetrics,
    ghlLoading,
    ghlError
  };
}
