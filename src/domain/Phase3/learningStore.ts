import type { Phase3Cycle } from '../../store/Phase3ContextStore';
import type { AssessmentDeliverable } from '../Phase2/engine';
import { getManualLogs } from '../Phase1/manualLogStore';
import { getProposals } from '../Phase2/proposals';
import type { SyncableBaseEntity } from '../CloudSync/contracts';

export interface CycleFeedbackRecord extends SyncableBaseEntity {
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
  // Nova Estrutura de Decisão Longitudinal Ativa
  decisionOutcome: string;
  confidenceInLearning: string;
  shouldInfluenceFutureSelection: boolean;
  nextStepPhrase: string;

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

import { evaluateCycleDecision } from './decisionEngine';

export function generateLearningPayload(
  cycle: Phase3Cycle, 
  deliverable: AssessmentDeliverable,
  reviewAnswers: { adesao: string; dificuldade: string; efeito: string }
) {
  const logs = getManualLogs();
  
  // Quick snapshot of current baseline
  let latency = 0, awakenings = 0, duration = 0;
  if(logs.length) {
    let rawLat = 0, rawAwake = 0;
    logs.forEach(l => {
       if (l.sleepOnsetEstimate === '> 60m' || l.sleepOnsetEstimate === '30-60m') rawLat += 45;
       else if (l.sleepOnsetEstimate === '15-30m') rawLat += 20;
       else rawLat += 10;
       rawAwake += l.awakeningsCount || 0;
    });
    latency = Math.round(rawLat / logs.length);
    awakenings = rawAwake / logs.length;
  }

  const checkinsList = Object.values(cycle.dailyCheckins);
  const successCount = checkinsList.filter(c => c === 'success').length;
  const adherenceRate = checkinsList.length > 0 ? successCount / checkinsList.length : 0;

  const activeProp = getProposals(deliverable).find(p => p.id === cycle.proposalId);

  // Instanciar o Motor Matemático
  const decision = evaluateCycleDecision(
    cycle.minDays,
    successCount,
    reviewAnswers.adesao,
    reviewAnswers.dificuldade,
    reviewAnswers.efeito
  );

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
    
    // Injeção do Outcome Isolado
    decisionOutcome: decision.status,
    confidenceInLearning: decision.confidenceLevel,
    shouldInfluenceFutureSelection: decision.shouldReoptimize,
    nextStepPhrase: decision.nextStepPhrase,

    eligibleForAnonymizedLearning: true,
    userReviewAnswers: reviewAnswers
  };

  // The Stringified payload for the external backend that ablute_ will eventually have
  payload.anonymizedLearningPayload = btoa(JSON.stringify({
    patternId: payload.contextualSnapshot.primarySleepPattern,
    driverId: payload.contextualSnapshot.primaryContextFactor,
    proposalFamily: payload.proposalFamily,
    adherenceRate: payload.adherenceSummary.rate,
    status: decision.status
  }));

  saveLearningRecord(payload);
  return decision; // Devolver a decisão purificada de volta p/ App UI Transition
}
