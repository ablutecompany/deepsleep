import { useNavigate } from 'react-router-dom';
import { User, Settings, CheckCircle2, XCircle, HelpCircle, Bell, ArrowRight, Activity, Calendar, FastForward } from 'lucide-react';
import { useNightCount } from '../hooks/useNightCount';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { getProposals } from '../domain/Phase2/proposals';
import { appClock } from '../utils/appClock';
import { getSensingSessions } from '../domain/Sensing/store';
import { getManualLogs } from '../domain/Phase1/manualLogStore';

export function ProcessHome() {
  const navigate = useNavigate();
  const nightCount = useNightCount();
  const { deliverable } = usePhase2Store();
  const { cycle, todayStr, checkInToday } = usePhase3Store();

  const hasPendingAction = cycle?.status === 'active' && !cycle.dailyCheckins[todayStr];
  const phase1Done = nightCount >= 5;

  // Deteção inteligente da "Manhã"
  const unlinkedSensing = getSensingSessions().find(s => !getManualLogs().some(l => l.dateStr === s.linkedNightId));

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
        
        // --- CASO 0: ROTEAMENTO INTELIGENTE MATINAL (WAKE FLOW) ---
        if (unlinkedSensing) {
          return (
            <div className="fade-in" style={{ padding: '24px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)', marginBottom: '24px' }}>
               <h3 style={{ fontSize: '20px', color: '#F8FAFC', fontWeight: 300, marginBottom: '8px', lineHeight: 1.3 }}>
                 A tua gravação de ontem está pronta
               </h3>
               <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.5, marginBottom: '24px', fontWeight: 300 }}>
                 A app já fez o processamento sonoro da tua noite. Só precisas de acrescentar a tua percepção rápida num bloco para cruzarmos as análises.
               </p>
               <button 
                 onClick={() => navigate(`/manual_log_form?fromSensing=true&sessionId=${unlinkedSensing.id}`)}
                 className="primary-btn" 
                 style={{ width: '100%', justifyContent: 'center', background: '#38BDF8', color: '#0F172A', fontWeight: 500 }}
               >
                 Juntar o meu Diário à Gravação
               </button>
            </div>
          );
        }

        // --- CASO 1: Existe um Ciclo em curso ou concluído ---
        if (cycle && deliverable) {
          const proposal = getProposals(deliverable).find(p => p.id === cycle.proposalId);
          
          if (cycle.status === 'active' || cycle.status === 'active_hold') {
            return (
              <div className="fade-in">
                {/* ESTADO 1: JÁ HÁ UM CHECK-IN GUARDADO HOJE, OU O CICLO ESTÁ COMPLETO E PRONTO A REVER */}
                {cycle.dailyCheckins[todayStr] && Object.keys(cycle.dailyCheckins).length < cycle.minDays ? (
                   <div style={{ textAlign: 'center', padding: '16px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '24px' }}>
                     <span style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '12px' }}>Registo guardado. Voltamos amanhã para continuar.</span>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                       <button onClick={() => navigate('/phase3_home')} style={{ background: 'transparent', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', width: '100%' }}>
                         Rever plano completo
                       </button>

                       {/* TEMPORARY INTERNAL BETA TIME-TRAVEL BUTTON */}
                       {appClock.isSimulated() && (
                         <button 
                           onClick={() => appClock.addDays(1)} 
                           style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '10px 24px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center', marginTop: '4px' }}
                           title="Apenas visível num ambiente de Teste Simulado"
                         >
                           <FastForward size={14} /> 
                           <span>Passar para o dia seguinte (Beta Teste)</span>
                         </button>
                       )}
                     </div>
                   </div>
                ) : !cycle.dailyCheckins[todayStr] ? (
                  /* ESTADO 2: CHECK-IN PENDENTE (OU A DECORRER HOJE) */
                  <div className="editorial-card" style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#38BDF8', fontWeight: 600, display: 'block', marginBottom: '16px' }}>
                      Check-in de hoje
                    </span>
                    
                    <h3 style={{ fontSize: '20px', color: '#F8FAFC', fontWeight: 300, lineHeight: '1.4', marginBottom: '8px' }}>
                      {proposal?.reviewQuestions?.adesao || proposal?.reportQuestion || "Conseguiste seguir o teu objetivo na noite passada?"}
                    </h3>
                    
                    <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.5, marginBottom: '24px', fontWeight: 300 }}>
                      {proposal?.reportQuestion}
                    </p>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => checkInToday('success')} style={{ flex: 1, padding: '16px 8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10B981', cursor: 'pointer' }}>
                        <CheckCircle2 size={20} strokeWidth={1.5} />
                        <span style={{ fontSize: '12px', fontWeight: 500 }}>Cumpri</span>
                      </button>
                      <button onClick={() => checkInToday('failed')} style={{ flex: 1, padding: '16px 8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', cursor: 'pointer' }}>
                        <XCircle size={20} strokeWidth={1.5} />
                        <span style={{ fontSize: '12px', fontWeight: 500 }}>Falhei</span>
                      </button>
                      <button onClick={() => checkInToday('incerto')} style={{ flex: 1, padding: '16px 8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#F59E0B', cursor: 'pointer' }}>
                        <HelpCircle size={20} strokeWidth={1.5} />
                        <span style={{ fontSize: '12px', fontWeight: 500 }}>Incerto</span>
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* VISUALIZAÇÃO DA DIREÇÃO ATIVA SEMPRE PRESENTE EM FORMATO COMPACTO E DICTADO (Seja pós-checkin ou hold) */}
                <div className="editorial-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#10B981', fontWeight: 600 }}>
                      O teu Plano · Dia {Math.max(1, Object.keys(cycle.dailyCheckins).length + (cycle.dailyCheckins[todayStr] ? 0 : 1))} de {cycle.minDays}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '22px', color: '#F8FAFC', fontWeight: 300, lineHeight: '1.4', marginBottom: '24px' }}>
                    {proposal?.actionToday}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '4px', height: '16px', borderRadius: '2px', background: '#38BDF8', marginTop: '4px' }}></div>
                    <span style={{ fontSize: '15px', color: '#E2E8F0', fontWeight: 300, lineHeight: '1.5' }}>
                      <strong style={{ color: '#94A3B8', fontWeight: 500, marginRight: '6px' }}>Observa:</strong> 
                      {proposal?.observeWhat}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ width: '4px', height: '16px', borderRadius: '2px', background: 'transparent', border: '1px solid #64748B', marginTop: '4px' }}></div>
                    <span style={{ fontSize: '15px', color: '#94A3B8', fontWeight: 300, lineHeight: '1.5' }}>
                      <strong style={{ color: '#64748B', fontWeight: 400, marginRight: '6px' }}>Amanhã:</strong> 
                      Poderás confirmar se cumpriste e se notaste diferença.
                    </span>
                  </div>

                  <button onClick={() => navigate('/phase3_home')} style={{ background: 'transparent', color: '#38BDF8', border: 'none', padding: 0, fontSize: '13px', cursor: 'pointer', marginTop: '32px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Ver plano completo <ArrowRight size={14} />
                  </button>
                </div>

                {!cycle.dailyCheckins[todayStr] && Object.keys(cycle.dailyCheckins).length >= cycle.minDays && (
                  <button onClick={() => navigate('/phase3_home')} className="primary-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }}>
                    A avaliação desta tua fase está pronta para veres
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
               titleText = "Mantemos este caminho por agora";
               ctaText = "Ver Evolução";
               ctaAction = () => navigate('/patterns');
            } else if (cycle.status === 'completed_adjust') {
               titleText = "Vamos ajustar o foco com base no que sentiste";
               ctaText = "Afinar Próximo Passo";
            } else if (cycle.status === 'completed_switch') {
               titleText = "Temos base concreta para mudar de estratégia";
               ctaText = "Tentar Nova Abordagem";
            } else if (cycle.status === 'pending_reassessment') {
               titleText = "Antes de mudar, precisamos de perceber um ponto";
               ctaText = "Responder a 3 perguntas curtas";
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
                  if (window.confirm("Atenção: isto descarta a estratégia atual temporariamente.")) {
                    localStorage.removeItem('deepsleep_phase3_cycle');
                    window.location.reload();
                  }
                }} className="text-btn" style={{ opacity: 0.4, marginTop: '8px' }}>
                  Descartar estratégia
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
                 A análise do teu historial criou um plano focado exatamente no teu ponto fraco principal. O plano de ação está pronto para veres.
               </p>
               <button onClick={() => navigate('/phase2/proposals')} className="primary-btn" style={{ width: '100%', justifyContent: 'center' }}>
                 Ver o teu Plano
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
                 Já conhecemos bem o teu sono.
               </h3>
               <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '40px', fontWeight: 300 }}>
                 Com {nightCount} noites guardadas, a app já aprendeu o teu perfil base. Só falta fecharmos uma última avaliação tua para criarmos o teu primeiro plano.
               </p>
               <button onClick={() => navigate('/phase2/entry')} className="primary-btn" style={{ width: '100%', justifyContent: 'center', background: '#38BDF8' }}>
                 Criar o teu Perfil Personalizado
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
              Precisamos que registes o teu sono ({nightCount}/5).
            </h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '32px', fontWeight: 300 }}>
              Para garantir que as avaliações são corretas, precisamos de pelo menos 5 noites. Com menos registos, o plano pausa as sugestões para evitar conclusões precipitadas.
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
