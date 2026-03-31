import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Moon } from 'lucide-react';
import { appClock } from '../utils/appClock';
import { saveManualLog, type SleepDurationEstimate, type ReSleepDifficulty, type IntensityScale, ENVIRONMENT_OPTIONS } from '../domain/Phase1/manualLogStore';
import { trackEvent, startTimer, endTimer } from '../domain/Telemetry/tracker';
import { useLocation } from 'react-router-dom';
import { getSensingSessions } from '../domain/Sensing/store';

export function ManualLogForm() {
  const navigate = useNavigate();

  const [dateStr, setDateStr] = useState(() => appClock.todayStr());
  const [sleepType, setSleepType] = useState<'NIGHT' | 'NAP'>('NIGHT');

  // Relógios
  const [bedTime, setBedTime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [outOfBedTime, setOutOfBedTime] = useState('06:45');
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromSensing = queryParams.get('fromSensing') === 'true';
  const sessionId = queryParams.get('sessionId');

  // Estimativas
  const [sleepOnset, setSleepOnset] = useState<SleepDurationEstimate | ''>('');
  const [awakeningsCount, setAwakeningsCount] = useState<string>('');
  const [reSleepDifficulty, setReSleepDifficulty] = useState<ReSleepDifficulty | ''>('');
  
  // Sentimentos
  const [restoration, setRestoration] = useState<'Fraca' | 'Razoável' | 'Boa' | 'Excelente' | ''>('');
  const [tension, setTension] = useState<IntensityScale | ''>('');

  // Toggles binários
  const [physicalDiscomfort, setPhysicalDiscomfort] = useState(false);
  const [hungerAtBedtime, setHungerAtBedtime] = useState(false);
  const [nicotineNearBedtime, setNicotineNearBedtime] = useState(false);
  const [disturbingDreams, setDisturbingDreams] = useState(false);
  
  // Environment
  const [selectedEnv, setSelectedEnv] = useState<string[]>([]);

  // Sestas
  const [napPeriod, setNapPeriod] = useState<any>('');
  const [napDuration, setNapDuration] = useState<SleepDurationEstimate | ''>('');

  const toggleEnv = (env: string) => {
    setSelectedEnv(prev => prev.includes(env) ? prev.filter(e => e !== env) : [...prev, env]);
  };

  useEffect(() => {
    trackEvent('manual_log_started');
    startTimer('manual_log');
    
    if (fromSensing && sessionId) {
      const allSensing = getSensingSessions();
      const session = allSensing.find(s => s.id === sessionId);
      if (session) {
        // Hydrate times logically
        const startD = new Date(session.startedAt);
        const endD = session.endedAt ? new Date(session.endedAt) : null;
        
        const formatTime = (d: Date) => {
          const hh = d.getHours().toString().padStart(2, '0');
          const mm = d.getMinutes().toString().padStart(2, '0');
          return `${hh}:${mm}`;
        };
        
        setBedTime(formatTime(startD));
        if (endD) {
          setWakeTime(formatTime(endD));
          setOutOfBedTime(formatTime(endD));
        }
      }
    }
  }, []);

  const handleBack = () => {
    trackEvent('manual_log_abandoned');
    navigate('/manual_log_hub');
  };

  const handleSave = () => {
    if (sleepType === 'NIGHT') {
      saveManualLog({
        dateStr,
        sleepType,
        bedTime,
        wakeTime,
        outOfBedTime,
        sleepOnsetEstimate: sleepOnset || undefined,
        awakeningsCount: awakeningsCount !== '' ? (awakeningsCount === '3+' ? 3 : Number(awakeningsCount)) : undefined,
        bathroomAwakenings: undefined, // Removido uso, a manter type.
        reSleepDifficulty: reSleepDifficulty || undefined,
        perceivedRestoration: restoration || undefined,
        tensionAtBedtime: tension || undefined,
        physicalDiscomfort,
        hungerAtBedtime,
        nicotineNearBedtime,
        disturbingDreams,
        environmentIssues: selectedEnv
      });
      
      // LIGAÇÃO INOXIDÁVEL: Amarrar o sensing à entidade criada agora
      if (fromSensing && sessionId) {
         const allSensing = getSensingSessions();
         const targetIdx = allSensing.findIndex(s => s.id === sessionId);
         if (targetIdx !== -1) {
            allSensing[targetIdx].linkedNightId = dateStr;
            localStorage.setItem('deepsleep_sensing_sessions', JSON.stringify(allSensing));
         }
      }
      
    } else {
      saveManualLog({
        dateStr,
        sleepType,
        napPeriod: napPeriod || undefined,
        napDurationEstimate: napDuration || undefined
      });
    }
    
    const durationMs = endTimer('manual_log');
    trackEvent('manual_log_completed', { durationMs });
    
    navigate('/manual_log_hub');
  };

  const renderRadioGroup = (label: string, value: string, setValue: (val: any) => void, options: string[]) => (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => setValue(opt)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              background: value === opt ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
              color: value === opt ? '#38BDF8' : '#F8FAFC',
              border: `1px solid ${value === opt ? '#38BDF8' : 'rgba(255,255,255,0.1)'}`,
              cursor: 'pointer',
              flex: '1 1 auto',
              textAlign: 'center'
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="home-page fade-in" style={{ background: 'var(--bg-core)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px', flex: 1, paddingBottom: '120px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <ArrowLeft size={24} color="#F8FAFC" style={{ cursor: 'pointer', opacity: 0.6 }} onClick={handleBack} />
          <h1 style={{ marginLeft: '16px', fontSize: '20px', fontWeight: 300, color: '#F8FAFC' }}>Novo registo</h1>
        </div>

        {/* Tipo de Registo */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', padding: '4px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            onClick={() => setSleepType('NIGHT')}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', background: sleepType === 'NIGHT' ? 'var(--surface-color)' : 'transparent', color: sleepType === 'NIGHT' ? '#F8FAFC' : '#64748B', border: 'none', fontWeight: 500, fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <Moon size={16} /> Noite
          </button>
          <button 
            onClick={() => setSleepType('NAP')}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', background: sleepType === 'NAP' ? 'var(--surface-color)' : 'transparent', color: sleepType === 'NAP' ? '#F8FAFC' : '#64748B', border: 'none', fontWeight: 500, fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <Clock size={16} /> Sesta / Diurno
          </button>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Data (dia anterior)
          </label>
          <input 
            type="date"
            value={dateStr}
            onChange={e => setDateStr(e.target.value)}
            style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F8FAFC', fontSize: '16px', outline: 'none' }}
          />
        </div>

        {sleepType === 'NIGHT' && (
          <div className="fade-in">
            {/* Secção Relógios (Exatos) */}
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', color: '#F8FAFC', marginBottom: '24px', fontWeight: 400 }}>Horários</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', color: '#E2E8F0' }}>Hora de deitar</span>
                  <input type="time" value={bedTime} onChange={e => setBedTime(e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '6px', color: '#F8FAFC', fontSize: '16px', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', color: '#E2E8F0' }}>Hora de acordar</span>
                  <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '6px', color: '#F8FAFC', fontSize: '16px', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', color: '#E2E8F0' }}>Hora de levantar</span>
                  <input type="time" value={outOfBedTime} onChange={e => setOutOfBedTime(e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '6px', color: '#F8FAFC', fontSize: '16px', outline: 'none' }} />
                </div>
              </div>
            </div>

            {/* Secção Estimativas e UX Reduzido */}
            {renderRadioGroup('Tempo até adormecer', sleepOnset, setSleepOnset, ['< 15m', '15-30m', '30-60m', '> 60m', 'Não sei bem'])}
            
            {renderRadioGroup('Aproximadamente, quantas vezes acordaste?', awakeningsCount, setAwakeningsCount, ['0', '1', '2', '3+'])}
            
            {(awakeningsCount === '1' || awakeningsCount === '2' || awakeningsCount === '3+') && (
               renderRadioGroup('Dificuldade em readormecer', reSleepDifficulty, setReSleepDifficulty, ['Fácil', 'Algum esforço', 'Muito difícil', 'Não voltei a dormir'])
            )}

            {renderRadioGroup('Qualidade da recuperação', restoration, setRestoration, ['Fraca', 'Razoável', 'Boa', 'Excelente'])}

            {renderRadioGroup('Tensão física ou ansiedade?', tension, setTension, ['Nenhuma', 'Leve', 'Alta'])}

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Condições Adicionais
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { id: 'fome', label: 'Fome ao deitar', state: hungerAtBedtime, set: setHungerAtBedtime },
                  { id: 'nicotina', label: 'Cigarro / nicotina tarde', state: nicotineNearBedtime, set: setNicotineNearBedtime },
                  { id: 'pesadelos', label: 'Pesadelos / sonhos tensos', state: disturbingDreams, set: setDisturbingDreams },
                  { id: 'dor', label: 'Dor ou desconforto físico', state: physicalDiscomfort, set: setPhysicalDiscomfort },
                ].map(item => (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: item.state ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${item.state ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={item.state as boolean} onChange={e => (item.set as any)(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#38BDF8' }} />
                    <span style={{ fontSize: '15px', color: item.state ? '#38BDF8' : '#E2E8F0' }}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
               <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ambiente e outros fatores
               </label>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                 {ENVIRONMENT_OPTIONS.map(env => (
                   <button
                     key={env}
                     type="button"
                     onClick={() => toggleEnv(env)}
                     style={{
                       padding: '10px 14px',
                       borderRadius: '24px',
                       fontSize: '13px',
                       background: selectedEnv.includes(env) ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                       color: selectedEnv.includes(env) ? '#38BDF8' : '#94A3B8',
                       border: `1px solid ${selectedEnv.includes(env) ? '#38BDF8' : 'rgba(255,255,255,0.1)'}`,
                       cursor: 'pointer'
                     }}
                   >
                     {env}
                   </button>
                 ))}
               </div>
            </div>

          </div>
        )}

        {sleepType === 'NAP' && (
          <div className="fade-in">
             {renderRadioGroup('Período do Dia', napPeriod, setNapPeriod, ['Manhã', 'Início da tarde', 'Final da tarde', 'Início da noite'])}
             {renderRadioGroup('Duração', napDuration, setNapDuration, ['< 15m', '15-30m', '30-60m', '> 60m', 'Não sei bem'])}
          </div>
        )}

        <button 
          onClick={handleSave}
          className="primary-btn"
          style={{ width: '100%', justifyContent: 'center', position: 'sticky', bottom: '24px', zIndex: 20 }}
        >
          Guardar Registo
        </button>

      </div>
    </div>
  );
}
