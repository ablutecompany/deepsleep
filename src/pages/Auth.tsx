import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const navigate = useNavigate();
  const [hasState, setHasState] = useState(false);

  useEffect(() => {
    const isBeta = localStorage.getItem('appMode') === 'beta_internal';
    setHasState(isBeta);
  }, []);

  const handleStart = () => {
    if (!hasState) {
      localStorage.setItem('appMode', 'beta_internal');
      localStorage.setItem('betaStartedAt', Date.now().toString());
    }
    localStorage.setItem('lastActiveAt', Date.now().toString());
    navigate('/process_home');
  };

  const handleReset = () => {
    localStorage.clear();
    setHasState(false);
  };

  return (
    <div className="home-page fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', background: 'var(--bg-core)' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span className="kicker" style={{ color: '#64748B', marginBottom: '16px' }}>_deepSleep</span>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '16px' }}>
          Beta interno.
        </h1>
        
        <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: '1.6', fontWeight: 300, marginBottom: '24px' }}>
          Esta versão serve para testar a experiência da app e a utilidade das propostas ao longo de vários dias.
        </p>

        <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.5', fontWeight: 300 }}>
            Os dados desta fase ficam guardados neste browser.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>
        <button 
          onClick={handleStart}
          className="primary-btn"
        >
          {hasState ? 'Continuar neste dispositivo' : 'Entrar e começar'}
        </button>

        {hasState && (
          <button 
            onClick={handleReset}
            className="text-btn"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px', color: '#64748B' }}
          >
            Apagar dados deste dispositivo e recomeçar
          </button>
        )}
      </div>
    </div>
  );
}
