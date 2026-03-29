import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePhase2Store } from '../store/Phase2ContextStore';

export function Phase2Entry() {
  const navigate = useNavigate();
  const { setAnswersDraft, setDeliverable } = usePhase2Store();

  const handleStart = (mode: 10 | 25) => {
    setAnswersDraft({}); // Clear draft when forcing new
    setDeliverable(null);
    navigate(`/phase2/questions?mode=${mode}`);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box' }}>
      <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer' }} onClick={() => navigate(-1)} />
      
      <h1 style={{ fontSize: '32px', fontWeight: 500, color: '#F8FAFC', lineHeight: '40px', marginBottom: '24px' }}>
        Contexto
      </h1>
      
      <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: '24px' }}>
        Para perceber melhor o que está a afectar o teu sono as nossas escolhas automáticas não chegam. Escolhe a dimensão da tua partilha.
      </p>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
        <button 
          onClick={() => handleStart(10)}
          style={{ flex: 1, height: '64px', borderRadius: '8px', background: '#334155', color: '#F8FAFC', border: 'none', fontWeight: 500, letterSpacing: '1px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ fontSize: '16px' }}>10</span>
          <span style={{ fontSize: '10px' }}>PERGUNTAS</span>
        </button>

        <button 
          onClick={() => handleStart(25)}
          style={{ flex: 1, height: '64px', borderRadius: '8px', background: '#334155', color: '#F8FAFC', border: 'none', fontWeight: 500, letterSpacing: '1px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ fontSize: '16px' }}>25</span>
          <span style={{ fontSize: '10px' }}>PERGUNTAS</span>
        </button>
      </div>
    </div>
  );
}
