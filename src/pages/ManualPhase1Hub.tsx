import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Activity, Calendar, FilePlus, Trash2 } from 'lucide-react';
import { getManualLogs, deleteManualLog, type ManualNightLog } from '../domain/Phase1/manualLogStore';

export function ManualPhase1Hub() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ManualNightLog[]>([]);
  const target = 5;

  useEffect(() => {
    const handleUpdate = () => setLogs(getManualLogs());
    handleUpdate();
    window.addEventListener('deepsleep_simulated_change', handleUpdate);
    return () => window.removeEventListener('deepsleep_simulated_change', handleUpdate);
  }, []);

  const progress = Math.min(logs.length, target);
  const done = progress >= target;

  const handleDelete = (id: string) => {
    if (window.confirm("Queres mesmo apagar este registo? Esta ação não pode ser anulada.")) {
      deleteManualLog(id);
      setLogs(getManualLogs());
    }
  };

  return (
    <div className="home-page fade-in" style={{ background: 'var(--bg-core)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/process_home')} />
        
        <header style={{ marginBottom: '32px' }}>
          <span className="kicker" style={{ color: '#64748B', marginBottom: '8px' }}>Fase 1 · Registo Manual</span>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            {progress} de {target} <span style={{ color: '#64748B' }}>noites</span>
          </h1>
          <p style={{ marginTop: '12px', fontSize: '15px', color: '#94A3B8', fontWeight: 300, lineHeight: '1.5' }}>
            {done 
              ? 'Já tens base suficiente para avançar. Podes continuar a registar as tuas noites.'
              : 'Precisamos de pelo menos 5 noites válidas para criar o teu perfil inicial e contexto.'}
          </p>
        </header>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          
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
              color: '#38BDF8',
              marginBottom: '16px'
            }}
          >
            <FilePlus size={18} />
            <span>Registar nova noite</span>
          </button>

          {logs.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '32px', opacity: 0.5 }}>
              <Calendar size={32} color="#64748B" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#64748B', fontSize: '14px', fontWeight: 300 }}>Nenhum registo de noite.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {logs.map(log => (
              <div key={log.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '16px', color: '#F8FAFC', fontWeight: 400 }}>{log.dateStr}</h4>
                  <button onClick={() => handleDelete(log.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={16} color="#EF4444" opacity={0.6} />
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#64748B" />
                    <span style={{ fontSize: '13px', color: '#94A3B8' }}>{log.bedTime} - {log.wakeTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={14} color="#64748B" />
                    <span style={{ fontSize: '13px', color: '#94A3B8' }}>{log.awakenings} {log.awakenings === 1 ? 'despertar' : 'despertares'}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recuperação:</span>
                  <span style={{ fontSize: '13px', color: '#E2E8F0' }}>{log.recovery}</span>
                </div>
              </div>
            ))}
          </div>
        </section>



      </div>
    </div>
  );
}
