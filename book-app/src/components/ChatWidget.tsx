import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

export interface ChatWidgetProps {}

const ChatWidget: React.FC<ChatWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    const currentSkill = skillLevel; 

    // 1. Immediate UI Update (Fixes Lag)
    // We clear the input first so the UI feels instant
    setInput('');
    setMessages((prev) => [...prev, `You: ${userMessage}`]);
    setLoading(true);

    try {
      // 2. Send Request to Backend
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: userMessage,
            skillLevel: currentSkill 
        }),
      });

      // 3. Safe JSON Parsing (Fixes Undefined Error)
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Robust fallback for different JSON structures
      const botReply = data.response || data.answer || data.reply || "Sorry, I received an empty response.";
      
      setMessages((prev) => [...prev, `Bot: ${botReply}`]);

    } catch (error) {
      console.error('Chat Error:', error);
      let errorMessage = 'Connection error. Please ensure the backend server (uvicorn) is running.';
      if (error instanceof TypeError) {
        errorMessage = `Network Error: ${error.message}. Is the backend running and accessible at http://localhost:8000?`;
      } else if (error instanceof Error) {
        errorMessage = `Backend Error: ${error.message}`;
      }
    } finally {
      setLoading(false);
    }
  };

  // Inline Styles (No Tailwind Required)
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    button: {
      backgroundColor: '#2563eb',
      color: 'white',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s',
    },
    window: {
      position: 'absolute',
      bottom: '80px',
      right: '0',
      width: '350px',
      height: '500px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 5px 40px rgba(0,0,0,0.16)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
    },
    header: {
      padding: '15px',
      background: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    messagesArea: {
      flex: 1,
      padding: '15px',
      overflowY: 'auto',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    messageBubble: {
      padding: '10px 14px',
      borderRadius: '12px',
      maxWidth: '85%',
      fontSize: '14px',
      lineHeight: '1.5',
      wordWrap: 'break-word',
    },
    inputArea: {
      padding: '15px',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      gap: '8px',
      backgroundColor: '#f8fafc',
    },
    input: {
      flex: 1,
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #cbd5e1',
      outline: 'none',
      fontSize: '14px',
    },
    sendButton: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0 15px',
      cursor: 'pointer',
      fontWeight: 'bold',
    }
  };

  return (
    <div style={styles.container}>
      {isOpen ? (
        <div style={styles.window}>
          {/* Header */}
          <div style={styles.header}>
            <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>AI Assistant</h3>
                <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>
                    {skillLevel} Mode
                </span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
          </div>

          {/* Chat History */}
          <div style={styles.messagesArea}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>
                <MessageSquare size={40} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <p>Hello! I am your AI Tutor.</p>
                <p style={{ fontSize: '12px' }}>Ask me anything about Physical AI.</p>
              </div>
            )}
            
            {messages.map((msg, idx) => {
              const isUser = msg.startsWith("You:");
              const text = msg.replace(/^(You:|Bot:)\s*/, "");
              
              return (
                <div key={idx} style={{
                  ...styles.messageBubble,
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  backgroundColor: isUser ? '#2563eb' : '#f1f5f9',
                  color: isUser ? 'white' : '#1e293b',
                  borderBottomRightRadius: isUser ? '2px' : '12px',
                  borderBottomLeftRadius: isUser ? '12px' : '2px',
                }}>
                  {text}
                </div>
              );
            })}
            
            {loading && (
                <div style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Loader2 className="animate-spin" size={14} />
                    <span>Thinking...</span>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={styles.inputArea}>
            <input
              type="text"
              style={styles.input}
              placeholder="Type a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
            />
            <button 
                onClick={handleSendMessage} 
                style={{...styles.sendButton, opacity: loading || !input.trim() ? 0.7 : 1 }}
                disabled={loading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} style={styles.button}>
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;