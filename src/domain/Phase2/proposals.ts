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

export function getProposals(deliverable: AssessmentDeliverable | null): EnhancedProposal[] {
  let proposals: EnhancedProposal[] = [
    { 
      id: 'prop_ancora',
      title: "Ancoragem Matinal", 
      why: "A base biológica precisa de um horário inegociável para começar a calcular a pressão de sono noturna.", 
      observe: "O quão difícil é levantar nos primeiros 3 dias e se a 'fome de sono' aparece mais cedo à noite.",
      whenNotTo: "Se o teu horário de trabalho mudou drasticamente (turnos).",
      minWindow: "5 dias",
      minDays: 5,
      future: "Fundação para as propostas de compressão de sono da Fase 3."
    },
    { 
      id: 'prop_descomp',
      title: "Descompressão Passiva", 
      why: "O teu cérebro está a levar estímulos visuais rápidos até o momento de tentar apagar, confundindo o ritmo circadiano.",
      observe: "Os pensamentos circulares quando ficas em total silêncio sem o telemóvel.",
      whenNotTo: "Nunca. É uma recomendação universal.",
      minWindow: "3 dias",
      minDays: 3,
      future: "Permite iniciar testes de relaxamento cognitivo na Fase futura."
    }
  ];

  if (deliverable) {
    if (deliverable.proposalConstraints.some(c => c.includes('Dor'))) {
      proposals.push({ 
        id: 'prop_ergo',
        title: "Proteção Ergonómica", 
        why: "A matriz detetou que a tensão corporal e a dor são gatilhos ativos a meio da noite.", 
        observe: "A frequência com que acordas para corrigir a posição.",
        whenNotTo: "Se tiveres uma lesão aguda recente que já tem indicação médica de imobilidade específica.",
        minWindow: "4 dias",
        minDays: 4,
        future: "Essencial para não confundir 'mente hiperativa' com 'resposta a dor'."
      });
    }

    if (deliverable.dominantDrivers.includes('P2')) {
      proposals = proposals.filter(p => p.id !== 'prop_ancora');
      proposals.unshift({ 
        id: 'prop_foco',
        title: "Foco Deslocado", 
        why: "O medo de não dormir virou o vilão. Tentar forçar o sono deitado na cama só aumenta o nível de alerta do teu corpo.", 
        observe: "O nível de resistência em sair da cama quando o sono não vem após 20 minutos.",
        whenNotTo: "Se a casa for extremamente fria ou insegura, fica apenas sentado na cama em vez de deitado.",
        minWindow: "7 dias",
        minDays: 7,
        future: "Será o teu trunfo de segurança antes de aplicar restrições ao tempo na cama na Fase futura."
      });
    }

    if (deliverable.flags.includes('Noctúria presente')) {
      proposals.push({ 
        id: 'prop_hidrica',
        title: "Restrição Hídrica Noturna", 
        why: "O volume de líquido noturno acorda o metabolismo renal e impede o sono contínuo e profundo.", 
        observe: "A densidade do teu primeiro ciclo de sono sem interrupções gástricas.",
        whenNotTo: "Se trabalhas fisicamente até perto da hora de deitar ou estás sob medicação diurética noturna.",
        minWindow: "3 dias",
        minDays: 3,
        future: "Preparação metabólica de base para métricas limpas."
      });
    }
  }

  return proposals;
}
