import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Lock } from 'lucide-react';
import { useNightCount } from '../hooks/useNightCount';

import { usePhase2Store } from '../store/Phase2ContextStore';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { getProposals } from '../domain/Phase2/proposals';
import { CheckCircle2, XCircle, HelpCircle, Bell } from 'lucide-react';

export function ProcessHome() {
  const navigate = useNavigate();
  const nightCount = useNightCount();
  const { deliverable } = usePhase2Store();
  const { cycle, checkInToday } = usePhase3Store();

  const [todayStr] = useState(() => new Date().toISOString().split('T')[0]);
  const phase1Done = nightCount >= 5;

  const handlePhase1Click = () => {
    const dataSource = localStorage.getItem('dataSourceType');
    if (!dataSource) {
      navigate('/data_source');
    } else if (dataSource === 'manual') {
      navigate('/manual_log_hub');
    }
  };

  const handlePhase2Click = () => {
    if (!phase1Done) return;
    if (cycle) {
      navigate('/phase3_home');
    } else if (deliverable) {
      navigate('/phase2/context');
    } else {
      navigate('/phase2/entry');
    }
  };

  const handlePhase3Click = () => {
    if (cycle || deliverable) {
      navigate('/phase3_home');
    }
  };

  return (
    <div className="process-home fade-in" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <span style={{ fontSize: '18px', fontWeight: 300, letterSpacing: '1px', color: '#F8FAFC' }}>_deepSleep</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <User size={24} color="#F8FAFC" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }} />
          <Settings size={24} color="#F8FAFC" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.02em' }}>
        O teu sono é um processo.
      </h1>
      <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '48px', fontWeight: 300 }}>
        A evolução baseia-se num sistema faseado rigoroso. Conclui a fase atual para desbloquear recursos avançados.
      </p>

      {cycle && cycle.status === 'active' && deliverable ? (
        <div style={{ marginBottom: '48px' }}>
          
          <div style={{ borderLeft: '2px solid #38BDF8', paddingLeft: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#38BDF8', fontWeight: 600 }}>
                Direção Ativa
              </span>
              <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 600 }}>
                DIA {Object.keys(cycle.dailyCheckins).length + 1} DE {cycle.minDays}
              </span>
            </div>
            <h3 style={{ fontSize: '22px', color: '#F8FAFC', fontWeight: 400, lineHeight: '1.2' }}>
              {getProposals(deliverable).find(p => p.id === cycle.proposalId)?.title || 'Teste em curso'}
            </h3>
          </div>

          <div className="editorial-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', color: '#E2E8F0', lineHeight: '1.6', fontWeight: 300 }}>
               <strong style={{ color: '#94A3B8', fontWeight: 500, display: 'block', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>O que observar hoje:</strong> 
               {getProposals(deliverable).find(p => p.id === cycle.proposalId)?.observe}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '24px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38BDF8', boxShadow: '0 0 8px rgba(56,189,248,0.5)' }}></div>
                 <span style={{ fontSize: '14px', color: '#F8FAFC', fontWeight: 400 }}>Hoje: Observação diária</span>
               </div>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.6 }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'transparent', border: '1px solid #94A3B8' }}></div>
                 <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 300 }}>Próximos dias: Consolidar sinal</span>
               </div>

               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.6 }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'transparent', border: '1px solid #94A3B8' }}></div>
                 <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 300 }}>Revisão Final: Após {cycle.minDays} noites</span>
               </div>
            </div>
            
            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px' }}>
              <Bell size={14} color="#64748B" />
              <span style={{ fontSize: '11px', color: '#64748B', letterSpacing: '0.02em' }}>Notificações de ciclo ligadas no dispositivo.</span>
            </div>
          </div>

          {!cycle.dailyCheckins[todayStr] ? (
            <div>
              <h4 style={{ fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', textAlign: 'center' }}>Registo Diário da Ação</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => checkInToday('success')}
                  style={{ flex: 1, padding: '16px 8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10B981', cursor: 'pointer' }}
                >
                  <CheckCircle2 size={20} strokeWidth={1.5} />
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>Alinhado</span>
                </button>
                <button
                  onClick={() => checkInToday('failed')}
                  style={{ flex: 1, padding: '16px 8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', cursor: 'pointer' }}
                >
                  <XCircle size={20} strokeWidth={1.5} />
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>Falhou</span>
                </button>
                <button
                  onClick={() => checkInToday('incerto')}
                  style={{ flex: 1, padding: '16px 8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#F59E0B', cursor: 'pointer' }}
                >
                  <HelpCircle size={20} strokeWidth={1.5} />
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>Incerto</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '12px' }}>Dia já registado. O trajeto continua amanhã.</span>
              <button 
                onClick={() => navigate('/phase3_home')}
                style={{ background: 'transparent', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', display: 'inline-block' }}
              >
                Avaliar Janela / Ver Plano
              </button>
            </div>
          )}
          
          {!cycle.dailyCheckins[todayStr] && (
            <button 
               onClick={() => navigate('/phase3_home')}
               className="text-btn"
               style={{ width: '100%', justifyContent: 'center', marginTop: '24px', opacity: 0.5 }}
            >
              Ver plano completo ou Finalizar
            </button>
          )}

        </div>
      ) : (
        <div className="process-stages">
          {/* Phase 1 */}
          <div 
            onClick={handlePhase1Click}
            className={`stage-card ${phase1Done ? 'completed' : 'active'}`}
          >
            <div className="stage-header">
              <h3 className="stage-title">1. Monitorização e perfil</h3>
              <span className="stage-status">{phase1Done ? 'CONCLUÍDA' : 'EM CURSO'}</span>
            </div>
            <p className="stage-desc">Recolha do baseline e formação do perfil biológico.</p>
          </div>

          {/* Phase 2 */}
          <div 
            onClick={handlePhase2Click}
            className={`stage-card ${phase1Done ? (deliverable ? 'completed' : 'active highlight') : 'locked'}`}
          >
            <div className="stage-header">
              <h3 className="stage-title">2. Interpretação Contextual</h3>
              <span className="stage-status">{phase1Done ? (deliverable ? 'CONCLUÍDA' : 'DISPONÍVEL') : <><Lock size={10} style={{marginRight: '4px', display:'inline-block'}}/> BLOQUEADA</>}</span>
            </div>
            <p className="stage-desc">Leitura do contexto de fricção e formulação de estratégias.</p>
          </div>

          {/* Phase 3 */}
          <div 
            onClick={handlePhase3Click}
            className={`stage-card ${deliverable ? (cycle ? 'active highlight' : 'active') : 'locked'}`}
          >
            <div className="stage-header">
              <h3 className="stage-title">3. Plano e Intervenções</h3>
              <span className="stage-status">{deliverable ? (cycle ? 'EM CURSO' : 'PRONTO A INICIAR') : <><Lock size={10} style={{marginRight: '4px', display:'inline-block'}}/> BLOQUEADA</>}</span>
            </div>
            <p className="stage-desc">Teste controlado das propostas de ação e observação.</p>
          </div>
        </div>
      )}
      
      {/* Botões de segurança */}
      <div style={{ marginTop: '64px', textAlign: 'center' }}>
        <button 
          className="text-btn" 
          style={{ margin: '0 auto' }}
          onClick={() => { 
            if (window.confirm("Queres mesmo apagar tudo e reiniciar o beta? Vais perder todo o teu histórico.")) {
              localStorage.clear(); 
              window.location.href = '/'; 
            }
          }}
        >
          Reiniciar Beta
        </button>
      </div>
    </div>
  );
}
