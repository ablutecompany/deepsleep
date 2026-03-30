import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { getProposals, getPriorityTest } from '../domain/Phase2/proposals';
import { generateLearningPayload } from '../domain/Phase3/learningStore';
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, MapPin } from 'lucide-react';

export function Phase3Home() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();
  const { cycle, startCycle, checkInToday, submitReview } = usePhase3Store();

  const [todayStr] = useState(() => new Date().toISOString().split('T')[0]);
  const [reviewStep, setReviewStep] = useState(0);
  const [adesao, setAdesao] = useState('');
  const [dificuldade, setDificuldade] = useState('');
  const [efeito, setEfeito] = useState('');
  
  const activeProposal = cycle && deliverable ? getProposals(deliverable).find(p => p.id === cycle.proposalId) : null;

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
    if (review === 'manter') rec = "Observável o comportamento positivo da tua execução, sugerindo valor em prolongar mais alguns dias a ação de teste atual para clarificar resultados na Fase 1 madura.";
    else if (review === 'ajustar') rec = "Iremos rever as ações recomendadas num ângulo com menos atrito. Esta proposta atual gerou atrito logístico nas tuas opções concretas e de estilo prático.";
    else rec = "Faltam provas na tua fase original de haver alteração contundente dos despertares com este trajeto específico. A escolha tática vai redirecionar-se.";
    
    // Gerar registo incremental vivo 
    generateLearningPayload(cycle, deliverable, review, rec, { adesao, dificuldade, efeito });
    
    submitReview(review, rec);
  };

  return (
    <div className="home-page fade-in" style={{ background: 'var(--bg-core)', position: 'relative' }}>
      
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px', display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
        
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/process_home')} />
        
        <header style={{ marginBottom: '40px' }}>
          <span className="kicker" style={{ color: '#10B981', marginBottom: '16px' }}>Direção Ativa · Observância</span>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '16px' }}>
            {cycle.status === 'active' ? "Em Percurso" : "Janela Concluída"}
          </h1>
          <div style={{ display: 'flex', gap: '16px' }}>
             <button onClick={() => navigate('/phase2/context')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94A3B8', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
               Consultar Contexto (Fase 2)
             </button>
             <button onClick={() => navigate('/process_home')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94A3B8', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
               Ver Métricas Bases
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
             <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Racional Biológico</span>
             <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, fontWeight: 300 }}>{currentProposal.why}</p>
          </div>
          
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
              
              <button
                onClick={() => checkInToday('incerto')}
                className="ritual-trigger"
                style={{
                  flex: 1, padding: '24px 16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                  background: todayValue === 'incerto' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(255,255,255,0.02)',
                  borderColor: todayValue === 'incerto' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255,255,255,0.08)',
                  borderLeft: todayValue === 'incerto' ? '2px solid #F59E0B' : '1px solid rgba(255,255,255,0.08)',
                  color: todayValue === 'incerto' ? '#F59E0B' : '#F8FAFC'
                }}
              >
                <HelpCircle size={24} strokeWidth={1.5} />
                <span style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '0.5px' }}>Incerto</span>
              </button>
            </div>
            
            {todayValue && (
              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', fontWeight: 300 }}>
                  Posição guardada sileciosamente. O trajeto continua amanhã.
                </p>
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
              <h3 className="kicker" style={{ color: '#F8FAFC', marginBottom: '16px' }}>Leitura Parcial Observada</h3>
              <p className="module-desc" style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#F8FAFC', fontWeight: 400 }}>{Math.round(adherenceRate * 100)}% de correspondência ao pedido inicial.</strong>
              </p>
              <p className="module-desc">
                {trendMsg}.
              </p>
            </div>
            
            <button onClick={() => setReviewStep(1)} className="primary-btn" style={{ width: '100%', justifyContent: 'center' }}>
              Iniciar Avaliação de Janela
            </button>
          </div>
        )}

        {cycle.status === 'active' && isMinWindowReached && reviewStep === 1 && (
          <div className="fade-in" style={{ marginTop: 'auto', marginBottom: '24px' }}>
            <h3 className="kicker" style={{ color: '#38BDF8', marginBottom: '16px' }}>Passo 1 de 4</h3>
            <h2 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '24px', lineHeight: 1.3 }}>
              {activeProposal?.reviewQuestions?.adesao || 'Conseguiste seguir esta orientação na maioria dos dias?'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Sim, sem falhas', 'Parcialmente / Custo esforço', 'Muito pouco / Quase nada'].map(opt => (
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
              {activeProposal?.reviewQuestions?.dificuldade || 'Foi fácil, difícil ou muito difícil de manter na prática?'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Fácil de encaixar', 'Exigiu alguma adaptação', 'Demasiado difícil fisicamente/logisticamente'].map(opt => (
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
              {activeProposal?.reviewQuestions?.efeito || 'Notaste alguma diferença útil no sono ou no despertar?'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Sim, diferença clara e positiva', 'Talvez algo subtil mas inconclusivo', 'Nenhuma diferença notória', 'Piorou a situação'].map(opt => (
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
              Decisão de Ajuste
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '24px', lineHeight: 1.5 }}>
              Baseado na tua experiência (Adesão: {adesao.split(',')[0]} / Dificuldade: {dificuldade.split(' ')[0]} / Efeito: {efeito.split(' ')[0]}), o que preferes fazer a seguir?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => handleReview('manter')} className="ritual-trigger" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '20px', borderRadius: '12px', borderLeftColor: '#F8FAFC' }}>
                <span style={{ fontWeight: 400, fontSize: '15px', color: '#F8FAFC' }}>Manter: Pedir p/ Repetir o Trajeto</span>
                <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 300, textAlign: 'left', lineHeight: '1.5' }}>Ideal se o efeito for subtil ou positivo e quiser consolidá-lo mais dias sem mexer.</span>
              </button>
              
              <button onClick={() => handleReview('ajustar')} className="ritual-trigger" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '20px', borderRadius: '12px', borderLeftColor: '#F59E0B' }}>
                <span style={{ fontWeight: 400, fontSize: '15px', color: '#F8FAFC' }}>Ajustar: Incompatível na Prática</span>
                <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 300, textAlign: 'left', lineHeight: '1.5' }}>Gerou demasiado atrito ou foi logísticamente inviável e precisamos de mudar de prisma.</span>
              </button>
              
              <button onClick={() => handleReview('trocar')} className="ritual-trigger" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '20px', borderRadius: '12px', borderLeftColor: '#EF4444' }}>
                <span style={{ fontWeight: 400, fontSize: '15px', color: '#F8FAFC' }}>Trocar: Caminho Inteiro (Sem efeito)</span>
                <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 300, textAlign: 'left', lineHeight: '1.5' }}>Aplicaste bem as diretrizes mas não gerou qualquer tração de sono passivo. Trocar tática.</span>
              </button>
            </div>
          </div>
        )}

        {cycle.status === 'completed' && (
          <div style={{ marginTop: 'auto', marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MapPin size={32} color="#10B981" style={{ marginBottom: '24px', opacity: 0.8 }} strokeWidth={1.5} />
            <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '12px' }}>Ciclo Prolongado com Sucesso</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', maxWidth: '280px', fontWeight: 300, marginBottom: '24px' }}>
              A direção será mantida nos registos futuros dada a eficácia. Continua a monitorizar o sono na Home.
            </p>
            <button onClick={() => navigate('/process_home')} className="primary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
               Voltar à Base Central
            </button>
          </div>
        )}

        {cycle.status === 'adjusted' && (
          <div style={{ marginTop: 'auto', marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MapPin size={32} color="#F59E0B" style={{ marginBottom: '24px', opacity: 0.8 }} strokeWidth={1.5} />
            <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginBottom: '12px' }}>Ajuste Tático Necessário</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', maxWidth: '280px', fontWeight: 300, marginBottom: '24px' }}>
              A abordagem testada não produziu a tração base pretendida. O perfil atualizou os fatores ativos e precisamos de refinar o caminho tático.
            </p>
            <button onClick={() => navigate('/phase2/proposals')} className="primary-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
               Procurar Novo Caminho
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
