import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

const modules = [
  {
    icon: '🤖',
    tag: 'Module 1',
    title: 'Robotic Nervous System',
    subtitle: 'ROS 2 & Communication',
    description:
      'Master Robot Operating System 2 — nodes, topics, services, actions, and the software backbone of every modern robot.',
    link: '/docs/module-1/intro',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    icon: '🌐',
    tag: 'Module 2',
    title: 'The Digital Twin',
    subtitle: 'Gazebo & Unity Simulation',
    description:
      'Build high-fidelity virtual environments with Gazebo and Unity to test and train robots safely before real-world deployment.',
    link: '/docs/module-2/intro',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    icon: '🧠',
    tag: 'Module 3',
    title: 'AI-Robot Brain',
    subtitle: 'NVIDIA Isaac Sim',
    description:
      'Harness NVIDIA Isaac Sim for photorealistic synthetic data, reinforcement learning, and accelerated robot training pipelines.',
    link: '/docs/module-3/isaac-intro',
    color: '#059669',
    bg: '#ecfdf5',
  },
  {
    icon: '👁️',
    tag: 'Module 4',
    title: 'Vision-Language-Action',
    subtitle: 'VLA Models & Capstone',
    description:
      'Deploy frontier VLA models that unify perception, language understanding, and physical action in autonomous humanoid robots.',
    link: '/docs/module-4/vla-intro',
    color: '#dc2626',
    bg: '#fff1f2',
  },
];

const features = [
  { icon: '💬', title: 'AI Tutor Chatbot', desc: 'Adaptive RAG-powered assistant that explains concepts at your skill level — Beginner, Intermediate, or Advanced.' },
  { icon: '📚', title: '4 Comprehensive Modules', desc: 'From ROS 2 fundamentals to cutting-edge VLA models, covering the complete Physical AI stack.' },
  { icon: '🔬', title: 'Hands-On Projects', desc: 'Lab exercises, simulation walkthroughs, and a full autonomous humanoid capstone project.' },
  { icon: '⚡', title: 'Always Up-to-Date', desc: 'Built on Gemini 2.5 and NVIDIA Isaac — the latest tools shaping the future of robotics.' },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="Physical AI & Humanoid Robotics Textbook"
      description="An AI-native, interactive textbook for the Physical AI & Humanoid Robotics course by Panaversity."
    >
      {/* ── Hero ── */}
      <header style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
        color: 'white',
        padding: '5rem 1.5rem 4rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.75, marginBottom: '1rem' }}>
            Panaversity · Physical AI Course
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.2, margin: '0 0 1rem' }}>
            Physical AI &amp; Humanoid Robotics
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', opacity: 0.88, lineHeight: 1.6, margin: '0 0 2.5rem' }}>
            An AI-native, interactive textbook covering ROS 2, Gazebo, NVIDIA Isaac Sim, and Vision-Language-Action models — your complete guide to building autonomous humanoid robots.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/docs/module-1/intro"
              style={{
                backgroundColor: 'white',
                color: '#1d4ed8',
                padding: '0.875rem 2rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
            >
              Start Reading →
            </Link>
            <Link
              to="/signup"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.5)',
              }}
            >
              Get Personalized AI Tutor
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Module Cards ── */}
        <section style={{ padding: '4rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.75rem' }}>Course Modules</h2>
            <p style={{ color: '#6b7280', fontSize: '1.0625rem', margin: 0 }}>
              Four comprehensive modules covering the complete Physical AI stack
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}>
            {modules.map((mod) => (
              <Link
                key={mod.tag}
                to={mod.link}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  padding: '1.75rem',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'var(--ifm-background-color, #fff)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  cursor: 'pointer',
                }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.10)';
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '48px', height: '48px',
                    backgroundColor: mod.bg,
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}>
                    {mod.icon}
                  </div>
                  <div>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
                      textTransform: 'uppercase', color: mod.color,
                    }}>
                      {mod.tag}
                    </span>
                    <h3 style={{ margin: '0.25rem 0 0.15rem', fontSize: '1.125rem', fontWeight: 700 }}>
                      {mod.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: mod.color, fontWeight: 600 }}>
                      {mod.subtitle}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6, flexGrow: 1 }}>
                    {mod.description}
                  </p>
                  <span style={{ color: mod.color, fontWeight: 600, fontSize: '0.875rem' }}>
                    Read chapter →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Features Row ── */}
        <section style={{ backgroundColor: '#f8fafc', padding: '4rem 1.5rem', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.75rem' }}>Why This Textbook?</h2>
              <p style={{ color: '#6b7280', fontSize: '1.0625rem', margin: 0 }}>
                Modern, interactive, and AI-powered from the ground up
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '1.5rem',
            }}>
              {features.map((f) => (
                <div key={f.title} style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--ifm-background-color, #fff)',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700 }}>{f.title}</h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
              Ready to build the future of robotics?
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.0625rem', marginBottom: '2rem' }}>
              Sign up free to unlock your personalized AI tutor that adapts to your skill level.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/signup"
                style={{
                  backgroundColor: '#2563eb', color: 'white',
                  padding: '0.875rem 2rem', borderRadius: '8px',
                  fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
                }}
              >
                Get Started Free →
              </Link>
              <Link
                to="/docs/module-1/intro"
                style={{
                  backgroundColor: 'transparent', color: '#2563eb',
                  padding: '0.875rem 2rem', borderRadius: '8px',
                  fontWeight: 600, fontSize: '1rem', textDecoration: 'none',
                  border: '2px solid #2563eb',
                }}
              >
                Browse Textbook
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
