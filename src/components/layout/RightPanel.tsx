import React, { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, Calendar, ExternalLink, Info, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { ELECTION_DATES } from '../../constants';
import { GoogleServices } from '../../services/google';
import type { PollingBooth } from '../../services/google';
import { BoothMap } from '../features/BoothMap';

export const RightPanel: React.FC = () => {
  const { userContext, reminderSet, setReminderSet } = useAppStore();
  const [misinfoInput, setMisinfoInput] = useState('');
  const [verdict, setVerdict] = useState<{status: string, color: string, explanation: string} | null>(null);
  const [isReminderLoading, setIsReminderLoading] = useState(false);
  const [booth, setBooth] = useState<PollingBooth | null>(null);

  const userState = userContext.location.state;
  const electionInfo = ELECTION_DATES.find(d => d.state === userState) || ELECTION_DATES[0];

  useEffect(() => {
    const loadBooth = async () => {
      const data = await GoogleServices.getNearestBooth(userState);
      setBooth(data);
    };
    loadBooth();
  }, [userState]);

  const handleSetReminder = async () => {
    setIsReminderLoading(true);
    try {
      await GoogleServices.setElectionReminder(userState);
      setReminderSet(true);
      setTimeout(() => setReminderSet(false), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReminderLoading(false);
    }
  };

  const handleOpenMaps = () => {
    const link = GoogleServices.getExternalMapLink(userState);
    window.open(link, '_blank');
  };

  const checkMisinfo = async () => {
    if (!misinfoInput.trim()) return;
    
    try {
      const res = await fetch('http://localhost:3000/api/misinfo/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ claim: misinfoInput })
      });
      const data = await res.json();
      setVerdict(data);
    } catch (e) {
      setVerdict({
        status: 'ERROR',
        color: '#ef4444',
        explanation: 'Failed to connect to verification server.'
      });
    }
  };

  return (
    <aside style={{ width: '320px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Misinfo Checker */}
      <section className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <ShieldAlert size={20} color="var(--bg-accent)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Misinfo Checker</h3>
        </div>
        
        <textarea
          value={misinfoInput}
          onChange={(e) => setMisinfoInput(e.target.value)}
          placeholder="Paste message or claim here..."
          style={{
            width: '100%',
            height: '80px',
            background: 'var(--bg-surface-light)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            resize: 'none',
            marginBottom: '12px'
          }}
        />
        
        <button
          onClick={checkMisinfo}
          style={{
            width: '100%',
            background: 'var(--bg-accent)',
            color: 'white',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          Check Claim
        </button>

        {verdict && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              marginTop: '16px', 
              padding: '12px', 
              borderRadius: 'var(--radius-md)', 
              background: 'rgba(255,255,255,0.03)',
              borderLeft: `4px solid ${verdict.color}`
            }}
          >
            <div style={{ fontWeight: 800, color: verdict.color, fontSize: '0.75rem', marginBottom: '4px' }}>
              VERDICT: {verdict.status}
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{verdict.explanation}</p>
          </motion.div>
        )}
      </section>

      {/* Live Map */}
      {booth && (
        <section className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <MapPin size={20} color="var(--bg-accent)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Nearest Booth</h3>
          </div>
          <BoothMap lat={booth.lat} lng={booth.lng} address={booth.address} />
          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {booth.address}
          </div>
        </section>
      )}

      {/* Quick Tools */}
      <section className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Quick Tools</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div 
            onClick={handleOpenMaps}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px', 
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
          >
            <MapPin size={18} color="var(--text-muted)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Polling Booth</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Find near {userState}</div>
            </div>
            <ExternalLink size={14} color="var(--text-muted)" />
          </div>

          <div 
            onClick={handleSetReminder}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px', 
              borderRadius: 'var(--radius-md)',
              background: reminderSet ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
              border: reminderSet ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              cursor: isReminderLoading ? 'wait' : 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {reminderSet ? <CheckCircle2 size={18} color="#10b981" /> : <Calendar size={18} color="var(--text-muted)" />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Election Date</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {electionInfo.date} ({userState})
              </div>
            </div>
            {reminderSet ? (
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>SET!</span>
            ) : (
              <Clock size={14} color="var(--text-muted)" />
            )}
            
            {isReminderLoading && (
              <motion.div 
                layoutId="loader"
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--bg-accent)' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Pro Tip */}
      <div style={{ 
        marginTop: 'auto',
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Info size={16} color="var(--bg-accent)" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>PRO TIP</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', opacity: 0.8 }}>
          Carry your EPIC ID and a secondary photo proof to the polling booth for faster verification.
        </p>
      </div>
    </aside>
  );
};
