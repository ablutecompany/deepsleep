import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { getProposals, getPriorityTest } from '../domain/Phase2/proposals';
import { generateLearningPayload } from '../domain/Phase3/learningStore';
import { REVIEW_BANK } from '../domain/Questions/adaptive';
import { appClock } from '../utils/appClock';
import { trackEvent } from '../domain/Telemetry/tracker';
import { ArrowLeft, CheckCircle2, XCircle, MapPin } from 'lucide-react';

export function Phase3Home() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();
  const { cycle, todayStr, startCycle, checkInToday, submitReview, skipReviewBeta } = usePhase3Store();

  const [reviewStep, setReviewStep] = useState(0);
  const [adesao, setAdesao] = useState('');
  const [dificuldade, setDificuldade] = useState('');
  const [efeito, setEfeito] = useState('');

  const [dailyStep, setDailyStep] = useState(0);
  const [dailyAdherence, setDailyAdherence] = useState<'success' | 'failed' | 'incerto' | null>(null);
  
  const activeProposal = cycle && deliverable ? getProposals(deliverable).find(p => p.id === cycle.proposalId) : null;
  const familyKey = activeProposal?.id ? activeProposal.id.toUpperCase() : 'DEFAULT';
  const adaptiveSet = REVIEW_BANK[familyKey] || REVIEW_BANK['DEFAULT'];

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
    } else if (cycle && cycle.status === 'active') {
      trackEvent('active_guidance_viewed', { linkedCycleId: cycle.cycleId, linkedGuidanceId: cycle.proposalId });
    }
  }, [deliverable, cycle, startCycle]);

  if (!deliverable) {
    return (
      <div className="home-page fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-core)', color: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#64748B', fontWeight: 300 }}>Ainda não tens um plano ativo.</p>
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
  const daysElapsed = Math.max(0, Math.floor((appClock.now().getTime() - new Date(cycle.startedAt).getTime()) / 86400000));
  
  // Numa demo real, `daysElapsed` pode ser 0 e bloquear o review. Assumimos o maior entre elapsed real e numero de checkins.
  const effectiveElapsed = Math.max(daysElapsed, loggedDaysCount);
  const isMinWindowReached = effectiveElapsed >= cycle.minDays;
  
  const todayValue = cycle.dailyCheckins[todayStr];

  // Cálculos de comparação e sinal
  const successCount = checkinsList.filter(c => c === 'success').length;
  const adherenceRate = loggedDaysCount > 0 ? successCount / loggedDaysCount : 0;
  
  let trendMsg = "Ainda sem dados suficientes";
  if (loggedDaysCount < 3) trendMsg = "A registar os primeiros dias...";
  else if (adherenceRate >= 0.7) trendMsg = "Estás no bom caminho, continua assim";
  else if (adherenceRate <= 0.3) trendMsg = "Parece que esta dica não está a resultar para ti";

  const handleSubmitAnswers = () => {
    // Gerar registo e obter decisão analítica do motor
    const decision = generateLearningPayload(cycle, deliverable, { adesao, dificuldade, efeito });
    
    // Fechar ciclo com a engine resolution prudente
    submitReview(decision);
  };

  return (
    <div className="home-page fade-in" style={{ background: 'var(--bg-core)', position: 'relative' }}>
      
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px', display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
        
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/process_home')} />
        
        <header style={{ marginBottom: '40px' }}>
          <span className="kicker" style={{ color: '#10B981', marginBottom: '16px' }}>O teu Plano Atual</span>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '16px' }}>
            {cycle.status === 'active' ? "Em Percurso" : "Janela Concluída"}
          </h1>
          <div style={{ display: 'flex', gap: '16px' }}>
             <button onClick={() => navigate('/phase2/context')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94A3B8', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
               Consultar Contexto
             </button>
             <button onClick={() => navigate('/process_home')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94A3B8', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
               Ver Progresso
             </button>
          </div>
        </header>

        <section className="editorial-card" style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#38BDF8', fontWeight: 600 }}>
              {currentProposal.badge}
            </span>
          </div>
          <h2 className="module-title" style={{ fontSize: '20px', marginBottom: '16px', color: '#F8FAFC' }}>{currentProposal.title}</h2>
          
          <p className="module-desc" style={{ marginBottom: '24px', color: '#E2E8F0', lineHeight: 1.6, fontWeight: 300 }}>
            {currentProposal.actionToday}
          </p>

          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '24px', borderLeft: '2px solid rgba(56, 189, 248, 0.4)' }}>
             <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Por que funciona?</span>
             <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, fontWeight: 300 }}>{currentProposal.why}</p>
          </div>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Progresso desta dica</span>
              <span style={{ fontSize: '13px', color: isMinWindowReached ? '#10B981' : '#F8FAFC', fontWeight: 300 }}>{effectiveElapsed} de {cycle.minDays} noites</span>
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
            
            {dailyStep === 0 && !todayValue && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <p style={{ color: '#F8FAFC', fontSize: '15px', fontWeight: 300, marginBottom: '8px' }}>Seguiste a orientação da proposta?</p>
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  <button
                    onClick={() => { setDailyAdherence('success'); setDailyStep(1); }}
                    className="ritual-trigger"
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid transparent' }}
                  >
                    <CheckCircle2 size={24} color="#10B981" strokeWidth={1.5} />
                    <span style={{ fontSize: '14px', color: '#F8FAFC' }}>Sim, consegui</span>
                  </button>
                  <button
                    onClick={() => { setDailyAdherence('failed'); setDailyStep(1); }}
                    className="ritual-trigger"
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid transparent' }}
                  >
                    <XCircle size={24} color="#EF4444" strokeWidth={1.5} />
                    <span style={{ fontSize: '14px', color: '#F8FAFC' }}>Não consegui</span>
                  </button>
                </div>
              </div>
            )}

            {dailyStep === 1 && !todayValue && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <p style={{ color: '#F8FAFC', fontSize: '15px', fontWeight: 300, marginBottom: '8px' }}>
                  {dailyAdherence === 'success' ? 'Foi fácil de executar?' : 'O que impediu a execução?'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  {dailyAdherence === 'success' ? (
                    <>
                      <button onClick={() => { 
                          trackEvent('proposal_execution_ease_selected', { payload: { ease: 'natural' } });
                          checkInToday('success', { executionEase: 'natural' }); 
                          setDailyStep(0); 
                      }} className="ritual-trigger" style={{ padding: '16px', borderRadius: '8px', color: '#F8FAFC', textAlign: 'left' }}>Foi natural e não custou</button>
                      
                      <button onClick={() => { 
                          trackEvent('proposal_execution_ease_selected', { payload: { ease: 'effort' } });
                          checkInToday('success', { executionEase: 'effort' }); 
                          setDailyStep(0); 
                      }} className="ritual-trigger" style={{ padding: '16px', borderRadius: '8px', color: '#F8FAFC', textAlign: 'left' }}>Exigiu algum esforço</button>
                      
                      <button onClick={() => { 
                          trackEvent('proposal_execution_ease_selected', { payload: { ease: 'very_difficult' } });
                          checkInToday('success', { executionEase: 'very_difficult' }); 
                          setDailyStep(0); 
                      }} className="ritual-trigger" style={{ padding: '16px', borderRadius: '8px', color: '#F8FAFC', textAlign: 'left' }}>Foi muito difícil forçar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { 
                          trackEvent('proposal_non_execution_reason_selected', { payload: { reason: 'forgot' } });
                          checkInToday('failed', { nonExecutionReason: 'forgot' }); 
                          setDailyStep(0); 
                      }} className="ritual-trigger" style={{ padding: '16px', borderRadius: '8px', color: '#F8FAFC', textAlign: 'left' }}>Esqueci-me completamente</button>
                      
                      <button onClick={() => { 
                          trackEvent('proposal_non_execution_reason_selected', { payload: { reason: 'no_conditions' } });
                          checkInToday('failed', { nonExecutionReason: 'no_conditions' }); 
                          setDailyStep(0); 
                      }} className="ritual-trigger" style={{ padding: '16px', borderRadius: '8px', color: '#F8FAFC', textAlign: 'left' }}>Não tive condições hoje</button>
                      
                      <button onClick={() => { 
                          trackEvent('proposal_non_execution_reason_selected', { payload: { reason: 'intentional' } });
                          checkInToday('failed', { nonExecutionReason: 'intentional' }); 
                          setDailyStep(0); 
                      }} className="ritual-trigger" style={{ padding: '16px', borderRadius: '8px', color: '#F8FAFC', textAlign: 'left' }}>Decidi intencionalmente não fazer</button>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {todayValue && (
              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', fontWeight: 300 }}>
                  Posição guardada sileciosamente. O trajeto continua amanhã.
                </p>
                <button onClick={() => {
                   trackEvent('beta_simulate_tomorrow_used');
                   appClock.addDays(1);
                }} className="secondary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', borderColor: 'rgba(245, 158, 11, 0.5)', color: '#F59E0B', background: 'rgba(245, 158, 11, 0.05)' }}>
                  [Beta] Simular Amanhã
                </button>
                <button onClick={() => navigate('/process_home')} className="primary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  Voltar ao Início
                </button>
                <div style={{ display: 'flex', width: '100%', gap: '12px' }}>
                  <button onClick={() => navigate('/phase2/context')} style={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', padding: '12px', borderRadius: '8px', color: '#94A3B8', fontSize: '13px' }}>
                    Consultar Padrões
                  </button>
                  <button onClick={() => navigate('/profile')} style={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', padding: '12px', borderRadius: '8px', color: '#94A3B8', fontSize: '13px' }}>
                    Consultar Perfil
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {cycle.status === 'active' && isMinWindowReached && reviewStep === 0 && (
          <div style={{ marginTop: 'auto', marginBottom: '24px' }}>
            <div className="editorial-card" style={{ background: 'transparent', padding: 0, border: 'none', marginBottom: '32px' }}>
              <h3 className="kicker" style={{ color: '#F8FAFC', marginBottom: '16px' }}>Ponto de Situação</h3>
              <p className="module-desc" style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#F8FAFC', fontWeight: 400 }}>{Math.round(adherenceRate * 100)}% de sucesso ao longo dos dias.</strong>
              </p>
              <p className="module-desc">
                {trendMsg}.
              </p>
            </div>
            
            <button onClick={() => setReviewStep(1)} className="primary-btn" style={{ width: '100%', justifyContent: 'center', marginBottom: '16px' }}>
              Fazer a Avaliação desta Dica
            </button>
            <button onClick={() => {
               trackEvent('beta_review_skipped');
               skipReviewBeta();
            }} className="secondary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', borderColor: 'rgba(245, 158, 11, 0.5)', color: '#F59E0B', background: 'rgba(245, 158, 11, 0.05)' }}>
              [Beta] Simular Amanhã (Saltar Review)
            </button>
          </div>
        )}

        {cycle.status === 'active' && isMinWindowReached && reviewStep === 1 && (
          <div className="fade-in" style={{ marginTop: 'auto', marginBottom: '24px' }}>
            <h3 className="kicker" style={{ color: '#38BDF8', marginBottom: '16px' }}>Passo 1 de 4</h3>
            <h2 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '24px', lineHeight: 1.3 }}>
              {adaptiveSet.questions[0].prompt}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {adaptiveSet.questions[0].options.map(opt => (
                <button key={opt} onClick={() => { setAdesao(opt); setReviewStep(2); }} className="ritual-trigger" style={{ justifyContent: 'flex-start', padding: '20px', borderRadius: '12px', color: '#F8FAFC' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {cycle.status === 'active' && isMinWindowReached && reviewStep === 2 && (
          <div className="fade-in" style={{ marginTop: 'auto', marginBottom: '24px' }}>
            <h3 className="kicker" style={{ color: '#38BDF8', marginBottom: '16px' }}>Passo 2 de 4</h3>
            <h2 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '24px', lineHeight: 1.3 }}>
              {adaptiveSet.questions[1].prompt}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {adaptiveSet.questions[1].options.map(opt => (
                <button key={opt} onClick={() => { setDificuldade(opt); setReviewStep(3); }} className="ritual-trigger" style={{ justifyContent: 'flex-start', padding: '20px', borderRadius: '12px', color: '#F8FAFC' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {cycle.status === 'active' && isMinWindowReached && reviewStep === 3 && (
          <div className="fade-in" style={{ marginTop: 'auto', marginBottom: '24px' }}>
            <h3 className="kicker" style={{ color: '#38BDF8', marginBottom: '16px' }}>Passo 3 de 4</h3>
            <h2 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '24px', lineHeight: 1.3 }}>
              {adaptiveSet.questions[2].prompt}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {adaptiveSet.questions[2].options.map(opt => (
                <button key={opt} onClick={() => { setEfeito(opt); setReviewStep(4); }} className="ritual-trigger" style={{ justifyContent: 'flex-start', padding: '20px', borderRadius: '12px', color: '#F8FAFC' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {cycle.status === 'active' && isMinWindowReached && reviewStep === 4 && (
          <div className="fade-in" style={{ marginTop: 'auto', marginBottom: '24px' }}>
            <h3 className="kicker" style={{ color: '#64748B', marginBottom: '16px' }}>Passo Final</h3>
            <h2 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '12px', lineHeight: 1.3 }}>
              Confirmar Respostas
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '24px', lineHeight: 1.5 }}>
              Baseado na tua experiência logada (Adesão: {adesao.split(',')[0]} / Dificuldade: {dificuldade.split(' ')[0]} / Efeito: {efeito.split(' ')[0]}), vamos entregar a decisão ao motor.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={handleSubmitAnswers} className="primary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '16px' }}>
                <span style={{ fontWeight: 400, fontSize: '15px', color: '#F8FAFC' }}>Guardar e Avaliar</span>
              </button>
            </div>
          </div>
        )}

        {cycle.status === 'completed_keep' && cycle.decisionEngineOutcome && (
          <div style={{ marginTop: 'auto', marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MapPin size={32} color="#10B981" style={{ marginBottom: '24px', opacity: 0.8 }} strokeWidth={1.5} />
            <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '12px' }}>Direção Mantida</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', maxWidth: '300px', fontWeight: 300, marginBottom: '24px' }}>
              {cycle.decisionEngineOutcome.nextStepPhrase}
            </p>
            <button onClick={() => navigate('/process_home')} className="primary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
               Continuar a Logar Noites
            </button>
          </div>
        )}

        {cycle.status === 'completed_adjust' && cycle.decisionEngineOutcome && (
          <div style={{ marginTop: 'auto', marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MapPin size={32} color="#F59E0B" style={{ marginBottom: '24px', opacity: 0.8 }} strokeWidth={1.5} />
            <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '12px' }}>Ajuste Sinalizado</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', maxWidth: '300px', fontWeight: 300, marginBottom: '24px' }}>
              {cycle.decisionEngineOutcome.nextStepPhrase}
            </p>
            <button onClick={() => navigate('/phase2/proposals')} className="primary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
               Ajustar Nova Direção
            </button>
          </div>
        )}

        {cycle.status === 'completed_switch' && cycle.decisionEngineOutcome && (
          <div style={{ marginTop: 'auto', marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MapPin size={32} color="#EF4444" style={{ marginBottom: '24px', opacity: 0.8 }} strokeWidth={1.5} />
            <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '12px' }}>Rota Esgotada</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', maxWidth: '300px', fontWeight: 300, marginBottom: '24px' }}>
              {cycle.decisionEngineOutcome.nextStepPhrase}
            </p>
            <button onClick={() => navigate('/phase2/proposals')} className="primary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
               Tentar Nova Abordagem
            </button>
          </div>
        )}

        {cycle.status === 'active_hold' && cycle.decisionEngineOutcome && (
          <div style={{ marginTop: 'auto', marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MapPin size={32} color="#6366F1" style={{ marginBottom: '24px', opacity: 0.8 }} strokeWidth={1.5} />
            <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '12px' }}>Manutenção Prudente</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', maxWidth: '300px', fontWeight: 300, marginBottom: '24px' }}>
              {cycle.decisionEngineOutcome.nextStepPhrase}
            </p>
            <button onClick={() => navigate('/process_home')} className="primary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
               Aceitar e Voltar à Home
            </button>
          </div>
        )}

        {cycle.status === 'pending_reassessment' && cycle.decisionEngineOutcome && (
          <div style={{ marginTop: 'auto', marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MapPin size={32} color="#38BDF8" style={{ marginBottom: '24px', opacity: 0.8 }} strokeWidth={1.5} />
            <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '12px' }}>Recolha Adicional</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', maxWidth: '300px', fontWeight: 300, marginBottom: '24px' }}>
              {cycle.decisionEngineOutcome.nextStepPhrase}
            </p>
            <button onClick={() => navigate('/process_home')} className="primary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
               Validar com Mais Registos
            </button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '32px', paddingBottom: '32px' }}>
          <button 
            onClick={() => {
              if (window.confirm("Queres mesmo cancelar o plano em curso? Vais perder o histórico logado deste ciclo atual.")) {
                localStorage.removeItem('deepsleep_phase3_cycle');
                navigate('/process_home');
                window.location.reload();
              }
            }}
            className="text-btn"
            style={{ color: '#EF4444', opacity: 0.5 }}
          >
            Cancelar Plano Ativo
          </button>
        </div>

      </div>
    </div>
  );
}
