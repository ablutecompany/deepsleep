import { useNavigate } from 'react-router-dom';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { getManualLogs } from '../domain/Phase1/manualLogStore';
import { appClock } from '../utils/appClock';
import { getTelemetryLogs } from '../domain/Telemetry/tracker';
import { getSensingSessions } from '../domain/Sensing/store';
import { evaporateNightCascade, wipeEntireProfile } from '../domain/DataGovernance/manager';
import { getBetaFeedbackRecords } from '../domain/Telemetry/betaFeedbackStore';
import { restoreFromSnapshot, verifyStorageHealth, getLastDefensiveSnapshotDate, generateSnapshotJSON } from '../domain/DataGovernance/backupManager';
import { Upload, HardDrive, ShieldAlert } from 'lucide-react';

export function Control() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();
  const sensingSessions = getSensingSessions();
  
  const storageHealth = verifyStorageHealth();
  const lastSnapshot = getLastDefensiveSnapshotDate();
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
      alert("Ainda não tens um perfil de sono estabilizado para exportar.");
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
    const snapStr = generateSnapshotJSON();
    downloadFile(`deepsleep_snapshot_beta_${appClock.todayStr()}.json`, snapStr);
  };

  const handleExportTelemetry = () => {
    const data = getTelemetryLogs();
    downloadFile(`deepsleep_dados_${appClock.todayStr()}.json`, JSON.stringify(data, null, 2));
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
      alert(`Não existem registos de sono associados a hoje (${today}).`);
      return;
    }
    
    if (window.confirm(`Vais apagar o registo da noite de ${today}.\n\nAo fazeres isto, qualquer som registado nesta janela também será apagado. Se desceres das 5 noites necessárias no histórico, vamos ter de deixar de mostrar os teus conselhos diários.\n\nQueres mesmo apagar isto?`)) {
      evaporateNightCascade(todaysLog.id);
      alert("A noite foi apagada do teu histórico.");
      navigate('/');
    }
  };

  const handleHardReset = () => {
    if (window.confirm("⚠️ APAGAR TODO O HISTÓRICO ⚠️\n\nVais apagar de vez tudo o que a app sabe sobre o teu sono:\n- Todas as noites e sestas\n- A avaliação que fez de ti\n- O plano que estás a seguir agora\n- Análises locais do quarto\n\nQueres mesmo desfazer tudo e recomeçar do zero?")) {
      if (window.confirm("Tem a certeza absoluta? A app vai reiniciar completamente em branco.")) {
        wipeEntireProfile();
        window.location.href = '/';
      }
    }
  };

  const handleImportRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm("⚠️ RESTORE DE SEGURANÇA ⚠️\n\nVais descarregar uma Cópia de Segurança e substituir TODOS os dados do teu telemóvel por este ficheiro.\nIsto serve para não perderes semanas de teste se a memória se corromper. Confirmas?")) {
       return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
       const str = e.target?.result as string;
       if (str) {
         const success = restoreFromSnapshot(str);
         if (success) {
           alert("Cópia restaurada. A app vai reiniciar com os novos dados.");
           window.location.href = '/';
         } else {
           alert("Falha no Restore. Ficheiro incompatível ou corrompido.");
         }
       }
    };
    reader.readAsText(file);
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
              <h3 className="module-title" style={{ fontSize: '18px' }}>Ambiente do Quarto (Som)</h3>
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
              <span className="retention-key">Observação da noite</span>
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
          <span className="kicker">Os teus Registos de Som</span>
          <p className="module-desc" style={{ marginBottom: '16px' }}>
            As medições de som automático que o telemóvel vai ouvindo para complementar o diário quando acordas.
          </p>
          <ul className="retention-list" style={{ marginTop: 0 }}>
            <li className="retention-item">
              <span className="retention-key">Total de noites observadas</span>
              <span className="retention-val">{sensingSessions.length} sessões</span>
            </li>
            <li className="retention-item">
              <span className="retention-key">Noites com dados suficientes</span>
              <span className="retention-val" style={{ color: '#10B981' }}>{sensingUsable} leituras completas</span>
            </li>
            {sensingErrors > 0 && (
              <li className="retention-item">
                <span className="retention-key">Sessões incompletas / com falhas</span>
                <span className="retention-val" style={{ color: '#EF4444' }}>{sensingErrors} falhas</span>
              </li>
            )}
          </ul>
        </section>

        <section className="editorial-module footer-module" style={{ borderTop: '2px dashed rgba(245, 158, 11, 0.4)', paddingTop: '32px', background: 'rgba(245, 158, 11, 0.02)', padding: '24px', borderRadius: '12px' }}>
          <span className="kicker" style={{ color: '#F59E0B', marginBottom: '16px' }}>Estado do teu Plano</span>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
             <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
               <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Noites Válidas</div>
               <div style={{ fontSize: '16px', color: '#F8FAFC' }}>{getManualLogs().filter(l => l.sleepType === 'NIGHT' && l.countsForBaseline).length} / 5</div>
             </div>
             <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
               <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>O Teu Perfil</div>
               <div style={{ fontSize: '16px', color: deliverable ? '#10B981' : '#F59E0B' }}>{deliverable ? 'Pronto' : 'Pendente'}</div>
             </div>
             
             {(() => {
                let phase3ActiveResult = 'Nenhum';
                let reviewPending = false;
                try {
                  const p3 = JSON.parse(localStorage.getItem('deepsleep_phase3_cycle') || 'null');
                  if (p3) {
                     phase3ActiveResult = p3.status === 'active' || p3.status === 'active_hold' ? 'Ativo' : 'Concluído';
                     reviewPending = (p3.status === 'active' || p3.status === 'active_hold') && Object.keys(p3.dailyCheckins || {}).length >= p3.minDays && !p3.dailyCheckins[appClock.todayStr()];
                  }
                } catch(e) {}
                const unlinkedSensing = getSensingSessions().find(s => !getManualLogs().some(log => log.dateStr === s.linkedNightId));

                return (
                  <>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Ciclo e Review</div>
                      <div style={{ fontSize: '16px', color: '#F8FAFC' }}>{phase3ActiveResult} {reviewPending ? <span style={{color:'#F59E0B', fontSize:'11px', marginLeft:'4px'}}>(Review pendente)</span> : ''}</div>
                    </div>
                    
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: unlinkedSensing ? '1px solid rgba(56, 189, 248, 0.4)' : 'none' }}>
                      <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Manhãs Pendentes</div>
                      <div style={{ fontSize: '16px', color: unlinkedSensing ? '#38BDF8' : '#F8FAFC' }}>{unlinkedSensing ? 'Registo em falta' : 'Resolvido'}</div>
                    </div>
                  </>
                );
             })()}

             <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
               <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Dados Atuais</div>
               <div style={{ fontSize: '16px', color: '#F8FAFC' }}>{getTelemetryLogs().length} <span style={{fontSize: '11px', color: '#64748B'}}>evts</span></div>
             </div>
             <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
               <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Feedback enviado</div>
               <div style={{ fontSize: '16px', color: getBetaFeedbackRecords().length > 0 ? '#10B981' : '#F8FAFC' }}>{getBetaFeedbackRecords().length} <span style={{fontSize: '11px', color: '#64748B'}}>itens</span></div>
             </div>
          </div>
        </section>

        <section className="editorial-module footer-module" style={{ borderTop: '2px dashed rgba(245, 158, 11, 0.4)', paddingTop: '32px', paddingBottom: '32px', paddingLeft: '24px', paddingRight: '24px', background: 'transparent' }}>
          <span className="kicker" style={{ color: '#F59E0B', marginBottom: '8px' }}>Cópia de Segurança</span>
          <p style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 300, lineHeight: 1.5, marginBottom: '24px' }}>
            Cópia completa da sessão de teste. Inclui versões, noites guardadas, registos de som e feedback interno.
          </p>

          <button onClick={handleExportFullTestSession} className="primary-btn" style={{ width: '100%', justifyContent: 'center', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '16px' }}>
            Fazer Cópia de Segurança Completa
          </button>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '16px', background: 'transparent', border: '1px dashed rgba(245, 158, 11, 0.3)', color: '#F59E0B', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
             <Upload size={16} />
             Restaurar dados via Ficheiro
             <input type="file" accept=".json" onChange={handleImportRestore} style={{ display: 'none' }} />
          </label>
        </section>

        <section className="editorial-module footer-module" style={{ borderTop: '2px dashed rgba(255, 255, 255, 0.1)', paddingTop: '32px', background: 'transparent', padding: '24px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
             {storageHealth === 'storage_ok' ? (
                <HardDrive size={20} color="#10B981" />
             ) : (
                <ShieldAlert size={20} color="#EF4444" />
             )}
             <span className="kicker" style={{ color: storageHealth === 'storage_ok' ? '#10B981' : '#EF4444', margin: 0 }}>
               Saúde de Armazenamento: {storageHealth === 'storage_ok' ? 'Estável' : 'Degradada'}
             </span>
           </div>
           
           <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 300, lineHeight: 1.5 }}>
             A app vai gerando Backups escondidos (<strong style={{color:'#E2E8F0'}}>{lastSnapshot ? new Date(lastSnapshot).toLocaleString() : 'Não encontrado'}</strong>). Se o teu telemóvel de repente decidir libertar memória, podes perder as tuas noites todas! Vai fazendo download do Backup Agregado aqui abaixo (a cada 3-4 dias).
           </p>

           <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <span className="kicker" style={{ margin: 0 }}>Version: 1.0.0-rc.1 (Beta-Interno)</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', display: 'block', marginTop: '4px' }}>Build controlada para testes reais. Funcionalidades encerram aqui.</span>
           </div>
        </section>

        <section className="editorial-module footer-module" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
          <span className="kicker" style={{ color: '#38BDF8' }}>Funcionalidades Experimentais</span>
          <div className="action-list" style={{ marginTop: '16px', marginBottom: '32px' }}>
            <button onClick={() => navigate('/sensing')} className="primary-btn action-link" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              Testar Observação Acústica
            </button>
            <button onClick={handleExportSensing} className="text-btn action-link" style={{ marginTop: '16px', color: '#94A3B8' }}>
              Exportar registos de som
            </button>
            <button onClick={handleExportTelemetry} className="text-btn action-link" style={{ marginTop: '16px', color: '#94A3B8' }}>
              Exportar dados de utilização
            </button>
            <p style={{ marginTop: '24px', fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>
              Ficheiro técnico para suporte no cálculo de ruído ambiente. O ecrã ficará desligado (preto) durante a observação. Nenhum dado sai do teu telemóvel.
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
