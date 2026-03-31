import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Activity, Calendar, FilePlus, Trash2, Moon, Sun } from 'lucide-react';
import { getManualLogs, type ManualAppLog } from '../domain/Phase1/manualLogStore';
import { getSensingSessions } from '../domain/Sensing/store';
import { evaporateNightCascade } from '../domain/DataGovernance/manager';
import { Ear } from 'lucide-react';

export function ManualPhase1Hub() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ManualAppLog[]>([]);
  const target = 5;

  const [sensingSessions, setSensingSessions] = useState<any[]>([]);

  useEffect(() => {
    const handleUpdate = () => {
      setLogs(getManualLogs());
      setSensingSessions(getSensingSessions());
    };
    handleUpdate();
    window.addEventListener('deepsleep_simulated_change', handleUpdate);
    return () => window.removeEventListener('deepsleep_simulated_change', handleUpdate);
  }, []);

  const validNights = logs.filter(l => l.sleepType === 'NIGHT' && l.countsForBaseline);
  const progress = Math.min(validNights.length, target);
  const done = progress >= target;

  const handleDelete = (log: ManualAppLog) => {
    if (log.sleepType === 'NIGHT' && log.countsForBaseline && validNights.length === 5) {
      if (!window.confirm("Atenção: Vais apagar uma noite importante.\n\nAo apagares esta noite, ficarás com menos de 5 noites válidas. Até juntares mais 1 noite, teremos de colocar o teu plano atual em espera, para garantir que as nossas dicas se baseiam no teu sono real.\n\nQueres mesmo apagar esta noite?")) {
        return;
      }
    } else {
      if (!window.confirm("Queres apagar este registo? Esta ação não pode ser recuperada.")) {
        return;
      }
    }
    evaporateNightCascade(log.id);
    setLogs(getManualLogs());
    setSensingSessions(getSensingSessions());
  };

  // Deteção Matinal de Pendência
  // Verifica se há alguma observação acústica não consumida por um Manual Log
  const unlinkedSensing = sensingSessions.find(s => !logs.some(l => l.dateStr === s.linkedNightId));

  return (
    <div className="home-page fade-in" style={{ background: 'var(--bg-core)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/process_home')} />
        
        <header style={{ marginBottom: '32px' }}>
          <span className="kicker" style={{ color: '#64748B', marginBottom: '8px' }}>Fase 1 · Registo Integrado</span>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            {progress} de {target} <span style={{ color: '#64748B' }}>noites</span>
          </h1>
          <p style={{ marginTop: '12px', fontSize: '15px', color: '#94A3B8', fontWeight: 300, lineHeight: '1.5' }}>
            {done 
              ? 'Já conhecemos o teu perfil inicial. Podes rever o teu histórico abaixo.'
              : 'Precisamos de avaliar 5 noites de sono tuas para perceber o teu ritmo natural com eficácia.'}
          </p>
        </header>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, paddingBottom: '90px' }}>
          
          {unlinkedSensing ? (
            <button 
              onClick={() => navigate(`/manual_log_form?fromSensing=true&sessionId=${unlinkedSensing.id}`)}
              style={{ 
                background: 'rgba(56, 189, 248, 0.15)', 
                border: '1px solid rgba(56, 189, 248, 0.4)', 
                borderRadius: '8px', 
                padding: '20px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '8px',
                color: '#38BDF8',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Ear size={20} color="#38BDF8" />
                <span style={{ fontWeight: 600, fontSize: '15px', color: '#F8FAFC' }}>Completa a Avaliação Sonora de Ontem</span>
              </div>
              <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.4' }}>
                 A app já fez o processamento sonoro da tua noite. Só precisas de acrescentar a tua percepção pessoal para juntarmos tudo.
              </p>
              <span style={{ fontSize: '14px', fontWeight: 500, marginTop: '8px' }}>Completar Registo da Noite →</span>
            </button>
          ) : (
            <button 
              onClick={() => navigate('/manual_log_form')}
              className="text-btn"
              style={{ 
                background: '#0a0a0c', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '8px', 
                padding: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '12px',
                color: '#38BDF8'
              }}
            >
              <FilePlus size={18} />
              <span>Adicionar Novo Registo Manual</span>
            </button>
          )}
          
          <button 
            onClick={() => navigate('/sensing')}
            className="text-btn"
            style={{ 
              background: 'transparent',
              border: '1px dashed rgba(56, 189, 248, 0.3)', 
              borderRadius: '8px', 
              padding: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              color: '#94A3B8',
              fontSize: '13px',
              marginBottom: '16px'
            }}
          >
            <Ear size={14} color="#38BDF8" />
            <span>Ferramenta de Escuta Sonora <span style={{ opacity: 0.5, fontSize: '11px', textTransform: 'uppercase', marginLeft: '6px' }}>Beta Automático</span></span>
          </button>

          {logs.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '32px', opacity: 0.5 }}>
              <Calendar size={32} color="#64748B" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#64748B', fontSize: '14px', fontWeight: 300 }}>Nenhum historial recolhido.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {logs.map(log => {
              const isNap = log.sleepType === 'NAP';
              const isValidNight = !isNap && log.countsForBaseline;
              // Visual Badges
              let borderColor = 'rgba(255,255,255,0.05)';
              let badgeColor = '#94A3B8';
              let badgeText = 'Noite Base';
              if (isNap) {
                borderColor = 'rgba(245, 158, 11, 0.2)'; 
                badgeColor = '#F59E0B'; 
                badgeText = 'Sesta';
              } else if (!isValidNight) {
                borderColor = 'rgba(239, 68, 68, 0.2)';
                badgeColor = '#EF4444';
                badgeText = 'Incompleto';
              } else {
                borderColor = 'rgba(16, 185, 129, 0.2)';
                badgeColor = '#10B981';
              }

              return (
                <div key={log.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', color: '#F8FAFC', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isNap ? <Sun size={14} color={badgeColor} /> : <Moon size={14} color={badgeColor} />}
                        {log.dateStr}
                      </h4>
                      <span style={{ fontSize: '10px', color: badgeColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px', display: 'inline-block' }}>
                        {badgeText}
                      </span>
                    </div>
                    <button onClick={() => handleDelete(log)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} color="#EF4444" opacity={0.5} />
                    </button>
                  </div>
                  
                  {!isNap ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="#64748B" />
                        <span style={{ fontSize: '13px', color: '#94A3B8' }}>{log.bedTime || '?'} - {log.wakeTime || '?'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Activity size={14} color="#64748B" />
                        <span style={{ fontSize: '13px', color: '#94A3B8' }}>{log.awakeningsCount !== undefined ? log.awakeningsCount + ' despertares' : 'Despertares s/ reg.'}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Clock size={14} color="#64748B" />
                      <span style={{ fontSize: '13px', color: '#94A3B8' }}>{log.napPeriod || 'Sesta genérica'} ({log.napDurationEstimate || 'Tempo desc.'})</span>
                    </div>
                  )}
                  
                  {!isNap && log.perceivedRestoration && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recuperação:</span>
                      <span style={{ fontSize: '13px', color: '#E2E8F0' }}>{log.perceivedRestoration}</span>
                    </div>
                  )}

                  {(() => {
                    if (isNap) return null;
                    const linkedSensing = sensingSessions.find(s => s.linkedNightId === log.dateStr);
                    if (!linkedSensing) {
                       return (
                         <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                           <Ear size={14} color="#64748B" opacity={0.5} />
                           <span style={{ fontSize: '12px', color: '#64748B', opacity: 0.5 }}>Sem processamento sonoro associado</span>
                         </div>
                       );
                    }
                    const isUsable = linkedSensing.qualityState !== 'unusable';
                    
                    return (
                      <div style={{ marginTop: '4px', background: 'rgba(56, 189, 248, 0.05)', padding: '12px', borderRadius: '6px', border: '1px dashed rgba(56, 189, 248, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <Ear size={14} color="#38BDF8" />
                          <span style={{ fontSize: '13px', color: '#38BDF8', fontWeight: 500 }}>
                             {isUsable ? 'Processamento Sonoro Local' : 'Áudio Corrompido/Curto'}
                          </span>
                        </div>
                        {isUsable && linkedSensing.summary?.dominantDisturbance ? (
                          <div style={{ fontSize: '12px', color: '#94A3B8', paddingLeft: '20px', lineHeight: '1.4' }}>
                           <strong>Detetado:</strong> {linkedSensing.summary.dominantDisturbance}
                          </div>
                        ) : (
                          <div style={{ fontSize: '12px', color: '#94A3B8', paddingLeft: '20px' }}>
                            Sem resumo sonoro claro ({linkedSensing.contaminationReasons?.[0] || 'ruído/curta'})
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
