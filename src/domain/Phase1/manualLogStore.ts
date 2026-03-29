export type ManualNightLog = {
  id: string;
  dateStr: string;
  bedTime: string;
  timeToSleepMin: number;
  awakenings: number;
  awakeTimeMin: number;
  wakeTime: string;
  recovery: 'Má' | 'Razoável' | 'Boa' | 'Excelente';
  markers: string[]; 
};

export const MARKER_OPTIONS = [
  'Ida à casa de banho',
  'Telemóvel antes de dormir',
  'Stress mental',
  'Dor / desconforto',
  'Ruído / luz'
];

export function getManualLogs(): ManualNightLog[] {
  try {
    const data = localStorage.getItem('manualNightLogs');
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveManualLog(log: Omit<ManualNightLog, 'id'>) {
  const current = getManualLogs();
  const newLog = { ...log, id: 'man_log_' + Date.now() };
  
  // Guardar nova lista
  const updated = [...current, newLog].sort((a,b) => b.dateStr.localeCompare(a.dateStr));
  localStorage.setItem('manualNightLogs', JSON.stringify(updated));
  
  // Sincronizar nightCount com a quantidade de registos reais
  // Assim a arquitectura (Fase 2) destrava nativamente quando chega a 5.
  localStorage.setItem('nightCount', updated.length.toString());
  
  // Anunciar alteração para re-render da app
  window.dispatchEvent(new Event('deepsleep_simulated_change'));
}

export function deleteManualLog(id: string) {
  const current = getManualLogs();
  const updated = current.filter(l => l.id !== id);
  localStorage.setItem('manualNightLogs', JSON.stringify(updated));
  localStorage.setItem('nightCount', updated.length.toString());
  window.dispatchEvent(new Event('deepsleep_simulated_change'));
}

export function getManualNightCount() {
  return getManualLogs().length;
}
