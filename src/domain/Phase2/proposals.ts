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
    why: 'Os rins continuam a processar líquidos de noite. De bexiga cheia, o teu corpo acorda forçadamente, cortando a tua arquitetura de sono.',
    whenNotTo: 'Se tens medicação que força essa hidratação noturna ou outra indicação clínica contrária.',
    minWindow: '4 noites',
    minDays: 4,
    future: 'Remover o obstáculo mecânico primário antes de analisar stress subjacente.',
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
    observeWhat: 'Observa se a tua mente lutou menos ao encostar a cabeça na almofada. Procura o cansaço passivo, não o esforço de descansar.',
    reportQuestion: 'Sentiste-te menos preocupado ou forçado ao deitar?',
    checkInLabel: 'Ao final do dia seguinte',
    why: 'Adormecer não é um ato de esforço muscular. Lutar para dormir treina o teu cérebro a ligar a cama a um palco de missão de stress.',
    whenNotTo: 'Se sentires sinais de tontura extrema, não prolongues o estar em pé.',
    minWindow: '5 noites',
    minDays: 5,
    future: 'Aprender a distinguir "estar exausto mas alerta" de "pressão real de sono".',
    reviewQuestions: {
      adesao: 'Retardaste ativamente a ida para a cama até os olhos pesarem pesado?',
      dificuldade: 'Foi stressante ficar acordado pela sala em vez de tentar forçar na cama?',
      efeito: 'Quando finalmente foste para a cama, adormeceste com mais agressividade química (mais rápido)?'
    }
  },
  CONTROLO_TEMPERATURA: {
    id: 'controlo_temp',
    family: 'Ambiente Térmico',
    badge: 'Constrição Biológica',
    title: 'Arrefece ativamente o ar do quarto na hora de deitar',
    actionToday: 'Abre a janela 10 minutos antes de deitar ou baixa o radiador. O quarto deve estar frio, mas o foco devem ser meias ou edredão para aquecimento focal.',
    observe: 'A fragmentação na segunda metade da noite.',
    observeWhat: 'Repara se o teu corpo acorda a transpirar levemente pelas 3h-4h da manhã, quando o calor central se liberta.',
    reportQuestion: 'A noite decorreu de forma mais constante até de manhã?',
    checkInLabel: 'Depois da noite passada',
    why: 'Para os processos de sono profundo iniciarem (melatonina), o teu núcleo térmico tem obrigatoriamente de conseguir descartar calor para o ar frio circundante.',
    whenNotTo: 'Noites de frio extremo onde o ar refrequeça excessivamente as vias respiratórias provocando tosse.',
    minWindow: '3 noites',
    minDays: 3,
    future: 'Criar as rampas fisiológicas naturais de dissipação de calor orgânico.',
    reviewQuestions: {
      adesao: 'Fizeste questão de arrefecer o ar do quarto na hora de deitar?',
      dificuldade: 'Sentiste um frio desconfortável que te impediu de relaxar?',
      efeito: 'Tiveste menos suores noturnos ou acordaste mais fresco e contínuo?'
    }
  },
  DESCOMPRESSAO_MENTAL: {
    id: 'descompressao_mental',
    family: 'Carga Cognitiva',
    badge: 'Zona Tampão Passiva',
    title: 'Substitui tarefas urgentes por inércia neutra',
    actionToday: 'Corta com o e-mail, redes polarizantes, ou limpezas intensas às 22h. Foca-te apenas em desarrumar a mente num livro, música suave ou alongamento repetitivo.',
    observe: 'A velocidade (ou ritmo cardíaco) percebida no peito quando fechas os olhos.',
    observeWhat: 'Nesta fase não tentes perceber se adormeces; apenas nota se a "rádio" cerebral toca muito alto face à quietude do quarto.',
    reportQuestion: 'O teu batimento ao deitar esteve desacelerado perante as noites de ontem?',
    checkInLabel: 'Amanhã de manhã',
    why: 'Passar dos 100km/h diários para 0 numa fração de segundo choca mecanicamente e resulta sempre numa reentrada imediata em alerta.',
    whenNotTo: 'Emergências e semanas atípicas inevitáveis onde falhes a janela por força maior de vida.',
    minWindow: '3 noites',
    minDays: 3,
    future: 'Apoiará todo o sistema quando entrarmos em técnicas avançadas de relaxamento muscular passivo.',
    reviewQuestions: {
      adesao: 'Substituiste e-mails e tarefas urgentes por uma atividade neutra de quebra?',
      dificuldade: 'Foi impossível desligar mentalmente do trabalho ou da logística?',
      efeito: 'A velocidade do bater do coração ao encostar no quarto pareceu mais baixa?'
    }
  },
  IRREGULARIDADE_LEVANTAR: {
    id: 'irar_levantar',
    family: 'Âncora Circadiana',
    badge: 'Bloqueio de Relógio',
    title: 'Fixar radicalmente a hora de saída da cama',
    actionToday: 'Amanhã o alarme toca à hora definida e o pé tem de tocar imediatamente no chão frio. Quer tenhas dormido 4 horas ou 8 horas.',
    observe: 'A fadiga extrema nas manhãs iniciais.',
    observeWhat: 'Nota que o primeiro dia vai doer. No terceiro as tuas horas de sono noturno vão estabilizar porque a pressão vespertina acumulará inevitavelmente.',
    reportQuestion: 'Toleraste o toque do alarme sem resvalar noites inteiras passadas na cama sem dormir?',
    checkInLabel: 'No final dos 5 dias de estabilização',
    why: 'O ritmo do homem não se define pela hora a que nos tentamos obrigar a dormir, mas com a precisão pela qual o relógio central apanha luz à mesma hora exata, matinalmente.',
    whenNotTo: 'Turnos instáveis. Sob fadiga impeditiva como motorista ou em controlo de maquinaria pesada.',
    minWindow: '5 noites',
    minDays: 5,
    future: 'Sem âncora final, todas as outras táticas fisiológicas serão ilusões passageiras.',
    reviewQuestions: {
      adesao: 'Levantaste-te imediatamente ao alarme independentemente das horas dormidas?',
      dificuldade: 'A inércia e a dor física de levantar na privação agudizou muito?',
      efeito: 'A pressão para dormir natural (fome de sono) antecipou-se substancialmente à noite?'
    }
  },
  REENTRADA_DESPERTOS: {
    id: 'reent_despertos',
    family: 'Condicionamento de Quarto',
    badge: 'Quebra de Estímulo',
    title: 'Sai da cama aos primeiros sinais de frustração',
    actionToday: 'Acordaste a meio da noite. Passaram 15-20 mnts? Sentes irritação ou rodas? Sai imediatamente. Vai à sala e faz uma leitura chata sob luz ténue.',
    observe: 'O abrandamento passivo fora da cama face à ansiedade entre o colchão e os lençóis.',
    observeWhat: 'Presta estrita atenção na distinção entre estar exausto de corpo leve ou estar com pensamento afunilado pela insónia na cama.',
    reportQuestion: 'A frustração diminuiu fora do quarto?',
    checkInLabel: 'A cada despertar substancial',
    why: 'Se ficares na cama a batalhar o sono dezenas de vezes nas madrugadas, o cérebro liga as paredes do quarto involuntariamente à guerra do despertar.',
    whenNotTo: 'Idade senil, pisos escorregadios fracos no aspeto quedas ao levantar de rompante. Risco térmico de hipotermia grave.',
    minWindow: '7 noites',
    minDays: 7,
    future: 'É a base mais clínica e robusta na quebra de insónias psicofisiológicas clássicas que se alimentam a si mesmas.',
    reviewQuestions: {
      adesao: 'Saíste prontamente da cama sempre que a frustração se instalou?',
      dificuldade: 'O tempo na sala pareceu-te demorado e solitário ao quebrar o ciclo?',
      efeito: 'A cama deixou gradualmente de ser percecionada como um ringue de boxe mental?'
    }
  },
  SESTAS_TARDES: {
    id: 'sestas_pressao',
    family: 'Mecânica de Pressão',
    badge: 'Geração de Pressão',
    title: 'Elimina ou encerra os encostos diurnos',
    actionToday: 'Se fores dominado pelo cansaço entre as 16h-20h, caminha, apanha vento frio, fala. Sob hipótese alguma "encostes" os olhos dez minutos.',
    observe: 'A solidez de sono perante essas abstinências.',
    observeWhat: 'Ao manteres a fatiga acumulada ao longo da corrente do dia, as hormonas densificam. Verifica se os teus despertares diminuem.',
    reportQuestion: 'Sentiste uma quebra no meio da noite menos pronunciada ou mais sólida?',
    checkInLabel: 'No 3º dia consecutivo',
    why: 'As sestas tardias e curtas operam puramente furtando e libertando o teu bolso de Adenosina — a moeda da pressão química central — arruinando a madrugada.',
    whenNotTo: 'Na obrigatoriedade total de segurança operacional se conduzires por quilómetros contínuos.',
    minWindow: '3 noites',
    minDays: 3,
    future: 'É vital reconstruir uma parede biológica unificada de "fome de sono" para os nossos rituais base de madrugada resultarem.',
    reviewQuestions: {
      adesao: 'Resististe totalmente à tentação de encostar os olhos a meio da tarde?',
      dificuldade: 'A privação diurna retirou-te uma capacidade funcional crítica no dia-a-dia?',
      efeito: 'Notaste uma consolidação da madrugada por estares significativamente mais "esfomeado" de sono?'
    }
  },
  ALCOOL_NOTURNO: {
    id: 'alcool_rebote',
    family: 'Tóxicos e Supressores',
    badge: 'Isolamento Químico',
    title: 'Retira completamente a bebida alcoólica vespertina',
    actionToday: 'A abstenção absoluta de álcool nas 4 a 6 horas distantes de deitar é requerida esta semana.',
    observe: 'A qualidade dos teus sonhos e a fragmentação no bloco das 3 da manhã.',
    observeWhat: 'Podes conseguir adormecer até rápido e pesado pelo etanol, mas irás notar um efeito ressalto na qual a mente levanta ansiosa brutalmente a meio do ciclo celular.',
    reportQuestion: 'A tua perceção do acordar matinal pareceu minimamente mais nítida hoje e menos difusa/inquinada?',
    checkInLabel: 'Depois da primeira isenção',
    why: 'Os soníferos da categoria de barbitúricos ou do álcool sedam instintivamente os lobos cerebrais na entrada, destapando logo atrás distúrbios, arritmias e sonhos tóxicos na fase de repouso orgânico.',
    whenNotTo: 'Esta ação não prevê interações, a não ser dependência puramente clínica onde o despiste do alcool não deve ser travado abruptamente sem acompanhamento geral de psiquiatria.',
    minWindow: '5 noites',
    minDays: 5,
    future: 'Isolamento de um dos maiores falsos amigos da sonolência rápida antes de julgar a capacidade cerebral basal individual.',
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
          family: 'Limpeza Básica de Base',
          badge: 'Nível Zero Regenerativo',
          title: 'Bloquear as luzes e deitar em vácuo escuro puro',
          actionToday: 'Desliga todas as luzes azuis, esconde telemóveis, apaga fios led nos carregadores, trinta minutos antes e mergulha a divisão em escuridão tátil sem distração sensorial nenhuma prévia.',
          observe: 'Se o cansaço volta ao fim de três dias num espaço sensório isolado vazio.',
          observeWhat: 'Nota de quebra basal nas noites sem a presença residual agressiva de interações com telemóvel disfuncionais que nos impediu nos testes precedentes na tuas reações rebotadas.',
          reportQuestion: 'O teu batimento cardíaco ou reatividade relaxou substancialmente com o apagar precoce visual face a dias logados onde havias tentado meditações intermédias?',
          checkInLabel: 'A cada 2 madrugadas',
          why: 'Sempre que tudo falha perante um cronossistema alterado na pessoa, a ciência basea-se primariamente numa única solução: restaurar o primitivo da fisiologia pelo silêncio, frio restrito e ausência de fotões sobre a retina até se criar desespero químico por descompressão nas noites tardias.',
          whenNotTo: 'Extinto para as pessoas que dependem medicamente de controlos de aparelhagem sensíveis com avisadores nos blocos perto do campo da almofada em que reagem em dormência perante interrupções de vida base do seu quadro patológico.',
          minWindow: '4 noites',
          minDays: 4,
          future: 'Sem voltar ao passo natural biológico basal primordial não conseguiremos injetar mais carga tática isolada.',
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
