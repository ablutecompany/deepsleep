import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { getProposals, getPriorityTest } from '../domain/Phase2/proposals';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Activity, ShieldCheck, MapPin } from 'lucide-react';

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
      <div className="home-page fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-core)', color: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#64748B', fontWeight: 300 }}>Acesso indisponível. Conclui primeiro a fase de interpretação contextual.</p>
        <button className="text-btn" style={{ marginTop: '24px', color: '#38BDF8' }} onClick={() => navigate('/phase2/entry')}>
          Retroceder
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
  
  let trendMsg = "Ainda sem sinal de fundo";
  if (loggedDaysCount < 3) trendMsg = "Leitura em aceleração inicial";
  else if (adherenceRate >= 0.7) trendMsg = "A ganhar tração e estabilidade tática";
  else if (adherenceRate <= 0.3) trendMsg = "Resistência massiva; incompatibilidade mecânica suspeita";

  const handleReview = (review: 'manter' | 'ajustar' | 'trocar') => {
    let rec = "";
    if (review === 'manter') rec = "Sinal suficiente para manter esta direção. Há coerência entre o baseline limpo de perturbações e as interações observadas.";
    else if (review === 'ajustar') rec = "A proposta atual revelou-se pouco compatível com o teu ritmo prático diário. Foi recomendada a redução de atrito.";
    else rec = "O teste atingiu a janela de prova com estabilidade, mas sem alteração biológica clara no baseline da Fase 1. A abordagem será redirecionada.";
    
    submitReview(review, rec);
  };

  return (
    <div className="home-page fade-in" style={{ padding: '0 0 100px 0', background: 'var(--bg-core)', position: 'relative' }}>
      
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px', display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
        
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/process_home')} />
        
        <header style={{ marginBottom: '40px' }}>
          <span className="kicker" style={{ color: '#10B981', marginBottom: '16px' }}>Direção Ativa · Observância</span>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            {cycle.status === 'active' ? "Em Percurso" : "Janela Concluída"}
          </h1>
        </header>

        <section className="editorial-card" style={{ marginBottom: '32px' }}>
          <h2 className="module-title" style={{ fontSize: '20px', marginBottom: '12px', color: '#F8FAFC' }}>{currentProposal.title}</h2>
          <p className="module-desc" style={{ marginBottom: '24px' }}>{cycle.selectionReason}</p>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Duração do trajeto</span>
              <span style={{ fontSize: '13px', color: isMinWindowReached ? '#10B981' : '#F8FAFC', fontWeight: 300 }}>{effectiveElapsed} de {cycle.minDays} noites focais</span>
            </div>
            
            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
               <div style={{ width: `${Math.min((effectiveElapsed / cycle.minDays) * 100, 100)}%`, height: '100%', background: isMinWindowReached ? '#10B981' : '#F8FAFC', transition: 'width 1s ease' }} />
            </div>
          </div>
        </section>

        {cycle.status === 'active' && !isMinWindowReached && (
          <div style={{ marginTop: 'auto', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748B', marginBottom: '16px', textAlign: 'center' }}>
              Posição Hoje ({todayStr.slice(5)})
            </h3>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => checkInToday('success')}
                className="ritual-trigger"
                style={{
                  flex: 1, padding: '24px 16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                  background: todayValue === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                  borderColor: todayValue === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.08)',
                  borderLeft: todayValue === 'success' ? '2px solid #10B981' : '1px solid rgba(255,255,255,0.08)',
                  color: todayValue === 'success' ? '#10B981' : '#F8FAFC'
                }}
              >
                <CheckCircle2 size={24} strokeWidth={1.5} />
                <span style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '0.5px' }}>Alinhado</span>
              </button>
              
              <button
                onClick={() => checkInToday('failed')}
                className="ritual-trigger"
                style={{
                  flex: 1, padding: '24px 16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                  background: todayValue === 'failed' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.02)',
                  borderColor: todayValue === 'failed' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.08)',
                  borderLeft: todayValue === 'failed' ? '2px solid #EF4444' : '1px solid rgba(255,255,255,0.08)',
                  color: todayValue === 'failed' ? '#EF4444' : '#F8FAFC'
                }}
              >
                <XCircle size={24} strokeWidth={1.5} />
                <span style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '0.5px' }}>Desalinhado</span>
              </button>
            </div>
            
            {todayValue && (
              <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', marginTop: '24px', fontWeight: 300 }}>
                Posição guardada sileciosamente. O trajeto continua amanhã.
              </p>
            )}
          </div>
        )}

        {cycle.status === 'active' && isMinWindowReached && (
          <div style={{ marginTop: 'auto', marginBottom: '24px' }}>
            
            <div className="editorial-card" style={{ background: 'transparent', padding: 0, border: 'none', marginBottom: '32px' }}>
              <h3 className="kicker" style={{ color: '#F8FAFC', marginBottom: '16px' }}>Leitura Parcial</h3>
              <p className="module-desc" style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#F8FAFC', fontWeight: 400 }}>{Math.round(adherenceRate * 100)}% de enquadramento prático.</strong>
              </p>
              <p className="module-desc">
                {trendMsg}.
              </p>
            </div>

            <h3 className="kicker" style={{ color: '#64748B', marginBottom: '16px' }}>Decisão Estratégica</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => handleReview('manter')} className="ritual-trigger" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '20px', borderRadius: '12px', borderLeftColor: '#F8FAFC' }}>
                <span style={{ fontWeight: 400, fontSize: '15px', color: '#F8FAFC' }}>Manter Rumo</span>
                <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 300, textAlign: 'left', lineHeight: '1.5' }}>Prolongar consolidacao. A estrutura atual deve maturar.</span>
              </button>
              
              <button onClick={() => handleReview('ajustar')} className="ritual-trigger" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '20px', borderRadius: '12px', borderLeftColor: '#F59E0B' }}>
                <span style={{ fontWeight: 400, fontSize: '15px', color: '#F8FAFC' }}>Reduzir Atrito</span>
                <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 300, textAlign: 'left', lineHeight: '1.5' }}>O plano tem exigência que a tua janela diária rejeita repetidamente.</span>
              </button>
              
              <button onClick={() => handleReview('trocar')} className="ritual-trigger" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '20px', borderRadius: '12px', borderLeftColor: '#EF4444' }}>
                <span style={{ fontWeight: 400, fontSize: '15px', color: '#F8FAFC' }}>Alterar Enfoque</span>
                <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 300, textAlign: 'left', lineHeight: '1.5' }}>Isolamento sintomático estéril. Procurar nova avenida transversal.</span>
              </button>
            </div>
          </div>
        )}

        {cycle.status !== 'active' && (
          <div style={{ marginTop: 'auto', marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MapPin size={32} color="#10B981" style={{ marginBottom: '24px', opacity: 0.8 }} strokeWidth={1.5} />
            <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '12px' }}>Tática Assente</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', maxWidth: '280px', fontWeight: 300 }}>
              A direção {cycle.reviewState} foi mapeada com sucesso na tua identidade central. Podes fechar a aplicação em segurança.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
