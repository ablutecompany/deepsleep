import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NightSignature } from '../components/NightSignature';

export function InsightDetail() {
  const navigate = useNavigate();

  return (
    <div className="home-page" style={{ padding: 0 }}>
      {/* Opacidade mais reduzida para o NightSignature focar na leitura analítica */}
      <div style={{ opacity: 0.5 }}>
         <NightSignature />
      </div>

      {/* Top Bar Navigation */}
      <nav className="top-bar">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <span className="top-bar-title">Análise de Dados</span>
      </nav>

      <div className="home-content">
        <header className="hero-section" style={{ paddingTop: '50px', paddingBottom: '40px' }}>
          <span className="kicker">Resultado Sintetizado</span>
          <h1 className="title-large" style={{ fontSize: '36px' }}>
            O maior impacto desta noite foi o uso do telemóvel.
          </h1>
        </header>

        <section className="editorial-module">
          <span className="kicker">Evidência Central</span>
          <ul className="evidence-list">
            <li>
              <span className="evidence-value">02</span>
              <span className="evidence-label">Despertares registados</span>
            </li>
            <li>
              <span className="evidence-value">01</span>
              <span className="evidence-label">Ecrã desbloqueado (03:41)</span>
            </li>
            <li>
              <span className="evidence-value">11</span>
              <span className="evidence-label">Minutos de ecrã ativo</span>
            </li>
            <li className="warning-item">
              <span className="evidence-value">-15%</span>
              <span className="evidence-label">Quebra na continuidade (vs Média)</span>
            </li>
          </ul>
        </section>

        <section className="editorial-module">
          <span className="kicker">A Ligação Plausível</span>
          <p className="module-desc">
            O padrão das últimas semanas mostra-nos que o ecrã a meio da noite está a dificultar imenso o regresso natural ao sono profundo.
          </p>
          <div className="readout-pill">CONFIANÇA DO MODELO: ALTA</div>
        </section>

        <section className="editorial-module footer-module priority-module">
          <span className="kicker accent">Recomendação Prática</span>
          <h2 className="module-title">Afastar o telemóvel da cama</h2>
          <p className="module-desc" style={{ marginBottom: '32px' }}>
            Cortar o acesso imediato ao ecrã é o primeiro passo para testar esta ligação. Pouse-o longe do alcance para neutralizar o instinto automático de acordar e pegar nele.
          </p>
          <button className="primary-btn" onClick={() => navigate('/tonight')}>
            Preparar Modo Noite <CheckCircle2 size={18} />
          </button>
        </section>
      </div>
    </div>
  );
}
