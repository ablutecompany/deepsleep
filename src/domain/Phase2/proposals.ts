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
          title: "Cronometria e Restrição Hídrica à Noite",
          why: "A fragmentação provada deve-se primariamente à pressão vesical que o cérebro tenta atender, roubando coesão.",
          observe: "A distribuição real dos teus mililitros ingeridos (muitos utentes compensam secas diurnas empurrando água para a ceia).",
          whenNotTo: "Estiveres a tomar medicação noturna que exige trato molhado.",
          minWindow: "4 noites sucessivas",
          minDays: 4,
          future: "Permite eliminar da equação o falso 'Acorda por ansiedade' e focar na mecânica do órgão."
        });
      }
      if (deliverable.proposalConstraints.some(c => c.includes('Dor'))) {
        proposals.push({
          id: 'prop_ergo',
          title: "Eliminação e Reposicionamento Físico",
          why: "O impacto mecânico e articular está a vencer a intenção biológica de paralisação no sono (atonia).",
          observe: "Exatamente qual a transição de perna ou braço que interrompe o delta profundo.",
          whenNotTo: "Já estares sob reabilitação ativa conflituante.",
          minWindow: "3 noites seguidas",
          minDays: 3,
          future: "O corpo precisa deixar de ser o vigilante primário de ti próprio."
        });
      }
      break;

    case 'REENTRADA_DESPERTAR':
    case 'FRAGMENTACAO_MANUTENCAO':
      proposals.push({
        id: 'prop_levantar',
        title: "Tática de Dissociação Condicionada (Sair da Cama)",
        why: "A tua medição prova que ficas refém da madrugada no escuro. A almofada começa a servir ao cérebro como 'Gabinete de Resolução de Problemas' e perdes o sinal de adormecimento.",
        observe: "A negociação mental que fazes para continuar lá deitado à força.",
        whenNotTo: "O impacto no resto da casa for perturbador ou a temperatura do domicílio inibir a saída de forma doente.",
        minWindow: "5 dias",
        minDays: 5,
        future: "Impede a cronificação do pânico secundário, devolvendo neutralidade tátil ao colchão."
      });
      break;

    case 'IRREGULARIDADE_HORARIOS':
      proposals.push({
        id: 'prop_ancora_horaria',
        title: "Estipular Barreira de Fecho Central",
        why: "Os turnos ou falhas de rotina impedem a criação da melatonina orgânica às horas habituais. Forçar ritmos noturnos exatos não vai funcionar se estipulares apenas a hora de adormecer.",
        observe: "Como tentas justificar continuar ativo mesmo não tendo turno marcado.",
        whenNotTo: "Semana sem margem com chamadas aleatórias madrugadoras obrigatórias.",
        minWindow: "7 dias seguidos",
        minDays: 7,
        future: "Reseta o relógio circadiano."
      });
      break;

    case 'DIFICULDADE_ADORMECIMENTO':
    default:
      if (deliverable.dominantDrivers.includes('P1') || deliverable.dominantDrivers.includes('P2')) {
        proposals.push({
          id: 'prop_foco_passivo',
          title: "Substituição para Carga Cognitiva Neutra",
          why: "O cérebro demora a abrandar. Se o ecrã funciona para ti como pacificador visual, reduz-lhe apenas a taxa de input imprevisível. Substitui 'scroll infinito' por conteudos lineares (séries antigas, podcasts lentos).",
          observe: "A vontade imediata de rodar rápido o conteúdo. A mudança de foco.",
          whenNotTo: "Nunca conseguiste usar ecrãs pacificamente.",
          minWindow: "3 noites",
          minDays: 3,
          future: "Teste de separação entre 'Estimula' e 'Regula' comportamental."
        });
      }
      break;
  }

  // Falback caso nenhuma entre (raro, pois default cobre DIFICULDADE e o resto foi mapeado)
  if (proposals.length === 0) {
    proposals.push({
      id: 'prop_descompressao',
      title: "Descompressão Activa Isolada",
      why: "Para o teu padrão, existe uma componente residual emocional a filtrar.",
      observe: "Irritabilidade não gerida durante o dia.",
      whenNotTo: "Dias caóticos impossíveis.",
      minWindow: "3 noites",
      minDays: 3,
      future: "Trabalhar rampa de acesso."
    });
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
