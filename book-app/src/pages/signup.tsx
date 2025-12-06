import React, { useState } from 'react';
import Layout from '@theme/Layout';
import auth from '../../lib/auth-client'; // Adjust path as necessary

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

  return (
    <Layout title="Sign Up" description="Sign up for an account">
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%',
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Sign Up</h1>
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {
              error && (
                <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
              )
            }
            {
              message && (
                <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>
              )
            }
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#555' }}>Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#555' }}>Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label htmlFor="skillLevel" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#555' }}>Skill Level:</label>
              <select
                id="skillLevel"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e40af'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              Sign Up
            </button>
          </form>
        </div>
      </main>
    </Layout>
  );
};

export default SignupPage;
