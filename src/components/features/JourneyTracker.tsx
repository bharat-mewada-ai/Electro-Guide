import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const JourneyTracker: React.FC = () => {
  const { journeySteps } = useAppStore();

  return (
    <div 
      role="progressbar"
      aria-label="Election Journey Progress"
      style={{
        padding: '24px',
        marginBottom: '24px',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        {/* Connector Line */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '40px',
          right: '40px',
          height: '2px',
          background: 'var(--border-subtle)',
          zIndex: 0
        }} aria-hidden="true" />
        
        {journeySteps.map((step) => (
          <div key={step.id} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '8px',
            zIndex: 1,
            width: '100px',
            textAlign: 'center'
          }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              role="status"
              aria-label={`${step.title} is ${step.status}`}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step.status === 'completed' ? '#10b981' : step.status === 'active' ? 'var(--bg-accent)' : 'var(--bg-surface-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: step.status === 'active' ? '4px solid rgba(99, 102, 241, 0.2)' : 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {step.status === 'completed' ? <CheckCircle2 size={20} /> : step.status === 'active' ? <Clock size={20} /> : <Circle size={20} />}
            </motion.div>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: step.status === 'active' ? 700 : 500,
              color: step.status === 'active' ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
