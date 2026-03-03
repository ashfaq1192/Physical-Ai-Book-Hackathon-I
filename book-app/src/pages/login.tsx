import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      // Simulate login — check against credentials stored during signup
      await new Promise(resolve => setTimeout(resolve, 800));

      const storedEmail = localStorage.getItem('user_email');

      if (storedEmail && storedEmail === email) {
        const skillLevel = localStorage.getItem('user_skill_level') || 'Beginner';
        localStorage.setItem('user_skill_level', skillLevel);
        setMessage(`Welcome back! Signed in as ${email}. Redirecting…`);
        setTimeout(() => {
          window.location.href = '/docs/module-1/intro';
        }, 1200);
      } else {
        setError('No account found for this email on this device. Please sign up first — accounts are saved locally in your browser.');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxSizing: 'border-box',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  return (
    <Layout title="Login" description="Sign in to your account">
      <main style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '75vh',
        padding: '2rem',
      }}>
        <div style={{
          padding: '2.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          maxWidth: '420px',
          width: '100%',
          border: '1px solid #e5e7eb',
          backgroundColor: 'var(--ifm-background-color, #fff)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Welcome Back</h1>
            <p style={{ color: '#6b7280', marginTop: '0.4rem', marginBottom: 0, fontSize: '0.9375rem' }}>
              Sign in to continue your robotics journey
            </p>
          </div>

          {/* Alert messages */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              border: '1px solid #fecaca',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              border: '1px solid #bbf7d0',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}>
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem' }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem' }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.875rem',
                borderRadius: '6px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9375rem',
                fontWeight: 600,
                opacity: loading ? 0.75 : 1,
                transition: 'background-color 0.2s',
                marginTop: '0.25rem',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Footer link */}
          <p style={{ textAlign: 'center', marginTop: '1.75rem', marginBottom: 0, color: '#6b7280', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#2563eb', fontWeight: 600 }}>
              Sign up free →
            </Link>
          </p>
        </div>
      </main>
    </Layout>
  );
};

export default LoginPage;
