import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Zap, Target } from 'lucide-react';

export function DataSourceSelection() {
  const navigate = useNavigate();

  const handleManualSelect = () => {
    localStorage.setItem('dataSourceType', 'manual');
    localStorage.setItem('dataSourceChosenAt', Date.now().toString());
    
    // Garante que iniciamos uma contagem real e limpa de zero se não houver diátios ativos.
    const logs = localStorage.getItem('deepsleep_manual_logs');
    if (!logs || JSON.parse(logs).length === 0) {
      localStorage.setItem('nightCount', '0');
    }
    
    navigate('/manual_log_hub');
  };

  return (
    <div className="home-page fade-in" style={{ background: 'var(--bg-core)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate(-1)} />
        
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            Como vais registar<br />as tuas noites.
          </h1>
          <p style={{ marginTop: '12px', fontSize: '15px', color: '#94A3B8', fontWeight: 300, lineHeight: '1.5' }}>
            Podes começar já com registo manual. As outras ligações chegarão mais à frente.
          </p>
        </header>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '24px', position: 'relative', opacity: 0.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Zap size={20} color="#64748B" />
                <h3 style={{ fontSize: '18px', fontWeight: 400, color: '#94A3B8' }}>Ativar modo completo</h3>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', color: '#64748B', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                Em desenvolvimento
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', fontWeight: 300 }}>
              Ligação ao modelo completo da app, com captação e processamento alargado.
            </p>
          </div>

          <div style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderLeft: '2px solid #38BDF8', borderRadius: '12px', padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <Target size={20} color="#38BDF8" />
              <h3 style={{ fontSize: '18px', fontWeight: 400, color: '#F8FAFC' }}>Registar manualmente</h3>
            </div>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', fontWeight: 300, marginBottom: '24px' }}>
              Inserir as informações das tuas noites para começares já a construir o teu padrão.
            </p>
            <button
              onClick={handleManualSelect}
              style={{ padding: '12px 20px', background: '#F8FAFC', color: '#0F172A', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'inline-block' }}
            >
              Começar assim
            </button>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '24px', position: 'relative', opacity: 0.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Clock size={20} color="#64748B" />
                <h3 style={{ fontSize: '18px', fontWeight: 400, color: '#94A3B8' }}>Importar de smartwatch</h3>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', color: '#64748B', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                Em desenvolvimento
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', fontWeight: 300 }}>
              Usar dados já medidos por outros equipamentos para alimentar a leitura do sono.
            </p>
          </div>

        </section>

      </div>
    </div>
  );
}
