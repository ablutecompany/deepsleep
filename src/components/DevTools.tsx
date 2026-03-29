import { useState } from 'react';
import { Database, RotateCcw, FastForward, CheckCircle, Activity, Bug, Moon, Clock, UserX } from 'lucide-react';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { usePhase3Store } from '../store/Phase3ContextStore';

// SEEDED USERS COERENTES
const PROFILES = {
  A: {
    nightCount: 5,
    deliverable: {
      schemaVersion: 1, assessmentId: "seed_A", createdAt: new Date().toISOString(), mode: "short", selectedQuestionIds: [],
      rawResponses: {}, factorScores: {}, flags: ["Medo de não dormir agudo"], contradictions: [], confidence: 92,
      temporalProfile: "Padrão fragmentado inicial", dominantDrivers: ["P2"], secondaryDrivers: [],
      proposalConstraints: ["Nenhuma"], proposalOpportunities: ["Alta consistência de horários"]
    }
  },
  B: {
    nightCount: 5,
    deliverable: {
      schemaVersion: 1, assessmentId: "seed_B", createdAt: new Date().toISOString(), mode: "short", selectedQuestionIds: [],
      rawResponses: {}, factorScores: {}, flags: ["Noctúria presente", "Excesso de tempo na cama"], contradictions: [], confidence: 85,
      temporalProfile: "Despertares contínuos a meio da noite", dominantDrivers: ["C1"], secondaryDrivers: [],
      proposalConstraints: ["Nenhuma"], proposalOpportunities: []
    }
  },
  C: {
    nightCount: 5,
    deliverable: {
      schemaVersion: 1, assessmentId: "seed_C", createdAt: new Date().toISOString(), mode: "short", selectedQuestionIds: [],
      rawResponses: {}, factorScores: {}, flags: ["Trabalho por turnos detetado"], contradictions: [], confidence: 78,
      temporalProfile: "Ritmo invertido irregular", dominantDrivers: ["F1", "C4"], secondaryDrivers: [],
      proposalConstraints: ["Horário letivo/trabalho fixo impossível"], proposalOpportunities: ["Controlo rígido de luz no quarto"]
    }
  },
  D: {
    nightCount: 5,
    deliverable: {
      schemaVersion: 1, assessmentId: "seed_D", createdAt: new Date().toISOString(), mode: "short", selectedQuestionIds: [],
      rawResponses: {}, factorScores: {}, flags: ["Alta carga emocional/Cuidadores"], contradictions: [], confidence: 88,
      temporalProfile: "Latência de sono severa", dominantDrivers: ["F18", "P1"], secondaryDrivers: [],
      proposalConstraints: ["Responsabilidades familiares noturnas"], proposalOpportunities: ["Boa resposta a técnicas passivas"]
    }
  }
};

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const { setDeliverable } = usePhase2Store();
  const { startCycle } = usePhase3Store();

  const softReload = () => {
    window.dispatchEvent(new Event('deepsleep_simulated_change'));
    // Fallback refresh se estiver em rotas que dependem de consts puras de mount
    if (window.location.pathname.includes('/phase')) {
       window.location.href = window.location.pathname; 
    }
  };

  const clearAll = () => {
    localStorage.clear();
    setDeliverable(null);
    window.location.href = '/';
  };

  const loadProfile = (profileKey: keyof typeof PROFILES) => {
    localStorage.clear();
    const p = PROFILES[profileKey];
    localStorage.setItem('nightCount', p.nightCount.toString());
    localStorage.setItem('profileTooltipSeen', 'true');
    setDeliverable(p.deliverable as any);
    window.location.href = '/phase2/proposals';
  };

  const simulateNight = (type: 'boa' | 'fragmentada' | 'curta') => {
    let current = parseInt(localStorage.getItem('nightCount') || '0', 10);
    current += 1;
    localStorage.setItem('nightCount', current.toString());
    
    // In a real product, here we'd inject simulated metrics to the biometric layer.
    // For this horizontal vertical slice, we mock Phase1 progress smoothly.
    softReload();
  };

  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        style={{ position: 'fixed', bottom: '24px', right: '24px', width: '20px', height: '20px', borderRadius: '50%', background: 'transparent', border: '1px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 9999, opacity: 0.05 }}
        title="Product Test Mode"
      >
        <Bug size={10} color="#F8FAFC" />
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: '16px', right: '16px', width: '340px', background: '#020203', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', zIndex: 9999, boxShadow: '0 16px 40px rgba(0,0,0,0.8)', color: '#F8FAFC' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '10px', fontWeight: 600, color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>Product Validation Mode</h3>
        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '12px' }}>Fechar</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button onClick={clearAll} style={btnStyle('#EF4444', 'rgba(239, 68, 68, 0.1)')}>
          <RotateCcw size={14} /> 0. Hard Reset (Zero Utilizador)
        </button>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '8px' }}>
          <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Simulador de Noites (Fase 1)</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => simulateNight('boa')} style={btnStyle('#10B981', 'transparent', true)}><Moon size={12}/> Boa</button>
            <button onClick={() => simulateNight('fragmentada')} style={btnStyle('#F59E0B', 'transparent', true)}><Activity size={12}/> Frag</button>
            <button onClick={() => simulateNight('curta')} style={btnStyle('#EF4444', 'transparent', true)}><Clock size={12}/> Curta</button>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '8px' }}>
          <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Perfis Seed (Avançar p/ Propostas)</p>
          <button onClick={() => loadProfile('A')} style={btnStyle('#A855F7', 'transparent')}><UserX size={14} /> Perfil A: Medo de não dormir</button>
          <button onClick={() => loadProfile('B')} style={btnStyle('#38BDF8', 'transparent')}><UserX size={14} /> Perfil B: Noctúria / Bexiga</button>
          <button onClick={() => loadProfile('C')} style={btnStyle('#F59E0B', 'transparent')}><UserX size={14} /> Perfil C: Trabalhador de Turnos</button>
          <button onClick={() => loadProfile('D')} style={btnStyle('#F43F5E', 'transparent')}><UserX size={14} /> Perfil D: Carga Mental Aguda</button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = (color: string, bg = 'transparent', flex = false) => ({
  flex: flex ? 1 : 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
  background: bg, color: color, border: `1px solid ${bg === 'transparent' ? 'rgba(255,255,255,0.1)' : bg}`,
  borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', textAlign: 'left' as const
});
