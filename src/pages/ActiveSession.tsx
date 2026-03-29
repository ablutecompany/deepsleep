import { useNavigate } from 'react-router-dom';

export function ActiveSession() {
  const navigate = useNavigate();
  // Fixed start time for mockup
  const startTime = "01:23";

  return (
    <div className="active-session-page fade-in">
      <div className="minimal-center">
        <div className="pulse-indicator"></div>
        <span className="session-kicker text-muted">Sessão em curso</span>
        <h1 className="active-time">{startTime} <span className="text-secondary text-sm">início</span></h1>
        <span className="cap-status mt-4">Recolha ativa</span>
      </div>

      <div className="bottom-action">
        <button className="secondary-action-btn" onClick={() => navigate('/phase1_home')}>
          Terminar sessão
        </button>
      </div>
    </div>
  );
}
