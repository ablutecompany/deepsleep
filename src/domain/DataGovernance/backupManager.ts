import { getManualLogs } from '../Phase1/manualLogStore';
import { getSensingSessions } from '../Sensing/store';
import { getTelemetryLogs } from '../Telemetry/tracker';
import { getBetaFeedbackRecords } from '../Telemetry/betaFeedbackStore';

export interface AppLocalSnapshot {
  schemaVersion: number;
  appVersion: string;
  installationId: string;
  exportedAt: string;
  payload: {
    manualLogs: any[];
    profile: any | null;
    phase3Cycle: any | null;
    learningRecords: any[];
    sensingSessions: any[];
    telemetry: any[];
    betaFeedback: any[];
  };
}

const STORAGE_TEST_KEY = 'deepsleep_storage_test';
const AUTO_SNAPSHOT_KEY = 'deepsleep_auto_snapshot';

// 1. Deteção de Storage Frágil
export function verifyStorageHealth(): 'storage_ok' | 'storage_degraded' {
  try {
    localStorage.setItem(STORAGE_TEST_KEY, '1');
    localStorage.removeItem(STORAGE_TEST_KEY);
    return 'storage_ok';
  } catch (e) {
    return 'storage_degraded';
  }
}

// 2. Extração Centralizada
export function buildSnapshotPayload(): AppLocalSnapshot['payload'] {
  let profile = null;
  try { profile = JSON.parse(localStorage.getItem('deepsleep_profile_deliverable') || 'null'); } catch(e) {}
  
  let phase3 = null;
  try { phase3 = JSON.parse(localStorage.getItem('deepsleep_phase3_cycle') || 'null'); } catch(e) {}

  let learning = [];
  try { learning = JSON.parse(localStorage.getItem('deepsleep_learning_records') || '[]'); } catch(e) {}

  return {
    manualLogs: getManualLogs(),
    profile,
    phase3Cycle: phase3,
    learningRecords: learning,
    sensingSessions: getSensingSessions(),
    telemetry: getTelemetryLogs(),
    betaFeedback: getBetaFeedbackRecords(),
  };
}

export function generateSnapshotJSON(): string {
  let installationId = localStorage.getItem('deepsleep_installation_id');
  if (!installationId) {
    installationId = 'inst_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deepsleep_installation_id', installationId);
  }

  const snapshot: AppLocalSnapshot = {
    schemaVersion: 1,
    appVersion: 'beta-1.0',
    installationId,
    exportedAt: new Date().toISOString(),
    payload: buildSnapshotPayload()
  };

  return JSON.stringify(snapshot, null, 2);
}

// 3. Auto-Snapshot Defensivo
export function saveDefensiveSnapshot() {
  if (verifyStorageHealth() === 'storage_degraded') return;
  const snapStr = generateSnapshotJSON();
  localStorage.setItem(AUTO_SNAPSHOT_KEY, snapStr);
}

export function getLastDefensiveSnapshotDate(): string | null {
  try {
    const data = localStorage.getItem(AUTO_SNAPSHOT_KEY);
    if (!data) return null;
    const snap = JSON.parse(data) as AppLocalSnapshot;
    return snap.exportedAt;
  } catch(e) {
    return null;
  }
}

// 4. Restore Controlado (Substituição Total Segura)
export function restoreFromSnapshot(jsonStr: string): boolean {
  try {
    const snap = JSON.parse(jsonStr) as AppLocalSnapshot;
    if (snap.schemaVersion !== 1) {
      throw new Error("Schema version logicamente incompatível com esta build.");
    }
    
    if (!snap.payload) throw new Error("Payload vazio.");

    // Evaporar e Re-escrever cirurgicamente
    localStorage.setItem('manualNightLogs', JSON.stringify(snap.payload.manualLogs || []));
    
    if (snap.payload.profile) {
      localStorage.setItem('deepsleep_profile_deliverable', JSON.stringify(snap.payload.profile));
    } else {
      localStorage.removeItem('deepsleep_profile_deliverable');
    }

    if (snap.payload.phase3Cycle) {
      localStorage.setItem('deepsleep_phase3_cycle', JSON.stringify(snap.payload.phase3Cycle));
    } else {
      localStorage.removeItem('deepsleep_phase3_cycle');
    }

    localStorage.setItem('deepsleep_learning_records', JSON.stringify(snap.payload.learningRecords || []));
    localStorage.setItem('deepsleep_sensing_sessions', JSON.stringify(snap.payload.sensingSessions || []));
    localStorage.setItem('deepsleep_telemetry_v1', JSON.stringify(snap.payload.telemetry || []));
    localStorage.setItem('deepsleep_beta_feedback_v1', JSON.stringify(snap.payload.betaFeedback || []));

    return true;
  } catch (e: any) {
    console.error("Falha a restaurar snapshot:", e);
    return false;
  }
}
