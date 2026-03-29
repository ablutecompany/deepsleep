import { createContext, useContext, useState, type ReactNode } from 'react';

export type CheckinValue = 'success' | 'failed' | 'skipped';

export interface Phase3Cycle {
  cycleId: string;
  proposalId: string;
  priorityScore: number;
  selectionReason: string;
  linkedAssessmentId: string;
  startedAt: string;
  minDays: number;
  dailyCheckins: Record<string, CheckinValue>; // Date string (YYYY-MM-DD): value
  status: 'active' | 'completed' | 'adjusted';
  reviewState?: 'manter' | 'ajustar' | 'trocar';
  finalRecommendation?: string;
}

interface Phase3ContextType {
  cycle: Phase3Cycle | null;
  startCycle: (proposalId: string, priorityScore: number, selectionReason: string, linkedAssessmentId: string, minDays: number) => void;
  checkInToday: (val: CheckinValue) => void;
  submitReview: (review: NonNullable<Phase3Cycle['reviewState']>, recommendation: string) => void;
}

const Phase3StoreContext = createContext<Phase3ContextType | undefined>(undefined);

export function Phase3StoreProvider({ children }: { children: ReactNode }) {
  const [cycle, setCycleState] = useState<Phase3Cycle | null>(() => {
    const saved = localStorage.getItem('deepsleep_phase3_cycle');
    return saved ? JSON.parse(saved) : null;
  });

  const saveCycle = (c: Phase3Cycle | null) => {
    setCycleState(c);
    if (c) {
      localStorage.setItem('deepsleep_phase3_cycle', JSON.stringify(c));
    } else {
      localStorage.removeItem('deepsleep_phase3_cycle');
    }
  };

  const startCycle = (proposalId: string, priorityScore: number, selectionReason: string, linkedAssessmentId: string, minDays: number) => {
    const newCycle: Phase3Cycle = {
      cycleId: 'cyc_' + Date.now(),
      proposalId,
      priorityScore,
      selectionReason,
      linkedAssessmentId,
      startedAt: new Date().toISOString(),
      minDays,
      dailyCheckins: {},
      status: 'active'
    };
    saveCycle(newCycle);
  };

  const checkInToday = (val: CheckinValue) => {
    if (!cycle) return;
    const todayStr = new Date().toISOString().split('T')[0];
    saveCycle({
      ...cycle,
      dailyCheckins: { ...cycle.dailyCheckins, [todayStr]: val }
    });
  };

  const submitReview = (review: NonNullable<Phase3Cycle['reviewState']>, recommendation: string) => {
    if (!cycle) return;
    saveCycle({
      ...cycle,
      status: review !== 'manter' ? 'adjusted' : 'completed',
      reviewState: review,
      finalRecommendation: recommendation
    });
  };

  return (
    <Phase3StoreContext.Provider value={{ cycle, startCycle, checkInToday, submitReview }}>
      {children}
    </Phase3StoreContext.Provider>
  );
}

export function usePhase3Store() {
  const context = useContext(Phase3StoreContext);
  if (context === undefined) {
    throw new Error('usePhase3Store must be used within a Phase3StoreProvider');
  }
  return context;
}
