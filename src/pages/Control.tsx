import { useNavigate } from 'react-router-dom';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { getManualLogs, deleteManualLog } from '../domain/Phase1/manualLogStore';
import { appClock } from '../utils/appClock';

export function Control() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();

  const downloadFile = (filename: string, text: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportProfile = () => {
    if (!deliverable) {
      alert("Ainda não tens um perfil mecânico estabilizado para exportar.");
      return;
    }
    downloadFile(`deepsleep_perfil_${appClock.todayStr()}.json`, JSON.stringify(deliverable, null, 2));
  };

  const handleExportMetrics = () => {
    const logs = getManualLogs();
    let learning = [];
    try {
      learning = JSON.parse(localStorage.getItem('deepsleep_learning_records') || '[]');
    } catch (e) {}
    
    if (logs.length === 0 && learning.length === 0) {
      alert("Não há dados de histórico ou aprendizagem retidos.");
      return;
    }
    
    const exportData = { raw_logs: logs, learning_records: learning };
    downloadFile(`deepsleep_historico_${appClock.todayStr()}.json`, JSON.stringify(exportData, null, 2));
  };

  const handleDeleteToday = () => {
    const today = appClock.todayStr();
    const logs = getManualLogs();
    const todaysLog = logs.find(l => l.dateStr === today);
    
    if (!todaysLog) {
      alert(`Não existem registos mecânicos associados a hoje (${today}).`);
      return;
    }
    
    if (window.confirm(`Vais apagar permanentemente o registo desta noite (${today}).\n\nIsto forçará o recálculo da tua janela de observação. Confirmas ação destrutiva?`)) {
      deleteManualLog(todaysLog.id);
      alert("Registo diário limpo com sucesso.");
      navigate('/');
    }
  };

  const handleHardReset = () => {
    if (window.confirm("⚠️ ATENÇÃO EXTREMA ⚠️\n\nVais destruir todo o teu perfil, base matemática e sessões em curso. A aplicação regressará ao estaca zero.\n\nConfirmas?")) {
      if (window.confirm("Ação irreversível. O teu telemóvel irá limpar a retenção agora.")) {
        localStorage.clear();
        window.location.href = '/';
      }
    }
  };
  return (
    <div className="home-page">
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
          <span className="kicker" style={{ color: '#38BDF8' }}>Beta Labs (Testes Locais)</span>
          <div className="action-list" style={{ marginTop: '16px', marginBottom: '32px' }}>
            <button onClick={() => navigate('/sensing')} className="primary-btn action-link" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              Testar Observação Acústica
            </button>
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>
              Spike técnico para cálculo de decibéis ambiente. O ecrã ficará preso em modo nocturno de alto-contraste. Sem envio para cloud.
            </p>
          </div>
        </section>

        <section className="editorial-module footer-module" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
          <span className="kicker">Exportação e Apagamento</span>
          
          <div className="action-list">
            <button onClick={handleExportProfile} className="text-btn action-link">Exportar perfil atual</button>
            <button onClick={handleExportMetrics} className="text-btn action-link">Exportar métricas de histórico</button>
            <button onClick={handleDeleteToday} className="text-btn action-link" style={{ marginTop: '16px' }}>Apagar sessão desta noite</button>
            <button onClick={handleHardReset} className="text-btn action-link" style={{ color: 'var(--text-muted)' }}>Apagar permanentemente o perfil</button>
          </div>
        </section>
      </div>
    </div>
  );
}
