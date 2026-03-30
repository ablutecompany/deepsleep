import type { EventType, UsageEvidenceRecord } from './types';
import { appClock } from '../../utils/appClock';

const STORAGE_KEY = 'deepsleep_telemetry_logs';

export function getTelemetryLogs(): UsageEvidenceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveTelemetryLog(log: UsageEvidenceRecord) {
  const all = getTelemetryLogs();
  all.push(log);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function clearTelemetryLogs() {
  localStorage.removeItem(STORAGE_KEY);
}

export function trackEvent(
  eventType: EventType,
  metadata?: Partial<Omit<UsageEvidenceRecord, 'id' | 'eventType' | 'timestamp' | 'appDateString'>>
) {
  const log: UsageEvidenceRecord = {
    id: 'evt_' + crypto.randomUUID(),
    eventType,
    timestamp: new Date().toISOString(),
    appDateString: appClock.todayStr(),
    route: window.location.pathname,
    ...metadata
  };
  saveTelemetryLog(log);
}

// Timer Hooks helper for views
const startTimes = new Map<string, number>();

export function startTimer(featureKey: string) {
  startTimes.set(featureKey, Date.now());
}

export function endTimer(featureKey: string): number | undefined {
  const start = startTimes.get(featureKey);
  if (start) {
    const durationMs = Date.now() - start;
    startTimes.delete(featureKey);
    return durationMs;
  }
  return undefined;
}
