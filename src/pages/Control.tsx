import { useNavigate } from 'react-router-dom';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { getManualLogs } from '../domain/Phase1/manualLogStore';
import { appClock } from '../utils/appClock';
import { getTelemetryLogs } from '../domain/Telemetry/tracker';
import { getSensingSessions } from '../domain/Sensing/store';
import { evaporateNightCascade, wipeEntireProfile } from '../domain/DataGovernance/manager';
import { getBetaFeedbackRecords } from '../domain/Telemetry/betaFeedbackStore';

export function Control() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();
  const sensingSessions = getSensingSessions();
  const sensingUsable = sensingSessions.filter(s => s.qualityState !== 'unusable').length;
  const sensingErrors = sensingSessions.filter(s => s.qualityState === 'unusable').length;

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
    
    let phase3 = null;
    try {
      phase3 = JSON.parse(localStorage.getItem('deepsleep_phase3_cycle') || 'null');
    } catch(e) {}
    
    if (logs.length === 0 && learning.length === 0 && !phase3) {
      alert("Não há dados de histórico ou aprendizagem retidos.");
      return;
    }
    
    const exportData = { 
      raw_logs: logs, 
      learning_records: learning,
      active_cycle: phase3 ? {
        cycleId: phase3.cycleId,
        proposalId: phase3.proposalId,
        status: phase3.status,
        dailyCheckins: phase3.dailyCheckins || {},
        dailyFeedback: phase3.dailyFeedback || {} // Incluído o micro-feedback diário explicitamente
      } : null
    };
    downloadFile(`deepsleep_historico_${appClock.todayStr()}.json`, JSON.stringify(exportData, null, 2));
  };

  const handleExportFullTestSession = () => {
    let phase3 = null;
    try { phase3 = JSON.parse(localStorage.getItem('deepsleep_phase3_cycle') || 'null'); } catch(e) {}
    let learning = [];
    try { learning = JSON.parse(localStorage.getItem('deepsleep_learning_records') || '[]'); } catch(e) {}

    const data = {
      beta_export_timestamp: new Date().toISOString(),
      beta_simulated_clock: appClock.todayStr(),
      tester_feedback: getBetaFeedbackRecords(),
      raw_logs: getManualLogs(),
      profile: deliverable,
      active_cycle: phase3,
      learning_records: learning,
      sensing_sessions: getSensingSessions(),
      telemetry: getTelemetryLogs(),
    };
    downloadFile(`deepsleep_agg_beta_test_${appClock.todayStr()}.json`, JSON.stringify(data, null, 2));
  };

  const handleExportTelemetry = () => {
    const data = getTelemetryLogs();
    downloadFile(`deepsleep_telemetria_${appClock.todayStr()}.json`, JSON.stringify(data, null, 2));
  };

  const handleExportSensing = () => {
    let data = [];
    try {
      data = JSON.parse(localStorage.getItem('deepsleep_sensing_sessions') || '[]');
    } catch(e) {}
    downloadFile(`deepsleep_acustica_${appClock.todayStr()}.json`, JSON.stringify(data, null, 2));
  };

  const handleDeleteToday = () => {
    const today = appClock.todayStr();
    const logs = getManualLogs();
    const todaysLog = logs.find(l => l.dateStr === today);
    
    if (!todaysLog) {
      alert(`Não existem registos mecânicos associados a hoje (${today}).`);
      return;
    }
    
    if (window.confirm(`Vais apagar permanentemente o registo desta noite (${today}).\n\nEste recálculo irá remover contextualmente quaisquer observações acústicas ligadas a esta noite e pode suspender o teu plano diário se passares abaixo do limite de baseline. Confirmas ação destrutiva?`)) {
      evaporateNightCascade(todaysLog.id);
      alert("Registo diário evaporado. Recálculo efetuado com sucesso.");
      navigate('/');
    }
  };

  const handleHardReset = () => {
    if (window.confirm("⚠️ APAGAMENTO PERMANENTE DE PERFIL ⚠️\n\nVais destruir e reinicializar:\n- Diário basal\n- Interpretações do motor\n- Decisões ativas (Fase 3)\n- Gravações locais do Microfone\n\nAs tuas exportações locais de histórico também ficarão órfãs. Confirmas limpar tudo?")) {
      if (window.confirm("Ação destrutiva final. A tua app irá suspender num ecrã em branco e reinicializar.")) {
        wipeEntireProfile();
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

        <section className="editorial-module">
          <span className="kicker">Dados Recolhidos Observacionais</span>
          <p className="module-desc" style={{ marginBottom: '16px' }}>
            Histórico opcional das tuas sessões acústicas de observação de sinal local, cruzadas e acopladas ao teu diário manual.
          </p>
          <ul className="retention-list" style={{ marginTop: 0 }}>
            <li className="retention-item">
              <span className="retention-key">Sessões Totais</span>
              <span className="retention-val">{sensingSessions.length} sessões</span>
            </li>
            <li className="retention-item">
              <span className="retention-key">Validadas p/ Histórico</span>
              <span className="retention-val" style={{ color: '#10B981' }}>{sensingUsable} capturas legíveis</span>
            </li>
            {sensingErrors > 0 && (
              <li className="retention-item">
                <span className="retention-key">Interrupções / Corrompidas</span>
                <span className="retention-val" style={{ color: '#EF4444' }}>{sensingErrors} falhas</span>
              </li>
            )}
          </ul>
        </section>

        <section className="editorial-module footer-module" style={{ borderTop: '2px dashed rgba(245, 158, 11, 0.4)', paddingTop: '32px', background: 'rgba(245, 158, 11, 0.02)', padding: '24px', borderRadius: '12px' }}>
          <span className="kicker" style={{ color: '#F59E0B', marginBottom: '16px' }}>[Beta] Painel Operacional de Sessão</span>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
             <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
               <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Noites Válidas</div>
               <div style={{ fontSize: '16px', color: '#F8FAFC' }}>{getManualLogs().filter(l => l.sleepType === 'NIGHT' && l.countsForBaseline).length} / 5</div>
             </div>
             <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
               <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Baseline Motor</div>
               <div style={{ fontSize: '16px', color: deliverable ? '#10B981' : '#F59E0B' }}>{deliverable ? 'Pronta' : 'Pendente'}</div>
             </div>
             <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
               <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Telemetria Ativa</div>
               <div style={{ fontSize: '16px', color: '#F8FAFC' }}>{getTelemetryLogs().length} <span style={{fontSize: '11px', color: '#64748B'}}>evts</span></div>
             </div>
             <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
               <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Fricção Registada</div>
               <div style={{ fontSize: '16px', color: '#F8FAFC' }}>{getBetaFeedbackRecords().length} <span style={{fontSize: '11px', color: '#64748B'}}>reps</span></div>
             </div>
          </div>
          
          <button onClick={handleExportFullTestSession} className="primary-btn" style={{ width: '100%', justifyContent: 'center', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            Baixar Exportação Agregada (Beta)
          </button>
        </section>

        <section className="editorial-module footer-module" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
          <span className="kicker" style={{ color: '#38BDF8' }}>Beta Labs (Testes Locais)</span>
          <div className="action-list" style={{ marginTop: '16px', marginBottom: '32px' }}>
            <button onClick={() => navigate('/sensing')} className="primary-btn action-link" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              Testar Observação Acústica
            </button>
            <button onClick={handleExportSensing} className="text-btn action-link" style={{ marginTop: '16px', color: '#94A3B8' }}>
              Exportar registos acústicos
            </button>
            <button onClick={handleExportTelemetry} className="text-btn action-link" style={{ marginTop: '16px', color: '#94A3B8' }}>
              Exportar telemetria local
            </button>
            <p style={{ marginTop: '24px', fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>
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
