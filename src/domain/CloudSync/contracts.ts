/**
 * CONTRATOS FUTUROS DE IDENTIDADE E SINCRONIZAÇÃO CLOUD
 * 
 * Esta infraestrutura prepara a aplicação _deepSleep para uma migração
 * fluida no futuro em direção a Backend/Auth/Multi-device, assumindo
 * por agora uma postura estritamente Local-First.
 */

// 1. CLASSIFICAÇÃO DE DADOS (Fronteira Local vs Cloud)
export type DataClassification = 
  | 'local_only'
  | 'sync_eligible'
  | 'sensitive_sync_eligible'
  | 'export_only'
  | 'ephemeral_debug';

export const DATA_DICTIONARY: Record<string, DataClassification> = {
  // Sync Eligible (Canónicos)
  'manualNightLogs': 'sync_eligible',
  'naps': 'sync_eligible',
  'deepsleep_profile_deliverable': 'sync_eligible',
  'deepsleep_phase3_cycle': 'sync_eligible',
  'deepsleep_learning_records': 'sync_eligible',
  'dailyProposalFeedback': 'sync_eligible',
  
  // Sensitive Sync
  'deepsleep_sensing_sessions': 'sensitive_sync_eligible',
  'deepsleep_telemetry_v1': 'sensitive_sync_eligible',

  // Local Only / Derivados (Não passam para sync engine)
  'nightCount': 'local_only',
  'profile_cache_state': 'local_only',
  'home_situational_state': 'local_only',

  // Export / Debug
  'deepsleep_beta_feedback': 'export_only',
  '__beta_clock_mode': 'ephemeral_debug',
  'deepsleep_simulated_now': 'ephemeral_debug'
};

// 2. ENTIDADES PRINCIPAIS DO UTILIZADOR
export interface AccountIdentity {
  accountId: string;
  authProviderType: 'anonymous' | 'email' | 'apple' | 'google' | 'pending';
  createdAt: string; // ISO Dates
  status: 'active' | 'suspended' | 'deleted_remotely';
}

export interface DeviceInstallation {
  installationId: string;
  deviceLabel: string;      // Ex: "iPhone 15 Pro Max"
  platform: 'ios' | 'android' | 'web';
  firstSeenAt: string;
  lastSeenAt: string;
  appVersion: string;
  clockModeDebugFlag?: boolean; // Para isolar sessões corrompidas por simulação temporal
}

export interface LocalProfileEnvelope {
  installationId: string;
  localProfileId: string;
  currentProfileVersion: string;
  lastUpdatedAt: string; // Garantir coerência em merge de perfil estático
}

// 3. ENVELOPE DE SINCRONIZAÇÃO (Padrão de Resolução)
export interface SyncEnvelope<T> {
  entityType: 'manual_log' | 'proposal_feedback' | 'learning_record' | 'sensing_session';
  localId: string;
  remoteId?: string;
  
  syncEligible: boolean;
  syncStatus: 'draft' | 'pending' | 'synced' | 'conflict' | 'orphaned';
  
  createdAt: string;
  lastModifiedAt: string;
  deletionState: 'active' | 'soft_deleted' | 'hard_deleted_pending_sync';
  
  conflictPolicy: 'client_wins' | 'server_wins' | 'latest_wins' | 'manual_merge';
  
  payload: T; // O dado canónico em si
}

// 4. ENTIDADES CANÓNICAS VS DERIVADAS
export type EntityNature = 'canonical' | 'derived';

export const ENTITY_NATURE_MAP: Record<string, EntityNature> = {
  'ManualAppLog': 'canonical',
  'SleepObservationSession': 'canonical',
  'CycleFeedbackRecord': 'canonical',
  'DailyProposalFeedback': 'canonical',
  'InternalTesterFeedback': 'canonical',
  
  // Derivados recalculáveis (não ocupam storage master)
  'BaselineSnapshots': 'derived',
  'DecisionOutcomes': 'derived',
  'ProfileSummaries': 'derived',
  'HomeState': 'derived',
  'SuitabilityAggregates': 'derived'
};

// 5. ESTRUTURA BASE PARA ENTIDADES CANÓNICAS IN-APP
// Todas as entidades principais do domínio devem vir a suportar este molde base
export interface SyncableBaseEntity {
  id?: string;             // Client-side generated ID
  remoteId?: string;       // Nullable até propagação
  installationId?: string; // Associar o nó de proveniência
  accountId?: string;      // Vinculo de Cloud Identity
  
  updatedAt?: string;      // ISO String for conflict resolution
  revision?: number;       // Increment lógico por mutação
}

// 6. SCOPES FUTUROS DE CONSENTIMENTO
export type FutureConsentScope = 
  | 'profile_storage' 
  | 'history_sync' 
  | 'sensing_sync' 
  | 'telemetry_sync' 
  | 'anonymized_learning' 
  | 'export_access';

// 7. POLÍTICA DE CONFLITOS FUTURA (Contrato Abstrato)
export interface SyncConflictPolicy {
  sourceOfTruthPreference: 'cloud_master' | 'local_master';
  resolutionStrategy: 'latest_timestamp' | 'manual_merge' | 'keep_both';
}
