import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';

export interface ChatWidgetProps {}

interface Message {
  role: 'user' | 'bot';
  text: string;
}

/** Lightweight markdown renderer — handles bold, inline code, and newlines */
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // Split line into bold/code/plain segments
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    const rendered = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={partIdx} style={{
            backgroundColor: 'rgba(0,0,0,0.12)',
            padding: '0 4px',
            borderRadius: '3px',
            fontSize: '0.85em',
            fontFamily: 'monospace',
          }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return <React.Fragment key={partIdx}>{part}</React.Fragment>;
    });
    return (
      <React.Fragment key={lineIdx}>
        {rendered}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

const ChatWidget: React.FC<ChatWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [skillLevel, setSkillLevel] = useState<string>('Beginner');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load skill level from storage when component mounts
  useEffect(() => {
    const storedLevel = localStorage.getItem('user_skill_level');
    if (storedLevel) {
      setSkillLevel(storedLevel);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const currentSkill = skillLevel;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Auto-detect: localhost → local backend, production → HF Space
      const API_BASE_URL =
        typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://localhost:8000'
          : 'https://ashfaq1192-physica-ai-chatbot-c3cd96c.hf.space';

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, skillLevel: currentSkill }),
      });

      if (!response.ok) {
        const errBody = await response.text().catch(() => '');
        throw new Error(`Server Error ${response.status}${errBody ? `: ${errBody}` : ''}`);
      }

      const data = await response.json();
      const botReply =
        data.response || data.answer || data.reply || 'Sorry, I received an empty response.';

      setMessages((prev) => [...prev, { role: 'bot', text: botReply }]);
    } catch (error) {
      let errorMessage = 'Connection error. Please try again later.';
      if (error instanceof TypeError) {
        errorMessage = `Network Error: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Chat Error:', error);
      setMessages((prev) => [...prev, { role: 'bot', text: `⚠️ ${errorMessage}` }]);
    } finally {
      setLoading(false);
    }
  };

  const skillColor: Record<string, string> = {
    Beginner: '#16a34a',
    Intermediate: '#d97706',
    Advanced: '#dc2626',
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
    toggleButton: {
      backgroundColor: '#2563eb',
      color: 'white',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(37,99,235,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    window: {
      position: 'absolute',
      bottom: '76px',
      right: '0',
      width: '370px',
      height: '520px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 48px rgba(0,0,0,0.18)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
    },
    header: {
      padding: '14px 16px',
      background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    headerIcon: {
      width: '36px',
      height: '36px',
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    messagesArea: {
      flex: 1,
      padding: '16px',
      overflowY: 'auto',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    inputArea: {
      padding: '12px 14px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      gap: '8px',
      backgroundColor: 'white',
      flexShrink: 0,
    },
    input: {
      flex: 1,
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      outline: 'none',
      fontSize: '0.9rem',
      backgroundColor: '#f9fafb',
      resize: 'none' as const,
    },
    sendButton: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: '40px',
      height: '40px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'background-color 0.15s',
    },
  };

  return (
    <div style={styles.container}>
      {isOpen ? (
        <div style={styles.window}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.headerIcon}>
                <Bot size={18} color="white" />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.2 }}>
                  AI Tutor
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.8)',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontWeight: 600,
                }}>
                  {skillLevel} Mode
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesArea}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem', padding: '0 1rem' }}>
                <MessageSquare size={36} style={{ margin: '0 auto 12px', opacity: 0.4, display: 'block' }} />
                <p style={{ fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>Hello! I'm your AI Tutor.</p>
                <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                  Ask me anything about Physical AI, ROS 2, NVIDIA Isaac Sim, or VLA models.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '8px',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isUser ? '#dbeafe' : '#e0e7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {isUser
                      ? <User size={14} color="#2563eb" />
                      : <Bot size={14} color="#4f46e5" />
                    }
                  </div>

                  {/* Bubble */}
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    maxWidth: '82%',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    wordBreak: 'break-word',
                    backgroundColor: isUser ? '#2563eb' : 'white',
                    color: isUser ? 'white' : '#1e293b',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}>
                    {isUser ? msg.text : renderMarkdown(msg.text)}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '36px' }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '10px 14px',
                  borderRadius: '16px 16px 16px 4px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#94a3b8',
                  fontSize: '0.875rem',
                }}>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  Thinking…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={styles.inputArea}>
            <input
              type="text"
              style={styles.input}
              placeholder="Ask about Physical AI…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              style={{
                ...styles.sendButton,
                opacity: loading || !input.trim() ? 0.5 : 1,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              }}
              disabled={loading || !input.trim()}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={styles.toggleButton}
          title="Open AI Tutor"
        >
          <Bot size={26} />
        </button>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
