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
      title: "Manter a hora de despertar constante", 
      why: "Acordar num horário regular pode ajudar o corpo a consolidar o momento do sono na noite seguinte.", 
      observe: "A resistência inicial em manter a hora ao limite em dias de maior cansaço.",
      whenNotTo: "Se o horário laboral fôr forçosamente imprevisível (ex: trabalho por turnos rotativos).",
      minWindow: "5 dias",
      minDays: 5,
      future: "Estabelecer estabilidade no horário de despertar costuma ser o passo base inicial seguro."
    },
    { 
      id: 'prop_descomp',
      title: "Testar uma redução de estímulos antes da cama", 
      why: "Evitar estímulos intensos (brilho, stress) pode ajudar na transição gradual para a fase orgânica de repouso.",
      observe: "A tua eventual urgência de pegar no telemóvel ao apagar as luzes.",
      whenNotTo: "Se os ecrãs já representam, pelo contrário, o teu mecanismo prático e consolidado de indução de sono funcional.",
      minWindow: "3 dias",
      minDays: 3,
      future: "Ao remover interrupções visuais, testamos a hipótese da reatividade mecânica ser a agravadora indireta."
    }
  ];

  if (deliverable) {
    if (deliverable.proposalConstraints.some(c => c.includes('Dor'))) {
      proposals.push({ 
        id: 'prop_ergo',
        title: "Tentar alívio sintomático estrutural", 
        why: "Antes de tentar alterar regras biológicas, focar na possível barreira corporal registada para mitigar microdespertares.", 
        observe: "Quais os momentos da noite em que a posição influi de facto mais negativamente no conforto sentido.",
        whenNotTo: "Existir uma direção primária concorrente liderada proativamente por um clínico ou suporte primário.",
        minWindow: "4 dias",
        minDays: 4,
        future: "Diminuir atrito ergonómico é uma primeira tentativa lógica para excluir a cama em si desta tensão."
      });
    }

    if (deliverable.dominantDrivers.includes('P2')) {
      proposals = proposals.filter(p => p.id !== 'prop_ancora');
      proposals.unshift({ 
        id: 'prop_foco',
        title: "Levantar da cama perante demoras prolongadas", 
        why: "A permanência acordada na cama parece condicionar o estado de alerta, sugerindo que a quebra ativa é uma defesa preferível.", 
        observe: "As pequenas frustrações internas ao decidir forçosamente sair de debaixo dos lençóis.",
        whenNotTo: "For fisicamente complexo transitar na moradia em segurança durante a noite fria.",
        minWindow: "7 dias",
        minDays: 7,
        future: "Este registo sugere interromper a correlação frustrante entre a almofada e a incerteza de conseguir fechar o ciclo."
      });
    }

    if (deliverable.flags.includes('Noctúria presente')) {
      proposals.push({ 
        id: 'prop_hidrica',
        title: "Experimentar ajustar timing de líquidos", 
        why: "Sendo um fator registado ativamente a meio das madrugadas passadas, este ajuste marginal sugere reduzir despertares fragmentadores práticos.", 
        observe: "Pequenos padrões rotineiros de jantar muito volumosos ou hidratações concentradas em excesso apenas à noite.",
        whenNotTo: "For explicitamente inviável medicamente e a tua sede diurna for incontornável.",
        minWindow: "3 dias",
        minDays: 3,
        future: "Pode ser tentado para excluir a pressão orgânica da bexiga das reais contagens mecânicas obstrutivas em Fase 1 madura."
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
      selectionReason: 'Como foi registada dor, a hipótese conservadora sugere priorizar a estabilidade material/física antes de mexer na conduta rítmica e horária.'
    };
  }

  if (deliverable.dominantDrivers.includes('P2')) {
    return {
      primaryProposalId: 'prop_foco',
      priorityScore: 90,
      selectionReason: 'A preocupação em conseguir adormecer parece ser um sinal presente que aconselha a quebra momentânea fora da cama.'
    };
  }

  if (deliverable.flags.includes('Noctúria presente')) {
    return {
      primaryProposalId: 'prop_hidrica',
      priorityScore: 85,
      selectionReason: 'Há indicativos baseados nos registos que suportam o teste da restrição precoce perante fracionamento claro.'
    };
  }

  // Fallback to default foundation
  return {
    primaryProposalId: 'prop_ancora',
    priorityScore: 80,
    selectionReason: 'Não existindo sinais determinantes contrários explícitos nestes dados, testar a âncora horária base do dia é recomendada na recolha inicial.'
  };
}
