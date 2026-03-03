import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      // Placeholder for Better-Auth signup logic
      // In a real application, you would interact with your backend
      // or directly with Better-Auth SDK to register the user.
      // For demonstration, we'll simulate a successful signup.
      console.log('Attempting signup with:', { email, password, skillLevel });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Assume signup is successful and you get a user object
      // In a real scenario, you'd get user info and potentially a session token
      const user = { email, skillLevel };

      // Store skill level in session/local storage for demonstration
      // In a production app, this would typically be handled by your auth system
      localStorage.setItem('user_skill_level', skillLevel);
      localStorage.setItem('user_email', email);

      setMessage('Signup successful! You can now use the personalized chat.');
      setEmail('');
      setPassword('');
      setSkillLevel('Beginner');

      // Optionally redirect to a dashboard or login page
      // window.location.href = '/docs/intro';

    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to sign up. Please try again.');
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
  };

  return (
    <Layout title="Sign Up" description="Sign up for an account">
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '2rem' }}>
        <div style={{
          backgroundColor: 'var(--ifm-background-color, #fff)',
          padding: '2.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.10)',
          maxWidth: '420px',
          width: '100%',
          border: '1px solid #e5e7eb',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚀</div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Create Account</h1>
            <p style={{ color: '#6b7280', marginTop: '0.4rem', marginBottom: 0, fontSize: '0.9375rem' }}>
              Start your Physical AI learning journey
            </p>
          </div>

          {/* Alert messages */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2', color: '#dc2626',
              padding: '0.75rem 1rem', borderRadius: '6px',
              border: '1px solid #fecaca', fontSize: '0.875rem', marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{
              backgroundColor: '#f0fdf4', color: '#16a34a',
              padding: '0.75rem 1rem', borderRadius: '6px',
              border: '1px solid #bbf7d0', fontSize: '0.875rem', marginBottom: '1rem',
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem' }}>Email Address</label>
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
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem' }}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="skillLevel" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem' }}>Your Skill Level</label>
              <select
                id="skillLevel"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                style={{ ...inputStyle, backgroundColor: 'var(--ifm-background-color, white)' }}
              >
                <option value="Beginner">🟢 Beginner — New to robotics &amp; AI</option>
                <option value="Intermediate">🟡 Intermediate — Some ROS / ML experience</option>
                <option value="Advanced">🔴 Advanced — Expert in robotics &amp; deep learning</option>
              </select>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.4rem', marginBottom: 0 }}>
                The AI tutor adapts its explanations to your level.
              </p>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.875rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                fontWeight: 600,
                transition: 'background-color 0.2s',
                marginTop: '0.25rem',
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              Create Account
            </button>
          </form>

          {/* Footer link */}
          <p style={{ textAlign: 'center', marginTop: '1.75rem', marginBottom: 0, color: '#6b7280', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>
              Sign in →
            </Link>
          </p>
        </div>
      </main>
    </Layout>
  );
};

export default SignupPage;
