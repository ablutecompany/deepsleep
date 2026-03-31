import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { appClock } from '../utils/appClock';
import { saveDefensiveSnapshot } from '../domain/DataGovernance/backupManager';
import type { SyncableBaseEntity } from '../domain/CloudSync/contracts';

export type CheckinValue = 'success' | 'failed' | 'skipped' | 'incerto';

export interface DailyProposalFeedback extends SyncableBaseEntity {
  id: string;
  dayKey: string;
  adherenceStatus: 'followed' | 'not_followed';
  executionEase?: 'natural' | 'effort' | 'very_difficult' | null;
  nonExecutionReason?: 'forgot' | 'no_conditions' | 'intentional' | null;
  submittedAt: string;
  isBetaSimulatedDay: boolean;
}

export interface Phase3Cycle extends SyncableBaseEntity {
  cycleId: string;
  proposalId: string;
  priorityScore: number;
  selectionReason: string;
  linkedAssessmentId: string;
  startedAt: string;
  minDays: number;
  dailyCheckins: Record<string, CheckinValue>; // Date string (YYYY-MM-DD): value
  dailyFeedback?: Record<string, DailyProposalFeedback>;
  status: 'active' | 'active_review_due' | 'completed_keep' | 'completed_adjust' | 'completed_switch' | 'active_hold' | 'pending_reassessment' | 'review_skipped_beta';
  reviewState?: 'manter' | 'ajustar' | 'trocar';
  finalRecommendation?: string;
  decisionEngineOutcome?: any; // To store full semantic results
}

interface Phase3ContextType {
  cycle: Phase3Cycle | null;
  todayStr: string;
  startCycle: (proposalId: string, priorityScore: number, selectionReason: string, linkedAssessmentId: string, minDays: number) => void;
  checkInToday: (val: CheckinValue, feedbackObj?: Partial<DailyProposalFeedback>) => void;
  submitReview: (decision: any) => void;
  skipReviewBeta: () => void;
}

const Phase3StoreContext = createContext<Phase3ContextType | undefined>(undefined);

export function Phase3StoreProvider({ children }: { children: ReactNode }) {
  const [cycle, setCycleState] = useState<Phase3Cycle | null>(() => {
    const saved = localStorage.getItem('deepsleep_phase3_cycle');
    const deliverableExists = localStorage.getItem('deepsleep_phase2_deliverable');
    
    // Limpeza de estados se o plano de Phase 2 desaparecer
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
      saveDefensiveSnapshot();
    } else {
      localStorage.removeItem('deepsleep_phase3_cycle');
      saveDefensiveSnapshot();
    }
  };

  const [todayStr, setTodayStr] = useState(() => appClock.todayStr());

  useEffect(() => {
    const handleInvalidation = () => setCycleState(null);
    const handleClock = () => setTodayStr(appClock.todayStr());
    
    window.addEventListener('deepsleep_baseline_invalidated', handleInvalidation);
    window.addEventListener('deepsleep_app_clock', handleClock);
    
    return () => {
      window.removeEventListener('deepsleep_baseline_invalidated', handleInvalidation);
      window.removeEventListener('deepsleep_app_clock', handleClock);
    };
  }, []);

  const startCycle = (proposalId: string, priorityScore: number, selectionReason: string, linkedAssessmentId: string, minDays: number) => {
    const newCycle: Phase3Cycle = {
      cycleId: 'cyc_' + Date.now(),
      proposalId,
      priorityScore,
      selectionReason,
      linkedAssessmentId,
      startedAt: appClock.now().toISOString(), // Keeping fallback ISO if not defined but driven by offset
      minDays,
      dailyCheckins: {},
      dailyFeedback: {},
      status: 'active'
    };
    saveCycle(newCycle);
  };

  const checkInToday = (val: CheckinValue, feedbackObj?: Partial<DailyProposalFeedback>) => {
    if (!cycle) return;
    const currentToday = appClock.todayStr();
    
    let builtFeedback = { ...(cycle.dailyFeedback || {}) };
    if (feedbackObj) {
      builtFeedback[currentToday] = {
        id: `fdbk_${Date.now()}`,
        dayKey: currentToday,
        adherenceStatus: val === 'success' ? 'followed' : 'not_followed',
        executionEase: feedbackObj.executionEase || null,
        nonExecutionReason: feedbackObj.nonExecutionReason || null,
        submittedAt: new Date().toISOString(),
        isBetaSimulatedDay: appClock.isSimulated(),
      };
    }
    
    saveCycle({
      ...cycle,
      dailyCheckins: { ...cycle.dailyCheckins, [currentToday]: val },
      dailyFeedback: builtFeedback
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

  const skipReviewBeta = () => {
    if (!cycle) return;
    saveCycle({
      ...cycle,
      status: 'review_skipped_beta',
      decisionEngineOutcome: null
    });
  };

  return (
    <Phase3StoreContext.Provider value={{ cycle, todayStr, startCycle, checkInToday, submitReview, skipReviewBeta }}>
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
