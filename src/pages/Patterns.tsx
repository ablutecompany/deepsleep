import { NightSignature } from '../components/NightSignature';

export function Patterns() {
  return (
    <div className="home-page">
      <div style={{ opacity: 0.4 }}>
        <NightSignature />
      </div>
      
      <div className="home-content">
        <header className="hero-section">
          <span className="kicker">Inteligência Acumulada</span>
          <h1 className="title-large" style={{ fontSize: '38px' }}>O que<br/>aprendemos</h1>
          <div className="readout-pill">
            <span className="status-dot" style={{ animationDuration: '4.5s' }}></span>
            AMOSTRAGEM BASE: 14 NOITES
          </div>
        </header>

        <section className="editorial-module">
          <span className="kicker">Padrões consolidados</span>
          <ul className="log-list" style={{ marginTop: '16px' }}>
            <li className="log-item dominant">
              <div className="log-meta">REPETE-SE HÁ 8 DIAS</div>
              <div className="log-text">
                O adormecimento é mais rápido e natural sem o telemóvel perto da cama.
              </div>
            </li>
            <li className="log-item">
              <div className="log-meta">PADRÃO RECORRENTE (14 DIAS)</div>
              <div className="log-text">
                Tendência para perder continuidade entre as 03:00 e as 04:30.
              </div>
            </li>
          </ul>
        </section>

        <section className="editorial-module">
          <span className="kicker accent">Maior Disruptor</span>
          <h2 className="module-title">Acesso ao telemóvel de madrugada</h2>
          
          <p className="module-desc">
            Quando isto acontece, a continuidade do sono tende a cair drasticamente.
          </p>
          
          <div className="pattern-evidence">
            <div className="evidence-row">
              <span className="evidence-key">Presença:</span>
              <span className="evidence-val">Em ~71% das noites fragmentadas</span>
            </div>
            <div className="evidence-row">
              <span className="evidence-key">Confiança:</span>
              <span className="evidence-val">Alta (10 registos associados)</span>
            </div>
          </div>
        </section>

        <section className="editorial-module">
          <span className="kicker">Maior Protetor</span>
          <h2 className="module-title" style={{ color: 'var(--text-primary)' }}>Telemóvel afastado antes de dormir</h2>
          
          <p className="module-desc">
            Tende a garantir o ciclo inicial mais profundo da semana.
          </p>

          <div className="pattern-evidence">
            <div className="evidence-row">
              <span className="evidence-key">Presença:</span>
              <span className="evidence-val">Em ~84% das melhores sessões</span>
            </div>
            <div className="evidence-row">
              <span className="evidence-key">Confiança:</span>
              <span className="evidence-val">Sinal forte e consistente</span>
            </div>
          </div>
        </section>

        <section className="editorial-module footer-module" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
          <span className="kicker">Ainda estamos a confirmar</span>
          <h2 className="module-title muted-title" style={{ fontSize: '15px', marginBottom: '12px' }}>
            A variação do horário em que se deita ao fim de semana parece afetar o descanso das segundas-feiras.
          </h2>
          <div className="pattern-evidence" style={{ borderLeft: 'none', paddingLeft: 0, marginTop: 0 }}>
            <div className="evidence-row">
              <span className="evidence-key">Estado:</span>
              <span className="evidence-val" style={{ color: 'var(--text-secondary)' }}>Sinal emergente. Mais 6 a 8 noites para aumentar a confiança.</span>
            </div>
          </div>
        </section>

        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingBottom: '32px' }}>
          <button 
            onClick={() => window.location.href = '/phase2/proposals'}
            className="primary-btn"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>Procurar Nova Direção</span>
          </button>
        </div>
      </div>
    </div>
  );
}
