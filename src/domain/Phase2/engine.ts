import { getManualLogs } from '../Phase1/manualLogStore';

export type PrimarySleepPattern = 'DIFICULDADE_ADORMECIMENTO' | 'FRAGMENTACAO_MANUTENCAO' | 'REENTRADA_DESPERTAR' | 'IRREGULARIDADE_HORARIOS' | 'COMPONENTE_ORGANICA' | 'INDEFINIDO';

export interface AssessmentDeliverable {
  schemaVersion: number;
  assessmentId: string;
  createdAt: string;
  mode: 10 | 25;
  selectedQuestionIds: string[];
  rawResponses: Record<string, string[]>;
  factorScores: Record<string, number>;
  flags: string[];
  contradictions: string[];
  confidence: number;
  primarySleepPattern: PrimarySleepPattern;
  secondarySleepPattern: PrimarySleepPattern | null;
  patternConfidence: number;
  contextualDrivers: string[];
  
  // Legacy fields to not break other unrefactored UI files
  dominantDrivers: string[];
  secondaryDrivers: string[];
  temporalProfile: string;
  hiddenFactorIndex: number;
  profileContribution: Record<string, any>;
  proposalConstraints: string[];
  proposalOpportunities: string[];
}


// Helpers for formulas
const MIN = (x: number, y: number) => Math.min(x, y);
const SYNC = (x: number, y: number) => (x >= 2 && y >= 2 ? 1 : 0);

function getIndex(ans: string[]): number {
  if (!ans || !ans.length) return 0;
  const first = ans[0];
  if (first === 'A') return 0;
  if (first === 'B') return 1;
  if (first === 'C') return 2;
  if (first === 'D') return 3;
  if (first === 'E') return 4;
  if (first === 'F') return 5;
  return 0; // fallback
}

