import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useNightCount } from '../hooks/useNightCount';

export function Phase1Progress() {
  const navigate = useNavigate();
  const nightCount = useNightCount();

  const progressPercent = Math.min((nightCount / 5) * 100, 100);

  if (nightCount >= 5) {
    return (
      <div className="flow-page completion-state fade-in">
        <div className="flow-content pt-12">
          <span className="session-kicker accent">Fase 1 · Concluída</span>
          <h1 className="title-large mt-2">Perfil inicial<br/>formado</h1>
          
          <p className="flow-text mt-6 mb-8">
            Já existe base suficiente para avançar. O motor concluiu a análise do teu baseline mecânico.
          </p>

          <div className="progress-insights mt-4 mb-8">
            <h2 className="module-title mb-2">Resumo da fase</h2>
            <p className="module-desc">
              O adormecimento inicial é consistente (média de 14 min). Há um padrão claro de interrupção entre as 03:00 e as 04:30. O teu perfil consolidativo está estagnado.
            </p>
          </div>

          <p className="flow-text text-secondary mt-8">
            O teu perfil detalhado já está disponível na área Perfil.
          </p>
        </div>

        <div className="bottom-action stack-btns">
          <button className="primary-action-btn w-100" onClick={() => navigate('/phase2/entry')}>
            <span>Avançar para contexto e propostas</span>
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
          <button className="secondary-action-btn w-100 mt-4" onClick={() => navigate('/profile')}>
            Ver perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flow-page progress-state fade-in">
      <div className="flow-content pt-12">
        <span className="session-kicker">Progresso da Fase</span>
        <h1 className="title-large mt-2">{nightCount} de <span className="text-muted">5 noites</span></h1>
        
        <div className="progress-bar-container mt-8">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="progress-insights mt-10">
          <h2 className="module-title mb-4">O que já aprendemos</h2>
          <p className="module-desc">
            - O adormecimento inicial é consistente (média de 14 min).<br/><br/>
            - Rasto vibracional elevado detetado sistematicamente na segunda metade da noite.
          </p>
        </div>

        <p className="flow-text mt-8 text-secondary">
          Faltam {5 - nightCount} noites válidas para concluir a monitorização e desbloquear o contexto da Fase 2.
        </p>
      </div>

      <div className="bottom-action">
        <button className="primary-action-btn w-100" onClick={() => navigate('/process_home')}>
          <span>Continuar monitorização</span>
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
