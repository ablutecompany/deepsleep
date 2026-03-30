import type { SyncableBaseEntity } from '../CloudSync/contracts';

export interface BetaFeedbackRecord extends SyncableBaseEntity {
  id: string;
  category: string;
  route: string;
  note?: string;
  timestamp: string;
  linkedCycleId?: string;
}

export function getBetaFeedbackRecords(): BetaFeedbackRecord[] {
  const data = localStorage.getItem('deepsleep_beta_feedback');
  return data ? JSON.parse(data) : [];
}

export function saveBetaFeedback(feedback: Omit<BetaFeedbackRecord, 'id' | 'timestamp'>) {
  const records = getBetaFeedbackRecords();
  const newRecord: BetaFeedbackRecord = {
    ...feedback,
    id: `bfdbk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  records.push(newRecord);
  localStorage.setItem('deepsleep_beta_feedback', JSON.stringify(records));
}
