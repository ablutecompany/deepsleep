import { useState, useEffect } from 'react';
import { RotateCcw, Bug, FastForward, CalendarX2 } from 'lucide-react';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { appClock } from '../utils/appClock';

// Seeded Profiles removed per request to ensure real beta testing.

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [clockInfo, setClockInfo] = useState({ 
    simulated: appClock.isSimulated(), 
    today: appClock.todayStr()
  });
  const { setDeliverable } = usePhase2Store();

  useEffect(() => {
    const handleClock = () => {
      setClockInfo({
        simulated: appClock.isSimulated(),
        today: appClock.todayStr()
      });
    };
    window.addEventListener('deepsleep_app_clock', handleClock);
    return () => window.removeEventListener('deepsleep_app_clock', handleClock);
  }, []);

  // Removed softReload

  const clearAll = () => {
    localStorage.clear();
    setDeliverable(null);
    window.location.href = '/';
  };

// Legacy profile loading and night simulations completely stripped off.

  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        style={{ position: 'fixed', bottom: '24px', right: '24px', padding: '10px 20px', borderRadius: '8px', background: '#F59E0B', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', zIndex: 9999, color: '#000000', fontSize: '13px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)' }}
      >
        <Bug size={16} color="#000000" /> BETA LABS
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: '16px', right: '16px', width: '340px', background: '#020203', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', zIndex: 9999, boxShadow: '0 16px 40px rgba(0,0,0,0.8)', color: '#F8FAFC' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '10px', fontWeight: 600, color: '#F59E0B', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>Beta Labs Central</h3>
        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '12px' }}>Fechar</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button onClick={clearAll} style={btnStyle('#EF4444', 'rgba(239, 68, 68, 0.1)')}>
          <RotateCcw size={14} /> 0. Hard Reset Total
        </button>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '11px', color: '#64748B', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>App Clock Central</p>
            <span style={{ fontSize: '10px', background: clockInfo.simulated ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: clockInfo.simulated ? '#F59E0B' : '#10B981', padding: '2px 6px', borderRadius: '4px' }}>
              {clockInfo.simulated ? 'SIMULAÇÃO ATIVA' : 'TEMPO REAL'}
            </span>
          </div>
          <p style={{ fontSize: '18px', color: '#F8FAFC', margin: '4px 0 8px 0', fontFamily: 'monospace' }}>{clockInfo.today}</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => appClock.addDays(1)} style={btnStyle('#38BDF8', 'rgba(56, 189, 248, 0.1)', true)}><FastForward size={14}/> +1 Dia</button>
            <button onClick={() => appClock.addDays(3)} style={btnStyle('#38BDF8', 'rgba(56, 189, 248, 0.1)', true)}><FastForward size={14}/> +3 Dias</button>
          </div>
          <button 
            onClick={() => {
              if (window.confirm("Queres apagar todo o avanço de progresso (Fase 3 e registos) simulado agora no futuro e repor no dia de hoje?\n\n(Ok = Apagar dados futuros, Cancelar = Só acertar o relógio para hoje)")) {
                // Hard reset tático exigido
                const realToday = new Date();
                const rY = realToday.getFullYear();
                const rM = String(realToday.getMonth() + 1).padStart(2, '0');
                const rD = String(realToday.getDate()).padStart(2, '0');
                const key = `${rY}-${rM}-${rD}`;
                
                const storedLogs = localStorage.getItem('deepsleep_manual_logs');
                if (storedLogs) {
                  let logs: any[] = JSON.parse(storedLogs);
                  logs = logs.filter(l => l.dateStr <= key);
                  localStorage.setItem('deepsleep_manual_logs', JSON.stringify(logs));
                }
                localStorage.removeItem('deepsleep_phase3_cycle');
              }
              appClock.reset();
            }} 
            style={btnStyle('#F43F5E', 'transparent', true)}
          >
            <CalendarX2 size={14}/> Regressar ao Presente
          </button>
        </div>
        
      </div>
    </div>
  );
}

const btnStyle = (color: string, bg = 'transparent', flex = false) => ({
  flex: flex ? 1 : 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
  background: bg, color: color, border: `1px solid ${bg === 'transparent' ? 'rgba(255,255,255,0.1)' : bg}`,
  borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', textAlign: 'left' as const
});
