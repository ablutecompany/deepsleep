import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Phase2Entry() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box' }}>
      <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer' }} onClick={() => navigate(-1)} />
      
      <h1 style={{ fontSize: '32px', fontWeight: 500, color: '#F8FAFC', lineHeight: '40px', marginBottom: '24px' }}>
        Contexto e propostas
      </h1>
      
      <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: '24px' }}>
        Para perceber melhor o que está a afectar o teu sono, preciso de saber mais sobre ti. Que disponibilidade tens para responder a algumas questões?
      </p>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
        <button 
          onClick={() => navigate('/phase2_questions')}
          style={{ flex: 1, height: '64px', borderRadius: '8px', background: '#334155', color: '#F8FAFC', border: 'none', fontWeight: 500, letterSpacing: '1px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ fontSize: '16px' }}>10</span>
          <span style={{ fontSize: '10px' }}>PERGUNTAS</span>
        </button>

        <button 
          onClick={() => navigate('/phase2_questions')}
          style={{ flex: 1, height: '64px', borderRadius: '8px', background: '#334155', color: '#F8FAFC', border: 'none', fontWeight: 500, letterSpacing: '1px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ fontSize: '16px' }}>25</span>
          <span style={{ fontSize: '10px' }}>PERGUNTAS</span>
        </button>
      </div>
    </div>
  );
}
