import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePhase2Store } from '../store/Phase2ContextStore';
import { QUESTIONS_BANK, getQuestionsForMode } from '../domain/Phase2/questions';
import { evaluateAssessment } from '../domain/Phase2/engine';

export function Phase2Questions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { answersDraft, setAnswersDraft, setDeliverable } = usePhase2Store();

  const modeRaw = searchParams.get('mode');
  const mode = modeRaw === '25' ? 25 : 10;
  
  const [qids] = useState(() => {
    // Ensure we don't re-roll the questions if we already answered some.
    if (Object.keys(answersDraft).length > 0) {
      return Object.keys(answersDraft);
    }
    return getQuestionsForMode(mode);
  });
  
  // Find first unanswered question
  const initialIndex = qids.findIndex(qid => !answersDraft[qid] || answersDraft[qid].length === 0);
  const skipTo = initialIndex === -1 ? 0 : initialIndex; // If all answered, start at 0 (unlikely unless done)

  const [currentIndex, setCurrentIndex] = useState(skipTo);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentQid = qids[currentIndex];
  const currentQ = QUESTIONS_BANK[currentQid];

  useEffect(() => {
    if (isGenerating) {
      let t: ReturnType<typeof setTimeout>;
      try {
        const finalDeliverable = evaluateAssessment(answersDraft, mode);
        setDeliverable(finalDeliverable);
      } catch (e) {
        console.error("Phase 2 Generation Error:", e);
      } finally {
        // Reduzido para 800ms para evitar retenções irritantes e prevenir re-renders de store clearing o timeout
        t = setTimeout(() => navigate('/phase2/context', { replace: true }), 800);
      }
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating]);

  if (isGenerating) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#000', color: '#F8FAFC', padding: '24px' }}>
        <p style={{ fontSize: '14px', color: '#94A3B8' }}>A gerar mapa contextual...</p>
      </div>
    );
  }

  if (!currentQ) return null;

  const currentAnswers = answersDraft[currentQ.id] || [];

  const handleToggle = (optId: string) => {
    let newAnswers = [...currentAnswers];
    if (newAnswers.includes(optId)) {
      newAnswers = newAnswers.filter(a => a !== optId);
    } else {
      if (currentQ.type === 'single_choice') {
        newAnswers = [optId];
      } else {
        newAnswers.push(optId);
      }
    }
    
    setAnswersDraft({ ...answersDraft, [currentQ.id]: newAnswers });

    if (currentQ.type === 'single_choice' && newAnswers.length > 0) {
      setTimeout(() => proceed(), 300);
    }
  };

  const proceed = () => {
    if (currentIndex < qids.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsGenerating(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#000', color: '#F8FAFC', padding: '24px', boxSizing: 'border-box' }}>
      <p style={{ textAlign: 'center', color: '#64748B', fontSize: '12px', letterSpacing: '2px', marginTop: '32px', marginBottom: '64px' }}>
        {currentIndex + 1} / {qids.length}
      </p>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 500, lineHeight: '32px', marginBottom: '8px' }}>
          {currentQ.text}
        </h2>
        <p style={{ fontSize: '12px', color: '#64748B', letterSpacing: '1px', marginBottom: '48px' }}>
          {currentQ.type === 'multi_choice' ? 'Escolha múltipla' : 'Escolhe 1'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {currentQ.options.map(opt => {
            const isSelected = currentAnswers.includes(opt.id);
            return (
              <div 
                key={opt.id}
                onClick={() => handleToggle(opt.id)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '8px',
                  background: isSelected ? '#1E293B' : 'transparent',
                  border: `1px solid ${isSelected ? 'transparent' : '#1E293B'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '16px', color: '#F8FAFC' }}>{opt.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer for multi_choice confirm */}
      <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end' }}>
        {currentQ.type === 'multi_choice' && currentAnswers.length > 0 && (
          <button 
            onClick={proceed}
            style={{ width: '100%', height: '56px', borderRadius: '8px', background: '#F8FAFC', color: '#0F172A', border: 'none', fontWeight: 500, letterSpacing: '1px' }}
          >
            CONFIRMAR
          </button>
        )}
      </div>
    </div>
  );
}
