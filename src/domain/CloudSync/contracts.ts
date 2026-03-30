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

// 4. ESTRUTURA BASE PARA ENTIDADES CANÓNICAS IN-APP
// Todas as entidades principais do domínio devem vir a suportar este molde base
export interface SyncableBaseEntity {
  id?: string;             // Client-side generated ID
  remoteId?: string;       // Nullable até propagação
  installationId?: string; // Associar o nó de proveniência
  accountId?: string;      // Vinculo de Cloud Identity
  
  updatedAt?: string;      // ISO String for conflict resolution
  revision?: number;       // Increment lógico por mutação
}

// 5. SCOPES FUTUROS DE CONSENTIMENTO
export type FutureConsentScope = 
  | 'profile_storage' 
  | 'history_sync' 
  | 'sensing_sync' 
  | 'telemetry_sync' 
  | 'anonymized_learning' 
  | 'export_access';
