import { useNavigate } from 'react-router-dom';
import { NightSignature } from '../components/NightSignature';
import { ArrowLeft, Clock, Activity, Sparkles, Map } from 'lucide-react';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { useNightCount } from '../hooks/useNightCount';
import { getProposals } from '../domain/Phase2/proposals';
import { FACTOR_LABELS } from '../domain/Phase2/interpreter';

function getConfidenceLabel(confidence: number): string {
  if (confidence < 60) return "Leitura inicial";
  if (confidence < 75) return "Útil, mas ainda a estabilizar";
  if (confidence < 90) return "Leitura forte e consistente";
  return "Leitura altamente estável";
}

export function Profile() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();
  const { cycle } = usePhase3Store();
  const nightCount = useNightCount();

  if (nightCount < 5) {
    return (
      <div className="home-page fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-core)', padding: '24px', textAlign: 'center' }}>
        <Activity size={32} color="#1E293B" style={{ marginBottom: '24px' }} />
        <h2 style={{ fontSize: '20px', color: '#F8FAFC', fontWeight: 300, marginBottom: '12px' }}>
          Ouve primeiro.
        </h2>
        <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '22px', maxWidth: '280px', fontWeight: 300 }}>
          O sistema precisa de observar o teu sono mecânico em silêncio. Faltam {5 - nightCount} noites.
        </p>
        <button 
          onClick={() => navigate('/process_home')}
          className="text-btn"
          style={{ marginTop: '40px', color: '#38BDF8' }}
        >
          Voltar a monitorizar
        </button>
      </div>
    );
  }

  return (
    <div className="home-page fade-in" style={{ padding: '0 0 100px 0', background: 'var(--bg-core)' }}>
      <div style={{ opacity: 0.08, position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none', height: '30vh', overflow: 'hidden' }}>
        <NightSignature />
      </div>
      
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
        
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/process_home')} />
        
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2' }}>Perfil do teu sono.</h1>
          <p style={{ marginTop: '12px', fontSize: '15px', color: '#94A3B8', fontWeight: 300, lineHeight: '1.5' }}>
            Este é um perfil inicial em construção. À medida que avanças no processo, esta leitura ganha contexto, torna-se mais fiável e mais ajustada ao teu padrão real.
          </p>
          {localStorage.getItem('dataSourceType') && (
            <p style={{ marginTop: '16px', fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38BDF8' }} />
              Baseado nos teus dados: {localStorage.getItem('dataSourceType') === 'manual' ? 'registo manual' : localStorage.getItem('dataSourceType')}
            </p>
          )}
        </header>



        {deliverable && (
          <section className="editorial-card contextual-layer" style={{ marginTop: '48px', padding: '24px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.03)', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={14} color="#38BDF8" />
              <span className="kicker" style={{ margin: 0, color: '#38BDF8' }}>Leitura em Contexto</span>
            </div>
            
            <h2 className="module-title" style={{ color: '#F8FAFC', marginBottom: '12px', fontSize: '20px' }}>
              {deliverable.dominantDrivers.length > 0 ? FACTOR_LABELS[deliverable.dominantDrivers[0]] : 'Leitura distribuída sem predominância'}
            </h2>
            
            <p className="module-desc" style={{ marginBottom: '24px' }}>
              {deliverable.flags.length > 0 ? `Com os dados atuais registados, parecem surgir sinais de tensões (ex: ${deliverable.flags[0].toLowerCase()}) a requerer confirmação.` : "Até agora, não emergem grandes constrangimentos declarados adicionais."}
            </p>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>Fase desta leitura</span>
                <span style={{ fontSize: '14px', color: '#F8FAFC', fontWeight: 400 }}>{getConfidenceLabel(deliverable.confidence)}</span>
              </div>
            </div>
          </section>
        )}

        {cycle && (
          <section className="editorial-card test-track-card" style={{ marginTop: '24px', padding: '20px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Clock size={14} color="#10B981" />
              <span className="kicker" style={{ margin: 0, color: '#10B981' }}>
                {cycle.status === 'active' ? 'Direção Ativa' : 'Direção Concluída'}
              </span>
            </div>
            
            <h2 className="module-title" style={{ fontSize: '16px', marginBottom: '8px' }}>
              {getProposals(deliverable).find(p => p.id === cycle.proposalId)?.title || 'Hipótese ativa'}
            </h2>
            
            <p style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 300, lineHeight: '1.5' }}>
              {cycle.status === 'active' 
                ? `${Object.keys(cycle.dailyCheckins).length} dias em percurso observacional.`
                : cycle.finalRecommendation}
            </p>
          </section>
        )}

        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate(deliverable ? '/phase2/proposals' : '/phase2/entry')}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', padding: '16px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              <Map size={16} />
              {deliverable ? 'Ver Propostas Guardadas' : 'Avancar para Contexto Inicial'}
            </button>
        </div>

      </div>
    </div>
  );
}
