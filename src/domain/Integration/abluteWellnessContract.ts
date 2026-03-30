/**
 * ABLUTE_ WELLNESS CONTRACT
 * 
 * Este schema define a assinatura de dados que o mini-produto `_deepSleep` 
 * poderá trocar bi-direcionalmente com a aplicação principal `ablute_` no futuro.
 * Não invoca APIs reais, serve apenas como modelação estrutural (Tarefa 9).
 */

export interface AbluteIncomingContext {
  userId: string;
  sourceAppVersion: string;
  capturedAt: string;
  biologicalData: {
    avgRestingHeartRate?: number;
    avgHrv?: number;
    bodyTemperatureTrend?: 'normal' | 'elevated' | 'low';
    menstrualCyclePhase?: 'follicular' | 'ovulation' | 'luteal' | 'menstruation';
  };
  psychologicalData: {
    stressLevelReported: 'baixa' | 'moderada' | 'severa';
    anxietyMarkers: string[]; // ex: ["ruminação crural", "palpitações"]
  };
  environmentData: {
    roomBaseTemperatureC?: number; // vindo de domótica futura ou health-kit ambient
    noisePollutionLevel?: 'quiet' | 'moderate' | 'high';
  };
  longitudinalState: {
    longevityPace?: number; // cruzar com `ablute_ longevity`
    activeGoals: string[]; // ex: ["reduzir massa gorda", "correr 10km"]
  };
}

export interface AbluteOutgoingContext {
  userId: string;
  lastSyncAt: string;
  primarySleepPattern: string; // Ex: 'FRAGMENTACAO_MANUTENCAO'
  diagnosticConfidence: number; // 0-100%
  baselineMetrics: {
    avgTimeToSleepMin: number;
    avgAwakeningsCount: number;
    avgAwakeTimeMin: number;
  };
  activeInterventions: {
    proposalFamily: string;
    totalDaysTested: number;
    adherenceRatePercentage: number;
    userPerceivedOutcome: 'KEEP_REFINING' | 'REJECT_AND_REOPTIMIZE'; // O que resultou ou não resultou
  }[];
  anonymizedLearningHistory: string[]; // Array of base64 payloads to feed the AI general model
  napsAndDiurnalImpact: {
    totalNapsLogged: number;
    averageNapDurationMin: number;
  };
}

export type WellnessSyncResponse = {
  status: 'acknowledged' | 'rejected';
  recalibrationTriggered: boolean;
  message: string;
};
