import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { getProposals } from '../domain/Phase2/proposals';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export function Phase3Home() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();
  const { cycle, startCycle, checkInToday, submitReview } = usePhase3Store();

  const [todayStr] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // If we have a deliverable but NO active cycle, start the top proposal automatically.
    // This removes the choice barrier as requested.
    if (deliverable && !cycle) {
      const topProposal = getProposals(deliverable)[0];
      if (topProposal) {
        startCycle(topProposal.id, deliverable.assessmentId, topProposal.minDays);
      }
    }
  }, [deliverable, cycle, startCycle]);

  if (!deliverable) {
    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#000', color: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#94A3B8' }}>A Fase 2 ainda não foi concluída.</p>
        <button className="primary-action-btn mt-6" onClick={() => navigate('/phase2/entry')}>
          Regressar à Fase 2
        </button>
      </div>
    );
  }

  if (!cycle) return null;

  const currentProposal = getProposals(deliverable).find(p => p.id === cycle.proposalId) || getProposals(deliverable)[0];
  
  const loggedDaysCount = Object.keys(cycle.dailyCheckins).length;
  const isMinWindowReached = loggedDaysCount >= cycle.minDays;
  const todayValue = cycle.dailyCheckins[todayStr];

  const handleReview = (review: 'manter' | 'ajustar' | 'trocar') => {
    submitReview(review);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box', background: '#000' }}>
      <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer' }} onClick={() => navigate('/process_home')} />
      
      <span className="kicker" style={{ color: '#38BDF8', marginBottom: '8px', display: 'block' }}>Fase 3 · Observância</span>
      <h1 className="title-large" style={{ fontSize: '32px', marginBottom: '24px', color: '#F8FAFC' }}>
        Teste Ativo
      </h1>

      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#F8FAFC', marginBottom: '12px' }}>{currentProposal.title}</h2>
        <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '22px', marginBottom: '16px' }}>{currentProposal.why}</p>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#64748B' }}>Progresso da janela:</span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: isMinWindowReached ? '#10B981' : '#F8FAFC' }}>
            {loggedDaysCount} / {cycle.minDays} dias
          </span>
        </div>
      </div>

      {cycle.status === 'active' && !isMinWindowReached && (
        <div style={{ marginTop: 'auto', marginBottom: '40px' }}>
          <p style={{ color: '#F8FAFC', fontSize: '16px', marginBottom: '16px', textAlign: 'center' }}>
            A adesão hoje ({todayStr.slice(5)})
          </p>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => checkInToday('success')}
              style={{
                flex: 1, padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                background: todayValue === 'success' ? '#10B981' : '#1E293B',
                border: `1px solid ${todayValue === 'success' ? '#10B981' : '#334155'}`,
                color: todayValue === 'success' ? '#000' : '#F8FAFC', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              <CheckCircle2 size={24} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Consegui</span>
            </button>
            <button
              onClick={() => checkInToday('failed')}
              style={{
                flex: 1, padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                background: todayValue === 'failed' ? '#EF4444' : '#1E293B',
                border: `1px solid ${todayValue === 'failed' ? '#EF4444' : '#334155'}`,
                color: todayValue === 'failed' ? '#FFF' : '#F8FAFC', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              <XCircle size={24} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Não deu</span>
            </button>
          </div>
          {todayValue && (
            <p style={{ fontSize: '12px', color: '#64748B', textAlign: 'center', marginTop: '16px' }}>Registo guardado. Volta amanhã.</p>
          )}
        </div>
      )}

      {cycle.status === 'active' && isMinWindowReached && (
        <div style={{ marginTop: 'auto', marginBottom: '40px', background: 'rgba(56, 189, 248, 0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
          <h3 style={{ fontSize: '18px', color: '#38BDF8', marginBottom: '16px', fontWeight: 500 }}>Revisão de Ciclo</h3>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '24px', lineHeight: '22px' }}>
            A janela mínima de teste({cycle.minDays} dias) foi atingida. Já notaste alguma tendência clara de alteração nos bloqueios que nos trouxeram até aqui?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={() => handleReview('manter')}
              style={{ width: '100%', padding: '16px', borderRadius: '8px', background: '#F8FAFC', color: '#0F172A', border: 'none', fontWeight: 500 }}
            >
              Caminho Certo (Manter)
            </button>
            <button 
              onClick={() => handleReview('ajustar')}
              style={{ width: '100%', padding: '16px', borderRadius: '8px', background: '#1E293B', color: '#F8FAFC', border: '1px solid #334155', fontWeight: 500 }}
            >
              Difícil cumprir (Ajustar agora)
            </button>
            <button 
              onClick={() => handleReview('trocar')}
              style={{ width: '100%', padding: '16px', borderRadius: '8px', background: 'transparent', color: '#94A3B8', border: '1px solid transparent', fontWeight: 500 }}
            >
              Sem efeito (Trocar de teste)
            </button>
          </div>
        </div>
      )}

      {cycle.status !== 'active' && (
        <div style={{ marginTop: 'auto', marginBottom: '40px', textAlign: 'center' }}>
          <RotateCcw size={32} color="#10B981" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', color: '#F8FAFC', marginBottom: '8px' }}>Avaliação Concluída</h3>
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>
            O resultado da tua fase de observância ({cycle.reviewState}) foi guardado no teu Perfil e guiará os próximos passos orgânicos da app. Nenhuma ação iminente necessária.
          </p>
        </div>
      )}

    </div>
  );
}
