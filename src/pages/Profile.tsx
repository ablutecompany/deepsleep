import { useNavigate } from 'react-router-dom';
import { NightSignature } from '../components/NightSignature';
import { ArrowLeft, Clock, Activity, Sparkles, Map, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { getManualLogs } from '../domain/Phase1/manualLogStore';
import { getProposals } from '../domain/Phase2/proposals';
import { getLearningRecords } from '../domain/Phase3/learningStore';
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
  const logs = getManualLogs();
  const validNights = logs.filter(l => l.sleepType === 'NIGHT' && l.countsForBaseline);
  const totalNaps = logs.filter(l => l.sleepType === 'NAP').length;
  const learningRecords = getLearningRecords();
  const nightCount = validNights.length;

  if (nightCount < 3) {
    return (
      <div className="home-page fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-core)', padding: '24px', textAlign: 'center' }}>
        <Activity size={32} color="#1E293B" style={{ marginBottom: '24px' }} />
        <h2 style={{ fontSize: '20px', color: '#F8FAFC', fontWeight: 300, marginBottom: '12px' }}>
          Ouve primeiro.
        </h2>
        <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '22px', maxWidth: '280px', fontWeight: 300 }}>
          O Perfil não gera relatórios fictícios. Precisamos de observar o teu sono mecânico por mais {Math.max(0, 3 - nightCount)} noites válidas para extrair um perfil verdadeiro.
        </p>
        <button 
          onClick={() => navigate('/manual_log_hub')}
          className="text-btn"
          style={{ marginTop: '40px', color: '#38BDF8' }}
        >
          Ir para os registos
        </button>
      </div>
    );
  }

  // Estatísticas e Modas
  const countFrequencies = (arr: any[]) => arr.reduce((acc, curr) => { acc[curr] = (acc[curr] || 0) + 1; return acc; }, {});
  const getMode = (arr: any[], fallback: string) => {
    const valid = arr.filter(Boolean);
    if (!valid.length) return fallback;
    const freqs = countFrequencies(valid);
    return Object.keys(freqs).reduce((a, b) => freqs[a] > freqs[b] ? a : b);
  };

  let avgAwakenings = 0;
  let avgDurationMin = 0;
  let markerCounts = {} as Record<string, number>;
  
  const latencies: string[] = [];
  const restorations: string[] = [];

  validNights.forEach(l => {
     if (l.sleepOnsetEstimate) latencies.push(l.sleepOnsetEstimate);
     if (l.perceivedRestoration) restorations.push(l.perceivedRestoration);
     if (l.awakeningsCount !== undefined) avgAwakenings += l.awakeningsCount;
     
     if (l.environmentIssues) {
         l.environmentIssues.forEach((m: string) => { markerCounts[m] = (markerCounts[m] || 0) + 1; });
     }
     
     if (l.bedTime && l.wakeTime) {
         const [bH, bM] = l.bedTime.split(':').map(Number);
         const [wH, wM] = l.wakeTime.split(':').map(Number);
         let bMin = bH * 60 + bM;
         let wMin = wH * 60 + wM;
         if (wMin < bMin) wMin += 24 * 60;
         avgDurationMin += Math.max(0, wMin - bMin);
     }
  });
  
  const modalLatency = getMode(latencies, '--');
  const modalRec = getMode(restorations, 'Não registado');
  avgAwakenings = Math.round((avgAwakenings / nightCount)*10)/10;
  avgDurationMin = Math.round(avgDurationMin / nightCount);

  const formatHrs = (mins: number) => mins ? `${Math.floor(mins / 60)}h${(mins % 60).toString().padStart(2, '0')}` : '--';
  const frequentMarkers = Object.entries(markerCounts).filter(([_, count]) => count >= nightCount / 2).map(([m]) => m);

  return (
    <div className="home-page fade-in" style={{ background: 'var(--bg-core)' }}>
      <div style={{ opacity: 0.08, position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none', height: '30vh', overflow: 'hidden' }}>
        <NightSignature />
      </div>
      
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
        
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/process_home')} />
        
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2' }}>Perfil do sono.</h1>
          <p style={{ marginTop: '12px', fontSize: '15px', color: '#94A3B8', fontWeight: 300, lineHeight: '1.5' }}>
            {nightCount < 5 
              ? 'O teu perfil orgânico está em construção. Quantas mais noites válidas inserires, mais forte se tornará este ecrã base.' 
              : 'O teu perfil orgânico superou a barreira dos 5 registos basais. Estamos a utilizar a nossa arquitetura para traduzir a norma do teu sono.'}
          </p>
          <p style={{ marginTop: '16px', fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38BDF8' }} />
            Baseado estatisticamente nos teus últimos {nightCount} registos.
          </p>
        </header>

        {/* Real Data Baseline Visuals */}
        <section style={{ marginBottom: '48px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
             <div className="editorial-card" style={{ padding: '20px' }}>
               <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>Tempo médio na cama</span>
               <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginTop: '8px' }}>{formatHrs(avgDurationMin)}</h3>
             </div>
             <div className="editorial-card" style={{ padding: '20px' }}>
               <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>Tempo a Adormecer</span>
               <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginTop: '8px' }}>{modalLatency}</h3>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
             <div className="editorial-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>Média de Despertares</span>
               <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC' }}>{avgAwakenings} / noite</h3>
             </div>
          </div>
          
          <div className="editorial-card">
            <h3 className="kicker" style={{ color: '#F8FAFC' }}>Coesão da Retoma Mecânica</h3>
            <p className="module-desc" style={{ marginBottom: '12px' }}>A tua recuperação matinal auto-avaliada típica tem sido <span style={{ color: '#F8FAFC' }}>{modalRec}</span>. Os factores noturnos sistémicos registados com maior frequência são:</p>
            {frequentMarkers.length > 0 ? (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {frequentMarkers.map(m => (
                  <span key={m} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', color: '#94A3B8' }}>{m}</span>
                ))}
              </div>
            ) : (
               <span style={{ fontStyle: 'italic', fontSize: '13px', color: '#64748B' }}>Não emergiram condicionantes regulares até ao momento.</span>
            )}
          </div>
          
          {totalNaps > 0 && (
            <div className="editorial-card" style={{ marginTop: '24px', paddingBottom: '0' }}>
               <h3 className="kicker" style={{ color: '#F8FAFC' }}>Impacto Diurno / Sestas</h3>
               <p className="module-desc">Registaste um total de <strong style={{ color: '#F8FAFC', fontWeight: 400 }}>{totalNaps} sestas</strong> ao longo das tuas medições. Estes episódios reduzem a pressão de sono noturna e podem justificar demoras a adormecer.</p>
            </div>
          )}
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '64px' }}>
          <div style={{ padding: '16px', borderLeft: '2px solid #10B981', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={16} color="#10B981" style={{ marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '14px', color: '#F8FAFC', fontWeight: 400, marginBottom: '4px' }}>O que está claro</h4>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5' }}>
                Os totais físicos de fragmentação e latência estão mapeados com segurança para podermos arrancar o cruzamento da gravidade fisiológica com o contexto de ambiente.
              </p>
            </div>
          </div>
          <div style={{ padding: '16px', borderLeft: '2px solid #64748B', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <AlertCircle size={16} color="#64748B" style={{ marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '14px', color: '#F8FAFC', fontWeight: 400, marginBottom: '4px' }}>O que ainda procuramos</h4>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                Pelas limitadas noites inseridas, o motor orgânico pode falhar na distinção de flutuações e exceções como as do fim-de-semana. Quantas mais noites colocares, menos erro de exceção haverá.
              </p>
            </div>
          </div>
        </section>

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

        {learningRecords.length > 0 && (
          <section className="editorial-card" style={{ marginTop: '24px', padding: '24px', borderRadius: '12px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h3 className="kicker" style={{ color: '#F59E0B', marginBottom: '16px' }}>Histórico Evolutivo</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {learningRecords.map((rec, i) => {
                 let tagColor = '#64748B';
                 let tagText = 'AVALIAÇÃO HISTÓRICA';
                 
                 if (rec.decisionOutcome === 'completed_keep') { tagColor = '#10B981'; tagText = 'DIREÇÃO CONSOLIDADA'; }
                 else if (rec.decisionOutcome === 'completed_adjust') { tagColor = '#F59E0B'; tagText = 'FOCO REFORMULADO'; }
                 else if (rec.decisionOutcome === 'completed_switch') { tagColor = '#38BDF8'; tagText = 'MUDANÇA TÁTICA'; }
                 // Fallback para os legados na máquina do utente
                 else if ((rec as any).finalDecision === 'KEEP_REFINING') { tagColor = '#10B981'; tagText = 'DIREÇÃO CONSOLIDADA (LEGADO)'; }

                 return (
                  <div key={i} style={{ padding: '12px', borderLeft: `2px solid ${tagColor}`, background: 'rgba(255,255,255,0.02)' }}>
                     <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                       {rec.createdAt.split('T')[0]} · Ciclo Tático {rec.cycleWindowDays} noites
                     </p>
                     <p style={{ fontSize: '14px', color: '#E2E8F0', marginBottom: '8px', fontWeight: 500 }}>
                       Evolução: <span style={{ color: tagColor }}>{tagText}</span>
                     </p>
                     <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5' }}>
                       {rec.nextStepPhrase || (rec as any).observedChangeSummary || 'Registo arquivado.'}
                     </p>
                  </div>
                 );
              })}
            </div>
          </section>
        )}

        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <button 
              onClick={() => navigate(deliverable ? '/phase2/proposals' : '/phase2/entry')}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', padding: '16px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              <Map size={16} />
              {deliverable ? 'Ver Propostas Guardadas' : 'Avançar para Interpretação'}
            </button>
            
            <button 
              className="text-btn" 
              style={{ opacity: 0.3 }}
              onClick={() => { 
                if (window.confirm("Atenção: vais apagar todo o teu histórico, noites registadas e evolução aprendida. Queres recomeçar o processo clínico a partir do zero?")) {
                  localStorage.clear(); 
                  window.location.href = '/'; 
                }
              }}
            >
              Reiniciar Beta
            </button>
        </div>

      </div>
    </div>
  );
}
