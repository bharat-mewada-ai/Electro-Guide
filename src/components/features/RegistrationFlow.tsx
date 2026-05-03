import React from 'react';
import { FileText, ClipboardList, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegistrationFlow: React.FC = () => {
  const docs = [
    'Proof of Identity (Aadhar Card, PAN, etc.)',
    'Proof of Address (Utility Bill, Passport)',
    'Proof of Age (18+ as of Jan 1st)',
    'Recent Passport Size Photo'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass"
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        marginTop: '12px',
        border: '1px solid var(--border-subtle)',
        background: 'rgba(99, 102, 241, 0.05)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <ClipboardList size={18} color="var(--bg-accent)" />
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Registration Checklist</h4>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {docs.map((doc, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={12} color="var(--text-muted)" />
            </div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{doc}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.open('https://voters.eci.gov.in/', '_blank')}
        style={{
          width: '100%',
          background: 'var(--bg-accent)',
          color: 'white',
          padding: '10px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <FileText size={16} />
        Start Registration (Form 6)
      </button>
      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
        You will be redirected to the official ECI portal.
      </p>
    </motion.div>
  );
};
