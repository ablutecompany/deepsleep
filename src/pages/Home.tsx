import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NightSignature } from '../components/NightSignature';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <NightSignature />
      
      <div className="home-content">
        <header className="hero-section">
          <span className="kicker">Análise Concluída</span>
          <h1 className="title-large">Noite<br/>fragmentada</h1>
          <div className="readout-pill">
            <span className="status-dot"></span>
            CONFIANÇA DA ANÁLISE: ALTA
          </div>
        </header>

        <section className="editorial-module">
          <span className="kicker accent">O que mais pesou</span>
          <h2 className="module-title">Ecrã ligado na madrugada</h2>
          <p className="module-desc">
            Foi detetada atividade às 03:41. Esta luz interrompeu o ciclo e tornou mais difícil voltar a adormecer profundamente.
          </p>
          <button className="text-btn detail-btn" onClick={() => navigate('/insight')}>
            Como chegámos aqui <ArrowRight size={14} />
          </button>
        </section>

        <section className="editorial-module priority-module">
          <span className="kicker">Foco para hoje</span>
          <h2 className="module-title">Telemóvel longe da cama</h2>
          <p className="module-desc">
            Esta noite, deixe o telemóvel fora do alcance físico. Criar esta distância ajuda a não ceder ao impulso automático de olhar para o ecrã se acordar.
          </p>
          
          <button className="ritual-trigger" onClick={() => navigate('/tonight')}>
            <span className="ritual-trigger-label">Iniciar sessão nocturna</span>
            <ArrowRight size={18} strokeWidth={1.2} className="ritual-trigger-icon" />
          </button>
        </section>

        <section className="editorial-module footer-module">
          <span className="kicker">O que estamos a aprender</span>
          <h2 className="module-title muted-title">
            O adormecimento inicial continua rápido e eficiente (~12 min). As interrupções estão a acontecer quase em exclusivo na janela entre as 03:00 e as 04:30.
          </h2>
        </section>
      </div>
    </div>
  );
}
