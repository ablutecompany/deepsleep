import { appClock } from '../../utils/appClock';

export type SleepDurationEstimate = '< 15m' | '15-30m' | '30-60m' | '> 60m' | 'Não sei bem';
export type ReSleepDifficulty = 'Fácil' | 'Algum esforço' | 'Muito difícil' | 'Não voltei a dormir';
export type IntensityScale = 'Nenhuma' | 'Leve' | 'Alta';

export type ManualAppLog = {
  id: string;
  dateStr: string;
  createdAt: string;

  sleepType: 'NIGHT' | 'NAP';

  // --- CAMPOS DE NOITE ---
  // Estruturais exatos (Relógio)
  bedTime?: string;
  wakeTime?: string;
  outOfBedTime?: string;

  // Sentimentais / Intervalares rápidos
  sleepOnsetEstimate?: SleepDurationEstimate;
  awakeningsCount?: number;
  bathroomAwakenings?: number;
  reSleepDifficulty?: ReSleepDifficulty;
  perceivedRestoration?: 'Fraca' | 'Razoável' | 'Boa' | 'Excelente';
  tensionAtBedtime?: IntensityScale;
  
  // Condições biológicas / contexto binário
  physicalDiscomfort?: boolean;
  hungerAtBedtime?: boolean;
  nicotineNearBedtime?: boolean;
  disturbingDreams?: boolean;
  environmentIssues?: string[]; // Substitui o 'markers' vago
  
  // --- CAMPOS DE SESTA ---
  napPeriod?: 'Manhã' | 'Início da tarde' | 'Final da tarde' | 'Início da noite';
  napDurationEstimate?: SleepDurationEstimate;
  napContextText?: string; 
  
  // --- METADADOS INTERNOS DO MOTOR ---
  validityScore: number;
  countsForBaseline: boolean;
  isCompleteEnough: boolean;
};

export const ENVIRONMENT_OPTIONS = [
  'Telemóvel antes de dormir',
  'Ruído',
  'Luz',
  'Calor / Frio desconfortável',
  'Álcool',
  'Cafeína tardia',
  'Medicação para dormir / Calmantes'
];

export function getManualLogs(): ManualAppLog[] {
  try {
    const data = localStorage.getItem('manualNightLogs');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function calculateValidity(log: Partial<ManualAppLog>) {
  if (log.sleepType === 'NAP') {
    return { validityScore: 1, countsForBaseline: false, isCompleteEnough: !!log.napDurationEstimate };
  }

  // Night validity prudente
  let score = 0;
  if (log.bedTime && log.wakeTime) score += 0.5; // Relógios são a fundação
  if (log.sleepOnsetEstimate) score += 0.2;
  if (log.awakeningsCount !== undefined) score += 0.15;
  if (log.perceivedRestoration) score += 0.15;

  const isCompleteEnough = score >= 0.7; // Ex: Tem relógios e tempo estimado / recuperação
  const countsForBaseline = score >= 0.85; // Ex: Relógios, tempo onset, e um de (awakenings | restoration)

  return { validityScore: score, countsForBaseline, isCompleteEnough };
}

// Sub-rotina crtítica de Purga (Gating Integrity)
function recalculateGatingIntegrity(updatedLogs: ManualAppLog[]) {
  const validNightsPattern = updatedLogs.filter(l => l.sleepType === 'NIGHT' && l.countsForBaseline);
  const validCount = validNightsPattern.length;
  
  localStorage.setItem('nightCount', validCount.toString());

  // Se o utilizador apagar noites ao ponto de descer da base mínima (5)
  if (validCount < 5) {
    // Purga a fase matemática (A BaseDeDado Fricção)
    localStorage.removeItem('deepsleep_phase2_context');
    // Purga o Ciclo de Teste Activo e Outcomes (Não existe ciclo sem plano)
    localStorage.removeItem('deepsleep_phase3_cycle');
    
    // Anuncia de forma forçada uma invalidação central (Para a Home se ajustar)
    window.dispatchEvent(new Event('deepsleep_baseline_invalidated'));
  }
}

export function saveManualLog(logInfo: Omit<ManualAppLog, 'id' | 'createdAt' | 'validityScore' | 'countsForBaseline' | 'isCompleteEnough'>) {
  const current = getManualLogs();
  
  const validity = calculateValidity(logInfo);
  
  const newLog: ManualAppLog = { 
    ...logInfo, 
    id: 'man_log_' + Date.now(),
    createdAt: appClock.now().toISOString(),
    ...validity
  };
  
  const updated = [...current, newLog].sort((a,b) => b.dateStr.localeCompare(a.dateStr));
  localStorage.setItem('manualNightLogs', JSON.stringify(updated));
  
  recalculateGatingIntegrity(updated);
  window.dispatchEvent(new Event('deepsleep_simulated_change'));
}

export function deleteManualLog(id: string) {
  const current = getManualLogs();
  const updated = current.filter(l => l.id !== id);
  localStorage.setItem('manualNightLogs', JSON.stringify(updated));
  
  recalculateGatingIntegrity(updated);
  window.dispatchEvent(new Event('deepsleep_simulated_change'));
}

export function getManualNightCount() {
  const current = getManualLogs();
  return current.filter(l => l.sleepType === 'NIGHT' && l.countsForBaseline).length;
}
