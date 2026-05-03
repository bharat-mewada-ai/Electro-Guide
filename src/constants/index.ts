import type { Intent } from '../types';

export const ELECTION_DATES = [
  { state: 'Andaman & Nicobar Islands', date: 'April 19, 2024', phase: 1 },
  { state: 'Andhra Pradesh', date: 'May 13, 2024', phase: 4 },
  { state: 'Arunachal Pradesh', date: 'April 19, 2024', phase: 1 },
  { state: 'Assam', date: 'April 19, 2024', phase: 1 },
  { state: 'Bihar', date: 'May 7, 2024', phase: 3 },
  { state: 'Chandigarh', date: 'June 1, 2024', phase: 7 },
  { state: 'Chhattisgarh', date: 'April 19, 2024', phase: 1 },
  { state: 'Dadra and Nagar Haveli and Daman and Diu', date: 'May 7, 2024', phase: 3 },
  { state: 'Delhi', date: 'May 25, 2024', phase: 6 },
  { state: 'Goa', date: 'May 7, 2024', phase: 3 },
  { state: 'Gujarat', date: 'May 7, 2024', phase: 3 },
  { state: 'Haryana', date: 'May 25, 2024', phase: 6 },
  { state: 'Himachal Pradesh', date: 'June 1, 2024', phase: 7 },
  { state: 'Jammu & Kashmir', date: 'May 13, 2024', phase: 4 },
  { state: 'Jharkhand', date: 'May 13, 2024', phase: 4 },
  { state: 'Karnataka', date: 'April 26, 2024', phase: 2 },
  { state: 'Kerala', date: 'April 26, 2024', phase: 2 },
  { state: 'Ladakh', date: 'May 20, 2024', phase: 5 },
  { state: 'Lakshadweep', date: 'April 19, 2024', phase: 1 },
  { state: 'Madhya Pradesh', date: 'April 19, 2024', phase: 1 },
  { state: 'Maharashtra', date: 'May 20, 2024', phase: 5 },
  { state: 'Manipur', date: 'April 19, 2024', phase: 1 },
  { state: 'Meghalaya', date: 'April 19, 2024', phase: 1 },
  { state: 'Mizoram', date: 'April 19, 2024', phase: 1 },
  { state: 'Nagaland', date: 'April 19, 2024', phase: 1 },
  { state: 'Odisha', date: 'May 13, 2024', phase: 4 },
  { state: 'Puducherry', date: 'April 19, 2024', phase: 1 },
  { state: 'Punjab', date: 'June 1, 2024', phase: 7 },
  { state: 'Rajasthan', date: 'April 19, 2024', phase: 1 },
  { state: 'Sikkim', date: 'April 19, 2024', phase: 1 },
  { state: 'Tamil Nadu', date: 'April 19, 2024', phase: 1 },
  { state: 'Telangana', date: 'May 13, 2024', phase: 4 },
  { state: 'Tripura', date: 'April 19, 2024', phase: 1 },
  { state: 'Uttar Pradesh', date: 'May 20, 2024', phase: 5 },
  { state: 'Uttarakhand', date: 'April 19, 2024', phase: 1 },
  { state: 'West Bengal', date: 'June 1, 2024', phase: 7 },
];

export const INDIAN_STATES = ELECTION_DATES.map(d => d.state).sort();

export const COMMON_MYTHS = [
  {
    keywords: ['hack', 'machine', 'evm'],
    verdict: 'FALSE',
    explanation: 'EVMs are standalone, non-networked machines with multi-layer hardware/software security. They are physically sealed and tested in front of political agents.',
    confidence: 0.99
  },
  {
    keywords: ['online', 'internet', 'whatsapp', 'mobile'],
    verdict: 'FALSE',
    explanation: 'India does not allow online or mobile voting. You must physically visit your designated polling booth with a valid ID.',
    confidence: 0.98
  },
  {
    keywords: ['ink', 'remove', 'chemical'],
    verdict: 'FALSE',
    explanation: 'Indelible ink is designed to stay for weeks. Attempting to remove it can damage the skin and is a punishable offense under election law.',
    confidence: 0.95
  },
  {
    keywords: ['holiday', 'work'],
    verdict: 'TRUE',
    explanation: 'Election day is a mandatory paid public holiday for all employees (including private sectors) to ensure everyone can vote.',
    confidence: 0.92
  }
];

export const INTENT_METADATA: Record<Intent, { title: string, color: string }> = {
  'REGISTRATION_INTENT': { title: 'Voter Registration', color: '#6366f1' },
  'INFORMATION_QUERY': { title: 'General Info', color: '#10b981' },
  'PROCEDURAL_GUIDE': { title: 'Voting Process', color: '#f59e0b' },
  'MISINFORMATION_CHECK': { title: 'Fact Checking', color: '#ef4444' },
  'SIMULATION_REQUEST': { title: 'Training Mode', color: '#8b5cf6' },
  'LOCATION_SERVICE': { title: 'Geo Services', color: '#06b6d4' },
  'GENERAL': { title: 'Assistant', color: '#94a3b8' }
};

export const MOCK_CANDIDATES = [
  { name: 'Aditi Sharma', party: 'Independent', education: 'PhD Economics', assets: '₹2.4 Cr', cases: 0 },
  { name: 'Rajesh Kumar', party: 'National Party', education: 'MA Law', assets: '₹12.5 Cr', cases: 1 },
  { name: 'Sarah Joseph', party: 'Social Alliance', education: 'Social Work', assets: '₹85 Lakh', cases: 0 },
];
