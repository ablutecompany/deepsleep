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

// --- DICIONÁRIO COMPOSICIONAL DE MICRO-AÇÕES ---
const ACTION_LIBRARY: Record<string, EnhancedProposal> = {
  TIMING_LIQUIDOS: {
    id: 'timing_liquidos',
    family: 'Fisiologia / Urgência',
    badge: 'Fator Mecânico Diário',
    title: 'Limita os líquidos a partir do jantar',
    actionToday: 'Evita sumos, chás, água ou sopa nas 2 horas finais antes de te deitares.',
    observe: 'Se acordas menos vezes durante a madrugada.',
    observeWhat: 'Repara se a típica ida à casa de banho deixa de quebrar o meio da tua noite e se os despertares diminuem.',
    reportQuestion: 'Houve menos interrupções pelo teu próprio corpo?',
    checkInLabel: 'Amanhã de manhã',
    why: 'Os rins continuam a trabalhar se beberes água tarde. De bexiga cheia, o teu corpo acorda forçadamente, quebrando a tua noite de sono.',
    whenNotTo: 'Se tens medicação que força hidratação noturna ou outra indicação médica contrária.',
    minWindow: '4 noites',
    minDays: 4,
    future: 'Remover esta interrupção natural antes de culparmos a ansiedade ou o stress.',
    reviewQuestions: {
      adesao: 'Conseguiste cortar totalmente os líquidos nas 2 horas antes de deitar?',
      dificuldade: 'Foi muito difícil suportar a sede ao final do dia?',
      efeito: 'Acordaste menos vezes de madrugada com vontade de urinar?'
    }
  },
  PRESSAO_DORMIR: {
    id: 'pressao_dormir',
    family: 'Vigilância / Ansiedade',
    badge: 'Abrandamento de Expectativa',
    title: 'Não tentes adormecer mais cedo à força',
    actionToday: 'Atrasa voluntariamente a hora de deitar. Fica a ler no sofá com luz fraca até os olhos pesarem. Não te deites apenas "por ser hora".',
    observe: 'A sensação de alerta quando a luz do quarto apaga.',
    observeWhat: 'Nesta noite foca-te em não tentar forçar o sono. Deixa ele vir. Sente se a tua cabeça lutou menos quando a pousaste.',
    reportQuestion: 'Sentiste-te menos preocupado com a necessidade de ter de adormecer logo?',
    checkInLabel: 'Ao final do dia seguinte',
    why: 'Adormecer não é um esforço que controles à força. Lutar para dormir treina o teu cérebro a ligar a cama a um lugar de stress.',
    whenNotTo: 'Se sentires sinais de tontura extrema, não prolongues o estar em pé.',
    minWindow: '5 noites',
    minDays: 5,
    future: 'Aprender a perceber quando o teu corpo está fisicamente pronto para apagar, e não apenas fadigado.',
    reviewQuestions: {
      adesao: 'Ficaste de fora da cama a fazer tempo até os olhos pesarem mesmo?',
      dificuldade: 'Foi muito difícil ou stressante não te deitares logo?',
      efeito: 'Quando finalmente foste para a cama, adormeceste com mais facilidade ou naturalidade?'
    }
  },
  CONTROLO_TEMPERATURA: {
    id: 'controlo_temp',
    family: 'Ambiente Térmico',
    badge: 'Rotina Térmica',
    title: 'Arrefece um bocado o quarto antes de ias dormir',
    actionToday: 'Abre a janela 10 minutos antes de deitar (ou usa o AC). O ar deve estar mais frio, mas podes tapar-te bem com o edredão ou meias.',
    observe: 'Acordas com suores de madrugada?',
    observeWhat: 'Repara se acordas a transpirar levemente pelas 3h-4h da manhã e se tens de puxar os lençóis para fora.',
    reportQuestion: 'A noite foi mais inteira e sem suores repentinos?',
    checkInLabel: 'Depois da noite passada',
    why: 'Para o sono profundo começar, o teu corpo precisa de arrefecer e mandar o calor corporal para o ar mais fresco do quarto.',
    whenNotTo: 'Se o frio for desconfortável, dar tosse forte ou se viveres em clima já extremo.',
    minWindow: '3 noites',
    minDays: 3,
    future: 'Ajudar o teu corpo a baixar a temperatura de forma natural e suave, puxando o sono contínuo.',
    reviewQuestions: {
      adesao: 'Fizeste questão de arrefecer o ar do quarto na hora de deitar?',
      dificuldade: 'Sentiste um frio desconfortável que te impediu de relaxar?',
      efeito: 'Tiveste menos suores noturnos ou acordaste mais fresco e contínuo?'
    }
  },
  DESCOMPRESSAO_MENTAL: {
    id: 'descompressao_mental',
    family: 'Carga Cognitiva',
    badge: 'Quebra Base de Dia',
    title: 'Evita tarefas urgentes ou limpar a casa depois das 22h',
    actionToday: 'Corta com o e-mail, redes sociais de debates, ou lidas intensas antes de dormir. Ocupa as mãos com livro, um chá ou música calma.',
    observe: 'A sensação de aceleração do coração quando fechas os olhos na cama.',
    observeWhat: 'Não fiques obcecado a ver se adormeces de pressa. Apenas nota se o peito ou a cabeça não parecem uma rádio aos altos gritos.',
    reportQuestion: 'O teu batimento pareceu-te mais calmo comparado aos dias em que trabalhas até tarde?',
    checkInLabel: 'Amanhã de manhã',
    why: 'Se parares o carro de repente quando levas 100km/h diários, o motor não arrefece instantaneamente: a tua cabeça salta diretamente de volta ao alerta.',
    whenNotTo: 'Em dias de verdadeira emergência (filhos a chorar, prazos absolutos finais de trabalho) em que nem tens escolha.',
    minWindow: '3 noites',
    minDays: 3,
    future: 'Serão a tua pista de aterragem natural, muito útil para domares os picos de stress do dia antes de embateres na cama.',
    reviewQuestions: {
      adesao: 'Substituiste e-mails e tarefas urgentes por uma atividade neutra de quebra?',
      dificuldade: 'Foi impossível desligar mentalmente do trabalho ou da logística?',
      efeito: 'A velocidade do bater do coração ao encostar no quarto pareceu mais baixa?'
    }
  },
  IRREGULARIDADE_LEVANTAR: {
    id: 'irar_levantar',
    family: 'Âncora Circadiana',
    badge: 'Consistência de Manhã',
    title: 'Levanta-te estritamente à mesma hora todos os dias',
    actionToday: 'Sempre que o alarme tocar, levanta-te logo. Literalmente sentar e por o pé no chão. Quer tenhas dormido pessimamente 4 horas ou otimamente 8 horas.',
    observe: 'O peso e a fadiga enorme nas manhãs dos dois primeiros dias.',
    observeWhat: 'Os primeiros dias custam muito porque acordas cansado. Mas ao fixares o despertar, a fome de sono noturna começa a agrupar perfeitamente.',
    reportQuestion: 'Aguentaste o toque do alarme e saíste logo (sem ficares às voltas para recuperar)?',
    checkInLabel: 'Ao final do 5º dia de tentar estabilizar',
    why: 'O ritmo do homem acerta-se melhor pela rotina matinal (quando o relógio biológico cruza com a luz solar) e não por te obrigares a ir para a cama à força de noite.',
    whenNotTo: 'Se trabalhas por turnos irregulares à noite ou se o cansaço matar o teu rigor se tiveres de conduzir autocarros/camiões na manhã seguinte.',
    minWindow: '5 noites',
    minDays: 5,
    future: 'Dar ao teu corpo um fuso-horário previsível para a tua energia assentar.',
    reviewQuestions: {
      adesao: 'Levantaste-te imediatamente ao alarme independentemente das horas dormidas?',
      dificuldade: 'A inércia e a dor física de levantar na privação agudizou muito?',
      efeito: 'A pressão para dormir natural (fome de sono) antecipou-se substancialmente à noite?'
    }
  },
  REENTRADA_DESPERTOS: {
    id: 'reent_despertos',
    family: 'Condicionamento de Quarto',
    badge: 'Mudar de Cenário',
    title: 'Levanta-te da cama aos primeiros sinais de chatear',
    actionToday: 'Acordaste a meio da noite e não fechas o olho há já uns 20 minutos? Estás sem pingo de sono e a desesperar? Sai do quarto. Vai à sala e lê sob luz muito fraquinha.',
    observe: 'Presta atenção à calma e ao tédio que vais sentir no sofá da sala face à agitação que sentias na cama.',
    observeWhat: 'Aprende a diferenciar estares "pesado e ensonado de olhos fechados na cama" e estares "zangado(a) com a vida porque são 4 da manhã e não dormes e passas a vida aos tombos no colchão".',
    reportQuestion: 'O nervosismo por não dormir deu lugar a um certo tédio neutro passivo quando abandonaste a cama?',
    checkInLabel: 'Sempre que perderes o sono da madrugada',
    why: 'Se passares dezenas de madrugadas às voltas nos lençóis sem dormir a sofrer por horas, o cérebro afina-se e liga o quarto à frustração de não dormires.',
    whenNotTo: 'Se fores mais sensível a quebras de tensão ao levantar derrepente a meio da noite ou com idades com risco mais passivo para quedas caseiras se o chão não tiver iluminação.',
    minWindow: '7 noites',
    minDays: 7,
    future: 'É a fórmula de ouro absoluta para evitar que um pequeno sobressalto noturno dure semanas encostado a esse próprio stress psicológico auto-gerado.',
    reviewQuestions: {
      adesao: 'Saíste prontamente da cama sempre que a frustração se instalou?',
      dificuldade: 'O tempo na sala pareceu-te demorado e solitário ao quebrar o ciclo?',
      efeito: 'A cama deixou gradualmente de ser percecionada como um ringue de boxe mental?'
    }
  },
  SESTAS_TARDES: {
    id: 'sestas_pressao',
    family: 'Mecânica de Pressão',
    badge: 'Guarda o Cansaço',
    title: 'Elimina totalmente os encostos e as sestas curtas do dia',
    actionToday: 'Bateu o cansaço pesado entra as 16h e as 20h? Caminha um bocadinho, lava as mãos com água fria e conversa. Não "feches os olhos para descansar 10 minutos" no sofá.',
    observe: 'A integridade da tua proxima paragem debaixo dos lençóis passadas as próximas 6 horas desse pico de privação aguentado de tarde.',
    observeWhat: 'Guarda toda a exaustão acumulada do dia num cesto e entrega-a à noite.',
    reportQuestion: 'Sentiste um embalo para adormecer mais inteiro na ausência da soneca intermédia de hoje?',
    checkInLabel: 'Ao 3º dia consecutivo sem cochilar à tarde',
    why: 'Qualquer fechar de olhos após as 14h devora grande parte das tuas hormonas mensageiras de sono noturno furtadas, como se estivesses a comer um bolo calórico às escondidas do "Fome" antes de te sentares na mesa farta pelas 20h para janatar.',
    whenNotTo: 'Quem passa a conduzir centenas de kms que necessita imperativamente das pequenas miniaturas micro-sestas curtas salva-vidas obrigatórias na estação de serviço na segurança em fadiga imensa.',
    minWindow: '3 noites',
    minDays: 3,
    future: 'Ajudar aos ritos dos desesperos de acordar de madrugadas pelo facto que quem passa do limiar, se cansa imensamente mais, dormindo o resto contíuamente pesadamente.',
    reviewQuestions: {
      adesao: 'Resististe totalmente à tentação de encostar os olhos a meio da tarde?',
      dificuldade: 'A privação diurna retirou-te uma capacidade funcional crítica no dia-a-dia?',
      efeito: 'Notaste uma consolidação da madrugada por estares significativamente mais "esfomeado" de sono?'
    }
  },
  ALCOOL_NOTURNO: {
    id: 'alcool_rebote',
    family: 'Estimulantes Ocultos',
    badge: 'Sobriedade Certa',
    title: 'Nenhum álcool 4h horas antes de deitar',
    actionToday: 'Evitar aquele último copo de vinho ou de digestivo horas coladas à tua hora de entrar na cama nestas próximas noites cruciais deste teste fechado.',
    observe: 'Os minutos da noite a partir as 3 e meia em especial o ressalto em suores da mente agitada subitamente e vividamente.',
    observeWhat: 'Como a abstenção permite aos sonhos não se esmagarem nos cantos noturnos da memória para de seguida esbarrarem ressaltados contra acorda-derrepêntes agitando.',
    reportQuestion: 'Quando acordas hoje para a vida e lavaste as faces, sentes o interior não tão ensombrado face antes, mas um pouco limpo nas partes da nitidez e descanso contínuo de manhã?',
    checkInLabel: 'Depois dessas isenções puras completas feitas',
    why: 'Muitos deitam abaixo a pessoa, porque sedam para indução ao relaxar com amigos e em jantares; infelicemente os metabolitos na digestão hepática fragmentam no meio da noite acordando abruptamente ou tornando os sonhos num caos frenético intermitente das meias da noite.',
    whenNotTo: 'Casos médicos severos onde um "desmame rápido absoluto" ressalte em perigos sem o apoio dos profissionais no processo abstinêncial e agitando sem os controlarem.',
    minWindow: '5 noites',
    minDays: 5,
    future: 'Poder avaliar francamente perante esta remoção destas "aditivas relaxadoras de falso efeito longo" a tua autêntica verdadeira fundação do descanso sem os encobrimentos químicos da moda de socialização.',
    reviewQuestions: {
      adesao: 'Suprimiste totalmente a bebida alcoólica vespertina ou de indução de noite?',
      dificuldade: 'Este corte logístico na rotina social provocou-te atrito?',
      efeito: 'O sentimento geral de nitidez celular de manhã revelou-se mais purificado?'
    }
  }
};


