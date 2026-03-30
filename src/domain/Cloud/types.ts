export type DeletionScope = 'this_night' | 'active_cycle' | 'local_profile' | 'account_and_cloud_data';
export type ExportScope = 'profile_only' | 'historical_logs' | 'sync_eligible_data' | 'full_takeout';

export interface AccountIdentity {
  accountId: string;          // UUID do backend (e.g. Supabase Auth / Firebase)
  isAnonymous: boolean;       // Support para signInAnonymously no arranque
  verifiedEmail?: string;
  createdAt: string;
}

export interface DeviceInstallation {
  deviceId: string;           // UUID gerado no primeiro boot da app
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  linkedAccountId?: string;   // Quando a conversão para User final ocorre
  lastActiveAt: string;
}

// Data Boundary Contract - O que pdoe subir para a Cloud
export interface SyncEligibleData {
  nightLogs: any[];           // Apenas logs manuais finalizados e sumarizados (Phase 1)
  learningRecords: any[];     // Outcomes das revisões de janela (Phase 3)
  deliverable: any;           // Padrão predominantemente atual e motor (Phase 2)
  resonanceFeedbacks: any[];  // Correções/desacordo humano (Phase 2 UX)
}

// Data Boundary Contract - O que MORRE obrigatoriamente no telemóvel do utilizador
export interface LocalOnlyData {
  sensingDrafts: any[];       // Gravações ou sinal bruto não processado
  answersDraft: Record<string, string[]>; // Wizard State
  appClockSimulation: any;    // Variáveis de ambiente Beta 
}
