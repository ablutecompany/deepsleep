import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Phase3Home() {
  const navigate = useNavigate();
  const [reported, setReported] = useState(false);

  const proposals = [
    { title: "REGULARIDADE DINÂMICA", act: "Manter alarme fixo em 7h30, independente da hora de deitar." },
    { title: "DESCOMPRESSÃO PASSIVA", act: "Base fixa do telemóvel fora do alcance imediato, sem manipulação após luzes desligadas." }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box', background: '#0F172A', color: '#F8FAFC' }}>
      <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer' }} onClick={() => navigate('/process_home')} />
      
      <h1 style={{ fontSize: '32px', fontWeight: 500, color: '#F8FAFC', marginBottom: '8px' }}>
        Observância e Ajustes
      </h1>
      <p style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 700, letterSpacing: '1px', marginBottom: '32px' }}>
        Dia 1 do ciclo de adoção.
      </p>

      {!reported ? (
        <div style={{ background: '#1E293B', borderRadius: '12px', padding: '24px', marginBottom: '48px' }}>
          <p style={{ fontSize: '18px', fontWeight: 500, lineHeight: '24px', marginBottom: '24px' }}>
            Ontem conseguiste seguir as propostas combinadas?
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => setReported(true)}
              style={{ flex: 1, height: '48px', borderRadius: '8px', background: '#F8FAFC', color: '#0F172A', border: 'none', fontWeight: 500 }}
            >
              SIM
            </button>
            <button 
              onClick={() => setReported(true)}
              style={{ flex: 1, height: '48px', borderRadius: '8px', background: '#334155', color: '#F8FAFC', border: 'none', fontWeight: 500 }}
            >
              NÃO
            </button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '12px', color: '#38BDF8', letterSpacing: '1px', marginBottom: '48px' }}>
          Relatório de hoje recebido.
        </p>
      )}

      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#64748B', marginBottom: '16px', display: 'block' }}>
        PROPOSTAS ATIVAS
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {proposals.map((p, i) => (
          <div key={i} style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px', padding: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', color: '#F8FAFC', display: 'block', marginBottom: '8px' }}>
              {p.title}
            </span>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '20px' }}>
              {p.act}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
