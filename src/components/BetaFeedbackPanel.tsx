import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveBetaFeedback } from '../domain/Telemetry/betaFeedbackStore';
import { MessageSquareWarning, X } from 'lucide-react';

const FEEDBACK_CATEGORIES = [
  "Não percebi o que fazer",
  "Isto pareceu-me errado",
  "Isto repetiu-se demasiado",
  "Esta proposta não fez sentido",
  "Houve bug / bloqueio",
  "Demorei demasiado tempo",
  "A linguagem está estranha",
  "Outro"
];

export function BetaFeedbackPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) {
      setSelectedCat('');
      setNote('');
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selectedCat) return;
    
    // Extracção do cycleId caso estejamos na fase activa 3
    let cycleId = undefined;
    try {
       const cycle = JSON.parse(localStorage.getItem('deepsleep_phase3_cycle') || 'null');
       cycleId = cycle?.cycleId;
    } catch(e) {}

    saveBetaFeedback({
      category: selectedCat,
      route: location.pathname,
      note: note.trim() || undefined,
      linkedCycleId: cycleId
    });

    setSubmitted(true);
    setTimeout(() => setIsOpen(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '100px', // Acima da bottom-nav
          right: '24px',
          zIndex: 9999,
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          color: '#F59E0B',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
        aria-label="Reportar Fricção"
      >
        <MessageSquareWarning size={20} />
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000, 
          background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }}>
          <div className="fade-in" style={{ 
            width: '100%', maxWidth: '100%', margin: 'auto 0 0 0',
            borderTop: '1px solid rgba(245, 158, 11, 0.3)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0',
            background: '#070709',
            padding: '24px 20px calc(24px + env(safe-area-inset-bottom, 0px)) 20px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <MessageSquareWarning size={40} color="#10B981" style={{ margin: '0 auto 16px', opacity: 0.8 }} />
                <h3 style={{ color: '#F8FAFC', fontSize: '18px', marginBottom: '8px' }}>Fricção Registada</h3>
                <p style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 300 }}>Este reporte ficará contido na exportação final da tua simulação.</p>
              </div>
            ) : (
              <>
                <h3 className="kicker" style={{ color: '#F59E0B', marginBottom: '16px' }}>[Beta] Reporte de Fricção</h3>
                <p style={{ color: '#E2E8F0', fontSize: '14px', marginBottom: '24px', fontWeight: 300, lineHeight: 1.5 }}>
                  O que quebrou a fluidez ou a confiança neste ecrã?
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '24px' }}>
                  {FEEDBACK_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCat(cat)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        fontSize: '13px',
                        background: selectedCat === cat ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.03)',
                        border: selectedCat === cat ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255,255,255,0.08)',
                        color: selectedCat === cat ? '#F59E0B' : '#CBD5E1',
                        cursor: 'pointer'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {selectedCat === 'Outro' && (
                  <textarea
                    autoFocus
                    placeholder="Descreve opcionalmente de forma curta..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      color: '#F8FAFC',
                      fontSize: '13px',
                      minHeight: '80px',
                      resize: 'none',
                      marginBottom: '24px'
                    }}
                  />
                )}
                
                <button 
                  onClick={handleSubmit} 
                  disabled={!selectedCat}
                  className="primary-btn" 
                  style={{ width: '100%', justifyContent: 'center', opacity: !selectedCat ? 0.3 : 1 }}
                >
                  Registar Dificuldade Local
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
