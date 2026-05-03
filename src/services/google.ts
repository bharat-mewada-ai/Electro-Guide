import { fetchWithAuth } from '../lib/api';

export interface PollingBooth {
  lat: number;
  lng: number;
  address: string;
  nearbyBooths?: Array<{
    name: string;
    distance: string;
  }>;
}

export interface CalendarReminderResponse {
  success: boolean;
  message: string;
  scheduledAt: string;
  eventLink?: string;
}

/**
 * Service for interacting with Google-related election tools and free Map alternatives.
 */
export const GoogleServices = {
  /**
   * Fetches the nearest polling booth for the user's location/state.
   */
  getNearestBooth: async (state: string): Promise<PollingBooth> => {
    try {
      return await fetchWithAuth<PollingBooth>(`/google/booth?state=${encodeURIComponent(state)}`);
    } catch (error) {
      console.error('Failed to fetch booth:', error);
      // Fallback coordinates for Maharashtra/Mumbai
      return {
        lat: 19.0760,
        lng: 72.8777,
        address: "Government School, Near Market Square (Fallback Location)"
      };
    }
  },

  /**
   * Schedules an election reminder.
   */
  setElectionReminder: async (state: string, date?: string): Promise<CalendarReminderResponse> => {
    return fetchWithAuth<CalendarReminderResponse>('/google/calendar/reminder', {
      method: 'POST',
      body: JSON.stringify({ state, electionDate: date })
    });
  },

  /**
   * Helper to open external maps
   */
  getExternalMapLink: (state: string) => {
    return `https://www.google.com/maps/search/polling+booth+in+${encodeURIComponent(state)}`;
  }
};

