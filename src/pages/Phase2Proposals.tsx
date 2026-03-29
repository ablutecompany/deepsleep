import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, AlertTriangle, Calendar, Activity } from 'lucide-react';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { getProposals } from '../domain/Phase2/proposals';

export function Phase2Proposals() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();

  const proposals = getProposals(deliverable);



  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box', background: '#000' }}>
      <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer' }} onClick={() => navigate(-1)} />
      
      <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#F8FAFC', marginBottom: '16px' }}>
        As tuas propostas
      </h1>
      <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '22px', marginBottom: '32px' }}>
        Delineadas a partir da leitura direta das tuas noites e do teu contexto psíquico. Estas são as táticas iniciais preparatórias.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        {proposals.map((p, i) => (
          <div key={i} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#38BDF8', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                PRIORIDADE {i + 1}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#F8FAFC', marginBottom: '4px' }}>{p.title}</h3>
              <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: '22px' }}>{p.why}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Eye size={16} color="#94A3B8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '20px' }}>
                  <strong style={{ color: '#E2E8F0', fontWeight: 500 }}>Foca-te em:</strong> {p.observe}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <AlertTriangle size={16} color="#94A3B8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '20px' }}>
                  <strong style={{ color: '#E2E8F0', fontWeight: 500 }}>Ignorar se:</strong> {p.whenNotTo}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Calendar size={16} color="#94A3B8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '20px' }}>
                  <strong style={{ color: '#E2E8F0', fontWeight: 500 }}>Ciclo:</strong> {p.minWindow}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Activity size={16} color="#94A3B8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '20px' }}>
                  <strong style={{ color: '#E2E8F0', fontWeight: 500 }}>Impacto futuro:</strong> {p.future}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ paddingBottom: '80px' }}>
        <button 
          onClick={() => navigate('/phase3_home')}
          style={{ width: '100%', height: '56px', borderRadius: '8px', background: '#F8FAFC', color: '#0F172A', border: 'none', fontWeight: 500, letterSpacing: '1px', marginTop: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <span>INICIAR OBSERVÂNCIA (FASE 3)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
