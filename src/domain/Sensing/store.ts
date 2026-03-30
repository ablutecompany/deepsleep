import type { SleepObservationSession } from './types';

const STORAGE_KEY = 'deepsleep_sensing_sessions';

export function getSensingSessions(): SleepObservationSession[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch(e) {
    return [];
  }
}

export function saveSensingSession(session: SleepObservationSession) {
  const all = getSensingSessions();
  
  // Auto-associate with a night based on startedAt
  // A night usually spans 20:00 to 12:00 next day.
  if (!session.linkedNightId) {
    const d = new Date(session.startedAt);
    const hour = d.getHours();
    
    let nightDateStr: string;
    if (hour >= 0 && hour < 14) {
      // It's past midnight, so the night belongs to the previous calendar day
      const prevDate = new Date(d.getTime() - 24 * 60 * 60 * 1000);
      nightDateStr = prevDate.toISOString().split('T')[0];
    } else {
      // It's evening, belongs to current calendar day
      nightDateStr = d.toISOString().split('T')[0];
    }
    
    session.linkedNightId = nightDateStr;
  }
  
  all.unshift(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
