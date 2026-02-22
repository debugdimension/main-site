import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [step, setStep] = useState(0); // 0: Username, 1: Access Key
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, accessKey }),
      });
      const data = await response.json() as { success?: boolean; token?: string; error?: string };
      if (data.success && data.token) {
        localStorage.setItem('session_token', data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Authentication Failed');
        setStep(0);
        setUsername('');
        setAccessKey('');
      }
    } catch (err) {
      setError('System Error: Connection Lost');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <h1>SYSTEM ACCESS</h1>
        <div className="terminal-handshake">
          {error && <div className="error-msg" style={{color: '#ff4d4d', marginBottom: '1rem'}}>{error}</div>}
          {loading ? (
            <div className="loading">
              ESTABLISHING HANDSHAKE<span className="cursor"></span>
            </div>
          ) : (
            <>
              {step === 0 && (
                <div className="input-group">
                  <div style={{textAlign: 'left'}}>architect@debug:~$ <span className="input-label">LOGIN_ID</span></div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <input
                      type="text"
                      className="terminal-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && username && setStep(1)}
                      autoFocus
                    />
                    <span className="cursor"></span>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="input-group">
                  <div style={{textAlign: 'left'}}>architect@debug:~$ <span className="input-label">ACCESS_KEY</span></div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <input
                      type="password"
                      className="terminal-input"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && accessKey && handleLogin()}
                      autoFocus
                    />
                    <span className="cursor"></span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
