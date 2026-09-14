import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('admin@kaizen.io');
  const [password, setPassword] = useState('kaizen123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setToken = useAuthStore(s => s.setToken);
  const setUser = useAuthStore(s => s.setUser);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.access_token);
      setUser(res.data.user);
      navigate('/overview');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full border border-border">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-accent tracking-widest">KAIZEN</div>
          <div className="text-secondary text-sm mt-1 tracking-widest uppercase">Change for Better</div>
          <div className="w-16 h-0.5 bg-accent mx-auto mt-3" />
        </div>

        {/* Demo credentials info */}
        <div className="mb-4 p-3 bg-background rounded border border-border text-xs text-secondary">
          <div className="font-semibold text-accent mb-1">Demo Credentials</div>
          <div>Email: admin@kaizen.io</div>
          <div>Password: kaizen123</div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-secondary mb-1 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-background text-foreground px-4 py-2.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-accent font-mono"
              placeholder="admin@kaizen.io"
            />
          </div>
          <div>
            <label className="block text-sm text-secondary mb-1 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-background text-foreground px-4 py-2.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-accent font-mono"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-danger/10 border border-danger/30 rounded text-danger text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-background py-3 rounded font-bold hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN TO COMMAND CENTER'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-center">
          <div className="text-xs text-secondary">
            ⚠ SIMULATED DATA — Decision Support Only
          </div>
        </div>
      </div>
    </div>
  );
}

