export type AdaptiveQuestion = {
  id: string;
  prompt: string;
  options: string[];
  purpose: 'confidence_adjust' | 'family_feedback' | 'decision_engine';
};

export type AdaptiveQuestionSet = {
  id: string;
  triggerType: 'mini_reassessment' | 'guidance_followup' | 'window_review';
  linkedProposalFamily?: string;
  questions: AdaptiveQuestion[];
};

export const REASSESSMENT_BANK: AdaptiveQuestionSet = {
  id: 'mini_reassess_01',
  triggerType: 'mini_reassessment',
  questions: [
    {
      id: 'q1_friction',
      prompt: 'Onde achas que falhámos na leitura do teu sono?',
      options: ['O motivo principal apontado', 'As razões secundárias', 'Falta algo que não vos contei', 'A forma como está escrito'],
      purpose: 'confidence_adjust'
    },
    {
      id: 'q2_shift',
      prompt: 'Se tivesses de alterar a direção das tuas noites agora, foçarias em:',
      options: ['Adormecer mais rápido', 'Acordar menos vezes a meio', 'Ter manhãs com mais energia', 'Não acordar muito suado ou desconfortável'],
      purpose: 'family_feedback'
    }
  ]
};

export const REVIEW_BANK: Record<string, AdaptiveQuestionSet> = {
  TIMING_LIQUIDOS: {
    id: 'rev_liquidos',
    triggerType: 'window_review',
    linkedProposalFamily: 'Fisiologia / Urgência',
    questions: [
      {
        id: 'rev1',
        prompt: 'Conseguiste cortar totalmente os líquidos nas 2 horas antes de deitar nestes dias?',
        options: ['Sim, todos os dias', 'Na maioria dos dias', 'Foi muito difícil'],
        purpose: 'confidence_adjust'
      },
      {
        id: 'rev2',
        prompt: 'Sentiste que tiveste de te levantar menos vezes de madrugada com vontade de urinar?',
        options: ['Claramente menos vezes', 'Aconteceu na mesma', 'Não notei diferença'],
        purpose: 'family_feedback'
      },
      {
        id: 'rev3',
        prompt: 'O que queres fazer a seguir?',
        options: ['Manter este hábito (está a ajudar)', 'Ajustar a indicação', 'Trocar de tática agora'],
        purpose: 'decision_engine'
      }
    ]
  },
  PRESSAO_DORMIR: {
    id: 'rev_pressao',
    triggerType: 'window_review',
    linkedProposalFamily: 'Vigilância / Ansiedade',
    questions: [
      {
        id: 'rev1',
        prompt: 'Conseguiste ficar de fora da cama a fazer tempo até os teus olhos pesarem mesmo?',
        options: ['Sempre', 'Pela metade das noites', 'Meti-me logo na cama na mesma'],
        purpose: 'confidence_adjust'
      },
      {
        id: 'rev2',
        prompt: 'Quando te deitaste efetivamente com sono, adormeceste com mais facilidade ou menos stress?',
        options: ['Muito mais facilmente', 'Houve alguma diferença', 'Foi a mesma batalha'],
        purpose: 'family_feedback'
      },
      {
        id: 'rev3',
        prompt: 'Como vamos prosseguir?',
        options: ['Manter este hábito', 'Re-ajustar horários', 'Trocar de tática agora'],
        purpose: 'decision_engine'
      }
    ]
  },
  DEFAULT: {
    id: 'rev_default',
    triggerType: 'window_review',
    linkedProposalFamily: 'Geral',
    questions: [
      {
        id: 'rev1',
        prompt: 'Conseguiste seguir esta orientação na maioria dos dias?',
        options: ['Sim, sem falhas', 'Parcialmente', 'Muito pouco'],
        purpose: 'confidence_adjust'
      },
      {
        id: 'rev2',
        prompt: 'Notaste alguma diferença útil e sólida na tua rotina?',
        options: ['Sim, claramente', 'Muito ligeira', 'Nada até agora'],
        purpose: 'family_feedback'
      },
      {
        id: 'rev3',
        prompt: 'Esta proposta pareceu-te adequada para ti?',
        options: ['Quero manter', 'Quero ajustar um pouco', 'Quero trocar de tática'],
        purpose: 'decision_engine'
      }
    ]
  }
};
