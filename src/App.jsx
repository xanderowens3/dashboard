import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [slInitKey, setSlInitKey] = useState(0);
  const [ghlInitKey, setGhlInitKey] = useState(0);

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSmartLeadKeySet={() => setSlInitKey(k => k + 1)}
        onGHLKeySet={() => setGhlInitKey(k => k + 1)}
      />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Dashboard slInitKey={slInitKey} ghlInitKey={ghlInitKey} />
      </main>
    </div>
  );
}
