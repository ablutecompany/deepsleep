import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AssessmentDeliverable } from '../domain/Phase2/engine';

interface Phase2ContextType {
  deliverable: AssessmentDeliverable | null;
  setDeliverable: (d: AssessmentDeliverable | null) => void;
  answersDraft: Record<string, string[]>;
  setAnswersDraft: (d: Record<string, string[]>) => void;
  clearDraft: () => void;
}

const Phase2StoreContext = createContext<Phase2ContextType | undefined>(undefined);

export function Phase2StoreProvider({ children }: { children: ReactNode }) {
  const [deliverable, setDeliverableState] = useState<AssessmentDeliverable | null>(() => {
    const saved = localStorage.getItem('deepsleep_phase2_deliverable');
    if (saved) {
      try {
        const parsed: AssessmentDeliverable = JSON.parse(saved);
        if (parsed.schemaVersion === 1) return parsed;
        localStorage.removeItem('deepsleep_phase2_deliverable'); // Purge stale
      } catch (e) {
        localStorage.removeItem('deepsleep_phase2_deliverable');
      }
    }
    return null;
  });

  const [answersDraft, setAnswersDraftState] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('deepsleep_phase2_draft');
    return saved ? JSON.parse(saved) : {};
  });

  const setDeliverable = (d: AssessmentDeliverable | null) => {
    setDeliverableState(d);
    if (d) {
      localStorage.setItem('deepsleep_phase2_deliverable', JSON.stringify(d));
    } else {
      localStorage.removeItem('deepsleep_phase2_deliverable');
    }
  };

  const setAnswersDraft = (d: Record<string, string[]>) => {
    setAnswersDraftState(d);
    localStorage.setItem('deepsleep_phase2_draft', JSON.stringify(d));
  };

  const clearDraft = () => {
    setAnswersDraftState({});
    localStorage.removeItem('deepsleep_phase2_draft');
  };

  return (
    <Phase2StoreContext.Provider value={{ deliverable, setDeliverable, answersDraft, setAnswersDraft, clearDraft }}>
      {children}
    </Phase2StoreContext.Provider>
  );
}

export function usePhase2Store() {
  const context = useContext(Phase2StoreContext);
  if (context === undefined) {
    throw new Error('usePhase2Store must be used within a Phase2StoreProvider');
  }
  return context;
}
