import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import './KPICard.css';

export default function KPICard({
  icon,
  iconColor = 'blue',
  label,
  value,
  suffix,
  subText,
  trend,
  trendLabel = 'vs prev. period',
  sparkData,
  sparkColor = '#3b82f6',
  disabled = false,
  pendingSource = null,
  loading = false,
}) {
  const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  // For bounce rate, down is good
  const isBounceRate = label.toLowerCase().includes('bounce');
  const effectiveTrend = isBounceRate
    ? (trend < 0 ? 'up' : trend > 0 ? 'down' : 'neutral')
    : trendDirection;

  if (loading) {
    return (
      <div className="kpi-card kpi-card-loading">
        <div className="kpi-spinner-wrap">
          <svg className="kpi-spinner" viewBox="0 0 40 40">
            <defs>
              <linearGradient id="spinnerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
            <circle className="kpi-spinner-track" cx="20" cy="20" r="16" />
            <circle className="kpi-spinner-fill" cx="20" cy="20" r="16" />
          </svg>
        </div>
        <div className="kpi-card-label">{label}</div>
      </div>
    );
  }

  return (
    <div className={`kpi-card ${disabled ? 'disabled' : ''}`}>
      {pendingSource && (
        <span className="kpi-card-pending">⏳ {pendingSource}</span>
      )}

      <div className="kpi-card-header">
        <div className={`kpi-card-icon ${iconColor}`}>
          {icon}
        </div>
        {sparkData && sparkData.length > 0 && (
          <div className="kpi-card-sparkline">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id={`spark-${label.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sparkColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={sparkColor} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={sparkColor}
                  strokeWidth={2}
                  fill={`url(#spark-${label.replace(/\s+/g, '')})`}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="kpi-card-label">{label}</div>

      <div className="kpi-card-value-row">
        <span className="kpi-card-value">{value}</span>
        {suffix && <span className="kpi-card-suffix">{suffix}</span>}
      </div>

      {subText && <div className="kpi-card-sub">{subText}</div>}

      {trend !== undefined && trend !== null && (
        <div className="kpi-card-footer">
          <span className={`kpi-card-trend ${effectiveTrend}`}>
            {effectiveTrend === 'up' ? (
              <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
            ) : effectiveTrend === 'down' ? (
              <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
            ) : (
              <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            )}
            {Math.abs(trend)}%
          </span>
          <span className="kpi-card-trend-label">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
