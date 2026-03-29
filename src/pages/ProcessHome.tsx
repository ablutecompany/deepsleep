import { useNavigate } from 'react-router-dom';
import { User, Settings, Lock } from 'lucide-react';
import { useNightCount } from '../hooks/useNightCount';

export function ProcessHome() {
  const navigate = useNavigate();
  const nightCount = useNightCount();

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
          onClick={() => phase1Done ? navigate('/phase2/entry') : undefined}
          className={`stage-card ${phase1Done ? 'active highlight' : 'locked'}`}
        >
          <div className="stage-header">
            <h3 className="stage-title">2. Contexto e propostas</h3>
            <span className="stage-status">{phase1Done ? 'DISPONÍVEL' : <><Lock size={10} style={{marginRight: '4px', display:'inline-block'}}/> BLOQUEADA</>}</span>
          </div>
          <p className="stage-desc">Interpretação comportamental e introdução de mecânicas de melhoria.</p>
        </div>

        {/* Phase 3 */}
        <div className="stage-card locked">
          <div className="stage-header">
            <h3 className="stage-title">3. Observância e ajustes</h3>
            <span className="stage-status"><Lock size={10} style={{marginRight: '4px', display:'inline-block'}}/> BLOQUEADA</span>
          </div>
          <p className="stage-desc">Calibração contínua baseada em protocolos clínicos.</p>
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
