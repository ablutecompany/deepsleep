import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { saveManualLog, type ManualNightLog } from '../domain/Phase1/manualLogStore';

export function ManualPhase1Form() {
  const navigate = useNavigate();
  
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [timeToSleepMin, setTimeToSleepMin] = useState<number | ''>('');
  const [awakenings, setAwakenings] = useState<number | ''>('');
  const [awakeTimeMin, setAwakeTimeMin] = useState<number | ''>('');
  const [recovery, setRecovery] = useState<ManualNightLog['recovery']>('Razoável');
  const [outOfBedTime, setOutOfBedTime] = useState('07:15');
  const [bathroomAwakenings, setBathroomAwakenings] = useState<number | ''>('');
  const [tensionAtBedtime, setTensionAtBedtime] = useState<'Nenhuma' | 'Leve' | 'Alta'>('Nenhuma');
  const [physicalDiscomfort, setPhysicalDiscomfort] = useState(false);
  const [hungerAtBedtime, setHungerAtBedtime] = useState(false);
  const [nicotineNearBedtime, setNicotineNearBedtime] = useState(false);
  const [disturbingDreams, setDisturbingDreams] = useState(false);

  // Markers removidos visulamente, mantendo o array silencioso
  const markers: string[] = [];
  
  const [tookNap, setTookNap] = useState(false);
  const [napDurationMin, setNapDurationMin] = useState<number | ''>('');
  const [napPeriod, setNapPeriod] = useState<'Manhã'|'Tarde'|'Início da Noite'>('Tarde');

  const handleSave = () => {
    if (!dateStr || !bedTime || !wakeTime || timeToSleepMin === '' || awakenings === '' || awakeTimeMin === '' || !recovery) {
      alert('Por favor, preenche todos os campos numéricos e horários.');
      return;
    }
    saveManualLog({
      dateStr,
      bedTime,
      wakeTime,
      outOfBedTime,
      timeToSleepMin: Number(timeToSleepMin),
      awakenings: Number(awakenings),
      awakeTimeMin: Number(awakeTimeMin),
      bathroomAwakenings: bathroomAwakenings !== '' ? Number(bathroomAwakenings) : 0,
      recovery,
      markers,
      tensionAtBedtime,
      physicalDiscomfort,
      hungerAtBedtime,
      nicotineNearBedtime,
      disturbingDreams,
      nap: {
        tookNap,
        ...(tookNap ? { durationMin: Number(napDurationMin), period: napPeriod } : {})
      }
    });
    navigate(-1);
  };

  const isComplete = Boolean(dateStr && bedTime && wakeTime && timeToSleepMin !== '' && awakenings !== '' && awakeTimeMin !== '' && recovery);

  return (
    <div className="home-page fade-in" style={{ background: 'var(--bg-core)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px', flex: 1 }}>
        
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate(-1)} />
        
        <header style={{ marginBottom: '40px' }}>
          <span className="kicker" style={{ color: '#64748B', marginBottom: '8px' }}>Fase 1 · Registo Manual</span>
          <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2' }}>Adicionar<br/>Nova Noite</h1>
        </header>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Data (noite que passou)</label>
            <input 
              type="date"
              value={dateStr}
              onChange={e => setDateStr(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', color: '#F8FAFC', fontSize: '16px', fontWeight: 400 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Hora deitar</label>
              <input 
                type="time"
                value={bedTime}
                onChange={e => setBedTime(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', color: '#F8FAFC', fontSize: '16px', fontWeight: 400 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Hora acordar (olhos abriram)</label>
              <input 
                type="time"
                value={wakeTime}
                onChange={e => setWakeTime(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', color: '#F8FAFC', fontSize: '16px', fontWeight: 400 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Hora pisar o chão</label>
            <input 
              type="time"
              value={outOfBedTime}
              onChange={e => setOutOfBedTime(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', color: '#F8FAFC', fontSize: '16px', fontWeight: 400 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Minutos p/ adormecer</label>
              <input 
                type="number"
                min="0"
                value={timeToSleepMin}
                onChange={e => setTimeToSleepMin(Number(e.target.value))}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', color: '#F8FAFC', fontSize: '16px', fontWeight: 400 }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Despertares (Cortes)</label>
              <input 
                type="number"
                min="0"
                value={awakenings}
                onChange={e => setAwakenings(Number(e.target.value))}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', color: '#F8FAFC', fontSize: '16px', fontWeight: 400 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1.5 }}>
              <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#B45309', fontWeight: 600 }}>Minutos acordado a meio</label>
              <input 
                type="number"
                min="0"
                value={awakeTimeMin}
                onChange={e => setAwakeTimeMin(Number(e.target.value))}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', color: '#F8FAFC', fontSize: '16px', fontWeight: 400 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
               <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38BDF8', fontWeight: 600 }}>Urinar (Idas)</label>
               <input 
                 type="number"
                 min="0"
                 placeholder="0"
                 value={bathroomAwakenings}
                 onChange={e => setBathroomAwakenings(Number(e.target.value))}
                 style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', color: '#F8FAFC', fontSize: '16px', fontWeight: 400 }}
               />
             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Aceleração ao Deitar (Ansiedade/Mente a mil)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {['Nenhuma', 'Leve', 'Alta'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setTensionAtBedtime(opt as any)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: tensionAtBedtime === opt ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.05)',
                    background: tensionAtBedtime === opt ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                    color: tensionAtBedtime === opt ? '#F8FAFC' : '#94A3B8',
                    fontWeight: tensionAtBedtime === opt ? 500 : 400,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >{opt}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Contexto Específico (O que marcou a noite?)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
               <button onClick={() => setPhysicalDiscomfort(!physicalDiscomfort)} style={{ padding: '12px', borderRadius: '8px', fontSize: '13px', border: physicalDiscomfort ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.05)', background: physicalDiscomfort ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.02)', color: physicalDiscomfort ? '#F8FAFC' : '#94A3B8' }}>Desconforto Físico</button>
               <button onClick={() => setHungerAtBedtime(!hungerAtBedtime)} style={{ padding: '12px', borderRadius: '8px', fontSize: '13px', border: hungerAtBedtime ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.05)', background: hungerAtBedtime ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.02)', color: hungerAtBedtime ? '#F8FAFC' : '#94A3B8' }}>Fome ao deitar</button>
               <button onClick={() => setNicotineNearBedtime(!nicotineNearBedtime)} style={{ padding: '12px', borderRadius: '8px', fontSize: '13px', border: nicotineNearBedtime ? '1px solid #94A3B8' : '1px solid rgba(255,255,255,0.05)', background: nicotineNearBedtime ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255,255,255,0.02)', color: nicotineNearBedtime ? '#F8FAFC' : '#94A3B8' }}>Nicotina à noite</button>
               <button onClick={() => setDisturbingDreams(!disturbingDreams)} style={{ padding: '12px', borderRadius: '8px', fontSize: '13px', border: disturbingDreams ? '1px solid #8B5CF6' : '1px solid rgba(255,255,255,0.05)', background: disturbingDreams ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)', color: disturbingDreams ? '#F8FAFC' : '#94A3B8' }}>Pesadelos vivos</button>
            </div>
          </div>

          {/* Secção de Sestas */}
          <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#F8FAFC', fontWeight: 500 }}>Fizeste alguma sesta diurna?</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setTookNap(true)} style={{ padding: '6px 16px', borderRadius: '4px', background: tookNap ? '#38BDF8' : 'rgba(255,255,255,0.05)', color: tookNap ? '#000' : '#94A3B8', border: 'none' }}>Sim</button>
                <button onClick={() => setTookNap(false)} style={{ padding: '6px 16px', borderRadius: '4px', background: !tookNap ? '#64748B' : 'rgba(255,255,255,0.05)', color: !tookNap ? '#FFF' : '#94A3B8', border: 'none' }}>Não</button>
              </div>
            </div>
            
            {tookNap && (
              <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94A3B8' }}>Minutos</label>
                  <input type="number" min="0" value={napDurationMin} onChange={e => setNapDurationMin(Number(e.target.value))} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '6px', color: '#FFF' }} />
                </div>
                <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94A3B8' }}>Período</label>
                  <select value={napPeriod} onChange={e => setNapPeriod(e.target.value as any)} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '6px', color: '#FFF' }}>
                    <option>Manhã</option>
                    <option>Tarde</option>
                    <option>Início da Noite</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Recuperação percebida (Resumo GERAL)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['Má', 'Razoável', 'Boa', 'Excelente'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setRecovery(opt as any)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: recovery === opt ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.05)',
                    background: recovery === opt ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.02)',
                    color: recovery === opt ? '#F8FAFC' : '#94A3B8',
                    fontWeight: recovery === opt ? 500 : 400,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >{opt}</button>
              ))}
            </div>
          </div>

        </section>

        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            onClick={handleSave}
            className="primary-btn"
            style={{ opacity: isComplete ? 1 : 0.5, cursor: isComplete ? 'pointer' : 'not-allowed' }}
          >
            <span>Guardar Noite</span>
            <Save size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
