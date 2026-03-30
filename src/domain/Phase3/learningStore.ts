import type { Phase3Cycle } from '../../store/Phase3ContextStore';
import type { AssessmentDeliverable } from '../Phase2/engine';
import { getManualLogs } from '../Phase1/manualLogStore';
import { getProposals } from '../Phase2/proposals';

export interface CycleFeedbackRecord {
  feedbackRecordId: string;
  linkedAssessmentId: string;
  linkedCycleId: string;
  createdAt: string;
  baselineSnapshot: { avgLatency: number; avgAwakenings: number; avgDurationMin: number };
  contextualSnapshot: { primarySleepPattern: string; primaryContextFactor: string };
  activeProposalId: string;
  proposalFamily: string;
  adherenceSummary: { totalDays: number; successDays: number; rate: number };
  cycleWindowDays: number;
  userPerceivedOutcome: 'manter' | 'ajustar' | 'trocar';
  observedChangeSummary: string;
  finalDecision: 'KEEP_REFINING' | 'REJECT_AND_REOPTIMIZE';
  proposalSuitability: 'HIGH' | 'LOW' | 'INCOMPATIBLE';
  constraintsTriggered: string[];
  nextRecommendation: string;
  eligibleForAnonymizedLearning: boolean;
  anonymizedLearningPayload?: string;
  userReviewAnswers?: {
    adesao: string;
    dificuldade: string;
    efeito: string;
  };
}

export function getLearningRecords(): CycleFeedbackRecord[] {
  const data = localStorage.getItem('deepsleep_learning_records');
  return data ? JSON.parse(data) : [];
}

export function saveLearningRecord(record: CycleFeedbackRecord) {
  const records = getLearningRecords();
  records.push(record);
  localStorage.setItem('deepsleep_learning_records', JSON.stringify(records));
  // Dispatch event for UI updates globally
  window.dispatchEvent(new Event('deepsleep_profile_updated'));
}

export function generateLearningPayload(
  cycle: Phase3Cycle, 
  deliverable: AssessmentDeliverable, 
  userReview: 'manter' | 'ajustar' | 'trocar',
  recommendation: string,
  reviewAnswers?: { adesao: string; dificuldade: string; efeito: string }
) {
  const logs = getManualLogs();
  
  // Quick snapshot of current baseline
  let latency = 0, awakenings = 0, duration = 0;
  if(logs.length) {
    latency = Math.round(logs.reduce((acc, l) => acc + l.timeToSleepMin, 0) / logs.length);
    awakenings = logs.reduce((acc, l) => acc + l.awakenings, 0) / logs.length;
  }

  const checkinsList = Object.values(cycle.dailyCheckins);
  const successCount = checkinsList.filter(c => c === 'success').length;
  const adherenceRate = checkinsList.length > 0 ? successCount / checkinsList.length : 0;

  const activeProp = getProposals(deliverable).find(p => p.id === cycle.proposalId);

  const payload: CycleFeedbackRecord = {
    feedbackRecordId: 'lrn_' + Date.now(),
    linkedAssessmentId: deliverable.assessmentId,
    linkedCycleId: cycle.cycleId,
    createdAt: new Date().toISOString(),
    baselineSnapshot: {
      avgLatency: latency,
      avgAwakenings: awakenings,
      avgDurationMin: duration, // Mock for now, requires complex parse
    },
    contextualSnapshot: {
      primarySleepPattern: deliverable.primarySleepPattern,
      primaryContextFactor: deliverable.contextualDrivers[0] || deliverable.dominantDrivers[0] || 'Unknown',
    },
    activeProposalId: cycle.proposalId,
    proposalFamily: activeProp ? activeProp.id.split('_')[1] : 'unknown',
    adherenceSummary: {
      totalDays: checkinsList.length,
      successDays: successCount,
      rate: adherenceRate
    },
    cycleWindowDays: cycle.minDays,
    userPerceivedOutcome: userReview,
    observedChangeSummary: recommendation,
    finalDecision: userReview === 'manter' ? 'KEEP_REFINING' : 'REJECT_AND_REOPTIMIZE',
    proposalSuitability: userReview === 'manter' ? 'HIGH' : (userReview === 'ajustar' ? 'LOW' : 'INCOMPATIBLE'),
    constraintsTriggered: userReview !== 'manter' ? ['Atribuição gerou atrito logístico ou ineficácia mecânica'] : [],
    nextRecommendation: userReview === 'manter' ? 'Prosseguir aprofundamento ou isolar novos fatores se desejado.' : 'Sinalizar re-avaliação do contexto principal; recalcular Proposta Dominante.',
    eligibleForAnonymizedLearning: true,
    userReviewAnswers: reviewAnswers
  };

  // The Stringified payload for the external backend that ablute_ will eventually have
  payload.anonymizedLearningPayload = btoa(JSON.stringify({
    patternId: payload.contextualSnapshot.primarySleepPattern,
    driverId: payload.contextualSnapshot.primaryContextFactor,
    proposalFamily: payload.proposalFamily,
    adherenceRate: payload.adherenceSummary.rate,
    suitability: payload.proposalSuitability
  }));

  saveLearningRecord(payload);
}
