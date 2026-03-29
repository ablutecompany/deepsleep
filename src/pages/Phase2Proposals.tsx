import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, AlertTriangle, Calendar, Activity } from 'lucide-react';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { getProposals } from '../domain/Phase2/proposals';

export function Phase2Proposals() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();

  const proposals = getProposals(deliverable);



  return (
    <div className="home-page fade-in" style={{ padding: '0 0 100px 0', background: 'var(--bg-core)' }}>
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate(-1)} />
        
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            Por onde<br />começar.
          </h1>
          <p style={{ marginTop: '12px', fontSize: '15px', color: '#94A3B8', fontWeight: 300, lineHeight: '1.5' }}>
            Partindo das tuas noites e do que mais está a agravar o descanso, este é o melhor ponto de partida.
          </p>
        </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', flex: 1 }}>
        {proposals.map((p, i) => (
          <div key={i} className="editorial-card" style={{ padding: '0 0 24px 0', borderBottom: i === proposals.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ marginBottom: '16px' }}>
              <span className="kicker" style={{ color: i === 0 ? '#38BDF8' : '#64748B', marginBottom: '8px' }}>
                PRIORIDADE {i + 1}
              </span>
              <h3 className="module-title" style={{ fontSize: '20px', color: '#F8FAFC', marginBottom: '8px' }}>{p.title}</h3>
              <p className="module-desc" style={{ color: '#E2E8F0', fontSize: '15px' }}>{p.why}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Eye size={14} color="#64748B" style={{ marginTop: '3px', flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', fontWeight: 300 }}>
                  <span style={{ color: '#64748B', display: 'block', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em', marginBottom: '2px' }}>Presta atenção a:</span>
                  {p.observe}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <AlertTriangle size={14} color="#64748B" style={{ marginTop: '3px', flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', fontWeight: 300 }}>
                  <span style={{ color: '#64748B', display: 'block', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em', marginBottom: '2px' }}>Evita esta proposta se:</span>
                  {p.whenNotTo}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Calendar size={14} color="#64748B" style={{ marginTop: '3px', flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', fontWeight: 300 }}>
                  <span style={{ color: '#64748B', display: 'block', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em', marginBottom: '2px' }}>Janela mínima:</span>
                  {p.minWindow}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Activity size={14} color="#64748B" style={{ marginTop: '3px', flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', fontWeight: 300 }}>
                  <span style={{ color: '#64748B', display: 'block', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em', marginBottom: '2px' }}>Porque vem antes:</span>
                  {p.future}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingBottom: '32px' }}>
        <button 
          onClick={() => navigate('/phase3_home')}
          className="primary-btn"
        >
          <span>Começar teste</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  </div>
  );
}
