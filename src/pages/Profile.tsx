import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NightSignature } from '../components/NightSignature';
import { ArrowRight, Activity, Info, CalendarClock } from 'lucide-react';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { getProposals } from '../domain/Phase2/proposals';
import { FACTOR_LABELS } from '../domain/Phase2/interpreter';

export function Profile() {
  const navigate = useNavigate();
  const { deliverable } = usePhase2Store();
  const { cycle } = usePhase3Store();
  const [nightCount, setNightCount] = useState(0);

  useEffect(() => {
    let count = parseInt(localStorage.getItem('nightCount') || '0', 10);
    if (isNaN(count)) count = 0;
    setNightCount(count);
  }, []);

  if (nightCount < 5) {
    return (
      <div className="home-page" style={{ paddingBottom: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#000', padding: '24px', textAlign: 'center' }}>
        <Activity size={48} color="#1E293B" style={{ marginBottom: '24px' }} />
        <h2 style={{ fontSize: '24px', color: '#F8FAFC', fontWeight: 500, marginBottom: '16px' }}>
          Ouve primeiro.
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '22px', maxWidth: '280px' }}>
          O sistema precisa de analisar 5 noites válidas do teu sono mecânico (Fase 1) antes de conseguir projetar a tua identidade biológica.
        </p>
        <button 
          onClick={() => navigate('/process_home')}
          style={{ marginTop: '40px', padding: '16px 32px', borderRadius: '8px', background: '#0F172A', color: '#F8FAFC', border: '1px solid #1E293B', fontWeight: 500, letterSpacing: '1px' }}
        >
          VOLTAR AO INÍCIO
        </button>
      </div>
    );
  }

  return (
    <div className="home-page" style={{ paddingBottom: '100px' }}>
      <div style={{ opacity: 0.15 }}>
        <NightSignature />
      </div>
      
      <div className="home-content">
        <header className="hero-section">
          <span className="kicker">Identidade Base</span>
          <h1 className="title-large" style={{ fontSize: '38px' }}>Perfil em<br/>construção</h1>
          <div className="readout-pill mt-4">
            <span className="status-dot"></span>
            NÍVEL DE CERTEZA DO PERFIL: ~60%
          </div>
        </header>

        <section className="editorial-module">
          <span className="kicker">Traços mais consistentes</span>

          <div className="trait-block" style={{ marginTop: '24px' }}>
            <h3 className="trait-label">Regularidade</h3>
            <h2 className="module-title">Responde melhor a horários estáveis</h2>
            <p className="module-desc">
              O teu sono tende a estabilizar visivelmente nas noites em que a hora de deitar não varia mais do que trinta minutos.
            </p>
            <div className="pattern-evidence">
              <div className="evidence-row">
                <span className="evidence-key">Base:</span>
                <span className="evidence-val">Confiança alta</span>
              </div>
            </div>
          </div>

          <div className="trait-block" style={{ marginTop: '40px' }}>
            <h3 className="trait-label">Fricção Digital</h3>
            <h2 className="module-title" style={{ color: 'var(--text-primary)' }}>Sensibilidade tátil</h2>
            <p className="module-desc">
              A reentrada no telemóvel a meio da noite pesa significativamente mais do que a média do teu padrão. Quando acontece, a continuidade da noite tende a cair.
            </p>
            <div className="pattern-evidence">
              <div className="evidence-row">
                <span className="evidence-key">Base:</span>
                <span className="evidence-val">Confiança média-alta</span>
              </div>
            </div>
          </div>
        </section>

        <section className="editorial-module">
          <span className="kicker accent">Maior fragilidade</span>
          <h2 className="module-title">Janela crítica na madrugada</h2>
          <p className="module-desc">
            Até agora, as horas entre as 03:00 e as 04:30 concentram quase toda a tua dispersão de sono contínuo.
          </p>
        </section>

        <section className="editorial-module">
          <span className="kicker">O que mais te protege</span>
          <h2 className="module-title" style={{ color: 'var(--text-primary)' }}>Ritmo de adormecimento</h2>
          <p className="module-desc">
            O adormecimento inicial tem-se mantido incrívelmente constante e rápido. Tem funcionado como a fundação protetora do teu descanso.
          </p>
        </section>

        {deliverable && (
          <section className="editorial-module" style={{ background: 'rgba(56, 189, 248, 0.03)', border: '1px solid rgba(56, 189, 248, 0.1)', padding: '24px', borderRadius: '16px', marginTop: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Activity size={16} color="#38BDF8" />
              <span className="kicker" style={{ margin: 0, color: '#38BDF8' }}>Contexto Comportamental</span>
            </div>
            
            <h2 className="module-title" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
              {deliverable.dominantDrivers.length > 0 ? FACTOR_LABELS[deliverable.dominantDrivers[0]] : 'Padrão multifatorial complexo'}
            </h2>
            
            <p className="module-desc" style={{ marginBottom: '16px' }}>
              Baseado na tua última auto-análise. <span style={{ color: '#94A3B8' }}>{deliverable.temporalProfile}</span>.
            </p>

            <div className="pattern-evidence" style={{ borderLeftColor: '#38BDF8', background: 'transparent', padding: '0 0 0 16px', margin: 0 }}>
              <div className="evidence-row">
                <span className="evidence-key" style={{ color: '#F8FAFC' }}>Confiança:</span>
                <span className="evidence-val" style={{ color: '#38BDF8' }}>{deliverable.confidence}%</span>
              </div>
            </div>

            {deliverable.flags.length > 0 && (
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {deliverable.flags.map((flag, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94A3B8' }}>
                    <Info size={14} />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {cycle && (
          <section className="editorial-module" style={{ background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '24px', borderRadius: '16px', marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CalendarClock size={16} color="#10B981" />
              <span className="kicker" style={{ margin: 0, color: '#10B981', background: 'transparent', padding: 0 }}>
                {cycle.status === 'active' ? 'Teste em curso (Fase 3)' : 'Teste concluído'}
              </span>
            </div>
            
            <h2 className="module-title" style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '18px' }}>
              {getProposals(deliverable).find(p => p.id === cycle.proposalId)?.title || 'Teste de Hipótese'}
            </h2>
            
            {cycle.status === 'active' ? (
              <p className="module-desc" style={{ marginBottom: '16px', fontSize: '13px' }}>
                A observância está neste momento num total de <span style={{ color: '#F8FAFC' }}>{Object.keys(cycle.dailyCheckins).length} dias</span> de registo consecutivo.
              </p>
            ) : (
              <p className="module-desc" style={{ marginBottom: '16px', fontSize: '13px' }}>
                Recomendação Final: <span style={{ color: '#F8FAFC' }}>{cycle.finalRecommendation || `Ação: ${cycle.reviewState}`}</span>
              </p>
            )}
          </section>
        )}

        <section className="editorial-module footer-module" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
          <span className="kicker">Ainda a ganhar forma</span>
          <h3 className="trait-label" style={{ color: 'var(--text-muted)' }}>Recuperação percebida</h3>
          <h2 className="module-title muted-title" style={{ fontSize: '15px', marginBottom: '12px' }}>
            O sistema tenta agora observar a ligação entre as tuas noites profundas e como sentes os teus dias de maior energia.
          </h2>
          <div className="pattern-evidence" style={{ borderLeft: 'none', paddingLeft: 0, marginTop: 0 }}>
            <div className="evidence-row">
              <span className="evidence-key">Estado:</span>
              <span className="evidence-val" style={{ color: 'var(--text-secondary)' }}>Ainda a ganhar forma. Estamos a cruzar dados empíricos.</span>
            </div>
          </div>
        </section>

        {/* Bloco de Continuidade Final */}
        <section className="continuity-block" style={{ marginTop: '64px', marginBottom: '32px' }}>
          <p className="flow-text text-secondary mb-6 text-center" style={{ fontSize: '14px' }}>
            O teu perfil inicial já está formado.<br/>Podes avançar para a fase seguinte ou voltar ao início.
          </p>
          <div className="stack-btns">
            <button className="primary-action-btn w-100" onClick={() => navigate('/phase2/entry')}>
              <span>Avançar para contexto e propostas</span>
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
            <button className="secondary-action-btn w-100 mt-4" onClick={() => navigate('/process_home')}>
              Voltar ao início
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
