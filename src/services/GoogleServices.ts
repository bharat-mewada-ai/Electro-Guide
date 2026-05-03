import { fetchWithAuth } from '../lib/api';

export const GoogleMapsService = {
  getBoothCoordinates: async (state: string) => {
    try {
      const data = await fetchWithAuth(`/google/booth?state=${state}`);
      return data;
    } catch (error) {
      console.error('Failed to get booth coordinates:', error);
      return { lat: 28.6139, lng: 77.2090 }; // Default fallback
    }
  },
  
  getBoothLink: (state: string) => {
    return `https://www.google.com/maps/search/polling+booth+in+${state}`;
  }
};

export const GoogleCalendarService = {
  createElectionReminder: async (state: string) => {
    try {
      const data = await fetchWithAuth('/google/calendar/reminder', {
        method: 'POST',
        body: JSON.stringify({ state })
      });
      return data;
    } catch (error) {
      console.error('Failed to create election reminder:', error);
      return { success: false };
    }
  }
};
