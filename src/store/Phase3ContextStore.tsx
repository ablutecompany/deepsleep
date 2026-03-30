import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type CheckinValue = 'success' | 'failed' | 'skipped' | 'incerto';

export interface Phase3Cycle {
  cycleId: string;
  proposalId: string;
  priorityScore: number;
  selectionReason: string;
  linkedAssessmentId: string;
  startedAt: string;
  minDays: number;
  dailyCheckins: Record<string, CheckinValue>; // Date string (YYYY-MM-DD): value
  status: 'active' | 'active_review_due' | 'completed_keep' | 'completed_adjust' | 'completed_switch' | 'active_hold' | 'pending_reassessment';
  reviewState?: 'manter' | 'ajustar' | 'trocar';
  finalRecommendation?: string;
  decisionEngineOutcome?: any; // To store full semantic results
}

interface Phase3ContextType {
  cycle: Phase3Cycle | null;
  startCycle: (proposalId: string, priorityScore: number, selectionReason: string, linkedAssessmentId: string, minDays: number) => void;
  checkInToday: (val: CheckinValue) => void;
  submitReview: (decision: any) => void;
}

const Phase3StoreContext = createContext<Phase3ContextType | undefined>(undefined);

export function Phase3StoreProvider({ children }: { children: ReactNode }) {
  const [cycle, setCycleState] = useState<Phase3Cycle | null>(() => {
    const saved = localStorage.getItem('deepsleep_phase3_cycle');
    const deliverableExists = localStorage.getItem('deepsleep_phase2_deliverable');
    
    // Purga agressiva de estados se houver desamparo (hidratação limpa)
    if (saved && !deliverableExists) {
       localStorage.removeItem('deepsleep_phase3_cycle');
       return null;
    }
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Fallback de upgrade: forçar apagar ciclos velhos da schema anterior p/ n crashar
        if (parsed.status === 'completed' || parsed.status === 'adjusted') {
          localStorage.removeItem('deepsleep_phase3_cycle');
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const saveCycle = (c: Phase3Cycle | null) => {
    setCycleState(c);
    if (c) {
      localStorage.setItem('deepsleep_phase3_cycle', JSON.stringify(c));
    } else {
      localStorage.removeItem('deepsleep_phase3_cycle');
    }
  };

  useEffect(() => {
    const handleInvalidation = () => {
      setCycleState(null);
    };
    window.addEventListener('deepsleep_baseline_invalidated', handleInvalidation);
    return () => window.removeEventListener('deepsleep_baseline_invalidated', handleInvalidation);
  }, []);

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

  const submitReview = (decision: any) => {
    if (!cycle) return;
    
    let nextStatus: Phase3Cycle['status'] = 'completed_keep';
    if (decision.status === 'maintain') nextStatus = 'completed_keep';
    else if (decision.status === 'adjust') nextStatus = 'completed_adjust';
    else if (decision.status === 'switch') nextStatus = 'completed_switch';
    else if (decision.status === 'hold') nextStatus = 'active_hold';
    else if (decision.status === 'reassess') nextStatus = 'pending_reassessment';

    saveCycle({
      ...cycle,
      status: nextStatus,
      decisionEngineOutcome: decision
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
