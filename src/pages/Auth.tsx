import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="auth-container" style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '2px', textAlign: 'center', marginBottom: '64px', color: '#E2E8F0' }}>
        _deepSleep
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          style={{ padding: '16px', borderRadius: '8px', background: 'transparent', border: '1px solid #334155', color: '#F8FAFC', width: '100%', outline: 'none' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={{ padding: '16px', borderRadius: '8px', background: 'transparent', border: '1px solid #334155', color: '#F8FAFC', width: '100%', outline: 'none' }}
        />
      </div>

      <button 
        onClick={() => navigate('/process_home')}
        style={{ width: '100%', padding: '16px', borderRadius: '8px', background: '#334155', color: '#F8FAFC', border: 'none', fontWeight: 500, letterSpacing: '1px' }}
      >
        {isSignUp ? "CRIAR CONTA" : "INICIAR SESSÃO"}
      </button>

      <p 
        onClick={() => setIsSignUp(!isSignUp)}
        style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center', marginTop: '24px', cursor: 'pointer' }}
      >
        {isSignUp ? "Já tens conta? Iniciar sessão" : "Não tens conta? Criar"}
      </p>
    </div>
  );
}
