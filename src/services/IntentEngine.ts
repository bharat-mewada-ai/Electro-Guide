import type { Intent } from '../types/intent';
import { fetchWithAuth } from '../lib/api';

interface IntentResult {
  intent: Intent;
  confidence: number;
  reasoning: string;
}

export const detectIntent = async (input: string): Promise<IntentResult> => {
  try {
    const res = await fetchWithAuth('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message: input })
    });
    return res;
  } catch (error) {
    return {
      intent: 'GENERAL',
      confidence: 0,
      reasoning: 'Error connecting to AI engine.'
    };
  }
};

export const getResponseForIntent = (intent: Intent, userName: string, state: string): string => {
  const responses: Record<Intent, string> = {
    'REGISTRATION_INTENT': `Namaste ${userName}! To register in ${state}, you need to fill Form 6. I've prepared a checklist of documents you'll need below.`,
    'PROCEDURAL_GUIDE': `Voting in ${state} is a standardized 4-step process. Would you like to start a visual simulation of the polling booth right now?`,
    'SIMULATION_REQUEST': "Excellent choice. Initiating the Polling Day Simulation module. Please follow the instructions on your screen.",
    'MISINFORMATION_CHECK': "Integrity is key. I've analyzed your query against my database of verified election facts. Check the analysis in the right panel.",
    'LOCATION_SERVICE': `I'm locating the polling booths in ${state}. Based on typical patterns, your booth will be at a nearby government school. Want to see the map?`,
    'INFORMATION_QUERY': `Researching candidates for your constituency in ${state}. Knowledge is your greatest tool in a democracy.`,
    'GENERAL': `Hello ${userName}, I am here to help you navigate the upcoming elections in ${state}. What's on your mind?`
  };

  return responses[intent] || responses['GENERAL'];
};
