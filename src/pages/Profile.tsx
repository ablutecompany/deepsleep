import { NightSignature } from '../components/NightSignature';

export function Profile() {
  return (
    <div className="home-page" style={{ paddingBottom: '100px' }}>
      <div style={{ opacity: 0.15 }}>
        <NightSignature />
      </div>
      
      <div className="home-content">
        <header className="hero-section">
          <span className="kicker">Identidade Base</span>
          <h1 className="title-large" style={{ fontSize: '38px' }}>Perfil em<br/>construção</h1>
          <div className="readout-pill">
            <span className="status-dot"></span>
            NÍVEL DE CERTEZA DO PERFIL: ~60%
          </div>
        </header>

        <section className="editorial-module">
          <span className="kicker">Traços mais consistentes</span>

          <div className="trait-block" style={{ marginTop: '24px' }}>
            <h3 className="trait-label">Regularidade</h3>
            <h2 className="module-title">Responde melhor a horários estáveis</h2>
            <p className="module-desc">
              O teu sono tende a estabilizar visivelmente nas noites em que a hora de deitar não varia mais do que trinta minutos.
            </p>
            <div className="pattern-evidence">
              <div className="evidence-row">
                <span className="evidence-key">Base:</span>
                <span className="evidence-val">Confiança alta</span>
              </div>
            </div>
          </div>

          <div className="trait-block" style={{ marginTop: '40px' }}>
            <h3 className="trait-label">Fricção Digital</h3>
            <h2 className="module-title" style={{ color: 'var(--text-primary)' }}>Sensibilidade tátil</h2>
            <p className="module-desc">
              A reentrada no telemóvel a meio da noite pesa significativamente mais do que a média do teu padrão. Quando acontece, a continuidade da noite tende a cair.
            </p>
            <div className="pattern-evidence">
              <div className="evidence-row">
                <span className="evidence-key">Base:</span>
                <span className="evidence-val">Confiança média-alta</span>
              </div>
            </div>
          </div>
        </section>

        <section className="editorial-module">
          <span className="kicker accent">Maior fragilidade</span>
          <h2 className="module-title">Janela crítica na madrugada</h2>
          <p className="module-desc">
            Até agora, as horas entre as 03:00 e as 04:30 concentram quase toda a tua dispersão de sono contínuo.
          </p>
        </section>

        <section className="editorial-module">
          <span className="kicker">O que mais te protege</span>
          <h2 className="module-title" style={{ color: 'var(--text-primary)' }}>Ritmo de adormecimento</h2>
          <p className="module-desc">
            O adormecimento inicial tem-se mantido incrívelmente constante e rápido. Tem funcionado como a fundação protetora do teu descanso.
          </p>
        </section>

        <section className="editorial-module footer-module" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
          <span className="kicker">Ainda a ganhar forma</span>
          <h3 className="trait-label" style={{ color: 'var(--text-muted)' }}>Recuperação percebida</h3>
          <h2 className="module-title muted-title" style={{ fontSize: '15px', marginBottom: '12px' }}>
            O sistema tenta agora observar a ligação entre as tuas noites profundas e como sentes os teus dias de maior energia.
          </h2>
          <div className="pattern-evidence" style={{ borderLeft: 'none', paddingLeft: 0, marginTop: 0 }}>
            <div className="evidence-row">
              <span className="evidence-key">Estado:</span>
              <span className="evidence-val" style={{ color: 'var(--text-secondary)' }}>Ainda a ganhar forma. Estamos a cruzar dados empíricos.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
