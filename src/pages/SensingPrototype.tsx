import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, AlertTriangle, CheckCircle, Moon } from 'lucide-react';
import { AcousticSensingEngine } from '../domain/Sensing/recorder';
import type { SleepObservationSession } from '../domain/Sensing/types';
import { saveSensingSession } from '../domain/Sensing/store';

export function SensingPrototype() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'recording' | 'finished' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [result, setResult] = useState<SleepObservationSession | null>(null);
  
  const engineRef = useRef<AcousticSensingEngine | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount if user swipes back dangerously
      if (engineRef.current && status === 'recording') {
        engineRef.current.stopSession('user_stopped');
      }
    };
  }, [status]);

  const handleStart = async () => {
    try {
      if (!engineRef.current) engineRef.current = new AcousticSensingEngine();
      await engineRef.current.startSession();
      setStatus('recording');
      
      // Tentativa silenciosa de Fullscreen para reduzir luz de botões de sistema
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (e) {}
    } catch (e: any) {
      if (e.message === 'permission_denied') {
        setErrorMsg('Permissão de microfone negada. Válida as tuas definições de browser.');
      } else {
        setErrorMsg('Falha ao iniciar canal ou Screen Wake Lock não suportado.');
      }
      setStatus('error');
    }
  };

  const handleStop = () => {
    if (!engineRef.current) return;
    const finalSession = engineRef.current.stopSession('user_stopped');
    
    saveSensingSession(finalSession);

    setResult(finalSession);
    setStatus('finished');
  };

  // --- RENDERS ---
  
  if (status === 'recording') {
    return (
      <div style={{ backgroundColor: '#000000', height: '100vh', display: 'flex', flexDirection: 'column', padding: '24px', cursor: 'none' }}>
        {/* AMOLED Black - No light, No distracting text */}
        <div style={{ flex: 1 }} onClick={handleStop} />
        <button 
          onClick={handleStop}
          style={{ width: '100%', padding: '24px', background: 'transparent', border: 'none', color: '#050505', fontSize: '10px', borderRadius: '8px' }}
        >
          Toca em qualquer ponto para terminar
        </button>
      </div>
    );
  }

  return (
    <div className="home-page fade-in" style={{ backgroundColor: 'var(--bg-core)', color: '#F8FAFC', padding: '24px', minHeight: '100vh' }}>
      <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/control')} />
      
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2' }}>Observação de som</h1>
        
        {status === 'idle' && (
          <div style={{ marginTop: '24px', background: 'rgba(56, 189, 248, 0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#94A3B8' }}>
              Esta funcionalidade permite detetar sons que possam estar a quebrar o teu sono, sem enviar nada para fora do teu telemóvel.<br/><br/>
              <strong style={{ color: '#E2E8F0' }}>O que vai acontecer:</strong>
            </p>
            <ul style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px', fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
              <li><strong>Não gravamos vozes nem conversas.</strong> A app apenas mede a intensidade do som ambiente.</li>
              <li>O ecrã ficará totalmente preto para não incomodar o teu descanso.</li>
              <li>Consome bateria porque o telemóvel precisa de estar activo. <strong style={{color: '#94A3B8'}}>Deixa ligado à corrente.</strong></li>
            </ul>
          </div>
        )}
      </header>
      
      {status === 'idle' && (
        <button className="primary-btn" onClick={handleStart} style={{ marginTop: '32px' }}>
          <Mic size={18} style={{ marginRight: '8px' }}/> Iniciar Observação
        </button>
      )}

      {status === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
          <AlertTriangle color="#EF4444" size={24} />
          <p style={{ fontSize: '14px', color: '#F8FAFC' }}>{errorMsg}</p>
        </div>
      )}

      {status === 'finished' && result && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
             <CheckCircle color="#10B981" size={24} />
             <p style={{ fontSize: '18px', color: '#F8FAFC' }}>Bom dia. Sessão acústica terminada.</p>
           </div>

           <div>
             <h3 className="kicker" style={{ color: '#94A3B8', marginBottom: '8px' }}>Resumo da noite</h3>
             <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <li style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', borderLeft: '2px solid #38BDF8' }}>
                 <p style={{ fontSize: '14px', color: '#E2E8F0' }}>
                   {result.qualityState === 'pristine' ? 'Ambiente estável e silencioso.' : (result.qualityState === 'degraded' ? 'Houve algumas interferências de som.' : 'O ambiente estava demasiado ruidoso.')}
                 </p>
               </li>
               <li style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
                 <p style={{ fontSize: '14px', color: '#E2E8F0' }}>
                   {result.derivedFeatures?.suspectedFragmentationEvents ? `Foram detetados ${result.derivedFeatures.suspectedFragmentationEvents} momentos de som fora do normal.` : 'Não houve ruídos significativos.'}
                 </p>
               </li>
             </ul>
             <p style={{ fontSize: '13px', color: '#64748B', marginTop: '16px', lineHeight: '1.4' }}>
               Estes dados são apenas uma parte da análise. O mais importante é o teu registo matinal.
             </p>
           </div>
           
           <button 
             onClick={() => navigate(`/manual_log_form?fromSensing=true&sessionId=${result.id}`)} 
             className="primary-btn" 
             style={{ marginTop: '24px', justifyContent: 'center', padding: '16px', fontSize: '16px', background: '#38BDF8', color: '#0F172A' }}
           >
             Completar Registo da Noite
           </button>
           
           <button 
             onClick={() => navigate('/process_home')} 
             className="text-btn" 
             style={{ justifyContent: 'center', color: '#64748B' }}
           >
             Ignorar e voltar à Home
           </button>
        </div>
      )}
    </div>
  );
}
