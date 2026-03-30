import { getManualLogs } from '../Phase1/manualLogStore';
import { getSensingSessions } from '../Sensing/store';
import { trackEvent } from '../Telemetry/tracker';

export function evaporateNightCascade(logId: string) {
  // 1. Apagar do histórico
  const logs = getManualLogs();
  const targetLog = logs.find(l => l.id === logId);
  if (!targetLog) return;
  
  const updatedLogs = logs.filter(l => l.id !== logId);
  localStorage.setItem('manualNightLogs', JSON.stringify(updatedLogs));

  // 2. Cascade para Sessões Acústicas (Órfãos)
  const sensing = getSensingSessions();
  let modifiedSensing = false;
  sensing.forEach(sess => {
    if (sess.linkedNightId === targetLog.dateStr) {
      sess.linkedNightId = null;
      sess.contaminationReasons.push('user_deleted_night' as any);
      sess.summary = {
         verdict: 'insufficient_data',
         dominantDisturbance: 'O registo manual da noite foi apagado. Contexto irremediavelmente perdido.'
      };
      sess.qualityState = 'unusable';
      modifiedSensing = true;
    }
  });
  if (modifiedSensing) {
    localStorage.setItem('deepsleep_sensing_sessions', JSON.stringify(sensing));
  }

  // 3. Recalcular Gating
  const validCount = updatedLogs.filter(l => l.sleepType === 'NIGHT' && l.countsForBaseline).length;
  localStorage.setItem('nightCount', validCount.toString());

  if (validCount < 5) {
    // Invalidação completa estrutural
    localStorage.removeItem('deepsleep_phase2_deliverable');
    localStorage.removeItem('deepsleep_phase2_context');
    localStorage.removeItem('deepsleep_phase3_cycle');
    trackEvent('baseline_invalidated', { payload: 'drop_below_5' });
    window.dispatchEvent(new Event('deepsleep_baseline_invalidated'));
  }
}

export function evaporateAcousticSession(sessionId: string) {
  const sessions = getSensingSessions();
  const filtered = sessions.filter(s => s.id !== sessionId);
  localStorage.setItem('deepsleep_sensing_sessions', JSON.stringify(filtered));
  trackEvent('destructive_action_triggered', { payload: 'sensing_session_deleted' });
}

export function wipeEntireProfile() {
  // Clear Core Profile
  localStorage.removeItem('manualNightLogs');
  localStorage.removeItem('nightCount');
  
  // Clear Phase 2 & 3
  localStorage.removeItem('deepsleep_phase2_context');
  localStorage.removeItem('deepsleep_phase2_deliverable');
  localStorage.removeItem('deepsleep_phase3_cycle');
  localStorage.removeItem('deepsleep_learning_records');
  
  // Clear Acústica
  localStorage.removeItem('deepsleep_sensing_sessions');
  
  // Clear Beta Tools / Time Simulation
  localStorage.removeItem('deepsleep_simulated_time');
  
  trackEvent('destructive_action_triggered', { payload: 'factory_reset' });

  // Optional: Do not clear telemetry immediately to allow analysis of the drop off
  // But strictly speaking, profile data is gone. A user might want full wipe:
  // localStorage.removeItem('deepsleep_telemetry_logs');
  
  window.dispatchEvent(new Event('deepsleep_baseline_invalidated'));
}

export function verifyHydrationIntegrity() {
  // 1. Check if phase 2/3 exists but no manual logs or baseline is too low
  const logs = getManualLogs();
  const validCount = logs.filter(l => l.sleepType === 'NIGHT' && l.countsForBaseline).length;
  
  const hasPhase2 = !!localStorage.getItem('deepsleep_phase2_deliverable');
  const hasPhase3 = !!localStorage.getItem('deepsleep_phase3_cycle');
  
  if (validCount < 5 && (hasPhase2 || hasPhase3)) {
    // Estado Absurdo / Resíduo Híbrido
    localStorage.removeItem('deepsleep_phase2_deliverable');
    localStorage.removeItem('deepsleep_phase2_context');
    localStorage.removeItem('deepsleep_phase3_cycle');
    trackEvent('destructive_action_triggered', { payload: 'hydration_integrity_purge' });
  }

  // 2. Check Acoustic Sessions Orphaning blindly
  const sessions = getSensingSessions();
  let changed = false;
  sessions.forEach(sess => {
    if (sess.linkedNightId && !logs.find(l => l.dateStr === sess.linkedNightId)) {
       sess.linkedNightId = null;
       if (!sess.contaminationReasons.includes('user_deleted_night' as any)) {
          sess.contaminationReasons.push('user_deleted_night' as any);
          sess.summary = { verdict: 'insufficient_data', dominantDisturbance: 'Registo basal ausente.' };
       }
       changed = true;
    }
  });

  if (changed) {
    localStorage.setItem('deepsleep_sensing_sessions', JSON.stringify(sessions));
  }
}
