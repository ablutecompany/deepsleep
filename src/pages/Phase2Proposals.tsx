import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Phase2Proposals() {
  const navigate = useNavigate();

  const proposals = [
    { title: "Regularidade Dinâmica", hyp: "A fragmentação tem origem no jitter matinal", act: "Manter alarme fixo em 7h30, independente da hora de deitar." },
    { title: "Descompressão Passiva", hyp: "Carga visual excessiva pré-sono", act: "Base fixa do telemóvel fora do alcance imediato, sem manipulação após luzes desligadas." }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box' }}>
      <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer' }} onClick={() => navigate(-1)} />
      
      <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#F8FAFC', marginBottom: '16px' }}>
        As tuas propostas
      </h1>
      <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '22px', marginBottom: '32px' }}>
        Delineadas a partir da leitura direta das tuas noites e do teu contexto psíquico.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {proposals.map((p, i) => (
          <div key={i} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#64748B', display: 'block', marginBottom: '8px' }}>
              PROPOSTA {i + 1}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#F8FAFC', marginBottom: '12px' }}>{p.title}</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}>Hipótese: {p.hyp}</p>
            <p style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 500 }}>Ação: {p.act}</p>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/phase3_home')}
        style={{ width: '100%', height: '56px', borderRadius: '8px', background: '#F8FAFC', color: '#0F172A', border: 'none', fontWeight: 500, letterSpacing: '1px', marginTop: '32px', marginBottom: '40px' }}
      >
        INICIAR OBSERVÂNCIA (FASE 3)
      </button>
    </div>
  );
}
