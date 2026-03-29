import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { getProposals, getPriorityTest } from '../domain/Phase2/proposals';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Activity } from 'lucide-react';

export function Phase3Home() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();
  const { cycle, startCycle, checkInToday, submitReview } = usePhase3Store();

  const [todayStr] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (deliverable && !cycle) {
      const priority = getPriorityTest(deliverable);
      const matchedProposal = getProposals(deliverable).find(p => p.id === priority.primaryProposalId);
      
      if (matchedProposal) {
        startCycle(
          priority.primaryProposalId,
          priority.priorityScore,
          priority.selectionReason,
          deliverable.assessmentId,
          matchedProposal.minDays
        );
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
  
  const checkinsList = Object.values(cycle.dailyCheckins);
  const loggedDaysCount = checkinsList.length;
  // Fallback para demodata se elapsed der negativo (timezones ou edge cases):
  const daysElapsed = Math.max(0, Math.floor((Date.now() - new Date(cycle.startedAt).getTime()) / 86400000));
  
  // Numa demo real, `daysElapsed` pode ser 0 e bloquear o review. Assumimos o maior entre elapsed real e numero de checkins.
  const effectiveElapsed = Math.max(daysElapsed, loggedDaysCount);
  const isMinWindowReached = effectiveElapsed >= cycle.minDays;
  
  const todayValue = cycle.dailyCheckins[todayStr];

  // Cálculos de comparação e sinal
  const successCount = checkinsList.filter(c => c === 'success').length;
  const adherenceRate = loggedDaysCount > 0 ? successCount / loggedDaysCount : 0;
  
  let trendMsg = "ainda sem sinal claro";
  if (loggedDaysCount < 3) trendMsg = "leitura ainda prematura";
  else if (adherenceRate >= 0.7) trendMsg = "tendência a melhorar";
  else if (adherenceRate <= 0.3) trendMsg = "sem melhoria visível";

  const handleReview = (review: 'manter' | 'ajustar' | 'trocar') => {
    let rec = "";
    if (review === 'manter') rec = "Sinal suficiente para manter esta direção. Há coerência entre o baseline limpo de perturbações e as interações observadas.";
    else if (review === 'ajustar') rec = "A proposta atual revelou-se pouco compatível com o teu ritmo prático diário. Foi recomendada a redução de atrito.";
    else rec = "O teste atingiu a janela de prova com estabilidade, mas sem alteração biológica clara no baseline da Fase 1. A abordagem será redirecionada.";
    
    submitReview(review, rec);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box', background: '#000' }}>
      <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer' }} onClick={() => navigate('/process_home')} />
      
      <span className="kicker" style={{ color: '#38BDF8', marginBottom: '8px', display: 'block' }}>Fase 3 · Observância</span>
      <h1 className="title-large" style={{ fontSize: '32px', marginBottom: '24px', color: '#F8FAFC' }}>
        Teste Ativo
      </h1>

      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#F8FAFC', marginBottom: '8px' }}>{currentProposal.title}</h2>
        <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '22px', marginBottom: '16px' }}>{cycle.selectionReason}</p>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748B' }}>Dias decorridos do teste:</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: isMinWindowReached ? '#10B981' : '#F8FAFC' }}>
              {effectiveElapsed} / {cycle.minDays} dias
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748B' }}>Dias com registo de ação:</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#F8FAFC' }}>
              {loggedDaysCount}
            </span>
          </div>
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
        <div style={{ marginTop: 'auto', marginBottom: '24px', background: 'rgba(30, 41, 59, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid #1E293B' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Activity size={18} color="#38BDF8" />
            <h3 style={{ fontSize: '16px', color: '#38BDF8', fontWeight: 500, margin: 0 }}>Comparação: Antes vs Durante</h3>
          </div>
          
          <div style={{ marginBottom: '24px', paddingLeft: '26px' }}>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '6px' }}>
              Taxa de adaptação tática: <strong style={{ color: '#F8FAFC', fontWeight: 500 }}>{Math.round(adherenceRate * 100)}%</strong>
            </p>
            <p style={{ fontSize: '14px', color: '#94A3B8' }}>
              Leitura face ao Baseline Inicial: <strong style={{ color: '#F8FAFC', fontWeight: 500 }}>{trendMsg}</strong>
            </p>
          </div>

          <h3 style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Decisão Pós-Janela</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button 
              onClick={() => handleReview('manter')}
              style={{ width: '100%', padding: '16px', borderRadius: '8px', background: '#F8FAFC', color: '#0F172A', border: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <span style={{ fontWeight: 600, fontSize: '15px' }}>Manter Caminho</span>
              <span style={{ fontSize: '12px', color: '#475569', fontWeight: 400 }}>Porque manter: Adesão estruturada que pede consolidação tática.</span>
            </button>
            <button 
              onClick={() => handleReview('ajustar')}
              style={{ width: '100%', padding: '16px', borderRadius: '8px', background: '#1E293B', color: '#F8FAFC', border: '1px solid #334155', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <span style={{ fontWeight: 500, fontSize: '15px' }}>Ajustar Complexidade</span>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Porque ajustar: Rigidez sentida face ao teu contexto prático.</span>
            </button>
            <button 
              onClick={() => handleReview('trocar')}
              style={{ width: '100%', padding: '16px', borderRadius: '8px', background: 'transparent', color: '#94A3B8', border: '1px solid #1E293B', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <span style={{ fontWeight: 500, fontSize: '15px' }}>Pausar e Substituir Teste</span>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Porque trocar: Nenhuma vibração detetável. Isolamento errado.</span>
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
