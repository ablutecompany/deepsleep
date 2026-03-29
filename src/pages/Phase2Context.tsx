import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { FACTOR_LABELS, FACTOR_DESCRIPTIONS } from '../domain/Phase2/interpreter';

function getConfidenceLabel(confidence: number): string {
  if (confidence < 60) return "Leitura inicial";
  if (confidence < 75) return "Útil, mas ainda a estabilizar";
  if (confidence < 90) return "Leitura forte e consistente";
  return "Leitura altamente estável";
}

export function Phase2Context() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();

  if (!deliverable) {
    return (
      <div className="home-page fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-core)', color: '#F8FAFC', padding: '24px', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#64748B', fontWeight: 300, textAlign: 'center', lineHeight: '1.6' }}>Não foi possível concluir o cálculo contextual ou não existem respostas suficientes gravadas.</p>
        <button onClick={() => navigate('/phase2/entry', { replace: true })} style={{ marginTop: '32px', color: '#38BDF8', padding: '12px 24px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', cursor: 'pointer', border: 'none' }} className="text-btn">
          Tentar novamente
        </button>
      </div>
    );
  }

  // Determine pattern text
  const patternLabels: Record<string, { label: string, desc: string }> = {
    'DIFICULDADE_ADORMECIMENTO': { label: 'Latência Prolongada', desc: 'A medição base assinala dificuldade na transição inicial para o sono.' },
    'FRAGMENTACAO_MANUTENCAO': { label: 'Fragmentação do Sono', desc: 'A noite apresenta quebras e despertares frequentes que afetam a continuidade.' },
    'REENTRADA_DESPERTAR': { label: 'Dificuldade de Reentrada', desc: 'O padrão central aponta para despertares mantidos a meio da noite, com dificuldade em retomar o sono.' },
    'IRREGULARIDADE_HORARIOS': { label: 'Irregularidade Circadiana', desc: 'Os horários medidos indicam variabilidade ou ausência de rotina térmica/estável.' },
    'COMPONENTE_ORGANICA': { label: 'Impacto Físico Direto', desc: 'Sinais orgânicos ou físicos destacam-se como interrupção primária nas noites medidas.' },
    'INDEFINIDO': { label: 'Padrão Distribuído', desc: 'O perfil atual não isola um único mecanismo dominante.' }
  };

  const patternData = patternLabels[deliverable.primarySleepPattern] || patternLabels['INDEFINIDO'];
  const secondaryPatternData = deliverable.secondarySleepPattern ? (patternLabels[deliverable.secondarySleepPattern] || null) : null;

  // Sub-context
  const dom = deliverable?.contextualDrivers?.[0] || deliverable?.dominantDrivers?.[0];
  const sec = deliverable?.contextualDrivers?.[1] || deliverable?.secondaryDrivers?.[0];

  const primaryContextLabel = dom && FACTOR_LABELS[dom] ? FACTOR_LABELS[dom] : 'Causas distribuídas / multifatoriais';
  const primaryContextDesc = dom && FACTOR_DESCRIPTIONS[dom] ? FACTOR_DESCRIPTIONS[dom] : null;

  const secondaryContextLabel = sec && FACTOR_LABELS[sec] ? FACTOR_LABELS[sec] : null;
  const secondaryContextDesc = sec && FACTOR_DESCRIPTIONS[sec] ? FACTOR_DESCRIPTIONS[sec] : null;

  return (
    <div className="home-page fade-in" style={{ background: 'var(--bg-core)' }}>
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
        
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/phase2/entry')} />
        
        <header style={{ marginBottom: '40px' }}>
          <span className="kicker" style={{ color: '#A855F7', marginBottom: '16px' }}>Leitura Inicial</span>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2' }}>Contexto<br />Sugerido.</h1>
          <p style={{ marginTop: '12px', fontSize: '15px', color: '#94A3B8', fontWeight: 300, lineHeight: '1.5' }}>
            Baseado nas tuas noites e respostas. {getConfidenceLabel(deliverable.patternConfidence || deliverable.confidence)}.
          </p>
        </header>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="editorial-card">
            <h3 className="kicker" style={{ color: '#F8FAFC' }}>Padrão Base Predominante</h3>
            <h2 className="module-title" style={{ marginTop: '8px', marginBottom: '8px', fontSize: '20px' }}>{patternData.label}</h2>
            <p className="module-desc">{patternData.desc}</p>
          </div>

          {secondaryPatternData && (
             <div className="editorial-card" style={{ background: 'transparent', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '20px', paddingRight: 0, paddingBottom: 0, paddingTop: '8px', marginTop: '-16px' }}>
               <h3 className="kicker" style={{ color: '#94A3B8' }}>Padrão Concorrente (Fase 1)</h3>
               <h2 className="module-title" style={{ marginTop: '8px', marginBottom: '8px', fontSize: '18px', color: '#E2E8F0' }}>{secondaryPatternData.label}</h2>
               <p className="module-desc">{secondaryPatternData.desc}</p>
             </div>
          )}

          <div className="editorial-card" style={{ background: 'transparent', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '20px', paddingRight: 0, paddingBottom: 0, paddingTop: '8px' }}>
            <h3 className="kicker" style={{ color: '#94A3B8' }}>Sub-motivos Apurados (Fase 2)</h3>
            <h2 className="module-title" style={{ marginTop: '8px', marginBottom: '8px', fontSize: '18px', color: '#E2E8F0' }}>{primaryContextLabel}</h2>
            {primaryContextDesc && <p className="module-desc">{primaryContextDesc.weight}</p>}
          </div>

          {secondaryContextLabel && (
            <div className="editorial-card" style={{ background: 'transparent', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '20px', paddingRight: 0, paddingBottom: 0, paddingTop: '8px', marginTop: '-16px' }}>
              <h2 className="module-title" style={{ marginTop: '0', marginBottom: '8px', fontSize: '18px', color: '#E2E8F0' }}>{secondaryContextLabel}</h2>
              {secondaryContextDesc && <p className="module-desc">{secondaryContextDesc.weight}</p>}
            </div>
          )}

          {deliverable.hiddenFactorIndex > 1.4 && (
            <div className="editorial-card" style={{ background: 'rgba(56, 189, 248, 0.03)', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
              <h3 className="kicker" style={{ color: '#38BDF8' }}>Ainda não é claro</h3>
              <p className="module-desc" style={{ marginTop: '12px', color: '#94A3B8' }}>
                Ainda persistem incongruências face a algumas das repostas fornecidas. A leitura precisará de continuar com precaução enquanto recolhemos mais noites reais.
              </p>
            </div>
          )}

          <div style={{ marginTop: '16px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="kicker" style={{ color: '#94A3B8', marginBottom: '24px' }}>Direção a considerar em teste</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {primaryContextDesc && (
                <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#F8FAFC', marginTop: '10px', flexShrink: 0 }}></div>
                  <span style={{ fontSize: '15px', color: '#E2E8F0', lineHeight: '1.6', fontWeight: 300 }}>{primaryContextDesc.testFirst}</span>
                </li>
              )}
              {deliverable.proposalOpportunities.map((opp, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#64748B', marginTop: '10px', flexShrink: 0 }}></div>
                  <span style={{ fontSize: '15px', color: '#94A3B8', lineHeight: '1.6', fontWeight: 300 }}>{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div style={{ marginTop: '64px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button 
            onClick={() => navigate('/phase2/proposals')}
            className="primary-btn"
          >
            <span>Ver propostas de ação</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
