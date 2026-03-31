import type { AssessmentDeliverable } from './engine';
import { getLearningRecords } from '../Phase3/learningStore';

export type EnhancedProposal = {
  id: string;
  family: string;
  badge: string;
  
  title: string;
  actionToday: string;
  observe: string;
  observeWhat: string;
  reportQuestion: string;
  checkInLabel: string;
  
  why: string;
  whenNotTo: string;
  minWindow: string;
  minDays: number;
  future: string;
  
  reviewQuestions: {
    adesao: string;
    dificuldade: string;
    efeito: string;
  };
};

export type PriorityTest = {
  primaryProposalId: string;
  priorityScore: number;
  selectionReason: string;
};

// --- DICIONÁRIO COMPOSICIONAL DE MICRO-AÇÕES (SIMPLIFICADO) ---
const ACTION_LIBRARY: Record<string, EnhancedProposal> = {
  TIMING_LIQUIDOS: {
    id: 'timing_liquidos',
    family: 'Fisiologia / Ir à Casa de Banho',
    badge: 'Rotina de Noite',
    title: 'Limitar os líquidos a partir do jantar',
    actionToday: 'Evita beber sumos, chás, água ou sopas nas 2 horas antes de te deitares.',
    observe: 'A quantidade de vezes que acordas à noite.',
    observeWhat: 'Repara se as tuas idas noturnas à casa de banho diminuíram e o teu sono ficou mais seguido.',
    reportQuestion: 'Acordaste menos vezes com vontade de ir à casa de banho?',
    checkInLabel: 'Amanhã de manhã',
    why: 'Os teus rins continuam a trabalhar à noite. Com a bexiga cheia, o teu corpo acorda inevitavelmente. Vamos eliminar esta causa básica de interrupção do sono.',
    whenNotTo: 'Se tiveres necessidade médica específica de beber água à noite devido a medicação.',
    minWindow: '4 noites',
    minDays: 4,
    future: 'Remover pequenos obstáculos que prejudicam a tua noite sem dares por isso, antes de tentarmos soluções mais pesadas.',
    reviewQuestions: {
      adesao: 'Conseguiste evitar líquidos nas horas antes de dormir?',
      dificuldade: 'Sentiste muita sede e foi difícil resistir?',
      efeito: 'As tuas idas à casa de banho diminuíram com esta experiência?'
    }
  },
  PRESSAO_DORMIR: {
    id: 'pressao_dormir',
    family: 'Ansiedade com o Sono',
    badge: 'Reduzir Stresse',
    title: 'Não tentes adormecer à força',
    actionToday: 'Fica fora da cama a ler ou a relaxar até os teus olhos começarem a fechar. Não te deites só porque "chegou a hora".',
    observe: 'Como te sentes no momento em que apagas a luz.',
    observeWhat: 'Nota como o teu corpo não entra em combate com a almofada. O sono aparece naturalmente quando não o tentas controlar.',
    reportQuestion: 'Ao deitares-te apenas quando já estavas a cair de sono, sentiste menos ansiedade?',
    checkInLabel: 'Ao final do dia seguinte',
    why: 'O sono não obedece à tua vontade nem à pressão do relógio. Obrigar-te a dormir treina a tua mente a associar a cama ao stresse.',
    whenNotTo: 'Se tiveres de conduzir cedo e o sono for insuficiente. Usa o senso comum.',
    minWindow: '5 noites',
    minDays: 5,
    future: 'Isto vai ajudar-te a descobrir a hora real a que o teu corpo quer desligar.',
    reviewQuestions: {
      adesao: 'Esperaste até sentires mesmo os olhos pesados antes de ires para a cama?',
      dificuldade: 'Foi difícil ignorar o relógio enquanto as horas avançavam?',
      efeito: 'Poupaste tempo de frustração na cama quando finalmente te deitaste?'
    }
  },
  CONTROLO_TEMPERATURA: {
    id: 'controlo_temp',
    family: 'Ambiente Ideal',
    badge: 'Temperatura',
    title: 'Arrefece o quarto e usa boas mantas',
    actionToday: 'Abre a janela do quarto um pouco antes de deitares para entrar ar fresco, mas garante que ficas bem coberto e quente na cama.',
    observe: 'Se acordas de repente com calor ou suores durante a madrugada.',
    observeWhat: 'Repara como um quarto mais fresco te ajuda a manter um sono profundo e sem interrupções térmicas.',
    reportQuestion: 'Sentiste menos calor ou suores durante a noite?',
    checkInLabel: 'Amanhã de manhã',
    why: 'O teu corpo baixa a temperatura no meio da noite para dormir profundamente. Se o quarto estiver demasiado quente, o sono quebra para te tentares refrescar.',
    whenNotTo: 'Se tiveres alergias severas ao ar exterior ou se o vento causar desconforto.',
    minWindow: '3 noites',
    minDays: 3,
    future: 'Resolver despertares causados pelo calor sem precisares de outras intervenções.',
    reviewQuestions: {
      adesao: 'Garantiste que o quarto estava fresco antes de te deitares?',
      dificuldade: 'O frio incomodou-te ao adormecer?',
      efeito: 'Passaste a noite sem acordar com calor?'
    }
  },
  DESCOMPRESSAO_MENTAL: {
    id: 'descompressao_mental',
    family: 'Descompressão Final',
    badge: 'Desligar a Cabeça',
    title: 'Para de trabalhar ou ver e-mails após as 21h',
    actionToday: 'Reserva o último tempo antes de dormir para algo relaxante. A tua rotina de descanso começa antes de vestires o pijama.',
    observe: 'O teu batimento cardíaco e a tua respiração ao fechares os olhos.',
    observeWhat: 'Repara se estás menos agitado e se a tua mente não está a saltar de problema em problema.',
    reportQuestion: 'Conseguiste acalmar a mente antes de apagar a luz?',
    checkInLabel: 'Passadas 3 noites',
    why: 'Se tentares dormir logo a seguir a tarefas difíceis, o teu cérebro ainda está a "mil à hora". É preciso tempo para o motor abrandar suavemente.',
    whenNotTo: 'Apenas em emergências familiares ou profissionais inevitáveis.',
    minWindow: '3 noites',
    minDays: 3,
    future: 'Preparar uma transição suave para o sono em vez de uma quebra abrupta e stressante.',
    reviewQuestions: {
      adesao: 'Defendeste esse tempo de transição sem veres o telemóvel ou pensares em trabalho?',
      dificuldade: 'Sentiste ansiedade por não estares a resolver pendentes?',
      efeito: 'Sentiste que o teu coração e a tua mente acalmaram mais depressa ao deitar?'
    }
  },
  IRREGULARIDADE_LEVANTAR: {
    id: 'irar_levantar',
    family: 'Relógio Biológico',
    badge: 'Acordar a Horas',
    title: 'Levanta-te sempre à mesma hora',
    actionToday: 'Mesmo que tenhas dormido mal ou pouco, levanta-te mal o alarme toque. Sê rigoroso com a hora de acordar.',
    observe: 'O teu cansaço ao longo do dia e a facilidade em adormecer à noite.',
    observeWhat: 'Ao manteres a hora de acordar fixa, vais sentir um sono mais pesado e natural quando chegar a noite.',
    reportQuestion: 'Conseguiste manter a tua coragem e levantar-te logo que o alarme tocou?',
    checkInLabel: 'Aos 5 dias de rotina fixa',
    why: 'O teu ritmo interno não se acerta pela hora a que adormeces, mas sim pela hora a que acordas e vês a luz do sol. A regularidade de manhã cria sono de qualidade à noite.',
    whenNotTo: 'Se a falta de sono extrema puser em risco a tua segurança (ex: conduzir). Prioriza a tua saúde.',
    minWindow: '5 noites',
    minDays: 5,
    future: 'Estabilizar o teu relógio biológico para que o sono apareça de forma previsível e profunda.',
    reviewQuestions: {
      adesao: 'Levantaste-te logo sem ceder à tentação de ficar mais 15 minutos na cama?',
      dificuldade: 'Sentiste-te muito moído ou com tonturas devido à falta de sono inicial?',
      efeito: 'Sentiste que o sono apareceu com mais força quando chegou a hora de te deitares?'
    }
  },
  REENTRADA_DESPERTOS: {
    id: 'reent_despertos',
    family: 'O Quarto é um Templo',
    badge: 'Quebrar o Ciclo',
    title: 'Levanta-te se perderes o sono a meio da noite',
    actionToday: 'Se acordares e não conseguires voltar a dormir, sai da cama. Vai para outra divisão e faz algo calmo (como ler) até teres sono outra vez. Só aí voltas para o quarto.',
    observe: 'A diferença entre estar "cansado e pronto para dormir" e "frustrado por estar acordado".',
    observeWhat: 'Ao saíres do quarto, a irritação diminui e é mais fácil o sono voltar naturalmente.',
    reportQuestion: 'Sair e quebrar essa frustração ajudou-te a acalmar?',
    checkInLabel: 'Sempre que acordares de madrugada',
    why: 'Se passares muito tempo acordado e frustrado na cama, o teu cérebro começa a associar o quarto ao stresse. Precisamos de manter a cama apenas para o sono.',
    whenNotTo: 'Se tiveres problemas de mobilidade ou se circular pela casa no escuro for perigoso.',
    minWindow: '7 noites',
    minDays: 7,
    future: 'Cortar a ligação entre a cama e a insónia, garantindo um sono mais contínuo.',
    reviewQuestions: {
      adesao: 'Saíste da cama quando percebeste que estavas a ficar frustrado por não adormecer?',
      dificuldade: 'Foi difícil sair do conforto da cama para o frio da sala?',
      efeito: 'Sentiste que o sono voltou de forma mais natural quando regressaste à cama?'
    }
  },
  SESTAS_TARDES: {
    id: 'sestas_pressao',
    family: 'Cansaço do Dia',
    badge: 'Evitar Sestas',
    title: 'Evita dormir durante o dia',
    actionToday: 'Tenta resistir ao cansaço depois do almoço ou do trabalho. Se não dormires de dia, vais acumular a "fome de sono" necessária para dormires bem à noite.',
    observe: 'A facilidade com que adormeces à noite quando não dormes sestas.',
    observeWhat: 'Nota como o sono à noite aparece de forma mais rápida e profunda quando aguentas o dia todo acordado.',
    reportQuestion: 'Conseguiste resistir à tentação de dormir um pouco durante o tarde?',
    checkInLabel: 'Após 3 dias sem sestas',
    why: 'Cochilar durante o dia é como comer um snack antes de um grande jantar: perdes o apetite. Para dormires a fundo, precisas de chegar à noite com o "tanque" de sono cheio.',
    whenNotTo: 'Se trabalhares em turnos ou se o cansaço extremo for perigoso para as tuas tarefas diárias.',
    minWindow: '3 noites',
    minDays: 3,
    future: 'Criar uma pressão de sono forte para garantir noites seguidas e sem interrupções.',
    reviewQuestions: {
      adesao: 'Evitaste deitar-te no sofá ou fechar os olhos durante o dia?',
      dificuldade: 'Sentiste um cansaço muito pesado durante a tarde?',
      efeito: 'O teu sono à noite foi mais direto e profundo sem essas interrupções diurnas?'
    }
  },
  ALCOOL_NOTURNO: {
    id: 'alcool_rebote',
    family: 'Hábitos Noturnos',
    badge: 'Noite Limpa',
    title: 'Evita o álcool após o jantar',
    actionToday: 'Tenta não beber álcool nas horas antes de dormir durante este período de teste.',
    observe: 'A qualidade do teu despertar e a clareza dos teus sonhos.',
    observeWhat: 'Repara se acordas com mais energia e se a tua noite parece menos agitada ou fragmentada.',
    reportQuestion: 'Sentiste que o teu sono foi mais calmo sem o efeito do álcool?',
    checkInLabel: 'Após os dias sem álcool',
    why: 'O álcool pode ajudar a "apagar", mas destrói a qualidade do sono profundo. Faz com que acordes mais vezes durante a madrugada e te sintas menos descansado de manhã.',
    whenNotTo: 'Apenas se não puderes evitar em contextos sociais muito específicos, mas tenta manter a regra.',
    minWindow: '5 noites',
    minDays: 5,
    future: 'Descobrir o quanto o teu descanso melhora quando o teu corpo não está a processar álcool durante a noite.',
    reviewQuestions: {
      adesao: 'Conseguiste evitar bebidas alcoólicas antes de dormir?',
      dificuldade: 'Foi difícil abdicar desse hábito ao final do dia?',
      efeito: 'Acordaste com a cabeça mais limpa e sentiste o sono mais restaurador?'
    }
  }
};
  }
};

