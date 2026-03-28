import { useState } from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NightSignature } from '../components/NightSignature';

export function Tonight() {
  const navigate = useNavigate();
  const [isActivating, setIsActivating] = useState(false);

  const handleActivation = () => {
    setIsActivating(true);
    // Simula bloqueio de ativação sagrado / timeout ritualístico
    setTimeout(() => {
      // Por agora retorna à Home (simulando que entrou no estado ativo)
      navigate('/');
    }, 1800);
  };

  return (
    <div className="tonight-page">
      {/* NightSignature é meramente um vulto muito escuro nesta vista para proteger a retina */}
      <div style={{ opacity: isActivating ? 0 : 0.2, transition: 'opacity 1.5s ease' }}>
        <NightSignature />
      </div>

      <nav className="top-bar" style={{ position: 'absolute', top: 0, width: '100%', padding: '24px 32px' }}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ opacity: isActivating ? 0 : 1 }}>
          <ArrowRight size={24} strokeWidth={1} style={{ transform: 'rotate(180deg)' }} />
        </button>
      </nav>

      <div className="tonight-content" style={{ opacity: isActivating ? 0 : 1, transition: 'opacity 0.8s ease' }}>
        <span className="kicker intimate">Recomendação · Janela das 03:00</span>
        <h1 className="title-serene">
          Risco de interrupção no ciclo profundo.
        </h1>
        <p className="recommendation-text">
          O afastamento do telemóvel neutraliza este padrão. Remova o dispositivo do seu alcance antes de iniciarmos a sessão.
        </p>
      </div>

      <button 
        className={`sacred-trigger ${isActivating ? 'activating' : ''}`} 
        onClick={handleActivation}
      >
        <span className="sacred-label">
          {isActivating ? 'A iniciar monitorização...' : 'Iniciar sessão nocturna'}
        </span>
        <Shield size={20} strokeWidth={1.2} className="sacred-icon" />
      </button>
    </div>
  );
}
