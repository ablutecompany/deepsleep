export type EventType = 
  | 'app_open' | 'route_view' 
  | 'manual_log_started' | 'manual_log_completed' | 'manual_log_abandoned'
  | 'reading_started' | 'reading_completed' | 'reading_back_used' | 'reading_abandoned'
  | 'resonance_feedback_submitted'
  | 'active_guidance_viewed' | 'daily_checkin_completed' | 'daily_checkin_missed'
  | 'window_review_started' | 'window_review_completed'
  | 'decision_outcome_generated' 
  | 'disagreement_with_reading' | 'destructive_action_triggered'
  | 'baseline_invalidated' | 'reset_beta_triggered' | 'time_simulation_used';

export interface UsageEvidenceRecord {
  id: string;
  eventType: EventType;
  timestamp: string;      // ISO 8601 UTC real (Date.now())
  appDateString: string;  // O tempo em que a app julgou estar (appClock)
  route: string;
  
  durationMs?: number;    // Ex: time_to_complete_manual_log
  
  linkedCycleId?: string;
  linkedReadingId?: string;
  linkedGuidanceId?: string;
  
  payload?: any;          // Extração agnóstica de adesão, outcomes, discordâncias
}
