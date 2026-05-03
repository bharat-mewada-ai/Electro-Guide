import { create } from 'zustand';
import type { Intent } from '../types/intent';
import type { UserContext, Message, JourneyStep } from '../types';
import { fetchWithAuth } from '../lib/api';

interface AppMessage extends Message {
  reasoning?: string;
  confidence?: number;
}

interface AppState {
  userContext: UserContext;
  messages: AppMessage[];
  currentIntent: Intent | null;
  journeySteps: JourneyStep[];
  isSimulationActive: boolean;
  currentView: 'home' | 'journey' | 'candidates' | 'misinfo' | 'simulate' | 'profile';
  reminderSet: boolean;
  
  // Actions
  initializeStore: () => Promise<void>;
  setUserContext: (context: Partial<UserContext>) => Promise<void>;
  addMessage: (message: Omit<AppMessage, 'id' | 'timestamp'>) => void;
  setIntent: (intent: Intent | null) => void;
  updateJourneyStep: (id: string, status: JourneyStep['status']) => Promise<void>;
  setSimulationActive: (active: boolean) => void;
  setView: (view: AppState['currentView']) => void;
  setReminderSet: (set: boolean) => void;
  resetMessages: () => void;
}

const DEFAULT_STEPS: JourneyStep[] = [
  { id: '1', title: 'Registration', description: 'Ensure you are on the electoral roll', status: 'active' },
  { id: '2', title: 'Deadlines', description: 'Check upcoming election dates', status: 'pending' },
  { id: '3', title: 'Compare Candidates', description: 'Research your local candidates', status: 'pending' },
  { id: '4', title: 'Prepare to Vote', description: 'Find your booth and ID cards', status: 'pending' },
  { id: '5', title: 'Polling Day', description: 'Cast your vote at the booth', status: 'pending' },
];

export const useAppStore = create<AppState>((set, get) => ({
  userContext: {
    name: 'Voter',
    location: { state: 'Maharashtra', city: 'Mumbai' },
    registrationStatus: 'Unknown',
    userType: 'Beginner',
  },
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: 'Namaste! I am ElectiGuide AI. I can help you with registration, polling day procedures, and verifying election claims. How can I help you today?',
      intent: 'GENERAL',
      timestamp: Date.now(),
      reasoning: 'Initial greeting state.'
    }
  ],
  currentIntent: null,
  journeySteps: DEFAULT_STEPS,
  isSimulationActive: false,
  currentView: 'home',
  reminderSet: false,

  initializeStore: async () => {
    try {
      const profile = await fetchWithAuth('/user/profile');
      const journey = await fetchWithAuth('/user/journey');
      
      set((state) => ({
        userContext: { 
          ...state.userContext, 
          name: profile.name, 
          location: { ...state.userContext.location, state: profile.state } 
        },
        journeySteps: journey.length > 0 ? journey.map((j: any) => ({
          id: j.stepId,
          title: j.title,
          description: j.description,
          status: j.status
        })) : DEFAULT_STEPS
      }));
    } catch (error) {
      console.error('Failed to initialize store:', error);
    }
  },

  setUserContext: async (context) => {
    set((state) => ({ 
      userContext: { ...state.userContext, ...context } 
    }));

    try {
      const { userContext } = get();
      await fetchWithAuth('/user/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: userContext.name,
          state: userContext.location.state
        })
      });
    } catch (error) {
      console.error('Failed to sync profile:', error);
    }
  },

  addMessage: (message) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...message,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
      },
    ],
  })),

  setIntent: (intent) => set({ currentIntent: intent }),

  updateJourneyStep: async (id, status) => {
    set((state) => ({
      journeySteps: state.journeySteps.map((step) => 
        step.id === id ? { ...step, status } : step
      ),
    }));

    try {
      const step = get().journeySteps.find(s => s.id === id);
      if (step) {
        await fetchWithAuth(`/user/journey/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            status,
            title: step.title,
            description: step.description
          })
        });
      }
    } catch (error) {
      console.error('Failed to sync journey step:', error);
    }
  },

  setSimulationActive: (active) => set({ isSimulationActive: active }),

  setView: (view) => set({ currentView: view }),

  setReminderSet: (value) => set({ reminderSet: value }),

  resetMessages: () => set((state) => ({
    messages: [state.messages[0]]
  }))
}));
