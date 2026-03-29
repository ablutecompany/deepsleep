import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  const handleContinue = () => {
    let count = parseInt(localStorage.getItem('nightCount') || '0', 10);
    if (isNaN(count)) count = 0;
    count = count + 1;
    localStorage.setItem('nightCount', count.toString());
    navigate('/phase1_progress');
  };

  return (
    <div className="flow-page review-state fade-in">
      <div className="flow-content pt-12">
        <span className="session-kicker">Leitura da manhã</span>
        <h1 className="title-large mt-2">Leitura<br/>degradada</h1>
        
        <div className="review-panel mt-8">
          <div className="state-row">
            <span className="state-label">Estado da sessão</span>
            <span className="state-value">Válida</span>
          </div>
          <div className="state-row">
            <span className="state-label">Confiança</span>
            <span className="state-value">Moderada</span>
          </div>
        </div>

        <div className="editorial-module mt-6 flat">
          <h2 className="module-title">Pico de movimento às 03:41</h2>
          <p className="module-desc">
            Agitação detetada fora da fase de sono profundo habitual, compatível com uma interrupção mecânica ou despertar transitório.
          </p>
        </div>

        <p className="state-disclosure mt-8">
          Esta leitura ficou condicionada por dados em falta (uso de ecrã).
        </p>
      </div>

      <div className="bottom-action">
        <button className="primary-action-btn w-100" onClick={handleContinue}>
          <span>Continuar</span>
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
