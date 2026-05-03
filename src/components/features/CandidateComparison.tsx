import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Briefcase, Gavel, Award, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { fetchWithAuth } from '../../lib/api';

interface Candidate {
  name: string;
  party: string;
  education: string;
  assets: string;
  cases: number;
}

export const CandidateComparison: React.FC = () => {
  const { userContext } = useAppStore();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth(`/candidates?state=${userContext.location.state}`);
        setCandidates(data);
        setError(null);
      } catch (err) {
        setError('Failed to load candidates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, [userContext.location.state]);

  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="var(--bg-accent)" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Candidate Comparison</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Showing candidates for your constituency in <strong>{userContext.location.state}</strong>.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {candidates.map((candidate, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'var(--bg-surface-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-accent)'
              }}>
                <Users size={32} color="var(--bg-accent)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{candidate.name}</h3>
                <div style={{ 
                  fontSize: '0.8125rem', 
                  color: 'var(--bg-accent)', 
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {candidate.party}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem' }}>
                <GraduationCap size={16} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-secondary)' }}>Education:</span>
                <span style={{ fontWeight: 600 }}>{candidate.education}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem' }}>
                <Briefcase size={16} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-secondary)' }}>Assets:</span>
                <span style={{ fontWeight: 600 }}>{candidate.assets}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem' }}>
                <Gavel size={16} color={candidate.cases > 0 ? '#ef4444' : '#10b981'} />
                <span style={{ color: 'var(--text-secondary)' }}>Criminal Cases:</span>
                <span style={{ fontWeight: 600, color: candidate.cases > 0 ? '#ef4444' : '#10b981' }}>{candidate.cases}</span>
              </div>
            </div>

            <button style={{
              marginTop: 'auto',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-subtle)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <Award size={16} />
              View Manifesto
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
