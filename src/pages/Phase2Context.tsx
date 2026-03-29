import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { FACTOR_LABELS, FACTOR_DESCRIPTIONS } from '../domain/Phase2/interpreter';

export function Phase2Context() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();

  if (!deliverable) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#000', color: '#F8FAFC', padding: '24px', justifyContent: 'center', alignItems: 'center' }}>
        <p>Ainda não há dados contextuais gerados.</p>
        <button onClick={() => navigate('/phase2/entry')} style={{ marginTop: '24px', background: '#334155', color: '#F8FAFC', padding: '12px 24px', borderRadius: '8px', border: 'none' }}>
          Voltar ao início
        </button>
      </div>
    );
  }

  const dom = deliverable.dominantDrivers[0];
  const sec = deliverable.secondaryDrivers[0];

  const primaryLabel = dom && FACTOR_LABELS[dom] ? FACTOR_LABELS[dom] : 'Causas distribuídas / multifatoriais';
  const primaryDesc = dom && FACTOR_DESCRIPTIONS[dom] ? FACTOR_DESCRIPTIONS[dom] : null;

  const secondaryLabel = sec && FACTOR_LABELS[sec] ? FACTOR_LABELS[sec] : null;
  const secondaryDesc = sec && FACTOR_DESCRIPTIONS[sec] ? FACTOR_DESCRIPTIONS[sec] : null;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box', background: '#000' }}>
      <header style={{ marginBottom: '40px', marginTop: '16px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 500, color: '#F8FAFC', lineHeight: '40px' }}>
          Leitura contextual
        </h1>
        <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '8px' }}>
          Síntese comportamental com {deliverable.confidence}% de certeza.
        </p>
      </header>

      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#64748B', marginBottom: '16px', textTransform: 'uppercase' }}>O que está a pesar mais</h3>
        <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#F8FAFC', marginBottom: '8px' }}>{primaryLabel}</h2>
          {primaryDesc && <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '22px' }}>{primaryDesc.weight}</p>}
        </div>
      </section>

      {secondaryLabel && (
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#64748B', marginBottom: '16px', textTransform: 'uppercase' }}>O que pode estar a agravar</h3>
          <div style={{ background: 'transparent', border: '1px solid #1E293B', borderRadius: '12px', padding: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#E2E8F0', marginBottom: '8px' }}>{secondaryLabel}</h2>
            {secondaryDesc && <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '22px' }}>{secondaryDesc.weight}</p>}
          </div>
        </section>
      )}

      {deliverable.hiddenFactorIndex > 1.4 && (
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#64748B', marginBottom: '16px', textTransform: 'uppercase' }}>O que ainda não está claro</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px 20px', borderLeft: '3px solid #38BDF8' }}>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '22px' }}>
              Existem pequenos sinais de defesa nas tuas escolhas. Pode haver um fator escondido ou uma causa física dissimulada que ainda estamos a subpercepcionar.
            </p>
          </div>
        </section>
      )}

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#64748B', marginBottom: '16px', textTransform: 'uppercase' }}>Onde vale a pena testar primeiro</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {primaryDesc && (
            <li style={{ position: 'relative', paddingLeft: '20px', fontSize: '14px', color: '#F8FAFC', marginBottom: '12px', lineHeight: '22px' }}>
              <span style={{ position: 'absolute', left: 0, top: '6px', width: '6px', height: '6px', borderRadius: '50%', background: '#38BDF8' }}></span>
              {primaryDesc.testFirst}
            </li>
          )}
          {deliverable.proposalOpportunities.map((opp, idx) => (
            <li key={idx} style={{ position: 'relative', paddingLeft: '20px', fontSize: '14px', color: '#F8FAFC', marginBottom: '12px', lineHeight: '22px' }}>
              <span style={{ position: 'absolute', left: 0, top: '6px', width: '6px', height: '6px', borderRadius: '50%', background: '#38BDF8' }}></span>
              {opp}
            </li>
          ))}
        </ul>
      </section>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => navigate('/phase2/proposals')}
          style={{ width: '100%', height: '56px', borderRadius: '8px', background: '#F8FAFC', color: '#0F172A', border: 'none', fontWeight: 500, letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <span>Avançar para propostas</span>
          <ArrowRight size={18} />
        </button>

        <button 
          onClick={() => navigate('/phase2/questions')}
          style={{ width: '100%', background: 'transparent', color: '#64748B', border: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
        >
          <ChevronLeft size={16} />
          Voltar às respostas
        </button>
      </div>
    </div>
  );
}
