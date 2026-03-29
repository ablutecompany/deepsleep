import { useNavigate } from 'react-router-dom';
import { NightSignature } from '../components/NightSignature';
import { ArrowLeft, Clock, Activity, Sparkles, Map, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { usePhase3Store } from '../store/Phase3ContextStore';
import { getManualLogs } from '../domain/Phase1/manualLogStore';
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
  const logs = getManualLogs();
  const nightCount = logs.length;

  if (nightCount < 3) {
    return (
      <div className="home-page fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-core)', padding: '24px', textAlign: 'center' }}>
        <Activity size={32} color="#1E293B" style={{ marginBottom: '24px' }} />
        <h2 style={{ fontSize: '20px', color: '#F8FAFC', fontWeight: 300, marginBottom: '12px' }}>
          Ouve primeiro.
        </h2>
        <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '22px', maxWidth: '280px', fontWeight: 300 }}>
          O Perfil não gera relatórios fictícios. Precisamos de observar o teu sono mecânico por mais {Math.max(0, 3 - nightCount)} noites para criar a tua baseline.
        </p>
        <button 
          onClick={() => navigate('/manual_log_hub')}
          className="text-btn"
          style={{ marginTop: '40px', color: '#38BDF8' }}
        >
          Voltar as noites
        </button>
      </div>
    );
  }

  // Baseline extraction from pure real data
  let avgLatency = 0;
  let avgAwakenings = 0;
  let avgAwakeTime = 0;
  let avgDurationMin = 0;
  let markerCounts = {} as Record<string, number>;
  const sumRecovery = { 'Má': 1, 'Razoável': 2, 'Boa': 3, 'Excelente': 4 };
  let avgRecScore = 0;

  logs.forEach(l => {
     avgLatency += l.timeToSleepMin;
     avgAwakenings += l.awakenings;
     avgAwakeTime += l.awakeTimeMin;
     avgRecScore += sumRecovery[l.recovery];
     l.markers.forEach(m => { markerCounts[m] = (markerCounts[m] || 0) + 1; });
     
     const [bH, bM] = l.bedTime.split(':').map(Number);
     const [wH, wM] = l.wakeTime.split(':').map(Number);
     let bMin = bH * 60 + bM;
     let wMin = wH * 60 + wM;
     if (wMin < bMin) wMin += 24 * 60; // crossed midnight
     avgDurationMin += Math.max(0, wMin - bMin);
  });
  
  avgLatency = Math.round(avgLatency / nightCount);
  avgAwakenings = Math.round((avgAwakenings / nightCount)*10)/10;
  avgAwakeTime = Math.round(avgAwakeTime / nightCount);
  avgDurationMin = Math.round(avgDurationMin / nightCount);
  avgRecScore = Math.round(avgRecScore / nightCount);

  const recLabel = Object.keys(sumRecovery).find(k => sumRecovery[k as keyof typeof sumRecovery] === avgRecScore) || 'Razoável';
  const formatHrs = (mins: number) => `${Math.floor(mins / 60)}h${(mins % 60).toString().padStart(2, '0')}`;
  const frequentMarkers = Object.entries(markerCounts).filter(([_, count]) => count >= nightCount / 2).map(([m]) => m);

  return (
    <div className="home-page fade-in" style={{ background: 'var(--bg-core)' }}>
      <div style={{ opacity: 0.08, position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none', height: '30vh', overflow: 'hidden' }}>
        <NightSignature />
      </div>
      
      <div className="home-content" style={{ position: 'relative', zIndex: 10, paddingTop: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
        
        <ArrowLeft size={24} color="#F8FAFC" style={{ marginBottom: '32px', cursor: 'pointer', opacity: 0.6 }} onClick={() => navigate('/process_home')} />
        
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: '1.2' }}>Perfil do teu sono.</h1>
          <p style={{ marginTop: '12px', fontSize: '15px', color: '#94A3B8', fontWeight: 300, lineHeight: '1.5' }}>
            Este é um perfil em construção. À medida que avanças nas Fases 2 e 3, ganhamos contexto e o retrato estabiliza de acordo com o teu padrão real.
          </p>
          <p style={{ marginTop: '16px', fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38BDF8' }} />
            Baseado fisicamente nos teus últimos {nightCount} registos válidos.
          </p>
        </header>

        {/* Real Data Baseline Visuals */}
        <section style={{ marginBottom: '48px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
             <div className="editorial-card" style={{ padding: '20px' }}>
               <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>Duração na Cama média</span>
               <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginTop: '8px' }}>{formatHrs(avgDurationMin)}</h3>
             </div>
             <div className="editorial-card" style={{ padding: '20px' }}>
               <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>Velocidade Adormecer</span>
               <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginTop: '8px' }}>{avgLatency} <span style={{ fontSize: '14px', color: '#64748B' }}>min</span></h3>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
             <div className="editorial-card" style={{ padding: '20px' }}>
               <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>Despertares Isolados</span>
               <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginTop: '8px' }}>{avgAwakenings}</h3>
             </div>
             <div className="editorial-card" style={{ padding: '20px' }}>
               <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>Tempo a lutar a meio</span>
               <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#F8FAFC', marginTop: '8px' }}>{avgAwakeTime} <span style={{ fontSize: '14px', color: '#64748B' }}>min</span></h3>
             </div>
          </div>
          
          <div className="editorial-card">
            <h3 className="kicker" style={{ color: '#F8FAFC' }}>Coesão da Retoma Mecânica</h3>
            <p className="module-desc" style={{ marginBottom: '12px' }}>A tua recuperação matinal auto-avaliada está fixada em <span style={{ color: '#F8FAFC' }}>{recLabel}</span>. Os factores noturnos que se cruzam na maioria das tuas noites registadas e que mais probabilidade têm de ditar esta energia são:</p>
            {frequentMarkers.length > 0 ? (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {frequentMarkers.map(m => (
                  <span key={m} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', color: '#94A3B8' }}>{m}</span>
                ))}
              </div>
            ) : (
               <span style={{ fontStyle: 'italic', fontSize: '13px', color: '#64748B' }}>Não emergiram padrões de atividade marcantes até ao momento.</span>
            )}
          </div>
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
