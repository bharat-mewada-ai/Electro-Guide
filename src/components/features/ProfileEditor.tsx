import React, { useState } from 'react';

import { User, MapPin, Save, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { INDIAN_STATES } from '../../constants';

export const ProfileEditor: React.FC = () => {
  const { userContext, setUserContext } = useAppStore();
  const [name, setName] = useState(userContext.name);
  const [state, setState] = useState(userContext.location.state);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setUserContext({
      name,
      location: { ...userContext.location, state }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '40px',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>
        Personalize Your Experience
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} /> Full Name
          </label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-light)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} /> Residential State
          </label>
          <select 
            value={state}
            onChange={(e) => setState(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-light)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
          >
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <button
          onClick={handleSave}
          style={{
            marginTop: '16px',
            background: saved ? '#10b981' : 'var(--bg-accent)',
            color: 'white',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'var(--transition-base)'
          }}
        >
          {saved ? <Check size={20} /> : <Save size={20} />}
          {saved ? 'Settings Saved' : 'Save Profile'}
        </button>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
          Your data is used locally to personalize AI responses and election dates.
        </p>
      </div>
    </div>
  );
};
