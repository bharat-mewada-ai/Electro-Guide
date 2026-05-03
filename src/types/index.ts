export * from './intent';

export type UserType = 'Beginner' | 'General';

export interface UserContext {
  name: string;
  location: {
    state: string;
    city: string;
  };
  registrationStatus: 'Registered' | 'Not Registered' | 'Unknown';
  userType: UserType;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: any; // Temporarily any to avoid import issues
  timestamp: number;
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}
