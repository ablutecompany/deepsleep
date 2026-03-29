import type { AssessmentDeliverable } from './engine';
import { getLearningRecords } from '../Phase3/learningStore';

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
  let proposals: EnhancedProposal[] = [];

  if (!deliverable) {
    proposals.push({
      id: 'prop_ancora',
      title: "Manter Constância Térmica e de Rumo",
      why: "Sem dados concretos, a correção circadiana ao amanhecer é o ponto seguro basal.",
      observe: "Irritabilidade na alvorada se não houver cumprimento de horas de sono.",
      whenNotTo: "Quando o limite for perigoso para a condução.",
      minWindow: "5 noites sucessivas",
      minDays: 5,
      future: "Estabelecer estabilidade no horário basal afunila padrões biológicos."
    });
    return proposals;
  }

  // 1. REGRA 3: Tratar Funcionalmente as Famílias com base na árvore da Fase 1
  switch (deliverable.primarySleepPattern) {
    case 'COMPONENTE_ORGANICA':
      if (deliverable.flags.some(f => f.includes('Noctúria'))) {
        proposals.push({
          id: 'prop_hidrica',
          title: "Cronometria de Impacto Hídrico Noturno",
          why: "A fragmentação registada cruza-se com a pressão vesical durante o ciclo. Adiar ou concentrar hidratação ajuda a distinguir causas orgânicas de ansiedade na interrupção do sono.",
          observe: "Padrões de ingestão concentrados na hora da refeição ou ceia por défice diurno.",
          whenNotTo: "Se existir indicação médica contrária ou necessidade para medicação específica.",
          minWindow: "4 noites sucessivas",
          minDays: 4,
          future: "Reduz o volume de interrupções puramente fisiológicas."
        });
      }
      if (deliverable.proposalConstraints.some(c => c.includes('Dor'))) {
        proposals.push({
          id: 'prop_ergo',
          title: "Eliminação e Suporte Físico",
          why: "O impacto mecânico relatado interfere com a continuidade natural do ciclo do sono.",
          observe: "A relação entre posições adotadas e o momento de despertar consecutivo.",
          whenNotTo: "Quando existir protocolo médico de reabilitação estruturado.",
          minWindow: "3 noites seguidas",
          minDays: 3,
          future: "Diminui o potencial de despertar gerado pelo próprio corpo."
        });
      }
      break;

    case 'REENTRADA_DESPERTAR':
    case 'FRAGMENTACAO_MANUTENCAO':
      proposals.push({
        id: 'prop_levantar',
        title: "Estratégia de Interrupção do Comportamento de Cama",
        why: "Permanecer na cama durante muito tempo sem conseguir dormir agrava o alerta. Levantar-se temporariamente interrompe essa fase de associação negativa.",
        observe: "A tendência para justificar a permanência na cama enquanto o estado de alerta aumenta.",
        whenNotTo: "Quando o levantar gerar risco físico de quedas ou impacto no contexto familiar.",
        minWindow: "5 dias experimentais",
        minDays: 5,
        future: "Impede a cronificação do alerta condicionado perante o ambiente de dormida."
      });
      break;

    case 'IRREGULARIDADE_HORARIOS':
      proposals.push({
        id: 'prop_ancora_horaria',
        title: "Barreira Circadiana de Fecho",
        why: "A ausência de ritmo inibe a produção de melatonina no tempo exato. Ajustar uma barreira fixa para terminar a atividade diária serve de indutor passivo.",
        observe: "O prolongamento desnecessário do dia em alturas críticas.",
        whenNotTo: "Quando sujeito a horários rotativos curtos impostos por turnos laborais.",
        minWindow: "7 dias seguidos",
        minDays: 7,
        future: "Normalização do ponto zero noturno antes do sono surgir."
      });
      break;

    case 'DIFICULDADE_ADORMECIMENTO':
    default:
      if (deliverable.dominantDrivers.includes('P1') || deliverable.dominantDrivers.includes('P2')) {
        proposals.push({
          id: 'prop_foco_passivo',
          title: "Substituição para Carga Cognitiva Neutra",
          why: "O uso de ecrãs não tem de interromper o adormecimento se o estímulo for reduzido. Preferir conteúdos previsíveis e lineares pode pacificar a transição e modular a carga do foco.",
          observe: "A necessidade de interação constante e rodar o feed de forma intensa antes do sono.",
          whenNotTo: "Se o próprio dispositivo for fonte central do disparo ansiogénico e houver histórico forte de excitação digital.",
          minWindow: "3 noites",
          minDays: 3,
          future: "Validação entre estímulo utilitário que regula e o que perturba visualmente."
        });
      }
      break;
  }

  if (proposals.length === 0) {
    proposals.push({
      id: 'prop_descompressao',
      title: "Descompressão Cognitiva Suave",
      why: "Para o padrão assinalado, gerir a passagem do estado ativo para passivo carece de regulação marginal.",
      observe: "A dificuldade em mudar de registos agitados para ações de processamento basal.",
      whenNotTo: "Semanas de exceção incontornável.",
      minWindow: "3 noites",
      minDays: 3,
      future: "Prepara a base temporal livre de perturbação antes do deitar planeado."
    });
  }

  // 2. Re-Otimização Viva com base nos Ciclos Concluídos (Aprendizagem Longitudinal)
  const learningRecords = getLearningRecords();
  if (learningRecords.length > 0 && deliverable) {
    // Propostas que o utilizador já reportou como ineficazes ou impossíveis ("ajustar" ou "trocar")
    const rejectedIds = learningRecords
      .filter(r => r.linkedAssessmentId === deliverable.assessmentId && r.finalDecision === 'REJECT_AND_REOPTIMIZE')
      .map(r => r.activeProposalId);

    if (rejectedIds.length > 0) {
      // Filtrar propostas rejeitadas, exceto se for a única que resta (fallback)
      const validProposals = proposals.filter(p => !rejectedIds.includes(p.id));
      if (validProposals.length > 0) {
        proposals = validProposals;
      } else {
        // Se todas as listadas esgotaram, fazemos fallback de contingência
        proposals = [{
          id: 'prop_fallback_regenerativo',
          title: "Controlo Passivo de Luz",
          why: "Os testes anteriores geraram atrito funcional. O passo base mais seguro e irrejeitável é fechar a componente luminosa exógena.",
          observe: "Frestas de estores ou leds espalhados no quarto que afetam a fase 1 biológica.",
          whenNotTo: "Quando existir fobia comprovada ao escuro total.",
          minWindow: "4 noites sucessivas",
          minDays: 4,
          future: "Estabelece química isolada permitindo repensar abordagens táticas nulas."
        }];
      }
    }
  }

  return proposals;
}

export function getPriorityTest(deliverable: AssessmentDeliverable): PriorityTest {
  // Always map exactly what we dynamically generated in proposals to ensure sync
  const proposals = getProposals(deliverable);
  const top = proposals[0];

  return {
    primaryProposalId: top.id,
    priorityScore: 90,
    selectionReason: `A matriz de Fase 1 assinala o padrão primordial "${deliverable.primarySleepPattern}", enquanto os teus contextos de Fase 2 validam uma tática da classe funcional adequada.`
  };
}
