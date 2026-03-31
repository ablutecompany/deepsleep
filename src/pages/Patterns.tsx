import { NightSignature } from '../components/NightSignature';
import { useNightCount } from '../hooks/useNightCount';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Info } from 'lucide-react';

export function Patterns() {
  const nightCount = useNightCount();
  const navigate = useNavigate();

  if (nightCount < 5) {
    return (
      <div className="home-page fade-in" style={{ background: 'var(--bg-core)', minHeight: '100vh', padding: '24px' }}>
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/process_home')} />
        
        <header style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
            <Lock size={28} color="#38BDF8" opacity={0.6} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', marginBottom: '16px' }}>Padrões e Sinais</h1>
          <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto', fontWeight: 300 }}>
            Ainda é cedo para tirar conclusões seguras. Para garantir que os padrões que te mostramos são reais e úteis, precisamos de pelo menos 5 noites completas de registo.
          </p>
          <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: '16px', borderRadius: '12px', marginTop: '16px', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
            <p style={{ fontSize: '13px', color: '#38BDF8', lineHeight: 1.5, margin: 0 }}>
              <strong>Honestidade técnica:</strong> Preferimos mostrar-te menos do que apresentar-te tendências prematuras que não ajudariam o teu sono.
            </p>
          </div>
        </header>

        <section style={{ background: 'rgba(255,255,255,0.02)', padding: '32px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
             <span style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progresso da Base</span>
             <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 500 }}>{nightCount} de 5 noites</span>
           </div>
           <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '24px' }}>
             <div style={{ width: `${(nightCount / 5) * 100}%`, height: '100%', background: '#38BDF8', transition: 'width 1s ease' }} />
           </div>

           <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
             <Info size={16} color="#64748B" style={{ marginTop: '2px' }} />
             <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
               Desta forma garantimos que as correlações que identificamos são baseadas em dados reais e não em coincidências de um dia.
             </p>
           </div>
        </section>

        <button onClick={() => navigate('/manual_log_hub')} className="primary-btn" style={{ width: '100%', marginTop: '40px', justifyContent: 'center' }}>
          Adicionar Registos
        </button>
      </div>
    );
  }
  return (
    <div className="home-page">
      <div style={{ opacity: 0.4 }}>
        <NightSignature />
      </div>
      
      <div className="home-content">
        <header className="hero-section">
          <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/process_home')} />
          <span className="kicker">Padrões identificados</span>
          <h1 className="title-large" style={{ fontSize: '38px' }}>O que<br/>já sabemos</h1>
          <div className="readout-pill">
            <span className="status-dot" style={{ animationDuration: '4.5s' }}></span>
            BASE DE DADOS: {nightCount} NOITES
          </div>
        </header>

        <section className="editorial-module">
          <span className="kicker">Sinais consistentes</span>
          <ul className="log-list" style={{ marginTop: '16px' }}>
            <li className="log-item dominant">
              <div className="log-meta">REPETE-SE HÁ 8 DIAS</div>
              <div className="log-text">
                O adormecimento é mais rápido e natural sem o telemóvel perto da cama.
              </div>
            </li>
            <li className="log-item">
              <div className="log-meta">PADRÃO RECORRENTE (14 DIAS)</div>
              <div className="log-text">
                Tendência para perder continuidade entre as 03:00 e as 04:30.
              </div>
            </li>
          </ul>
        </section>

        <section className="editorial-module">
          <span className="kicker accent">Maior Disruptor</span>
          <h2 className="module-title">Acesso ao telemóvel de madrugada</h2>
          
          <p className="module-desc">
            Quando isto acontece, a continuidade do sono tende a cair drasticamente.
          </p>
          
          <div className="pattern-evidence">
            <div className="evidence-row">
              <span className="evidence-key">Presença:</span>
              <span className="evidence-val">Em ~71% das noites fragmentadas</span>
            </div>
            <div className="evidence-row">
              <span className="evidence-key">Confiança:</span>
              <span className="evidence-val">Alta (10 registos associados)</span>
            </div>
          </div>
        </section>

        <section className="editorial-module">
          <span className="kicker">Maior Protetor</span>
          <h2 className="module-title" style={{ color: 'var(--text-primary)' }}>Telemóvel afastado antes de dormir</h2>
          
          <p className="module-desc">
            Tende a garantir o ciclo inicial mais profundo da semana.
          </p>

          <div className="pattern-evidence">
            <div className="evidence-row">
              <span className="evidence-key">Presença:</span>
              <span className="evidence-val">Em ~84% das melhores sessões</span>
            </div>
            <div className="evidence-row">
              <span className="evidence-key">Confiança:</span>
              <span className="evidence-val">Sinal forte e consistente</span>
            </div>
          </div>
        </section>

        <section className="editorial-module footer-module" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
          <span className="kicker">Ainda estamos a confirmar</span>
          <h2 className="module-title muted-title" style={{ fontSize: '15px', marginBottom: '12px' }}>
            A variação do horário em que se deita ao fim de semana parece afetar o descanso das segundas-feiras.
          </h2>
          <div className="pattern-evidence" style={{ borderLeft: 'none', paddingLeft: 0, marginTop: 0 }}>
            <div className="evidence-row">
              <span className="evidence-key">Estado:</span>
              <span className="evidence-val" style={{ color: 'var(--text-secondary)' }}>Sinal emergente. Mais 6 a 8 noites para aumentar a confiança.</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
