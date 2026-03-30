export type EngineDecisionStatus = 'maintain' | 'adjust' | 'switch' | 'reassess' | 'hold';

export interface DailyProposalFeedback {
  id: string;
  dayKey: string;
  adherenceStatus: 'followed' | 'not_followed';
  executionEase?: 'natural' | 'effort' | 'very_difficult' | null;
  nonExecutionReason?: 'forgot' | 'no_conditions' | 'intentional' | null;
  submittedAt: string;
  isBetaSimulatedDay: boolean;
}

export interface DecisionOutcome {
  status: EngineDecisionStatus;
  reasonCodes: string[];
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  basedOn: {
    adherenceEvidence: number; // 0 to 1
    tolerability: 'GOOD' | 'MODERATE' | 'POOR';
    perceivedOutcomeEvidence: 'CLEAR_BENEFIT' | 'SUBTLE' | 'NONE' | 'WORSENED' | 'UNKNOWN';
    contradictions: boolean;
  };
  shouldReoptimize: boolean;
  nextStepPhrase: string;
}

export function evaluateCycleDecision(
  totalDaysInCycle: number,
  successCheckins: number,
  adesaoAns: string,
  dificuldadeAns: string,
  efeitoAns: string,
  dailyFeedback: DailyProposalFeedback[] = []
): DecisionOutcome {
  // Processar histórico micro-diário primeiro
  let unavoidableFails = 0;
  let intentionalResistances = 0;
  let highEffortDays = 0;

  dailyFeedback.forEach(fb => {
    if (fb.adherenceStatus === 'not_followed' && fb.nonExecutionReason === 'no_conditions') {
      unavoidableFails++;
    }
    if (fb.adherenceStatus === 'not_followed' && fb.nonExecutionReason === 'intentional') {
      intentionalResistances++;
    }
    if (fb.adherenceStatus === 'followed' && fb.executionEase === 'very_difficult') {
      highEffortDays++;
    }
  });

  // Adesão base + perdões justificados
  let adherenceEvidence = totalDaysInCycle > 0 
    ? (successCheckins + unavoidableFails) / totalDaysInCycle 
    : 0;
  
  if (intentionalResistances > 0) {
    adherenceEvidence -= 0.2; // Penalização por resistência declarada
  }
  
  // Reforçar adherence baseada no input verbal final (Adesão auto-reportada)
  if (adesaoAns.includes('Muito pouco')) {
    adherenceEvidence = Math.min(adherenceEvidence, 0.3); // Cap down to poor if they admit failing.
  } else if (adesaoAns.includes('Sem falhas')) {
    adherenceEvidence = Math.max(adherenceEvidence, 0.8);
  }

  let tolerability: 'GOOD' | 'MODERATE' | 'POOR' = 'MODERATE';
  if (dificuldadeAns.includes('Fácil') || dificuldadeAns.includes('Boa')) tolerability = 'GOOD';
  if (dificuldadeAns.includes('Demasiado difícil') || dificuldadeAns.includes('impossível') || dificuldadeAns.includes('Dor')) tolerability = 'POOR';
  
  // Override diário de tolerabilidade
  if (highEffortDays >= 3) {
    tolerability = 'POOR';
  }

  let perceivedOutcomeEvidence: 'CLEAR_BENEFIT' | 'SUBTLE' | 'NONE' | 'WORSENED' | 'UNKNOWN' = 'UNKNOWN';
  if (efeitoAns.includes('diferença clara')) perceivedOutcomeEvidence = 'CLEAR_BENEFIT';
  else if (efeitoAns.includes('subtil')) perceivedOutcomeEvidence = 'SUBTLE';
  else if (efeitoAns.includes('Nenhuma diferença')) perceivedOutcomeEvidence = 'NONE';
  else if (efeitoAns.includes('Piorou')) perceivedOutcomeEvidence = 'WORSENED';

  // Lógica Decisória Prudente (Casos A-G)
  const isHighAdherence = adherenceEvidence >= 0.65;
  const isLowAdherence = adherenceEvidence < 0.4;
  
  let status: EngineDecisionStatus = 'hold';
  let reasonCodes: string[] = [];
  let confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
  let shouldReoptimize = false;
  let nextStepPhrase = 'Base de dados insuficiente. Manter.';

  if (perceivedOutcomeEvidence === 'WORSENED') {
    // CASO F: Piora clara => rever/switch rápido
    status = 'switch';
    reasonCodes.push('OUTCOME_WORSENED');
    shouldReoptimize = true;
    confidenceLevel = 'HIGH';
    nextStepPhrase = 'A direção piorou a resposta basal. Iremos recalcular totalmente o percurso imediato.';
  } 
  else if (tolerability === 'POOR') {
    // CASO D: Má tolerabilidade => despriorizar/switch mesmo com janela curta
    status = 'switch'; // Changed from 'adjust' to enforce removal if insufferable
    reasonCodes.push('POOR_TOLERABILITY');
    shouldReoptimize = true;
    confidenceLevel = 'HIGH';
    nextStepPhrase = 'Sinalizada logística impraticável para a tua vida. Esta direção será suspensa e evitada.';
  }
  else if (isHighAdherence && perceivedOutcomeEvidence === 'CLEAR_BENEFIT') {
    // CASO A: Boa adesão + benefício percebido + boa tolerabilidade => maintain/consolidar
    status = 'maintain';
    reasonCodes.push('CLEAR_BENEFIT_CONSOLIDATION');
    shouldReoptimize = false;
    confidenceLevel = 'HIGH';
    nextStepPhrase = 'A direção provou eficácia sólida e confortável. Continua no mesmo quadro para consolidar a alteração neurológica.';
  }
  else if (isHighAdherence && perceivedOutcomeEvidence === 'NONE') {
    // CASO B: Boa adesão + nenhum efeito claro => adjust/switch
    status = 'adjust';
    reasonCodes.push('NO_EFFECT_DESPITE_ADHERENCE');
    shouldReoptimize = true;
    confidenceLevel = 'HIGH';
    nextStepPhrase = 'Cumpriste rigorosamente, mas sem efeito na pressão de sono. Esta linha está esgotada. Iremos afinar a prioridade.';
  }
  else if (isLowAdherence) {
    // CASO C: Baixa adesão => NÃO concluir apressadamente que falhou
    // Mantém a direcção temporariamente (Hold Prudente) e sugere reavaliação logística
    status = 'hold';
    reasonCodes.push('LOW_ADHERENCE_INCONCLUSIVE');
    shouldReoptimize = false;
    confidenceLevel = 'LOW';
    nextStepPhrase = 'A baixa capacidade de execução registada não permite descartar a teoria clínica. Iremos preservar temporariamente até estares livre de restrições de vida.';
  }
  else if (perceivedOutcomeEvidence === 'SUBTLE' && totalDaysInCycle < 8) {
    // CASO G: Sinal ainda insuficiente (Benefício subtil, em janela ainda tenra)
    status = 'maintain';
    reasonCodes.push('SUBTLE_SIGNAL_MORE_DAYS_NEEDED');
    shouldReoptimize = false;
    confidenceLevel = 'MEDIUM';
    nextStepPhrase = 'Sinal de viragem detetado mas estatisticamente fraco. Mais dias necessários nesta direção antes de escalar táticas agressivas.';
  }
  else if (isHighAdherence && perceivedOutcomeEvidence === 'SUBTLE' && totalDaysInCycle >= 8) {
     // Subtle but we gave it enough time
     status = 'adjust';
     reasonCodes.push('PLATEAU_REACHED');
     shouldReoptimize = true;
     confidenceLevel = 'MEDIUM';
     nextStepPhrase = 'O benefício estagnou precocemente. É hora de injetar uma variável cruzada mantendo o terreno limpo.';
  }
  else {
    // CASO E: Sinais contraditórios / não formatados / indecisos
    status = 'reassess';
    reasonCodes.push('CONTRADICTION_TRIGGER');
    shouldReoptimize = false;
    confidenceLevel = 'LOW';
    nextStepPhrase = 'Sinais ligeiramente paradoxais. Mantém-te sob a estratégia sem escalar, mas foca no report mais preciso na home.';
  }

  // Sanity Lock for persistence
  const contradictions = reasonCodes.includes('CONTRADICTION_TRIGGER');

  return {
    status,
    reasonCodes,
    confidenceLevel,
    shouldReoptimize,
    nextStepPhrase,
    basedOn: {
      adherenceEvidence,
      tolerability,
      perceivedOutcomeEvidence,
      contradictions
    }
  };
}
