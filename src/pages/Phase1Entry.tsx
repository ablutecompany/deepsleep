import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function Phase1Entry() {
  const navigate = useNavigate();
  const [nightCount, setNightCount] = useState(0);

  useEffect(() => {
    let count = parseInt(localStorage.getItem('nightCount') || '0', 10);
    if (isNaN(count)) count = 0;
    setNightCount(count);
  }, []);

  return (
    <div className="flow-page entry-state fade-in">
      <nav className="top-bar">
        <button className="icon-btn" onClick={() => navigate('/process_home')}>
          <ArrowLeft size={22} strokeWidth={1.5} />
        </button>
      </nav>

      <div className="flow-content pt-4">
        <span className="session-kicker">Fase 1 · Monitorização e perfil</span>
        <h1 className="title-large mt-2">{nightCount} de <span className="text-muted">5 noites</span></h1>
        
        <div className="intro-block mt-8">
          <h2 className="module-title mb-4">Como funciona esta fase</h2>
          <p className="flow-text text-secondary mb-6">
            Primeiro recolhemos várias noites para construir o teu baseline. Depois formamos o teu perfil inicial e desbloqueamos a fase seguinte.
          </p>
          
          <ul className="flow-steps">
            <li><span className="step-num">1</span> Recolher noites válidas</li>
            <li><span className="step-num">2</span> Formar perfil inicial</li>
            <li><span className="step-num">3</span> Avançar para contexto e propostas</li>
          </ul>
          
          <div className="info-badge mt-8">
            <span className="text-sm">São necessárias 5 noites válidas. Podes acompanhar o progresso em qualquer momento.</span>
          </div>
        </div>
      </div>

      <div className="bottom-action">
        <button className="primary-action-btn w-100" onClick={() => navigate('/tonight')}>
          <span>Preparar esta noite</span>
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
