import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Tonight() {
  const navigate = useNavigate();
  const [isActivating, setIsActivating] = useState(false);

  const handleActivation = () => {
    setIsActivating(true);
    setTimeout(() => {
      navigate('/active_session');
    }, 1200);
  };

  return (
    <div className="flow-page preparation-state fade-in">
      <nav className="top-bar">
        <button className="icon-btn" onClick={() => navigate('/phase1_entry')} disabled={isActivating}>
          <ArrowLeft size={22} strokeWidth={1.5} />
        </button>
      </nav>

      <div className={`flow-content pt-8 ${isActivating ? 'fade-out' : ''}`}>
        <span className="session-kicker">Estado da recolha desta noite</span>
        
        <div className="capability-list mt-8">
          <div className="capability-row">
            <span className="cap-name">Movimento mecânico</span>
            <span className="cap-status">Disponível</span>
          </div>
          <div className="capability-row">
            <span className="cap-name">Áudio do quarto</span>
            <span className="cap-status">Disponível</span>
          </div>
          <div className="capability-row">
            <span className="cap-name">Uso de ecrã</span>
            <span className="cap-status limited">Limitado</span>
          </div>
        </div>

        <p className="flow-text mt-8 text-secondary">
          O dispositivo deve permanecer com o ecrã virado para cima, imobilizado na mesa de cabeceira. O modo de voo é recomendado.
        </p>
      </div>

      <div className="bottom-action">
        <button 
          className={`primary-trigger ${isActivating ? 'activating' : ''}`} 
          onClick={handleActivation}
        >
          <span className="trigger-label">
            {isActivating ? 'A iniciar...' : 'Iniciar sessão nocturna'}
          </span>
        </button>
      </div>
    </div>
  );
}
