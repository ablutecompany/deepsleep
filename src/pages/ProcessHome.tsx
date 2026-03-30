import { useNavigate } from 'react-router-dom';
import { User, Settings, CheckCircle2, XCircle, HelpCircle, Bell, ArrowRight, Activity, Calendar } from 'lucide-react';
import { useNightCount } from '../hooks/useNightCount';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { getProposals } from '../domain/Phase2/proposals';

export function ProcessHome() {
  const navigate = useNavigate();
  const nightCount = useNightCount();
  const { deliverable } = usePhase2Store();
  const { cycle, todayStr, checkInToday } = usePhase3Store();

  const hasPendingAction = cycle?.status === 'active' && !cycle.dailyCheckins[todayStr];
  const phase1Done = nightCount >= 5;

  return (
    <div className="process-home fade-in" style={{ padding: '24px', paddingBottom: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <span style={{ fontSize: '18px', fontWeight: 300, letterSpacing: '1px', color: '#F8FAFC' }}>_deepSleep</span>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {cycle && cycle.status === 'active' && (
            <div style={{ position: 'relative' }}>
              <Bell size={20} color={hasPendingAction ? "#38BDF8" : "#94A3B8"} />
              {hasPendingAction && (
                <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#38BDF8', borderRadius: '50%', boxShadow: '0 0 8px #38BDF8' }} />
              )}
            </div>
          )}
          <User size={22} color="#F8FAFC" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }} />
          <Settings size={22} color="#F8FAFC" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* RENDERIZAÇÃO ESTREITA E OPERACIONAL (Sem painéis globais) */}
      {(() => {
        // --- CASO 1: Existe um Ciclo em curso ou concluído ---
        if (cycle && deliverable) {
          const proposal = getProposals(deliverable).find(p => p.id === cycle.proposalId);
          
          if (cycle.status === 'active' || cycle.status === 'active_hold') {
            return (
              <div className="fade-in">
                <div style={{ borderLeft: '2px solid #38BDF8', paddingLeft: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#38BDF8', fontWeight: 600 }}>
                      {proposal?.badge || 'Direção Ativa'}
                    </span>
                    <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 600 }}>
                      DIA {Object.keys(cycle.dailyCheckins).length + 1} DE {cycle.minDays}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '22px', color: '#F8FAFC', fontWeight: 400, lineHeight: '1.3' }}>
                    {proposal?.title || 'Teste em curso'}
                  </h3>
                </div>

                {cycle.status === 'active_hold' && cycle.decisionEngineOutcome && (
                   <div style={{ marginTop: '16px', marginBottom: '24px', padding: '16px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '8px' }}>
                     <p style={{ fontSize: '12px', color: '#818cf8', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.05em' }}>MANUTENÇÃO PRUDENTE</p>
                     <p style={{ fontSize: '14px', color: '#E2E8F0', lineHeight: 1.5, marginBottom: '16px' }}>
                       Ainda não há peso mecânico suficiente para mudarmos de direção com clareza clínica. Vamos continuar a testar este prisma mais algumas noites antes de ajustar.
                     </p>
                     <p style={{ fontSize: '13px', color: '#94A3B8' }}>{cycle.decisionEngineOutcome.nextStepPhrase}</p>
                   </div>
                )}

                <div className="editorial-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
                  <p style={{ fontSize: '15px', color: '#E2E8F0', lineHeight: '1.6', fontWeight: 300, marginBottom: '24px' }}>
                     {proposal?.actionToday}
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                       <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38BDF8', boxShadow: '0 0 8px rgba(56,189,248,0.5)', marginTop: '6px', flexShrink: 0 }}></div>
                       <div>
                         <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Observa</span>
                         <span style={{ fontSize: '14px', color: '#F8FAFC', fontWeight: 400, lineHeight: '1.4' }}>
                           {proposal?.observeWhat}
                         </span>
                       </div>
                     </div>
                     
                     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', opacity: 0.8 }}>
                       <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'transparent', border: '1px solid #94A3B8', marginTop: '6px', flexShrink: 0 }}></div>
                       <div>
                         <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Depois diz-nos</span>
                         <span style={{ fontSize: '14px', color: '#E2E8F0', fontWeight: 300, lineHeight: '1.4' }}>
                           {proposal?.reportQuestion}
                         </span>
                       </div>
                     </div>
                  </div>
                </div>

                {!cycle.dailyCheckins[todayStr] ? (
                  <div style={{ paddingTop: '8px' }}>
                    <h4 style={{ fontSize: '14px', color: '#F8FAFC', fontWeight: 400, marginBottom: '20px', textAlign: 'center', lineHeight: 1.4, padding: '0 12px' }}>
                      Hoje precisamos deste registo:
                    </h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => checkInToday('success')} style={{ flex: 1, padding: '16px 8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10B981', cursor: 'pointer' }}>
                        <CheckCircle2 size={20} strokeWidth={1.5} />
                        <span style={{ fontSize: '12px', fontWeight: 500 }}>Alinhado</span>
                      </button>
                      <button onClick={() => checkInToday('failed')} style={{ flex: 1, padding: '16px 8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', cursor: 'pointer' }}>
                        <XCircle size={20} strokeWidth={1.5} />
                        <span style={{ fontSize: '12px', fontWeight: 500 }}>Falhou</span>
                      </button>
                      <button onClick={() => checkInToday('incerto')} style={{ flex: 1, padding: '16px 8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#F59E0B', cursor: 'pointer' }}>
                        <HelpCircle size={20} strokeWidth={1.5} />
                        <span style={{ fontSize: '12px', fontWeight: 500 }}>Incerto</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '12px' }}>Registo guardado. Voltamos amanhã para continuar.</span>
                    <button onClick={() => navigate('/phase3_home')} style={{ background: 'transparent', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      {Object.keys(cycle.dailyCheckins).length >= cycle.minDays ? "Avançar para Revisão Final" : "Rever janela"}
                    </button>
                  </div>
                )}
                
                {!cycle.dailyCheckins[todayStr] && Object.keys(cycle.dailyCheckins).length >= cycle.minDays && (
                  <button onClick={() => navigate('/phase3_home')} className="primary-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }}>
                    Esta janela está pronta para revisão
                  </button>
                )}
              </div>
            );
          } else {
            // Blocos de conclusão
            let titleText = "Concluído";
            let ctaText = "Avançar";
            let ctaAction = () => navigate('/phase2/proposals');

            if (cycle.status === 'completed_keep') {
               titleText = "Mantemos esta direção por agora";
               ctaText = "Ver Evolução nos Padrões";
               ctaAction = () => navigate('/patterns');
            } else if (cycle.status === 'completed_adjust') {
               titleText = "Vamos ajustar o foco com base no que reportaste";
               ctaText = "Afinar Próximo Passo";
            } else if (cycle.status === 'completed_switch') {
               titleText = "Temos base concreta para mudar de direção";
               ctaText = "Avançar com Nova Tática";
            } else if (cycle.status === 'pending_reassessment') {
               titleText = "Antes de mudar, precisamos de perceber um ponto";
               ctaText = "Responder 3 perguntas curtas";
               ctaAction = () => navigate('/phase3_home'); // Rota de reavaliação se existir
            }

            return (
              <div className="fade-in" style={{ padding: '32px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8', marginBottom: '8px' }}>
                  <CheckCircle2 size={24} />
                </div>
                
                <h3 style={{ fontSize: '20px', color: '#F8FAFC', fontWeight: 300, lineHeight: 1.3 }}>
                  {titleText}
                </h3>
                
                <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.5, maxWidth: '280px', fontWeight: 300 }}>
                  {cycle.decisionEngineOutcome?.nextStepPhrase || "A tua evolução foi atualizada."}
                </p>
                
                <button onClick={ctaAction} className="primary-btn" style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}>
                  {ctaText}
                </button>
                
                <button onClick={() => {
                  if (window.confirm("Atenção: isto descarta a tática atual temporariamente.")) {
                    localStorage.removeItem('deepsleep_phase3_cycle');
                    window.location.reload();
                  }
                }} className="text-btn" style={{ opacity: 0.4, marginTop: '8px' }}>
                  Descartar tática
                </button>
              </div>
            );
          }
        }

        // --- CASO 2: Fase 2 Concluída (mas sem ciclo) ---
        // => Pode ter ocorrido após fechar a Home ou re-entrada e o delivery foi recriado
        if (deliverable && phase1Done) {
          return (
            <div className="fade-in" style={{ padding: '32px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <Activity size={32} color="#38BDF8" style={{ margin: '0 auto 20px', opacity: 0.8 }} />
               <h3 style={{ fontSize: '24px', color: '#F8FAFC', fontWeight: 300, marginBottom: '12px', lineHeight: 1.2 }}>
                 Tudo pronto para avançar.
               </h3>
               <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '32px', fontWeight: 300 }}>
                 A leitura do teu historial gerou um vetor focado na fricção real. A tua proposta inicial para a próxima fase está pendente.
               </p>
               <button onClick={() => navigate('/phase2/proposals')} className="primary-btn" style={{ width: '100%', justifyContent: 'center' }}>
                 Ver Proposta Pendente
               </button>
            </div>
          );
        }

        // --- CASO 3: Fase 1 Concluída. Faltam propostas / entry Phase 2
        if (phase1Done) {
          return (
            <div className="fade-in" style={{ padding: '32px 20px', textAlign: 'center' }}>
               <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                 <CheckCircle2 size={28} color="#10B981" />
               </div>
               <h3 style={{ fontSize: '26px', color: '#F8FAFC', fontWeight: 300, marginBottom: '16px', lineHeight: 1.2 }}>
                 Já tens base suficiente para a leitura inicial.
               </h3>
               <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '40px', fontWeight: 300 }}>
                 Com {nightCount} noites estabilizamos o perfil orgânico. Falta fechar a tua leitura inicial para gerarmos o primeiro vetor prático.
               </p>
               <button onClick={() => navigate('/phase2/entry')} className="primary-btn" style={{ width: '100%', justifyContent: 'center', background: '#38BDF8' }}>
                 Fechar leitura inicial
                 <ArrowRight size={18} style={{ marginLeft: '8px' }} />
               </button>
            </div>
          );
        }

        // --- CASO 4: Faltam noites (Base Perdida/Nova)
        return (
          <div className="fade-in" style={{ padding: '24px 16px', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Calendar size={28} color="#94A3B8" style={{ marginBottom: '20px', margin: '0 auto' }} />
            <h3 style={{ fontSize: '22px', color: '#F8FAFC', fontWeight: 300, marginBottom: '12px', lineHeight: 1.3 }}>
              Base matemática pendente ({nightCount}/5).
            </h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '32px', fontWeight: 300 }}>
              Para impedir falsos positivos no motor, exigimos um basal prudente de 5 dias. Sempre que os teus registos descem deste limite, todas as propostas ativas são suspensas até restabeleceres a estabilidade basal.
            </p>
            <button onClick={() => navigate('/manual_log_hub')} className="primary-btn" style={{ width: '100%', justifyContent: 'center' }}>
             Ver / Adicionar Registos
            </button>
          </div>
        );
      })()}

    </div>
  );
}
