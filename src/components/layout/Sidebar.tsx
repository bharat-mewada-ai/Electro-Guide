import React from 'react';
import { Home, Users, ShieldCheck, PlayCircle, User, Vote } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'candidates', icon: Users, label: 'Compare Candidates' },
  { id: 'misinfo', icon: ShieldCheck, label: 'Misinformation Check' },
  { id: 'simulate', icon: PlayCircle, label: 'Simulate Voting' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export const Sidebar: React.FC = () => {
  const { currentView, setView, setSimulationActive } = useAppStore();

  const handleNav = (id: string) => {
    if (id === 'simulate') {
      setSimulationActive(true);
    } else {
      setView(id);
    }
  };

  return (
    <aside className="sidebar glass" style={{
      width: '260px',
      height: '100vh',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--border-subtle)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <div style={{ 
          background: 'var(--bg-accent)', 
          padding: '8px', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
        }}>
          <Vote size={24} color="white" />
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          ElectiGuide <span style={{ color: 'var(--bg-accent)' }}>AI</span>
        </h1>
      </div>

      <nav role="navigation" aria-label="Main Navigation" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            aria-label={item.label}
            aria-current={currentView === item.id ? 'page' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              color: currentView === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: currentView === item.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <item.icon size={20} strokeWidth={currentView === item.id ? 2.5 : 2} aria-hidden="true" />
            <span style={{ fontWeight: currentView === item.id ? 600 : 500 }}>{item.label}</span>
            {currentView === item.id && (
              <div style={{ 
                marginLeft: 'auto', 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--bg-accent)' 
              }} aria-hidden="true" />
            )}
          </button>
        ))}
      </nav>

      <div className="glass" style={{
        marginTop: 'auto',
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(255, 255, 255, 0.03)'
      }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>SYSTEM STATUS</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>AI Engine Active</span>
        </div>
      </div>
    </aside>
  );
};
