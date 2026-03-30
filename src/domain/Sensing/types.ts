import type { SyncableBaseEntity } from '../CloudSync/contracts';

export type PermissionState = 'granted' | 'denied' | 'needs_user_action' | 'restricted' | 'not_determined';
export type CapabilityState = 'available' | 'unavailable' | 'battery_blocked' | 'hardware_degraded';
export type SignalQuality   = 'pristine' | 'degraded' | 'unusable';
export type CaptureMode     = 'acoustic_only' | 'multimodal';
export type ContaminationReason = 'heavy_background_noise' | 'partner_interference' | 'phone_moved_away' | 'low_battery_cutoff' | 'os_kill';

export interface ObservationFeatureSet {
  suspectedFragmentationEvents: number; // Picos de disparo > limiar calibrado
  environmentalDisturbanceScore: number; // dB médio ambiente
  acousticContinuityPercentage: number;  // Janelas de repouso silencioso real
}

export interface SleepObservationSummary {
  verdict: 'clean_night' | 'contaminated_night' | 'insufficient_data';
  dominantDisturbance: string | null;
}

export interface SleepObservationSession extends SyncableBaseEntity {
  id: string;
  source: 'phone' | 'wearable';
  startedAt: string;
  endedAt: string | null;
  mode: CaptureMode;
  
  permissionState: PermissionState;
  capabilityState: CapabilityState;
  qualityState: SignalQuality;
  
  confidence: number; // 0-100 baseada na qualidade do sinal limpo
  contaminationReasons: ContaminationReason[];
  
  derivedFeatures?: ObservationFeatureSet;
  summary?: SleepObservationSummary;
  
  linkedNightId: string | null; // Acoplamento a ManualLog se aplicável
  createdAt: string;
  endedReason?: string;
}