export function getProposals(deliverable: AssessmentDeliverable | null): EnhancedProposal[] {
  let proposals: EnhancedProposal[] = [];

  if (!deliverable) {
    return [{
      ...ACTION_LIBRARY.IRREGULARIDADE_LEVANTAR,
      id: 'prop_ancora'
    }];
  }

  // Regras de extração: mantemos as ligações biológicas tal como estavam
  switch (deliverable.primarySleepPattern) {
    case 'COMPONENTE_ORGANICA':
      if (deliverable.flags.some(f => f.includes('Noctúria') || f.includes('Bexiga') || f.includes('Líquidos'))) {
        proposals.push(ACTION_LIBRARY.TIMING_LIQUIDOS);
      }
      if (deliverable.flags.some(f => f.includes('Álcool') || f.includes('Alcool'))) {
        proposals.push(ACTION_LIBRARY.ALCOOL_NOTURNO);
      }
      if (proposals.length === 0) {
        proposals.push(ACTION_LIBRARY.CONTROLO_TEMPERATURA);
      }
      break;

    case 'REENTRADA_DESPERTAR':
      proposals.push(ACTION_LIBRARY.REENTRADA_DESPERTOS);
      break;
      
    case 'FRAGMENTACAO_MANUTENCAO':
      if (deliverable.flags.some(f => f.includes('Sestas'))) {
        proposals.push(ACTION_LIBRARY.SESTAS_TARDES);
      } else {
         proposals.push(ACTION_LIBRARY.REENTRADA_DESPERTOS);
      }
      break;

    case 'IRREGULARIDADE_HORARIOS':
      proposals.push(ACTION_LIBRARY.IRREGULARIDADE_LEVANTAR);
      break;

    case 'DIFICULDADE_ADORMECIMENTO':
    default:
      if (deliverable.dominantDrivers.includes('P1') || deliverable.dominantDrivers.includes('P2')) {
        proposals.push(ACTION_LIBRARY.PRESSAO_DORMIR);
      } else {
        proposals.push(ACTION_LIBRARY.DESCOMPRESSAO_MENTAL);
      }
      break;
  }

  if (proposals.length === 0) {
    proposals.push(ACTION_LIBRARY.DESCOMPRESSAO_MENTAL);
  }

  const learningRecords = getLearningRecords();
  if (learningRecords.length > 0 && deliverable) {
    const rejectedIds = learningRecords
      .filter(r => r.linkedAssessmentId === deliverable.assessmentId && r.shouldInfluenceFutureSelection && (r.decisionOutcome === 'switch' || r.decisionOutcome === 'adjust'))
      .map(r => r.activeProposalId);

    if (rejectedIds.length > 0) {
      const validProposals = proposals.filter(p => !rejectedIds.includes(p.id));
      if (validProposals.length > 0) {
        proposals = validProposals;
      } else {
        proposals = [{
          id: 'prop_fallback_regenerativo',
          family: 'Regresso ao Essencial',
          badge: 'Acalmar o Espaço',
          title: 'Acalma os sentidos: escuro total e silêncio',
          actionToday: 'Desliga todas as luzes e ecrãs no quarto. Garante que fechas bem as persianas e tentas não usar o telemóvel na cama.',
          observe: 'O relaxamento ao estares num ambiente sem luz nem ruído.',
          observeWhat: 'Repara como no escuro total o teu corpo pede sono naturalmente, sem seres acordado por luzes ou notificações.',
          reportQuestion: 'Sentiste que o ambiente mais calmo e escuro te ajudou a adormecer melhor?',
          checkInLabel: 'Amanhã de manhã',
          why: 'Quando a rotina está muito agitada, o melhor é voltar ao básico: o silêncio e o escuro total ajudam o teu cérebro a desligar e a entrar no modo de descanso sem distrações.',
          whenNotTo: 'Se o escuro total representar um risco de queda ou se tiveres crianças pequenas que precisem de vigilância.',
          minWindow: '4 noites',
          minDays: 4,
          future: 'Esta base de silêncio e escuro é essencial para protegeres a qualidade das tuas madrugadas.',
          reviewQuestions: {
            adesao: 'Conseguiste livrar-te das luzes e garantir um quarto completamente escuro?',
            dificuldade: 'Foi difícil desligares-te dos ecrãs antes de dormir?',
            efeito: 'Sentiste que adormeceste com mais calma e sem as interrupções do costume?'
          }
        }];
      }
    }
  }

  return proposals;
}

export function getPriorityTest(deliverable: AssessmentDeliverable): PriorityTest {
  const proposals = getProposals(deliverable);
  const top = proposals[0];

  return {
    primaryProposalId: top.id,
    priorityScore: 90,
    selectionReason: `Focámo-nos na área "${deliverable.primarySleepPattern}" porque é a tua prioridade atual.`
  };
}
