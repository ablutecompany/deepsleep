import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, AlertTriangle, CheckCircle, Moon } from 'lucide-react';
import { AcousticSensingEngine } from '../domain/Sensing/recorder';
import type { SleepObservationSession } from '../domain/Sensing/types';

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
    
    // Persist localy
    const stored = localStorage.getItem('deepsleep_sensing_sessions');
    const allSessions = stored ? JSON.parse(stored) : [];
    allSessions.unshift(finalSession);
    localStorage.setItem('deepsleep_sensing_sessions', JSON.stringify(allSessions));

    setResult(finalSession);
    setStatus('finished');
  };

  // --- RENDERS ---
  
  if (status === 'recording') {
    return (
      <div style={{ backgroundColor: '#000000', color: '#111111', height: '100vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
        {/* Pitch Black State com elementos visuais cinza muito escuro para não queimar ecrã nem magoar vista/sono */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '12px', letterSpacing: '2px', textAlign: 'center', opacity: 0.5, marginBottom: '24px' }}>
             SESSÃO ACÚSTICA ACTIVA
          </p>
          <div style={{ padding: '32px', border: '1px solid #1a1a1a', borderRadius: '50%' }}>
            <Moon size={32} color="#1a1a1a" />
          </div>
          <p style={{ marginTop: '24px', fontSize: '11px', textAlign: 'center', opacity: 0.3, maxWidth: '200px' }}>
            A calcular ruído ambiente sem gravar conversas. Ecrã preso via Wakelock.
          </p>
        </div>

        <button 
          onClick={handleStop}
          style={{ width: '100%', padding: '24px', background: '#0a0a0a', border: 'none', color: '#444444', fontSize: '14px', borderRadius: '8px' }}
        >
          Acordar / Desativar Sessão
        </button>
      </div>
    );
  }

  return (
    <div className="home-page fade-in" style={{ backgroundColor: 'var(--bg-core)', color: '#F8FAFC', padding: '24px', minHeight: '100vh' }}>
      <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/control')} />
      
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2' }}>Observação Acústica<br/><span style={{ color: '#38BDF8' }}>(Protótipo Local)</span></h1>
        
        {status === 'idle' && (
          <div style={{ marginTop: '24px', background: 'rgba(56, 189, 248, 0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#94A3B8' }}>
              Esta camada beta valida métricas de perturbação e variação de ambiente basal (ruídos do canal) num sistema totalmente isolado à Internet.<br/><br/>
              <strong style={{ color: '#E2E8F0' }}>O que vai acontecer:</strong>
            </p>
            <ul style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px', fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
              <li><strong>Nenhum áudio de voz ou ronco será gravado na memória.</strong> Extraimos amplitudes silenciosamente a cada 2s e destruímos imediatamente a matriz crúa.</li>
              <li>O ecrã ficará virtualmente preso e num <strong>breu escuro</strong> para simular _sleep mode_.</li>
              <li>Consome mais bateria devido ao bloqueio ativo do browser (Wakelock). <strong style={{color: '#94A3B8'}}>Deixa ligado à corrente.</strong></li>
            </ul>
          </div>
        )}
      </header>
      
      {status === 'idle' && (
        <button className="primary-btn" onClick={handleStart} style={{ marginTop: '32px' }}>
          <Mic size={18} style={{ marginRight: '8px' }}/> Iniciar Sessão Prudente
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
             <p style={{ fontSize: '16px', color: '#F8FAFC' }}>Sessão guardada com sucesso no telemóvel.</p>
           </div>

           <div>
             <h3 className="kicker" style={{ color: '#94A3B8', marginBottom: '8px' }}>Resultado Paramétrico</h3>
             <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <li style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
                 <p style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#64748B', marginBottom: '4px' }}>Canal de Observação</p>
                 <p style={{ fontSize: '16px', color: '#E2E8F0' }}>{result.qualityState === 'pristine' ? 'Totalmente Audível' : (result.qualityState === 'degraded' ? 'Degradado / Interrompido' : 'Inválido / Pobre')}</p>
               </li>
               <li style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
                 <p style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#64748B', marginBottom: '4px' }}>Distúrbio e Estabilidade</p>
                 <p style={{ fontSize: '16px', color: '#E2E8F0' }}>{result.summary?.dominantDisturbance}</p>
                 <p style={{ fontSize: '13px', color: '#64748B', marginTop: '8px' }}>
                   * Detetados {result.derivedFeatures?.suspectedFragmentationEvents || 0} picos/súbditos fora do padrão contínuo.
                 </p>
               </li>
             </ul>
           </div>
           
           <button onClick={() => navigate('/control')} className="secondary-btn" style={{ marginTop: '24px' }}>
             Sair para as Definições
           </button>
        </div>
      )}
    </div>
  );
}
