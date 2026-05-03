import { useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { RightPanel } from './components/layout/RightPanel';
import { JourneyTracker } from './components/features/JourneyTracker';
import { ChatInterface } from './components/features/ChatInterface';
import { VotingSimulation } from './components/features/VotingSimulation';
import { CandidateComparison } from './components/features/CandidateComparison';
import { ProfileEditor } from './components/features/ProfileEditor';
import { useAppStore } from './store/useAppStore';

function App() {
  const { currentView, initializeStore } = useAppStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return <ProfileEditor />;
      case 'candidates':
        return <CandidateComparison />;
      case 'home':
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <JourneyTracker />
            <div style={{ flex: 1, minHeight: 0 }}>
              <ChatInterface />
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      background: 'var(--bg-main, #0a0b10)', 
      color: 'var(--text-primary, white)',
      overflow: 'hidden'
    }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '24px',
        overflow: 'hidden'
      }}>
        {renderContent()}
      </main>
      <RightPanel />
      <VotingSimulation />
    </div>
  );
}

export default App;
