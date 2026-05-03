import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { detectIntent, getResponseForIntent } from '../../services/IntentEngine';
import { RegistrationFlow } from './RegistrationFlow';

export const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [showReasoning, setShowReasoning] = useState<Record<string, boolean>>({});
  const { messages, addMessage, userContext, setIntent } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleReasoning = (id: string) => {
    setShowReasoning(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    addMessage({ role: 'user', content: userMessage });

    const { intent, confidence, reasoning } = await detectIntent(userMessage);
    setIntent(intent);

    setTimeout(() => {
      const aiResponse = getResponseForIntent(intent, userContext.name, userContext.location.state);
      addMessage({ 
        role: 'assistant', 
        content: aiResponse, 
        intent: intent,
        confidence: confidence,
        reasoning: reasoning
      });
    }, 800);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: 'rgba(255, 255, 255, 0.01)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden'
    }}>
      <div 
        ref={scrollRef}
        role="log"
        aria-label="Chat history"
        aria-live="polite"
        aria-relevant="additions"
        style={{ 
          flex: 1, 
          padding: '24px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px' 
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              aria-live={msg.role === 'assistant' ? 'polite' : 'off'}
              style={{
                display: 'flex',
                gap: '12px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <div 
                aria-hidden="true"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: msg.role === 'assistant' ? 'var(--bg-accent)' : 'var(--bg-surface-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {msg.role === 'assistant' ? <Bot size={18} color="white" /> : <User size={18} color="var(--text-secondary)" />}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '85%' }}>
                {msg.intent && msg.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      fontSize: '0.65rem', 
                      fontWeight: 800, 
                      color: 'var(--bg-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      textTransform: 'uppercase',
                      background: 'rgba(99, 102, 241, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '100px'
                    }}>
                      <Sparkles size={10} aria-hidden="true" />
                      {msg.intent.replace('_', ' ')}
                    </div>
                    {msg.confidence && (
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Confidence: {(msg.confidence * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                )}
                
                <div 
                  role="article"
                  aria-label={`${msg.role} message at ${new Date().toLocaleTimeString()}`}
                  style={{
                    padding: '16px',
                    borderRadius: msg.role === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                    background: msg.role === 'user' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9375rem',
                    lineHeight: '1.6',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {msg.content}
                  
                  {msg.intent === 'REGISTRATION_INTENT' && msg.role === 'assistant' && (
                    <RegistrationFlow />
                  )}

                  {/* AI Reasoning Section */}
                  {msg.role === 'assistant' && msg.reasoning && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                      <button 
                        onClick={() => toggleReasoning(msg.id)}
                        aria-expanded={showReasoning[msg.id]}
                        aria-controls={`reasoning-${msg.id}`}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          fontSize: '0.75rem', 
                          color: 'var(--bg-accent)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                          padding: '4px 0'
                        }}
                      >
                        <BrainCircuit size={12} aria-hidden="true" />
                        {showReasoning[msg.id] ? 'Hide Logic' : 'View AI Reasoning'}
                        {showReasoning[msg.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                      
                      <AnimatePresence>
                        {showReasoning[msg.id] && (
                          <motion.div
                            id={`reasoning-${msg.id}`}
                            role="region"
                            aria-label="AI Reasoning Details"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ 
                              marginTop: '8px', 
                              padding: '10px', 
                              background: 'rgba(0,0,0,0.2)', 
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.8125rem',
                              color: 'var(--text-secondary)',
                              fontStyle: 'italic',
                              lineHeight: 1.4
                            }}>
                              {msg.reasoning}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div style={{ 
        padding: '24px', 
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(0,0,0,0.1)' 
      }}>
        <div 
          role="search"
          aria-label="Ask ElectiGuide"
          style={{ 
            display: 'flex', 
            gap: '12px', 
            background: 'var(--bg-surface-light)',
            padding: '10px 10px 10px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            alignItems: 'center',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            aria-label="Question input"
            placeholder="Type your question (e.g. 'How to register')"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.9375rem',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSend}
            aria-label="Send message"
            style={{
              background: 'var(--bg-accent)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span>Ask</span>
            <Send size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
