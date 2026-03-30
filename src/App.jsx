import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Incrementing this tells Dashboard to re-init with the new API key
  const [slInitKey, setSlInitKey] = useState(0);

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSmartLeadKeySet={() => setSlInitKey(k => k + 1)}
      />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Dashboard slInitKey={slInitKey} />
      </main>
    </div>
  );
}
