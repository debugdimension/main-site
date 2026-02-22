import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

export default function Admin() {
  const [status, setStatus] = useState<string>('INITIALIZING...');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json() as { status: string };
        setStatus(data.status);
      } catch (err) {
        setStatus('OFFLINE');
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <header className="dashboard-header">
        <h1>COMMAND_CENTER // ADMIN</h1>
        <button className="logout-btn" onClick={handleLogout}>TERMINATE_SESSION</button>
      </header>

      <main>
        <div className="status-box">
          <p>System State: <span className={status === 'ACTIVE_SYNC' ? 'status-active' : ''}>{status}</span></p>
          <p>Location: CLOUDFLARE_EDGE_NODE_01</p>
          <p>Security: ZERO_TRUST_SHIELD_ACTIVE</p>
        </div>
      </main>
    </div>
  );
}