// Some questions are explicitly Progressive or Inverted. 
// However, the rule states: "a ordem textual da resposta já representa risco crescente" 
// so A=0, B=1, C=2, D=3, E=4 applies to BOTH P and I types for numeric fetching unless specified.
function val(qId: string, factor: string, raw: Record<string, string[]>): number {
  const ans = raw[qId];
  if (!ans || !ans.length) return 0;
  const i = getIndex(ans);

  // Mappings from section 4.3 (Categorical)
  if (qId === 'Q02') {
    if (i===0) return factor==='F14'?2.0 : factor==='F1'?1.0 : factor==='F2'?0.6 : 0;
    if (i===1) return factor==='F14'?2.2 : 0;
    if (i===2) return factor==='F15'?2.4 : factor==='F5'?0.8 : 0;
    if (i===3) return factor==='F3'?0.8 : factor==='F9'?0.8 : factor==='F10'?0.8 : factor==='F11'?0.8 : 0;
    if (i===4) return factor==='F18'?1.6 : 0;
  }
  if (qId === 'Q03') {
    if (i===0) return (factor==='F1'||factor==='F2') ? -0.8 : 0;
    if (i===1) return factor==='F1'?2.0 : 0;
    if (i===2) return factor==='F3'?1.4 : factor==='F4'?1.2 : 0;
    if (i===3) return factor==='F2'?2.2 : 0;
    if (i===4) return factor==='F18'?0.8 : 0;
  }
  if (qId === 'Q04') {
    if (i===0) return factor==='F3'?1.6 : factor==='F1'?0.8 : 0;
    if (i===1) return ['F9','F10','F11'].includes(factor)?1.0 : 0;
    if (i===2) return factor==='F13'?1.8 : 0;
    if (i===3) return factor==='F18'?1.8 : 0;
  }
  if (qId === 'Q05') {
    if (i===0) return factor==='F17'?1.4 : 0;
    if (i===1) return ['F1','F3','F13'].includes(factor)?0.8 : 0;
    if (i===2) return ['F9','F10','F11'].includes(factor)?0.8 : 0;
    if (i===3) return factor==='F2'?1.8 : factor==='F17'?0.8 :0;
    if (i===4) return factor==='F18'?1.2 : 0;
  }
  if (qId === 'Q12') {
    if (i===0) return factor==='F1'?1.6 : 0;
    if (i===1) return factor==='F14'?0.8 : factor==='F1'?1.0 : 0;
    if (i===2) return factor==='F3'?0.8 : factor==='F9'?0.8 : 0;
    if (i===3) return factor==='F18'?0.8 : factor==='F2'?0.6 : 0;
    if (i===4) return factor==='F17'?0.6 : factor==='F18'?0.8 : 0;
  }
  if (qId === 'Q13') {
    if (i===0) return factor==='F1'?1.2 : factor==='F4'?0.6 : 0;
    if (i===1) return factor==='F3'?1.6 : factor==='F6'?0.8 : 0;
    if (i===2) return factor==='F2'?1.8 : 0;
    if (i===3) return factor==='F1'?1.4 : factor==='F18'?0.6 : 0;
    if (i===4) return factor==='F18'?1.0 : 0;
  }
  if (qId === 'Q14') {
    if (i===0) return factor==='F1'?1.4 : 0;
    if (i===1) return factor==='F1'?2.0 : 0;
    if (i===2) return factor==='F1'?1.4 : factor==='F3'?0.8 : 0;
    if (i===3) return factor==='F2'?1.8 : 0;
  }
  if (qId === 'Q16') {
    if (i===1) return factor==='F2'?0.8 : 0;
    if (i===2) return factor==='F2'?1.4 : 0;
    if (i===3) return factor==='F2'?2.2 : 0;
    if (i===4) return factor==='F2'?2.4 : factor==='F1'?0.8 : 0;
  }
  if (qId === 'Q17') {
    if (i===0) return factor==='F1'?1.8 : 0;
    if (i===1) return factor==='F9'?1.0 : factor==='F18'?0.4 : 0;
    if (i===2) return factor==='F2'?2.0 : 0;
    if (i===3) return factor==='F13'?1.4 : 0;
    if (i===4) return factor==='F18'?0.8 : 0;
  }
  if (qId === 'Q20') {
    if (i===0) return ['F14','F2'].includes(factor)? -1.0 : 0;
    if (i===1) return factor==='F2'?0.8 : 0;
    if (i===2) return factor==='F1'?1.2 : 0;
    if (i===3) return factor==='F2'?1.6 : 0;
    if (i===4) return factor==='F2'?2.0 : 0;
  }
  if (qId === 'Q25') {
    if (i===0) return factor==='F1'?1.8 : 0;
    if (i===1) return factor==='F2'?1.8 : 0;
    if (i===2) return factor==='F3'?1.8 : 0;
    if (i===3) return factor==='F2'?2.2 : 0;
    if (i===4) return factor==='F1'?0.8: factor==='F2'?0.8 : factor==='F3'?0.8 : 0;
  }
  if (qId === 'Q42') {
    if (i===0) return factor==='F6'?1.0 : 0;
    if (i===1) return factor==='F6'?1.4 : 0;
    if (i===2) return factor==='F4'?1.0 : 0;
    if (i===3) return factor==='F7'?1.8 : 0;
    if (i===4) return factor==='F3'?1.2 : factor==='F18'?0.4 : 0;
  }
  if (qId === 'Q43') { // F7
    if (i===0) return factor==='F7'? -1.0 : 0;
    if (i===2) return factor==='F7'? 1.0 : 0;
    if (i===3) return factor==='F7'? 1.8 : 0;
    if (i===4) return factor==='F7'? 2.2 : 0;
  }
  if (qId === 'Q56') { // body
    if (i===0) return factor==='F9'? 1.8 : 0;
    if (i===1) return factor==='F9'? 1.2 : factor==='F3'?0.6 : 0;
    if (i===2) return factor==='F10'? 1.8 : 0;
    if (i===3) return factor==='F11'? 1.8 : 0;
  }
  if (qId === 'Q84') { // evolution
    if (i===0) return factor==='F17'? 2.0 : 0;
    if (i===1) return factor==='F17'? 1.6 : 0;
    if (i===2) return factor==='F17'? 2.0 : 0;
    if (i===3) return factor==='F17'? 2.2 : 0;
    if (i===4) return factor==='F17'? 1.6 : 0;
  }

  // Fallback for default indexed values, representing 0 to 4 intensity.
  return i;
}

// For multi-choice questions M(q). Base simple metric: 
// 0 ops = 0, 1 op = 2.0, 2+ ops = 2.3
function M(qId: string, raw: Record<string, string[]>): number {
  const ans = raw[qId];
  if (!ans || !ans.length || ans.includes('F')) return 0; // 'Nenhum'
  return ans.length === 1 ? 2.0 : 2.3;
}

function hasOption(ans: string[] | undefined, ops: string[]) {
  if (!ans) return false;
  return ans.some(a => ops.includes(a));
}

