import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const navigate = useNavigate();

  return (
    <div className="auth-container" style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', background: '#000' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '2px', textAlign: 'center', marginBottom: '24px', color: '#E2E8F0' }}>
          _deepSleep
        </h1>
        
        <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center', lineHeight: '22px', maxWidth: '280px' }}>
          Autenticação recebida através da plataforma <strong>ablute_wellness</strong>.
        </p>
      </div>

      <div style={{ background: '#0F172A', padding: '24px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #1E293B' }}>
        <p style={{ fontSize: '12px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Utilizador Ativo
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#F8FAFC', fontWeight: 500 }}>
            D
          </div>
          <div>
            <h3 style={{ fontSize: '16px', color: '#F8FAFC', fontWeight: 500 }}>Demo User</h3>
            <p style={{ fontSize: '14px', color: '#94A3B8' }}>Acesso Beta</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/process_home')}
        style={{ width: '100%', padding: '16px', borderRadius: '8px', background: '#F8FAFC', color: '#0F172A', border: 'none', fontWeight: 500, letterSpacing: '1px', marginBottom: '16px' }}
      >
        ENTRAR
      </button>

      <p style={{ color: '#64748B', fontSize: '12px', textAlign: 'center' }}>
        Acesso restrito em modo demonstração.
      </p>
    </div>
  );
}
