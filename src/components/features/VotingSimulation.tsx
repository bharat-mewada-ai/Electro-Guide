import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const simulationSteps = [
  {
    title: 'Enter Polling Booth',
    description: 'Walk in and present your Identity Proof to the first polling officer.',
    image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=400&h=250&auto=format&fit=crop'
  },
  {
    title: 'ID Verification',
    description: 'The officer will check your name on the electoral roll and mark your finger with ink.',
    image: 'https://images.unsplash.com/photo-1540910419892-f0c742c32463?q=80&w=400&h=250&auto=format&fit=crop'
  },
  {
    title: 'Cast Your Vote',
    description: 'Press the button on the EVM next to the candidate of your choice. A beep will sound.',
    image: 'https://images.unsplash.com/photo-1622675363200-721836652432?q=80&w=400&h=250&auto=format&fit=crop'
  },
  {
    title: 'Verify VVPAT',
    description: 'Check the VVPAT glass for 7 seconds to confirm your vote was recorded correctly.',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6ac7a20?q=80&w=400&h=250&auto=format&fit=crop'
  }
];

export const VotingSimulation: React.FC = () => {
  const { isSimulationActive, setSimulationActive } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isSimulationActive) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="simulation-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%',
          maxWidth: '600px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          position: 'relative'
        }}
      >
        <button
          onClick={() => setSimulationActive(false)}
          aria-label="Close simulation"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)',
            zIndex: 10
          }}
        >
          <X size={24} />
        </button>

        <div style={{ height: '240px', background: '#000', overflow: 'hidden' }}>
          <img 
            src={simulationSteps[currentStep].image} 
            alt={`Illustration for ${simulationSteps[currentStep].title}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
        </div>

        <div style={{ padding: '40px' }}>
          <div 
            aria-hidden="true"
            style={{ 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              color: 'var(--bg-accent)', 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            Step {currentStep + 1} of {simulationSteps.length}
          </div>
          
          <h2 id="simulation-title" style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px' }}>
            {simulationSteps[currentStep].title}
          </h2>
          
          <p style={{ 
            fontSize: '1.0625rem', 
            color: 'var(--text-secondary)', 
            lineHeight: 1.6,
            marginBottom: '40px',
            minHeight: '80px'
          }}>
            {simulationSteps[currentStep].description}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              aria-label="Previous step"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: currentStep === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={20} aria-hidden="true" />
              Back
            </button>

            <button
              onClick={() => {
                if (currentStep === simulationSteps.length - 1) {
                  setSimulationActive(false);
                } else {
                  setCurrentStep(prev => prev + 1);
                }
              }}
              aria-label={currentStep === simulationSteps.length - 1 ? "Finish simulation" : "Next step"}
              style={{
                background: 'var(--bg-accent)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
              }}
            >
              {currentStep === simulationSteps.length - 1 ? (
                <>
                  <span>Finish</span>
                  <CheckCircle size={20} aria-hidden="true" />
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ArrowRight size={20} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div 
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={simulationSteps.length}
          aria-label="Simulation progress"
          style={{ height: '4px', background: 'var(--border-subtle)', width: '100%' }}
        >
          <motion.div 
            animate={{ width: `${((currentStep + 1) / simulationSteps.length) * 100}%` }}
            style={{ height: '100%', background: 'var(--bg-accent)' }}
          />
        </div>
      </motion.div>
    </div>
  );
};