export function evaluateAssessment(raw: Record<string, string[]>, mode: 10 | 25): AssessmentDeliverable {
  // Compute basic scores
  let F1 = 0.8*val('Q03','F1',raw) + 1.1*val('Q11','F1',raw) + 1.2*val('Q12','F1',raw) + 1.1*val('Q13','F1',raw) + 1.0*val('Q17','F1',raw) + 0.9*val('Q20','F1',raw) + 0.8*val('Q23','F1',raw) + 0.8*val('Q25','F1',raw) + 0.5*val('Q29','F1',raw) + 0.9*val('Q93','F1',raw) + 0.9*MIN(val('Q11','F1',raw), val('Q20','F1',raw));
  let F2 = 1.0*val('Q03','F2',raw) + 1.5*val('Q16','F2',raw) + 1.6*val('Q19','F2',raw) + 1.0*val('Q20','F2',raw) + 1.2*val('Q21','F2',raw) +0.8*val('Q23','F2',raw) + 1.0*val('Q25','F2',raw) + 1.2*SYNC(val('Q16','F2',raw), val('Q20','F2',raw));
  let F3 = 0.8*val('Q12','F3',raw) + 1.1*val('Q13','F3',raw) + 1.2*val('Q24','F3',raw) + 0.8*val('Q25','F3',raw);
  let F4 = 0.8*val('Q08','F4',raw) + 1.2*val('Q29','F4',raw);
  let F5 = 0.7*val('Q08','F5',raw) + 1.3*val('Q39','F5',raw) + 0.8*val('Q84','F5',raw) + 0.7*val('Q86','F5',raw);
  let F6 = 0.7*val('Q12','F6',raw) + 0.9*val('Q42','F6',raw) + 1.1*val('Q53','F6',raw);
  let F7 = 1.0*val('Q42','F7',raw) + 1.3*val('Q43','F7',raw);
  let F8 = 0.8*val('Q47','F8',raw) + 1.4*val('Q49','F8',raw);
  let F9 = 1.3*M('Q57',raw) + 1.4*val('Q58','F9',raw) + 1.0*val('Q56','F9',raw);
  let F10 = 1.1*val('Q56','F10',raw) + 1.5*val('Q59','F10',raw);
  let F11 = 1.1*val('Q56','F11',raw) + 1.4*val('Q61','F11',raw);
  let F12 = 1.2*M('Q63',raw);
  let F13 = 1.3*M('Q73',raw) + 1.1*val('Q79','F13',raw) + 0.9*val('Q77','F13',raw);
  let F14 = 1.2*val('Q02','F14',raw) + 0.9*val('Q20','F14',raw) + 0.8*val('Q67','F14',raw);
  let F15 = 1.4*val('Q02','F15',raw) + 0.8*val('Q39','F15',raw);
  let F16 = 1.8*val('Q67','F16',raw) + 1.0*val('Q68','F16',raw);
  let F17 = 1.2*val('Q84','F17',raw) + 0.9*val('Q86','F17',raw);
  let F18 = 0.8*val('Q06','F18',raw) + 1.1*val('Q99','F18',raw);

  // Normalize (basic item active count approx)
  F1 /= 3; F2 /= 2; F3 /= 2; F4 /= 2; F5 /= 2; F6 /= 2; F7 /= 2; F8 /= 1; 
  F9 /= 2; F10 /= 1; F11 /= 1; F12 /= 1; F13 /= 2; F14 /= 2; F15 /= 2; F16 /= 1; F17 /= 1; F18 /= 2;

  let contradictions = [];
  let F18_penalty = 0;
  let confidence = 85; 

  // C1
  if (hasOption(raw['Q19'], ['A', 'B']) && 
     ((hasOption(raw['Q16'], ['D','E']) ? 1 : 0) + (hasOption(raw['Q20'], ['D','E']) ? 1 : 0) >= 2)) {
    F18_penalty += 1.6; confidence -= 15;
    contradictions.push('C1');
  }
  // C2
  if (hasOption(raw['Q43'], ['A', 'B']) && hasOption(raw['Q51'], ['D','E'])) {
    F18_penalty += 1.2; confidence -= 10;
    contradictions.push('C2');
  }
  // C3
  if (hasOption(raw['Q56'], ['E']) && (M('Q57', raw) > 0 || hasOption(raw['Q58'], ['C','D','E']))) {
    F18_penalty += 1.4; confidence -= 15;
    contradictions.push('C3');
  }
  
  F18 += F18_penalty;

  // CROSS-INTEGRATION: Phase 1 (Nightly Metrics) Modulating Phase 2
  const logs = getManualLogs();
  const numLogs = logs.length;
  let avgLatency = 0;
  let avgAwakenings = 0;
  let avgAwakeTime = 0;
  let markerUsage: Record<string, number> = {};

  if (numLogs > 0) {
    logs.forEach(l => {
      if (l.sleepOnsetEstimate === '> 60m' || l.sleepOnsetEstimate === '30-60m') avgLatency += 45;
      else if (l.sleepOnsetEstimate === '15-30m') avgLatency += 20;
      else avgLatency += 10;
      
      avgAwakenings += l.awakeningsCount || 0;
      avgAwakeTime += 30; // Deprecated detailed parsing to keep engine simple

      if (l.sleepType === 'NAP') {
        markerUsage['$Nap'] = (markerUsage['$Nap'] || 0) + 1;
      }
      
      if (l.environmentIssues) {
         l.environmentIssues.forEach((m: string) => {
           markerUsage[m] = (markerUsage[m] || 0) + 1;
         });
      }
      
      // Injeta variáveis primitivas no array de marcadores lidos pelo engine
      if (l.disturbingDreams) markerUsage['Pesadelos'] = (markerUsage['Pesadelos'] || 0) + 1;
      if (l.nicotineNearBedtime) markerUsage['Cigarro / Nicotina'] = (markerUsage['Cigarro / Nicotina'] || 0) + 1;
      if (l.hungerAtBedtime) markerUsage['Fome'] = (markerUsage['Fome'] || 0) + 1;
      if (l.physicalDiscomfort) markerUsage['Dor / desconforto'] = (markerUsage['Dor / desconforto'] || 0) + 1;
      if (l.bathroomAwakenings && l.bathroomAwakenings > 0) markerUsage['Ida à casa de banho'] = (markerUsage['Ida à casa de banho'] || 0) + 1;
    });
    avgLatency /= numLogs;
    avgAwakenings /= numLogs;
    avgAwakeTime /= numLogs;

    // Modulate based on truth-data from tracker
    if (avgLatency > 40) {
      F1 *= 1.4; // Hard evidence of Onset difficulty
      F2 *= 1.3; // Sleep anxiety reinforced
    } else {
      F1 *= 0.6; // If onset is actually fast, reduce arbitrary onset anxiety scores
      F2 *= 0.6;
    }

    if (avgAwakenings >= 2 && avgAwakeTime > 45) {
      F11 *= 1.6; // Maintenance failure / fragmentation confirmed
      F2 *= 1.4;  // Fear of returning to sleep
    }

    if (markerUsage['Ida à casa de banho'] && markerUsage['Ida à casa de banho'] > numLogs * 0.4) {
      F16 += 2.0; // Nocturia confirmed
    }

    if (markerUsage['Dor / desconforto'] && markerUsage['Dor / desconforto'] > numLogs * 0.3) {
      F9 *= 1.8;  // Pain interference overrides subtle psych factors
    }
    
    if (markerUsage['Cigarro / Nicotina'] || markerUsage['Álcool'] || markerUsage['Cafeína tardia']) {
      F12 *= 1.6; // Substance interaction
    }
    
    if (markerUsage['Calor / Frio desconfortável'] && markerUsage['Calor / Frio desconfortável'] > numLogs * 0.4) {
      F6 *= 1.5; // Environmental temperature constraints
    }
    
    if (markerUsage['Pesadelos'] && markerUsage['Pesadelos'] > 0) {
      F2 *= 1.5; // Sleep anxiety spikes with nightmares
    }
    
    if (markerUsage['Fome']) {
      F3 /= 1.2; // Diet factors messing maintenance
    }
    
    if (markerUsage['$Nap'] && markerUsage['$Nap'] > numLogs * 0.4) {
      if (avgLatency > 30) {
        // High napping + high latency = direct pressure steal
        F1 *= 0.5; // Not psych anxiety, just lacks sleep drive
      }
    }

    // Phone is only considered an "aggravator" (F1) if the user actually struggles to fall asleep.
    if (markerUsage['Telemóvel antes de dormir'] && markerUsage['Telemóvel antes de dormir'] > numLogs * 0.5) {
      if (avgLatency > 30) {
        F1 *= 1.3; // Replicated friction
      } else {
        // If falling asleep is fine, mobile phone is a functional regulator, ignore it.
        confidence += 5; 
      }
    }
  }

  const scores = [
    { f: 'P1', val: F1, score: F1 },
    { f: 'P2', val: F2, score: F2 },
    { f: 'P3', val: F3 + F6, score: F3 },
    { f: 'P4', val: F7, score: F7 },
    { f: 'P5', val: F8, score: F8 },
    { f: 'P6', val: F9, score: F9 },
    { f: 'P7', val: F10, score: F10 },
    { f: 'P8', val: F11, score: F11 },
    { f: 'P9', val: F12, score: F12 },
    { f: 'P10', val: F13, score: F13 },
    { f: 'P11', val: F14, score: F14 },
    { f: 'P12', val: F15, score: F15 },
    { f: 'P13', val: F5, score: F5 }
  ].sort((a,b) => b.val - a.val);

  const dom = scores[0];
  const sec = scores[1];
  
  const dominantDrivers = dom.val > 1.0 ? [dom.f] : [];
  const secondaryDrivers = sec.val > 0.8 ? [sec.f] : [];

  let temporalProfile = 'Ainda a clarificar';
  const q82 = getIndex(raw['Q82'] || []);
  if (q82 === 2) temporalProfile = 'Padrão crónico instalado';
  else if (q82 === 0) temporalProfile = 'Episódio recente / agudo';

  let constraints: string[] = [];
  let opportunities: string[] = [];

  // Re-write Constraints and Opportunities strictly intersecting Phase 1 truths
  if (markerUsage['Dor / desconforto'] && markerUsage['Dor / desconforto'] > 0) {
    constraints.push('Dor/Desconforto físico registados.');
  } else if (F9 > 1.5) {
    constraints.push('Indícios de potencial bloqueio mecânico que precisa eliminação clara.');
  }

  if (F8 > 1.5 || markerUsage['Cuidadores/Dependentes']) constraints.push('Cuidadores/Dependentes na janela noturna.');
  if (F5 > 1.5) constraints.push('Não sugerir rotinas rígidas por irregularidade nos turnos.');

  if (avgAwakenings >= 2 && avgAwakeTime > 30) {
    opportunities.push('Trabalhar consolidacao da vigilha re-entrante após despertar.');
  } else if (avgLatency > 30) {
    opportunities.push('Trabalhar focos pre-cama com carga passiva.');
  } else {
    opportunities.push('Estabilização holística de âncoras circadianas de dia e de noite.');
  }

  let flags = [];
  if (F12 > 1.5) flags.push('Consumo associado de estimulantes/álcool detetado.');
  if (F16 > 1.5 || markerUsage['Ida à casa de banho']) flags.push('Noctúria registada.');

  // DETERMINATION OF PRIMARY SLEEP PATTERN (Rule 1)
  let primarySleepPattern: PrimarySleepPattern = 'INDEFINIDO';
  let secondarySleepPattern: PrimarySleepPattern | null = null;
  let patternConfidence = confidence; // starting point from Q engine

  const patternsFound: { pattern: PrimarySleepPattern, weight: number }[] = [];

  if (markerUsage['Dor / desconforto'] > 0 || markerUsage['Ida à casa de banho'] > numLogs * 0.4) {
    patternsFound.push({ pattern: 'COMPONENTE_ORGANICA', weight: 90 });
  } 
  if (avgAwakenings >= 2 && avgAwakeTime > 45) {
    patternsFound.push({ pattern: 'REENTRADA_DESPERTAR', weight: 85 });
  } else if (avgAwakenings >= 2) {
    patternsFound.push({ pattern: 'FRAGMENTACAO_MANUTENCAO', weight: 75 });
  }
  if (F5 > 1.8) {
    patternsFound.push({ pattern: 'IRREGULARIDADE_HORARIOS', weight: 80 });
  }
  if (avgLatency > 40) {
    patternsFound.push({ pattern: 'DIFICULDADE_ADORMECIMENTO', weight: avgLatency > 60 ? 85 : 70 });
  }

  patternsFound.sort((a, b) => b.weight - a.weight);

  if (patternsFound.length > 0) {
    primarySleepPattern = patternsFound[0].pattern;
    patternConfidence = Math.min(patternConfidence, patternsFound[0].weight);
  }
  if (patternsFound.length > 1) {
    secondarySleepPattern = patternsFound[1].pattern;
    patternConfidence -= 10; // Penalize confidence if there are dual strong competing signals
  }
  if (numLogs < 3) patternConfidence -= 20;

  return {
    schemaVersion: 1,
    assessmentId: 'ass_' + Date.now(),
    createdAt: new Date().toISOString(),
    mode,
    selectedQuestionIds: Object.keys(raw),
    rawResponses: raw,
    factorScores: { F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18 },
    flags,
    contradictions,
    confidence: Math.max(0, Math.min(100, confidence)), // purely from QA
    primarySleepPattern,
    secondarySleepPattern,
    patternConfidence: Math.max(0, Math.min(100, patternConfidence)),
    contextualDrivers: dominantDrivers, // Using top P-factors to explain *why* pattern exists
    dominantDrivers,
    secondaryDrivers,
    temporalProfile,
    hiddenFactorIndex: F18,
    profileContribution: {
      primary: dom.f,
      secondary: sec.f
    },
    proposalConstraints: constraints,
    proposalOpportunities: opportunities
  };
}
