import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_QUESTIONS = [
  { id: 'q1', text: 'Como sentes o teu nível de stress atual?', options: ['Muito Alto', 'Gerível', 'Baixo', 'Inexistente'], maxChoices: 1 },
  { id: 'q2', text: 'Quais destes fatores costumam acordar-te?', options: ['Telemóvel/Ecrãs', 'Barulho', 'Temperatura', 'Ansiedade'], maxChoices: 2 }
];

export function Phase2Questions() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const currentQ = MOCK_QUESTIONS[currentIndex];

  useEffect(() => {
    if (isGenerating) {
      const t = setTimeout(() => navigate('/phase2_proposals'), 2000);
      return () => clearTimeout(t);
    }
  }, [isGenerating, navigate]);

  if (isGenerating) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#000', color: '#F8FAFC', padding: '24px' }}>
        <p style={{ fontSize: '14px', color: '#94A3B8' }}>A analisar contexto e a isolar propostas...</p>
      </div>
    );
  }

  if (!currentQ) return null;

  const currentAnswers = answers[currentQ.id] || [];

  const handleToggle = (option: string) => {
    let newAnswers = [...currentAnswers];
    if (newAnswers.includes(option)) {
      newAnswers = newAnswers.filter(a => a !== option);
    } else {
      if (currentQ.maxChoices === 1) {
        newAnswers = [option];
      } else if (newAnswers.length < currentQ.maxChoices) {
        newAnswers.push(option);
      }
    }
    
    setAnswers({ ...answers, [currentQ.id]: newAnswers });

    if (newAnswers.length === currentQ.maxChoices) {
      setTimeout(() => {
        if (currentIndex < MOCK_QUESTIONS.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setIsGenerating(true);
        }
      }, 300);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#000', color: '#F8FAFC', padding: '24px', boxSizing: 'border-box' }}>
      <p style={{ textAlign: 'center', color: '#64748B', fontSize: '12px', letterSpacing: '2px', marginTop: '32px', marginBottom: '64px' }}>
        {currentIndex + 1} / {MOCK_QUESTIONS.length}
      </p>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 500, lineHeight: '32px', marginBottom: '8px' }}>
          {currentQ.text}
        </h2>
        <p style={{ fontSize: '12px', color: '#64748B', letterSpacing: '1px', marginBottom: '48px' }}>
          {currentQ.maxChoices > 1 ? `Escolhe até ${currentQ.maxChoices}` : 'Escolhe 1'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {currentQ.options.map(opt => {
            const isSelected = currentAnswers.includes(opt);
            return (
              <div 
                key={opt}
                onClick={() => handleToggle(opt)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '8px',
                  background: isSelected ? '#1E293B' : 'transparent',
                  border: `1px solid ${isSelected ? 'transparent' : '#1E293B'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '16px', color: '#F8FAFC' }}>{opt}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
