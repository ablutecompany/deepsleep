import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePhase2Store } from '../store/Phase2ContextStore';

export function Phase2Entry() {
  const navigate = useNavigate();
  const { deliverable, setAnswersDraft, setDeliverable } = usePhase2Store();

  const handleStart = (mode: 10 | 25) => {
    setAnswersDraft({}); // Clear draft when forcing new
    setDeliverable(null);
    navigate(`/phase2/questions?mode=${mode}`);
  };

  if (deliverable) {
    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box' }}>
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', lineHeight: '40px', marginBottom: '24px' }}>
          Interpretação ativa.
        </h1>
        <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: '24px', fontWeight: 300 }}>
          O teu motor de contexto já dispõe de um referencial concluído. A não ser que o teu padrão de sono tenha ignorado ou alterado drasticamente sem justificação temporal percecionada, não é aconselhado refazer o inquérito base cego.
        </p>
        <div style={{ flex: 1 }} />
        <button onClick={() => navigate('/phase2/context')} className="primary-btn" style={{ marginBottom: '16px' }}>
          Consultar Leitura Atual
        </button>
        <button onClick={() => handleStart(10)} className="text-btn" style={{ color: '#EF4444', marginBottom: '40px' }}>
          Quero mesmo refazer a leitura base (10 perguntas)
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box' }}>
      <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer' }} onClick={() => navigate(-1)} />
      
      <h1 style={{ fontSize: '32px', fontWeight: 500, color: '#F8FAFC', lineHeight: '40px', marginBottom: '24px' }}>
        Aprofundamento
      </h1>
      
      <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: '24px', fontWeight: 300 }}>
        Para orientar a intervenção e as tuas escolhas a motorização limpa não chega. Seleciona qual a amplitude de questionário complementar a que queres responder hoje.
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
