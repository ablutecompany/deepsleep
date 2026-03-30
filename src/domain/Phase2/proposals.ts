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
      title: "Acordar sempre à mesma hora",
      why: "Como ainda não temos os teus dados completos, o passo mais testado e seguro é criares um horário inegociável para sair da cama. Isso força o teu relógio biológico a regular aos poucos.",
      observe: "A resistência inicial em sair da cama. O cansaço a meio do dia.",
      whenNotTo: "Se trabalhas por turnos ou se a fadiga colocar em risco a tua segurança na condução.",
      minWindow: "5 noites",
      minDays: 5,
      future: "Garante que o relógio interno estabiliza antes de testarmos o resto do ambiente."
    });
    return proposals;
  }

  // 1. REGRA 3: Tratar Funcionalmente as Famílias com base na árvore da Fase 1
  switch (deliverable.primarySleepPattern) {
    case 'COMPONENTE_ORGANICA':
      if (deliverable.flags.some(f => f.includes('Noctúria'))) {
        proposals.push({
          id: 'prop_hidrica',
          title: "Ajustar líquidos ao fim do dia",
          why: "O teu registo diz que acordas muitas vezes. Isso pode ser provocado pela simples vontade de ir à casa de banho, o que corta ciclos vitais do sono. Bebe mais de dia e menos depois de jantar.",
          observe: "Presta atenção a despertares logo após acabares ciclos ou depois de jantar.",
          whenNotTo: "Se o teu médico recomendou de forma estrita, ou tens medicação que força esse consumo de noite.",
          minWindow: "4 noites",
          minDays: 4,
          future: "Reduz idas desnecessárias à casa de banho que fragmentam a noite mecanicamente."
        });
      }
      if (deliverable.proposalConstraints.some(c => c.includes('Dor'))) {
        proposals.push({
          id: 'prop_ergo',
          title: "Controlar desconforto físico",
          why: "Sinalizaste dores como entrave grave no teu histórico de noites. O teu corpo acorda para evitar dor pela posição ou colchão errados. Foca nesta correção de posição e suporte base.",
          observe: "A relação entre as tuas posturas ao deitar e o momento preciso em que acordas a meio.",
          whenNotTo: "Se tens um limite rigoroso imposto por ortopedista ou médico para certas posturas.",
          minWindow: "3 noites",
          minDays: 3,
          future: "Previne que seja o teu corpo a forçar a interrupção biológica a meio da noite."
        });
      }
      break;

    case 'REENTRADA_DESPERTAR':
    case 'FRAGMENTACAO_MANUTENCAO':
      proposals.push({
        id: 'prop_levantar',
        title: "Levantar da cama se não adormecer",
        why: "Estar na cama acordado a lutar contra os pensamentos treina o teu cérebro a ligar o quarto ao stress. Se passaram 20 minutos e não dormes, levanta-te e lê num lugar com pouca luz até teres sono.",
        observe: "Tenta perceber em que ponto a tua tentativa de dormir vira irritação e frustração real.",
        whenNotTo: "Se ao levantares acordares familiares ou se houver risco sério de quedas.",
        minWindow: "5 noites",
        minDays: 5,
        future: "Quebra a associação tóxica entre a tua própria almofada e estado de alerta acelerado."
      });
      break;

    case 'IRREGULARIDADE_HORARIOS':
      proposals.push({
        id: 'prop_ancora_horaria',
        title: "Impor uma hora restrita para deitar",
        why: "A ausência total de ritmo bloqueia a libertação de substâncias naturais. Tenta respeitar um horário âncora de encerramento, para o teu corpo perceber que o dia finalmente acabou.",
        observe: "Sê franco a perceber o número de noites onde a hora final esticou sem razão útil real.",
        whenNotTo: "Se estás confinado a turnos dinâmicos por trabalho que não podes evitar.",
        minWindow: "7 noites",
        minDays: 7,
        future: "Deixa o teu corpo ter um alvo físico diário onde programar o cansaço."
      });
      break;

    case 'DIFICULDADE_ADORMECIMENTO':
    default:
      if (deliverable.dominantDrivers.includes('P1') || deliverable.dominantDrivers.includes('P2')) {
        proposals.push({
          id: 'prop_foco_passivo',
          title: "Não lutes: substitui o telemóvel por algo neutro",
          why: "Se precisas do ecrã para atuar contra o aborrecimento, tenta pelo menos não alimentar conversas, ou ler notícias ansiosas. Troca tudo por um e-reader fixo ou documentário longo aborrecido.",
          observe: "Avalia a tua ansiedade de querer dar sempre 'só mais um scroll' ou responder mensagens tarde.",
          whenNotTo: "Se o simples pegar num ecrã já disparar dor de cabeça intensa ou se isso perturbar o sono grave.",
          minWindow: "3 noites",
          minDays: 3,
          future: "Abrandar radicalmente a estimulação ativa, e focar em conteúdos passivos que causem tédio ou paz."
        });
      }
      break;
  }

  if (proposals.length === 0) {
    proposals.push({
      id: 'prop_descompressao',
      title: "Cortar tarefas a meia-luz antes de deitar",
      why: "Tenta não saltar de limpezas profundas, e-mails de trabalho ou stress agudo direto para dentro dos lençóis numa fração de segundo. Isso nunca resulta. Define 30 minutos de paz forçada, com luz fraca.",
      observe: "A velocidade e stress mental que levas quando dás por ti a deitar, o chamado 'acelerar até parar'.",
      whenNotTo: "Semanas atípicas onde não tiveste rigorosamente margem nas 24 horas por razões incontornáveis.",
      minWindow: "3 noites",
      minDays: 3,
      future: "O abrandamento passivo treina quimicamente o cansaço."
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
          title: "Bloquear a luz no quarto escuro",
          why: "Todos os testes anteriores foram incompatíveis com o teu estilo. O passo base irredutivel e irrejeitável que nos resta é tapar todas as frinchas e luzes azuis agressivas de carregadores e tentar dormir em paz térmica e visual pura.",
          observe: "Olha para os leds ou candeeiros de rua que cortaram a escuridão enquanto esticavas as noites.",
          whenNotTo: "Se for de todo impossível desligar equipamento médico com pequenas luzes no recinto ou se tiveres fobias extremas impeditivas.",
          minWindow: "4 noites",
          minDays: 4,
          future: "Recria o vazio inicial do quarto puro para rever a base, antes dos constrangimentos que forçamos antigamente."
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
