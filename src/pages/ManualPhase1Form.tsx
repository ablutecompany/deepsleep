import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { saveManualLog, MARKER_OPTIONS, type ManualNightLog } from '../domain/Phase1/manualLogStore';

export function ManualPhase1Form() {
  const navigate = useNavigate();
  
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [timeToSleepMin, setTimeToSleepMin] = useState<number | ''>('');
  const [awakenings, setAwakenings] = useState<number | ''>('');
  const [awakeTimeMin, setAwakeTimeMin] = useState<number | ''>('');
  const [recovery, setRecovery] = useState<ManualNightLog['recovery']>('Razoável');
  const [markers, setMarkers] = useState<string[]>([]);

  const toggleMarker = (m: string) => {
    if (markers.includes(m)) {
      setMarkers(markers.filter(x => x !== m));
    } else {
      setMarkers([...markers, m]);
    }
  };

  const handleSave = () => {
    if (!dateStr || !bedTime || !wakeTime || timeToSleepMin === '' || awakenings === '' || awakeTimeMin === '' || !recovery) {
      alert('Por favor, preenche todos os campos numéricos e horários.');
      return;
    }
    saveManualLog({
      dateStr,
      bedTime,
      wakeTime,
      timeToSleepMin: Number(timeToSleepMin),
      awakenings: Number(awakenings),
      awakeTimeMin: Number(awakeTimeMin),
      recovery,
      markers
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
              <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Hora acordar</label>
              <input 
                type="time"
                value={wakeTime}
                onChange={e => setWakeTime(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', color: '#F8FAFC', fontSize: '16px', fontWeight: 400 }}
              />
            </div>
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
              <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Despertares a meio</label>
              <input 
                type="number"
                min="0"
                value={awakenings}
                onChange={e => setAwakenings(Number(e.target.value))}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', color: '#F8FAFC', fontSize: '16px', fontWeight: 400 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Minutos acordado a meio da noite (Aprox.)</label>
            <input 
              type="number"
              min="0"
              value={awakeTimeMin}
              onChange={e => setAwakeTimeMin(Number(e.target.value))}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', color: '#F8FAFC', fontSize: '16px', fontWeight: 400 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Recuperação ao acordar</label>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600 }}>Marcadores</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {MARKER_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => toggleMarker(opt)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '30px',
                    border: '1px solid',
                    borderColor: markers.includes(opt) ? '#10B981' : 'rgba(255,255,255,0.1)',
                    background: markers.includes(opt) ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                    color: markers.includes(opt) ? '#F8FAFC' : '#94A3B8',
                    fontSize: '13px',
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