export function getProposals(deliverable: AssessmentDeliverable | null): EnhancedProposal[] {
  let proposals: EnhancedProposal[] = [];

  // Fallback se não há deliverable base ativo ou dados em cruzeiro de segurança insuficiente
  if (!deliverable) {
    return [{
      ...ACTION_LIBRARY.IRREGULARIDADE_LEVANTAR,
      id: 'prop_ancora'
    }];
  }

  // Composição Contextual do Engine Fase 2 -> Extração Dinâmica com base num pool central expandido em ACTION_LIBRARY
  switch (deliverable.primarySleepPattern) {
    case 'COMPONENTE_ORGANICA':
      if (deliverable.flags.some(f => f.includes('Noctúria') || f.includes('Bexiga') || f.includes('Líquidos'))) {
        proposals.push(ACTION_LIBRARY.TIMING_LIQUIDOS);
      }
      if (deliverable.flags.some(f => f.includes('Álcool') || f.includes('Alcool'))) {
        proposals.push(ACTION_LIBRARY.ALCOOL_NOTURNO);
      }
      if (proposals.length === 0) {
        proposals.push(ACTION_LIBRARY.CONTROLO_TEMPERATURA); // organic default
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
        proposals.push(ACTION_LIBRARY.PRESSAO_DORMIR); // Expectativa e ansiedade
      } else {
        proposals.push(ACTION_LIBRARY.DESCOMPRESSAO_MENTAL); // Carga pesada e luz/telas
      }
      break;
  }

  // Prevenir que um fallback em arrays fique vazio
  if (proposals.length === 0) {
    proposals.push(ACTION_LIBRARY.DESCOMPRESSAO_MENTAL);
  }

  // Re-Otimização Longitudinal Viva
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
        // Fallback blindado se todas falharam - Fallback regenerativo
        proposals = [{
          id: 'prop_fallback_regenerativo',
          family: 'Regresso ao Essencial',
          badge: 'Reset Diário Real',
          title: 'Bloquear as luzes e repousar em escuro total e silêncio',
          actionToday: 'Desliga as luzes azuis e corta todos os ecrãs (telemóvel inclusive), 30 minutos antes. Prepara te para deitar no teu quarto completamente mergulhado num resguardo livre de barulhos, apitos, fotões de led encarnados nos televisores suspensos, em perfeita calmaria de sombras absolutas sensoriais escuras quietas isoladas.',
          observe: 'Se o aborrecimento dá aso passadas algumas dúzias de dezenas a um eventual deitar exausto passivo final tranquilo na sombra calma.',
          observeWhat: 'Nota como, nestas condições destituídas de interrupções frenéticas e notificações ou luminosidades fortes, a mente simplesmente quebra e baixa o ritmo a solo sem tu nem dares pelos teus batimentos perante a tua paz natural interior orgânica limpa e honesta do meio.',
          reportQuestion: 'Os minutos perante as paredes neutras às escuras fizeram ressaltar, que no final abertamente ao render-se que tiveste menos luta em comparação sem luzes acesas te induzir de antemão exausto logo por adormecers?',
          checkInLabel: 'Ao 3º ou 4º de ensaio',
          why: 'Sempre que tudo encrava as rodas na cabeça à pressa com tentativas em rotinárias e complexas que fracassaram noutros passos, tudo converge numa fórmula intemporal humana: remover o estímulo totalmente antes da sintonização com os limites e ritmos primitivos ancestrais nossos e originais ao dormir repousando puramente em repouso visual limpo até clarejar de sono o encosto por desgaste biológico basal instintivo do deitar tarde descansado.',
          whenNotTo: 'Extinto para acompanhamentos neonatais obrigatórios perante as berços nas mesas e os recém nascidos cujos berros precisem luz de alerta imediata acessória visual em segurança imperiosa sem atrasões dos paises cegarem atoupações por divisões escuríssimas.',
          minWindow: '4 noites',
          minDays: 4,
          future: 'Sem acalmarmos o turbilhão externo da rotina hiper-ativada por meio, reatando de base com um quarto imersivo isento isolado primitivo intemporal natural não conseguiremos testar abordagens avançadas.',
          reviewQuestions: {
            adesao: 'Submeteste-te de forma consistente a uma escuridão rígida antes do sono?',
            dificuldade: 'O aborrecimento ou ansiedade noturna multiplicou contra o esvaziamento?',
            efeito: 'O restabelecimento do silêncio isolado repôs alguma pressão basilar na paragem biológica?'
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
    selectionReason: `A fase de contexto revelou um padrão do tipo "${deliverable.primarySleepPattern}", ligando mecanicamente ao teste primordial.`
  };
}
