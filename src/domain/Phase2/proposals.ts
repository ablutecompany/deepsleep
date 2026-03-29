import type { AssessmentDeliverable } from './engine';

export type EnhancedProposal = {
  id: string;
  title: string;
  why: string;
  observe: string;
  whenNotTo: string;
  minWindow: string; // ex: "5 dias letivos seguidos"
  minDays: number;   // numeric for Phase 3 engine (ex: 5)
  future: string;
};

export type PriorityTest = {
  primaryProposalId: string;
  priorityScore: number;
  selectionReason: string;
};

export function getProposals(deliverable: AssessmentDeliverable | null): EnhancedProposal[] {
  let proposals: EnhancedProposal[] = [
    { 
      id: 'prop_ancora',
      title: "Fixar a hora de despertar", 
      why: "Acordar à mesma hora ajuda o corpo a prever e preparar o sono para a noite seguinte.", 
      observe: "A dificuldade em sair da cama à hora marcada nos primeiros dias.",
      whenNotTo: "O teu horário de trabalho for inconstante (turnos).",
      minWindow: "5 dias",
      minDays: 5,
      future: "Estabelece um relógio biológico estável antes de tentar alterar hábitos noturnos."
    },
    { 
      id: 'prop_descomp',
      title: "Reduzir estímulo antes de deitar", 
      why: "Demasiado estímulo visual ou mental perto da hora de deitar pode dificultar a transição para o sono.",
      observe: "A tendência para voltar ao telemóvel ou entrar em pensamento circular quando tudo acalma.",
      whenNotTo: "O estímulo digital não parecer ter peso real no teu padrão atual.",
      minWindow: "3 dias",
      minDays: 3,
      future: "Cria uma base mais limpa para perceber se a ativação mental está a ser alimentada pelo ambiente."
    }
  ];

  if (deliverable) {
    if (deliverable.proposalConstraints.some(c => c.includes('Dor'))) {
      proposals.push({ 
        id: 'prop_ergo',
        title: "Aliviar o desconforto físico", 
        why: "A tensão corporal ou dor durante a noite provoca despertares frequentes que fragmentam o descanso.", 
        observe: "Quantas vezes acordas especificamente para mudar de posição devido a desconforto.",
        whenNotTo: "Tiveres indicação médica para manter uma posição específica a dormir.",
        minWindow: "4 dias",
        minDays: 4,
        future: "Resolve barreiras físicas óbvias antes de assumirmos que o problema é stress ou rotina."
      });
    }

    if (deliverable.dominantDrivers.includes('P2')) {
      proposals = proposals.filter(p => p.id !== 'prop_ancora');
      proposals.unshift({ 
        id: 'prop_foco',
        title: "Sair da cama quando o sono não vem", 
        why: "Quando ficas deitado a tentar adormecer à força, o estado de alerta sobe e o sono tende a afastar-se ainda mais.", 
        observe: "A dificuldade em sair da cama quando o sono não aparece ao fim de cerca de 20 minutos.",
        whenNotTo: "A casa for insegura, demasiado fria, ou se te sentires mais estável sentado na cama do que a circular.",
        minWindow: "7 dias",
        minDays: 7,
        future: "Ajuda a quebrar a associação entre cama e estado de alerta antes de testar medidas mais exigentes."
      });
    }

    if (deliverable.flags.includes('Noctúria presente')) {
      proposals.push({ 
        id: 'prop_hidrica',
        title: "Ajustar líquidos ao fim do dia", 
        why: "Beber demasiado perto da hora de deitar pode fragmentar o sono logo na primeira metade da noite.", 
        observe: "Despertares precoces ligados a idas à casa de banho ou sensação de bexiga ativa durante a noite.",
        whenNotTo: "Tiveres muita sede ao fim do dia, actividade física tardia, ou medicação que altere claramente o padrão urinário.",
        minWindow: "3 dias",
        minDays: 3,
        future: "Permite reduzir uma causa física simples de fragmentação antes de testar mudanças mais complexas."
      });
    }
  }

  return proposals;
}

export function getPriorityTest(deliverable: AssessmentDeliverable): PriorityTest {
  if (deliverable.proposalConstraints.some(c => c.includes('Dor'))) {
    return {
      primaryProposalId: 'prop_ergo',
      priorityScore: 95,
      selectionReason: 'A presença de dor física ativa assume sempre prioridade sobre otimizações cognitivas ou de rotina biológica.'
    };
  }

  if (deliverable.dominantDrivers.includes('P2')) {
    return {
      primaryProposalId: 'prop_foco',
      priorityScore: 90,
      selectionReason: 'O medo crónico da noite bloqueia qualquer intervenção baseada em restrição ou fixação de horários.'
    };
  }

  if (deliverable.flags.includes('Noctúria presente')) {
    return {
      primaryProposalId: 'prop_hidrica',
      priorityScore: 85,
      selectionReason: 'Desobstrução primária do metabolismo de fluidos para limpar os ciclos fragmentados.'
    };
  }

  // Fallback to default foundation
  return {
    primaryProposalId: 'prop_ancora',
    priorityScore: 80,
    selectionReason: 'Ausência de bloqueadores críticos. O caminho inicia-se pela fundação da estabilidade circadiana.'
  };
}
