import { useNavigate } from 'react-router-dom';
import { User, Settings, Lock } from 'lucide-react';
import { useNightCount } from '../hooks/useNightCount';

import { usePhase2Store } from '../store/Phase2ContextStore';
import { usePhase3Store } from '../store/Phase3ContextStore';

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
    } else {
      navigate('/phase1_entry');
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
    <div className="process-home fade-in" style={{ padding: '24px', paddingBottom: '100px' }}>
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
      <div style={{ marginTop: '64px', textAlign: 'center' }}>
        <button className="text-btn" onClick={() => { localStorage.setItem('nightCount', '0'); window.dispatchEvent(new Event('deepsleep_simulated_change')); }}>
          Reset Flow Simulation
        </button>
      </div>
    </div>
  );
}
