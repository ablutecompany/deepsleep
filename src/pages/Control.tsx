export function Control() {
  return (
    <div className="home-page" style={{ paddingBottom: '100px' }}>
      <div className="home-content">
        <header className="hero-section">
          <span className="kicker">Conservação e Confiança</span>
          <h1 className="title-large" style={{ fontSize: '38px' }}>Os seus dados,<br/>sob controlo</h1>
          <p className="module-desc" style={{ marginTop: '16px' }}>
            A inteligência do sistema desenha o seu perfil de sono. Pode ver, gerir, exportar e apagar tudo o que retemos em qualquer altura.
          </p>
        </header>

        <section className="editorial-module">
          <span className="kicker">Permissões Essenciais</span>
          
          <div className="permission-block">
            <div className="permission-header">
              <h3 className="module-title" style={{ fontSize: '18px' }}>Áudio Nocturno</h3>
              <span className="status-label active">Ativo</span>
            </div>
            <p className="module-desc">
              Processado apenas para detetar padrões e interrupções. O som original não é gravado, partilhado nem sai do seu telemóvel.
            </p>
          </div>

          <div className="permission-block">
            <div className="permission-header">
              <h3 className="module-title" style={{ fontSize: '18px' }}>Atividade do Telemóvel</h3>
              <span className="status-label active">Ativo</span>
            </div>
            <p className="module-desc">
              Usado exclusivamente para medir o impacto quando o ecrã liga durante os despertares de madrugada.
            </p>
          </div>
          
          <div className="permission-block">
            <div className="permission-header">
              <h3 className="module-title" style={{ fontSize: '18px' }}>Movimento Corporal</h3>
              <span className="status-label partial">Parcial</span>
            </div>
            <p className="module-desc">
              Acesso limitado à janela nocturna para calcular o seu nível de quietude e agitação contínua.
            </p>
          </div>
        </section>

        <section className="editorial-module">
          <span className="kicker accent">Tempo de Retenção</span>
          <ul className="retention-list">
            <li className="retention-item">
              <span className="retention-key">Áudio de processamento</span>
              <span className="retention-val">Apenas 24 horas</span>
            </li>
            <li className="retention-item">
              <span className="retention-key">Características de sono contínuo</span>
              <span className="retention-val">Até 6 meses</span>
            </li>
            <li className="retention-item">
              <span className="retention-key">Logs técnicos internos</span>
              <span className="retention-val">Apagados aos 30 dias</span>
            </li>
            <li className="retention-item">
              <span className="retention-key">Perfil de sono</span>
              <span className="retention-val">Até pedir apagamento</span>
            </li>
          </ul>
        </section>

        <section className="editorial-module">
          <span className="kicker">Ecossistema ablute_ (Opcional)</span>
          <p className="module-desc">
            O seu perfil de sono não é vendido nem partilhado externamente. Opcionalmente, pode fechar a ligação interna com as aplicações de nutrição e treino ablute_ para otimizar recomendações contínuas.
          </p>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="evidence-key" style={{ color: 'var(--text-primary)', fontSize: '12px'}}>Personalização Partilhada</span>
            <span className="status-label inactive">Desligado</span>
          </div>
        </section>

        <section className="editorial-module footer-module" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
          <span className="kicker">Exportação e Apagamento</span>
          
          <div className="action-list">
            <button className="text-btn action-link">Exportar perfil atual</button>
            <button className="text-btn action-link">Exportar métricas de histórico</button>
            <button className="text-btn action-link" style={{ marginTop: '16px' }}>Apagar sessão desta noite</button>
            <button className="text-btn action-link" style={{ color: 'var(--text-muted)' }}>Apagar permanentemente o perfil</button>
          </div>
        </section>
      </div>
    </div>
  );
}
