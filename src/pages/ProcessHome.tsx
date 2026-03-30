import { useNavigate } from 'react-router-dom';
import { User, Settings, Lock } from 'lucide-react';
import { useNightCount } from '../hooks/useNightCount';

import { usePhase2Store } from '../store/Phase2ContextStore';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { getProposals } from '../domain/Phase2/proposals';

export function ProcessHome() {
  const navigate = useNavigate();
  const nightCount = useNightCount();
  const { deliverable } = usePhase2Store();
  const { cycle } = usePhase3Store();

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

      {cycle && cycle.status === 'active' && deliverable && (
        <div style={{ marginBottom: '32px', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#38BDF8', fontWeight: 600 }}>Plano Diário Ativo</span>
              <h3 style={{ fontSize: '18px', color: '#FFF', marginTop: '4px', fontWeight: 400 }}>
                {getProposals(deliverable).find(p => p.id === cycle.proposalId)?.title || 'Teste em curso'}
              </h3>
            </div>
            <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
              Dia {Object.keys(cycle.dailyCheckins).length + 1} de {cycle.minDays}
            </span>
          </div>
          <p style={{ fontSize: '14px', color: '#E2E8F0', lineHeight: '1.6', marginBottom: '20px' }}>
             <strong style={{ color: '#94A3B8', fontWeight: 500 }}>Observar hoje:</strong> {getProposals(deliverable).find(p => p.id === cycle.proposalId)?.observe}
          </p>
          <button 
            onClick={() => navigate('/phase3_home')}
            style={{ width: '100%', padding: '14px', background: '#38BDF8', color: '#0F172A', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Ver Detalhes e Inserir Registo
          </button>
        </div>
      )}

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
      
      {/* Botão de reset de testes */}
      {/* Reset beta button for testing safely */}
      <div style={{ marginTop: '64px', textAlign: 'center' }}>
        <button 
          className="text-btn" 
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
