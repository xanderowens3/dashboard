import './LoadingScreen.css';

export default function LoadingScreen() {
  return (
    <div className="loading-inline">
      <div className="loading-inline-inner">
        <div className="loading-logo-wrap">
          <img src="/logo.svg" alt="Hermes" className="loading-logo-img" />
        </div>
        <p className="loading-message">Pulling your campaign data from SmartLead…</p>
        <div className="loading-bar-track">
          <div className="loading-bar-fill" />
        </div>
        <p className="loading-sub">
          This takes 1–2 minutes on first load. Switching between views will be instant afterwards.
        </p>
      </div>
    </div>
  );
}
