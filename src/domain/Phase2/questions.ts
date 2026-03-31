export type QuestionType = 'single_choice' | 'multi_choice';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: Option[];
}

export function getQuestionsForMode(mode: 10 | 25): string[] {
  // Pool 1: Onset & Anxiety
  const p1 = ['Q11', 'Q12', 'Q13', 'Q16', 'Q17', 'Q19', 'Q21', 'Q23', 'Q25'];
  // Pool 2: Maintenance & Waking
  const p2 = ['Q02', 'Q10', 'Q20', 'Q22', 'Q04', 'Q05'];
  // Pool 3: Routine/Schedule/Deceleration
  const p3 = ['Q26', 'Q29', 'Q30', 'Q33', 'Q36', 'Q39'];
  // Pool 4: Emotion/Mental load/Relations
  const p4 = ['Q42', 'Q43', 'Q47', 'Q49', 'Q53', 'Q54'];
  // Pool 5: Physical Discomfort/Environment/Substances
  const p5 = ['Q56', 'Q57', 'Q58', 'Q61', 'Q63', 'Q73', 'Q77'];
  // Pool 6: Chronicity & Evaluation
  const p6 = ['Q82', 'Q84', 'Q86', 'Q93', 'Q99'];

  const shuffle = (array: string[]) => {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Memory Rotation Logic
  let recentIds: string[] = [];
  try {
    const rawCache = localStorage.getItem('deepsleep-phase2-storage');
    if (rawCache) {
      const parsed = JSON.parse(rawCache);
      if (parsed?.state?.deliverable?.selectedQuestionIds) {
        recentIds = parsed.state.deliverable.selectedQuestionIds;
      }
    }
  } catch (e) {}

  const draw = (pool: string[], count: number) => {
    const fresh = pool.filter(id => !recentIds.includes(id));
    const recent = pool.filter(id => recentIds.includes(id));
    const orderedPool = [...shuffle(fresh), ...shuffle(recent)];
    return orderedPool.slice(0, count);
  };

  if (mode === 10) {
    return [
      'Q03', // Anchor: Baseline state at bedtime
      ...draw(p1, 2),
      ...draw(p2, 2),
      ...draw(p3, 1),
      ...draw(p4, 1),
      ...draw(p5, 2),
      ...draw(p6, 1)
    ];
  }

  return [
    'Q03', 'Q06', // Anchors
    ...draw(p1, 4),
    ...draw(p2, 4),
    ...draw(p3, 4),
    ...draw(p4, 3),
    ...draw(p5, 5),
    ...draw(p6, 3)
  ];
}

export const QUESTIONS_BANK: Record<string, Question> = {
  Q01: {
    id: 'Q01',
    type: 'single_choice',
    text: 'Quando pensas numa noite “boa”, o que costuma estar diferente?',
    options: [
      { id: 'A', text: 'Corpo desliga mais depressa' },
      { id: 'B', text: 'Cabeça vem mais calma' },
      { id: 'C', text: 'O dia foi mais leve' },
      { id: 'D', text: 'Houve menos interrupções à volta' },
      { id: 'E', text: 'Não noto um padrão claro' }
    ]
  },
  Q02: {
    id: 'Q02',
    type: 'single_choice',
    text: 'Nas noites mais difíceis, qual é normalmente a primeira coisa que sentes que falha?',
    options: [
      { id: 'A', text: 'Demoro a adormecer' },
      { id: 'B', text: 'Adormeço, mas acordo a meio' },
      { id: 'C', text: 'Acordo cedo demais' },
      { id: 'D', text: 'Durmo, mas não descanso' },
      { id: 'E', text: 'Não consigo dizer' }
    ]
  },
  Q03: {
    id: 'Q03',
    type: 'single_choice',
    text: 'Quando te deitas, a sensação mais habitual é:',
    options: [
      { id: 'A', text: 'Já estou pronto para dormir' },
      { id: 'B', text: 'O corpo está cansado, mas a cabeça não' },
      { id: 'C', text: 'Ainda estou “preso” ao dia' },
      { id: 'D', text: 'Tenho receio de como a noite vai correr' },
      { id: 'E', text: 'Depende muito do dia' }
    ]
  },
  Q04: {
    id: 'Q04',
    type: 'single_choice',
    text: 'Qual destas frases se aproxima mais de ti?',
    options: [
      { id: 'A', text: 'O meu sono piora quando levo o dia comigo para a cama' },
      { id: 'B', text: 'O meu sono piora quando o meu corpo incomoda' },
      { id: 'C', text: 'O meu sono piora quando o ambiente falha' },
      { id: 'D', text: 'O meu sono piora sem razão evidente' },
      { id: 'E', text: 'O meu sono é quase sempre igual' }
    ]
  },
  Q05: {
    id: 'Q05',
    type: 'single_choice',
    text: 'Quando uma noite corre mal, no dia seguinte costumas pensar:',
    options: [
      { id: 'A', text: '“Era previsível”' },
      { id: 'B', text: '“Houve algo que me ativou”' },
      { id: 'C', text: '“O meu corpo não ajudou”' },
      { id: 'D', text: '“Sei que isto vai repetir-se”' },
      { id: 'E', text: '“Nem sempre percebo porquê”' }
    ]
  },
  Q06: {
    id: 'Q06',
    type: 'single_choice',
    text: 'Se tivesses de apontar a origem mais provável do problema, para onde olharias primeiro?',
    options: [
      { id: 'A', text: 'Para a minha cabeça' },
      { id: 'B', text: 'Para o meu corpo' },
      { id: 'C', text: 'Para a minha rotina' },
      { id: 'D', text: 'Para o meu contexto / casa / relações' },
      { id: 'E', text: 'Para várias coisas ao mesmo tempo' }
    ]
  },
  Q07: {
    id: 'Q07',
    type: 'single_choice',
    text: 'Ao final do dia, sentes mais frequentemente:',
    options: [
      { id: 'A', text: 'Saturação mental' },
      { id: 'B', text: 'Cansaço físico' },
      { id: 'C', text: 'Irritabilidade / peso emocional' },
      { id: 'D', text: 'Falta de tempo para desacelerar' },
      { id: 'E', text: 'Nenhuma destas domina' }
    ]
  },
  Q08: {
    id: 'Q08',
    type: 'single_choice',
    text: 'O teu sono parece mais vulnerável a:',
    options: [
      { id: 'A', text: 'Dias intensos' },
      { id: 'B', text: 'Noites desorganizadas' },
      { id: 'C', text: 'Contexto / casa / pessoas' },
      { id: 'D', text: 'Sintomas físicos' },
      { id: 'E', text: 'Mudanças de horário' }
    ]
  },
  Q09: {
    id: 'Q09',
    type: 'single_choice',
    text: 'Quando a noite corre melhor do que o habitual, isso parece dever-se mais a:',
    options: [
      { id: 'A', text: 'Menos pressão interna' },
      { id: 'B', text: 'Mais ordem externa' },
      { id: 'C', text: 'Melhor conforto físico' },
      { id: 'D', text: 'Mais previsibilidade' },
      { id: 'E', text: 'Ainda não percebi' }
    ]
  },
  Q10: {
    id: 'Q10',
    type: 'single_choice',
    text: 'Que frase te descreve melhor?',
    options: [
      { id: 'A', text: 'Adormecer é a parte difícil' },
      { id: 'B', text: 'Manter o sono é a parte difícil' },
      { id: 'C', text: 'Acordar cedo demais é a parte difícil' },
      { id: 'D', text: 'Sensação de sono pouco reparador' },
      { id: 'E', text: 'O problema muda de forma' }
    ]
  },
  Q11: {
    id: 'Q11',
    type: 'single_choice',
    text: 'Quando as luzes se apagam, a tua mente tende a:',
    options: [
      { id: 'A', text: 'Abrandar naturalmente' },
      { id: 'B', text: 'Rever o dia' },
      { id: 'C', text: 'Saltar entre assuntos' },
      { id: 'D', text: 'Antecipar o dia seguinte' },
      { id: 'E', text: 'Ficar alerta com o próprio sono' }
    ]
  },
  Q12: {
    id: 'Q12',
    type: 'single_choice',
    text: 'Qual destas situações é mais tua?',
    options: [
      { id: 'A', text: 'Penso demais antes de adormecer' },
      { id: 'B', text: 'Penso demais quando acordo a meio da noite' },
      { id: 'C', text: 'Evito pensar, mas o corpo fica tenso' },
      { id: 'D', text: 'Nem penso muito; só não adormeço' },
      { id: 'E', text: 'Muda de noite para noite' }
    ]
  },
  Q13: {
    id: 'Q13',
    type: 'single_choice',
    text: 'Quando tens dificuldade em dormir, o conteúdo mental costuma ser mais:',
    options: [
      { id: 'A', text: 'Prático / tarefas' },
      { id: 'B', text: 'Emocional / relacional' },
      { id: 'C', text: 'Inseguranças / medo / antecipação' },
      { id: 'D', text: 'Aleatório e disperso' },
      { id: 'E', text: 'Não noto conteúdo claro' }
    ]
  },
  Q14: {
    id: 'Q14',
    type: 'single_choice',
    text: 'O teu cérebro à noite parece mais:',
    options: [
      { id: 'A', text: 'Organizado, mas ativo' },
      { id: 'B', text: 'Acelerado e desordenado' },
      { id: 'C', text: 'Preso a um tema' },
      { id: 'D', text: 'Em vigilância' },
      { id: 'E', text: 'Normal' }
    ]
  },
  Q15: {
    id: 'Q15',
    type: 'single_choice',
    text: 'Até que ponto o próprio sono se tornou um assunto dentro da tua cabeça?',
    options: [
      { id: 'A', text: 'Nada' },
      { id: 'B', text: 'Um pouco' },
      { id: 'C', text: 'Bastante' },
      { id: 'D', text: 'Muito' },
      { id: 'E', text: 'É das primeiras coisas em que penso' }
    ]
  },
  Q16: {
    id: 'Q16',
    type: 'single_choice',
    text: 'Quando percebes que não estás a adormecer, o que acontece por dentro?',
    options: [
      { id: 'A', text: 'Nada de especial, espero' },
      { id: 'B', text: 'Fico irritado comigo' },
      { id: 'C', text: 'Começo a contar o tempo' },
      { id: 'D', text: 'Sinto receio da noite e do dia seguinte' },
      { id: 'E', text: 'Tento controlar o sono' }
    ]
  },
  Q17: {
    id: 'Q17',
    type: 'single_choice',
    text: 'Qual destas frases te toca mais?',
    options: [
      { id: 'A', text: '“Se eu desligasse a cabeça, dormia.”' },
      { id: 'B', text: '“O problema não é pensar; é o corpo não ceder.”' },
      { id: 'C', text: '“O pior é começar a temer que a noite corra mal.”' },
      { id: 'D', text: '“Se nada me interrompesse, dormia.”' },
      { id: 'E', text: '“Não me revejo totalmente em nenhuma.”' }
    ]
  },
  Q18: {
    id: 'Q18',
    type: 'single_choice',
    text: 'Quando o sono falha, sentes que tentas forçá-lo?',
    options: [
      { id: 'A', text: 'Nunca' },
      { id: 'B', text: 'Às vezes' },
      { id: 'C', text: 'Muitas vezes' },
      { id: 'D', text: 'Quase sempre' },
      { id: 'E', text: 'Já virou hábito' }
    ]
  },
  Q19: {
    id: 'Q19',
    type: 'single_choice',
    text: 'Em relação ao sono, qual destas é mais verdadeira?',
    options: [
      { id: 'A', text: 'Confio que o sono acaba por vir' },
      { id: 'B', text: 'Tenho alguma insegurança' },
      { id: 'C', text: 'Fico em alerta se demorar' },
      { id: 'D', text: 'Temo genuinamente não dormir' },
      { id: 'E', text: 'O medo já interfere mais do que o cansaço' }
    ]
  },
  Q20: {
    id: 'Q20',
    type: 'single_choice',
    text: 'Se acordas a meio da noite, qual destas reações aparece primeiro?',
    options: [
      { id: 'A', text: 'Volto a dormir facilmente' },
      { id: 'B', text: 'Vejo as horas' },
      { id: 'C', text: 'Começo a pensar' },
      { id: 'D', text: 'Sinto tensão / alarme' },
      { id: 'E', text: 'Fico logo preocupado com o dia seguinte' }
    ]
  },
  Q21: {
    id: 'Q21',
    type: 'single_choice',
    text: 'Quando dizes a ti próprio “tenho de dormir”, isso normalmente:',
    options: [
      { id: 'A', text: 'Ajuda' },
      { id: 'B', text: 'Não muda muito' },
      { id: 'C', text: 'Piora um pouco' },
      { id: 'D', text: 'Piora bastante' },
      { id: 'E', text: 'É um ciclo quase automático' }
    ]
  },
  Q22: {
    id: 'Q22',
    type: 'single_choice',
    text: 'Qual destas aproxima melhor o teu medo, quando existe?',
    options: [
      { id: 'A', text: 'Medo de estar cansado no dia seguinte' },
      { id: 'B', text: 'Medo de perder controlo' },
      { id: 'C', text: 'Medo de entrar numa fase pior' },
      { id: 'D', text: 'Medo de algo estar errado comigo' },
      { id: 'E', text: 'Não sinto esse medo' }
    ]
  },
  Q23: {
    id: 'Q23',
    type: 'single_choice',
    text: 'Com que frequência sentes que a noite começa antes de te deitares?',
    options: [
      { id: 'A', text: 'Quase nunca' },
      { id: 'B', text: 'Algumas vezes' },
      { id: 'C', text: 'Muitas vezes' },
      { id: 'D', text: 'Quase sempre' },
      { id: 'E', text: 'Todos os dias' }
    ]
  },
  Q24: {
    id: 'Q24',
    type: 'single_choice',
    text: '“Levo o meu estado emocional para a cama.”',
    options: [
      { id: 'A', text: 'Quase nunca' },
      { id: 'B', text: 'Às vezes' },
      { id: 'C', text: 'Frequentemente' },
      { id: 'D', text: 'Muito frequentemente' },
      { id: 'E', text: 'É quase a regra' }
    ]
  },
  Q25: {
    id: 'Q25',
    type: 'single_choice',
    text: 'Nas noites piores, sentes mais:',
    options: [
      { id: 'A', text: 'Excesso de pensamento' },
      { id: 'B', text: 'Excesso de alerta' },
      { id: 'C', text: 'Excesso de emoção acumulada' },
      { id: 'D', text: 'Excesso de esforço para dormir' },
      { id: 'E', text: 'Várias destas ao mesmo tempo' }
    ]
  },
  Q26: {
    id: 'Q26',
    type: 'single_choice',
    text: 'O teu dia tende a terminar com:',
    options: [
      { id: 'A', text: 'Fecho claro' },
      { id: 'B', text: 'Transição confusa' },
      { id: 'C', text: 'Trabalho até tarde' },
      { id: 'D', text: 'Tarefas domésticas / familiares' },
      { id: 'E', text: 'Ecrãs / estímulos até ao fim' }
    ]
  },
  Q27: {
    id: 'Q27',
    type: 'single_choice',
    text: 'A tua vida atual parece mais:',
    options: [
      { id: 'A', text: 'Estável' },
      { id: 'B', text: 'Exigente, mas previsível' },
      { id: 'C', text: 'Exigente e variável' },
      { id: 'D', text: 'Caótica em horários' },
      { id: 'E', text: 'Difícil de encaixar numa rotina' }
    ]
  },
  Q28: {
    id: 'Q28',
    type: 'single_choice',
    text: 'O teu trabalho/estudo pesa mais por:',
    options: [
      { id: 'A', text: 'Carga mental' },
      { id: 'B', text: 'Pressão / responsabilidade' },
      { id: 'C', text: 'Horários' },
      { id: 'D', text: 'Relações / ambiente' },
      { id: 'E', text: 'Não é o principal' }
    ]
  },
  Q29: {
    id: 'Q29',
    type: 'single_choice',
    text: 'No fim do dia, tens espaço real para desacelerar?',
    options: [
      { id: 'A', text: 'Sim, quase sempre' },
      { id: 'B', text: 'Em alguns dias' },
      { id: 'C', text: 'Raramente' },
      { id: 'D', text: 'Quase nunca' },
      { id: 'E', text: 'Só à custa de dormir mais tarde' }
    ]
  },
  Q30: {
    id: 'Q30',
    type: 'single_choice',
    text: 'O que rouba mais o teu tempo noturno?',
    options: [
      { id: 'A', text: 'Trabalho / estudo' },
      { id: 'B', text: 'Casa / família' },
      { id: 'C', text: 'Telemóvel / séries / distração' },
      { id: 'D', text: 'Inércia / esgotamento' },
      { id: 'E', text: 'Nada em especial' }
    ]
  },
  Q31: {
    id: 'Q31',
    type: 'single_choice',
    text: 'O teu sono parece pagar o preço de:',
    options: [
      { id: 'A', text: 'Dias demasiado cheios' },
      { id: 'B', text: 'Falta de movimento / pouca atividade' },
      { id: 'C', text: 'Horários sem consistência' },
      { id: 'D', text: 'Vida social / lazer tardio' },
      { id: 'E', text: 'Exigência acumulada' }
    ]
  },
  Q32: {
    id: 'Q32',
    type: 'single_choice',
    text: 'Ao longo da semana, a tua energia:',
    options: [
      { id: 'A', text: 'É relativamente estável' },
      { id: 'B', text: 'Vai caindo' },
      { id: 'C', text: 'Varia muito' },
      { id: 'D', text: 'Depende das noites anteriores' },
      { id: 'E', text: 'Está quase sempre baixa' }
    ]
  },
  Q33: {
    id: 'Q33',
    type: 'single_choice',
    text: 'Como descreverias a tua última hora antes de te deitares?',
    options: [
      { id: 'A', text: 'Calma e repetível' },
      { id: 'B', text: 'Funcional, mas não ideal' },
      { id: 'C', text: 'Reativa / improvisada' },
      { id: 'D', text: 'Ainda acelerada' },
      { id: 'E', text: 'Muito diferente de dia para dia' }
    ]
  },
  Q34: {
    id: 'Q34',
    type: 'single_choice',
    text: 'Qual destas descreve melhor a tua rotina?',
    options: [
      { id: 'A', text: 'Tenho horas parecidas' },
      { id: 'B', text: 'Tenho intenção de rotina, mas falha' },
      { id: 'C', text: 'A minha rotina depende de outros' },
      { id: 'D', text: 'A minha rotina muda muito' },
      { id: 'E', text: 'Não tenho rotina de deitar' }
    ]
  },
  Q35: {
    id: 'Q35',
    type: 'single_choice',
    text: 'Se o dia foi bom, o sono normalmente:',
    options: [
      { id: 'A', text: 'Melhora bastante' },
      { id: 'B', text: 'Melhora um pouco' },
      { id: 'C', text: 'Muda pouco' },
      { id: 'D', text: 'Nem sempre acompanha' },
      { id: 'E', text: 'Às vezes até piora' }
    ]
  },
  Q36: {
    id: 'Q36',
    type: 'single_choice',
    text: 'Trabalhas/estudas em horários:',
    options: [
      { id: 'A', text: 'Muito regulares' },
      { id: 'B', text: 'Moderadamente regulares' },
      { id: 'C', text: 'Irregulares' },
      { id: 'D', text: 'Por turnos' },
      { id: 'E', text: 'Com grande variação entre dias' }
    ]
  },
  Q37: {
    id: 'Q37',
    type: 'single_choice',
    text: 'Ao fim de semana, a tua hora de deitar:',
    options: [
      { id: 'A', text: 'Mantém-se próxima' },
      { id: 'B', text: 'Atrasa um pouco' },
      { id: 'C', text: 'Atrasa bastante' },
      { id: 'D', text: 'É imprevisível' },
      { id: 'E', text: 'Compensa a semana' }
    ]
  },
  Q38: {
    id: 'Q38',
    type: 'single_choice',
    text: 'Ao fim de semana, a tua hora de acordar:',
    options: [
      { id: 'A', text: 'É parecida' },
      { id: 'B', text: 'Derrapa até 1 hora' },
      { id: 'C', text: 'Derrapa mais de 1-2 horas' },
      { id: 'D', text: 'Varia muito' },
      { id: 'E', text: 'Depende do cansaço acumulado' }
    ]
  },
  Q39: {
    id: 'Q39',
    type: 'single_choice',
    text: 'Sentes jetlag social?',
    options: [
      { id: 'A', text: 'Não' },
      { id: 'B', text: 'Ligeiro' },
      { id: 'C', text: 'Moderado' },
      { id: 'D', text: 'Forte' },
      { id: 'E', text: 'Nunca tinha pensado nisso, mas sim' }
    ]
  },
  Q40: {
    id: 'Q40',
    type: 'single_choice',
    text: 'A tua vida ativa / exercício tende a acontecer:',
    options: [
      { id: 'A', text: 'De manhã' },
      { id: 'B', text: 'Durante o dia' },
      { id: 'C', text: 'Ao fim da tarde' },
      { id: 'D', text: 'À noite' },
      { id: 'E', text: 'Não existe com regularidade' }
    ]
  },
  Q41: {
    id: 'Q41',
    type: 'single_choice',
    text: 'Há alguma relação que entre contigo na cama, mesmo quando a pessoa não está presente?',
    options: [
      { id: 'A', text: 'Não' },
      { id: 'B', text: 'Um pouco' },
      { id: 'C', text: 'Sim, moderadamente' },
      { id: 'D', text: 'Sim, claramente' },
      { id: 'E', text: 'É um dos fatores principais' }
    ]
  },
  Q42: {
    id: 'Q42',
    type: 'single_choice',
    text: 'Quando pensas em carga emocional, ela vem mais de:',
    options: [
      { id: 'A', text: 'Família' },
      { id: 'B', text: 'Relação amorosa' },
      { id: 'C', text: 'Trabalho / estudo' },
      { id: 'D', text: 'Solidão / falta de apoio' },
      { id: 'E', text: 'Mistura de contextos' }
    ]
  },
  Q43: {
    id: 'Q43',
    type: 'single_choice',
    text: 'À noite, sentes-te mais:',
    options: [
      { id: 'A', text: 'Acompanhado' },
      { id: 'B', text: 'Neutro' },
      { id: 'C', text: 'Um pouco só' },
      { id: 'D', text: 'Bastante só' },
      { id: 'E', text: 'Desligado dos outros' }
    ]
  },
  Q44: {
    id: 'Q44',
    type: 'single_choice',
    text: 'Tens alguém com quem possas falar de forma genuína quando estás em baixo?',
    options: [
      { id: 'A', text: 'Sim, com facilidade' },
      { id: 'B', text: 'Sim, mas nem sempre' },
      { id: 'C', text: 'Pouco' },
      { id: 'D', text: 'Quase ninguém' },
      { id: 'E', text: 'Ninguém' }
    ]
  },
  Q45: {
    id: 'Q45',
    type: 'single_choice',
    text: 'O teu contexto social atual é mais:',
    options: [
      { id: 'A', text: 'Suporte' },
      { id: 'B', text: 'Neutro' },
      { id: 'C', text: 'Exigente' },
      { id: 'D', text: 'Imprevisível' },
      { id: 'E', text: 'Fonte de tensão' }
    ]
  },
  Q46: {
    id: 'Q46',
    type: 'single_choice',
    text: 'A tua cama/quarto é também espaço de tensão relacional?',
    options: [
      { id: 'A', text: 'Não' },
      { id: 'B', text: 'Raramente' },
      { id: 'C', text: 'Às vezes' },
      { id: 'D', text: 'Frequentemente' },
      { id: 'E', text: 'Sim, claramente' }
    ]
  },
  Q47: {
    id: 'Q47',
    type: 'single_choice',
    text: 'Existe alguém cujo estado te mantém em alerta à noite?',
    options: [
      { id: 'A', text: 'Não' },
      { id: 'B', text: 'Sim, ocasionalmente' },
      { id: 'C', text: 'Sim, de forma regular' },
      { id: 'D', text: 'Sim, quase todas as noites' },
      { id: 'E', text: 'Prefiro não detalhar' }
    ]
  },
  Q48: {
    id: 'Q48',
    type: 'single_choice',
    text: 'Em casa, a noite depende só de ti?',
    options: [
      { id: 'A', text: 'Sim' },
      { id: 'B', text: 'Nem sempre' },
      { id: 'C', text: 'Depende de filhos' },
      { id: 'D', text: 'Depende de outro adulto' },
      { id: 'E', text: 'Depende de várias pessoas' }
    ]
  },
  Q49: {
    id: 'Q49',
    type: 'single_choice',
    text: 'Tens filhos, dependentes ou alguém a teu cargo que interfira com a tua noite?',
    options: [
      { id: 'A', text: 'Não' },
      { id: 'B', text: 'Sim, raramente' },
      { id: 'C', text: 'Sim, às vezes' },
      { id: 'D', text: 'Sim, frequentemente' },
      { id: 'E', text: 'Sim, é central' }
    ]
  },
  Q50: {
    id: 'Q50',
    type: 'single_choice',
    text: 'Quando a noite não é “tua”, isso deve-se mais a:',
    options: [
      { id: 'A', text: 'Crianças / dependentes' },
      { id: 'B', text: 'Outra pessoa em casa' },
      { id: 'C', text: 'Preocupação com alguém' },
      { id: 'D', text: 'Responsabilidade doméstica' },
      { id: 'E', text: 'Não se aplica' }
    ]
  },
  Q51: {
    id: 'Q51',
    type: 'single_choice',
    text: 'Sentir-te compreendido em relação ao teu sono é algo que:',
    options: [
      { id: 'A', text: 'Tenho' },
      { id: 'B', text: 'Tenho parcialmente' },
      { id: 'C', text: 'Tenho pouco' },
      { id: 'D', text: 'Não tenho' },
      { id: 'E', text: 'Nunca partilho' }
    ]
  },
  Q52: {
    id: 'Q52',
    type: 'single_choice',
    text: 'Nas noites piores, gostavas mais de:',
    options: [
      { id: 'A', text: 'Mais silêncio' },
      { id: 'B', text: 'Mais apoio' },
      { id: 'C', text: 'Mais espaço' },
      { id: 'D', text: 'Menos dependência de outros' },
      { id: 'E', text: 'Mais sensação de segurança' }
    ]
  },
  Q53: {
    id: 'Q53',
    type: 'single_choice',
    text: 'Como está a tua vida amorosa/relacional neste momento, no que toca ao impacto no sono?',
    options: [
      { id: 'A', text: 'Não pesa' },
      { id: 'B', text: 'Pesa um pouco' },
      { id: 'C', text: 'Pesa moderadamente' },
      { id: 'D', text: 'Pesa bastante' },
      { id: 'E', text: 'É um foco importante' }
    ]
  },
  Q54: {
    id: 'Q54',
    type: 'single_choice',
    text: 'A tua casa à noite parece mais:',
    options: [
      { id: 'A', text: 'Refúgio' },
      { id: 'B', text: 'Funcional' },
      { id: 'C', text: 'Inquieta' },
      { id: 'D', text: 'Exigente' },
      { id: 'E', text: 'Imprevisível' }
    ]
  },
  Q55: {
    id: 'Q55',
    type: 'single_choice',
    text: 'Se o teu sono pudesse falar, diria que te falta mais:',
    options: [
      { id: 'A', text: 'Ordem' },
      { id: 'B', text: 'Apoio' },
      { id: 'C', text: 'Descarga emocional' },
      { id: 'D', text: 'Espaço próprio' },
      { id: 'E', text: 'Segurança / previsibilidade' }
    ]
  },
  Q56: {
    id: 'Q56',
    type: 'single_choice',
    text: 'O teu corpo atrapalha o sono mais por:',
    options: [
      { id: 'A', text: 'Dor' },
      { id: 'B', text: 'Tensão / inquietação' },
      { id: 'C', text: 'Respiração' },
      { id: 'D', text: 'Digestão' },
      { id: 'E', text: 'Não é o principal' }
    ]
  },
  Q57: {
    id: 'Q57',
    type: 'multi_choice',
    text: 'Que tipo de desconforto aparece mais nas noites más?',
    options: [
      { id: 'A', text: 'Dor lombar' },
      { id: 'B', text: 'Dor cervical / ombros' },
      { id: 'C', text: 'Dor articular' },
      { id: 'D', text: 'Peso nas pernas / inquietação' },
      { id: 'E', text: 'Tensão muscular' },
      { id: 'F', text: 'Nenhum destes' }
    ]
  },
  Q58: {
    id: 'Q58',
    type: 'single_choice',
    text: 'Tens alguma limitação física ou motora que complique posições, virar na cama ou levantar-te?',
    options: [
      { id: 'A', text: 'Não' },
      { id: 'B', text: 'Um pouco' },
      { id: 'C', text: 'Moderadamente' },
      { id: 'D', text: 'Bastante' },
      { id: 'E', text: 'Sim, de forma muito clara' }
    ]
  },
  Q59: {
    id: 'Q59',
    type: 'single_choice',
    text: 'Quando a respiração pesa no sono, isso parece-se mais com:',
    options: [
      { id: 'A', text: 'Nariz obstruído' },
      { id: 'B', text: 'Boca seca / respirar pela boca' },
      { id: 'C', text: 'Sensação de não respirar bem' },
      { id: 'D', text: 'Ressonar / pausas' },
      { id: 'E', text: 'Não noto isso' }
    ]
  },
  Q60: {
    id: 'Q60',
    type: 'multi_choice',
    text: 'Acordas com algum destes sinais?',
    options: [
      { id: 'A', text: 'Boca seca' },
      { id: 'B', text: 'Dor de cabeça' },
      { id: 'C', text: 'Garganta seca' },
      { id: 'D', text: 'Sensação de sono pesado / pouco reparador' },
      { id: 'E', text: 'Azia' },
      { id: 'F', text: 'Nenhum' }
    ]
  },
  Q61: {
    id: 'Q61',
    type: 'single_choice',
    text: 'O teu sistema digestivo interfere mais:',
    options: [
      { id: 'A', text: 'Depois do jantar' },
      { id: 'B', text: 'Ao deitar' },
      { id: 'C', text: 'Durante a noite' },
      { id: 'D', text: 'Ao acordar' },
      { id: 'E', text: 'Não interfere' }
    ]
  },
  Q62: {
    id: 'Q62',
    type: 'single_choice',
    text: 'Qual destas te descreve melhor?',
    options: [
      { id: 'A', text: 'Janto cedo e leve' },
      { id: 'B', text: 'Janto tarde, mas tolero bem' },
      { id: 'C', text: 'Janto tarde e noto peso' },
      { id: 'D', text: 'A comida noturna muda muito' },
      { id: 'E', text: 'Não noto relação' }
    ]
  },
  Q63: {
    id: 'Q63',
    type: 'multi_choice',
    text: 'Há substâncias que tocam o teu sono?',
    options: [
      { id: 'A', text: 'Cafeína tardia' },
      { id: 'B', text: 'Álcool' },
      { id: 'C', text: 'Nicotina' },
      { id: 'D', text: 'Cannabis / outras substâncias' },
      { id: 'E', text: 'Medicação calmante / para dormir' },
      { id: 'F', text: 'Nenhuma destas' }
    ]
  },
  Q64: {
    id: 'Q64',
    type: 'single_choice',
    text: 'Em relação à cafeína, tu és mais:',
    options: [
      { id: 'A', text: 'Sensível' },
      { id: 'B', text: 'Moderadamente sensível' },
      { id: 'C', text: 'Pouco sensível' },
      { id: 'D', text: 'Não sei' },
      { id: 'E', text: 'Quase não consumo' }
    ]
  },
  Q65: {
    id: 'Q65',
    type: 'single_choice',
    text: 'Em relação ao álcool, qual te descreve melhor?',
    options: [
      { id: 'A', text: 'Não consumo / raramente' },
      { id: 'B', text: 'Consumo sem impacto claro' },
      { id: 'C', text: 'Ajuda a desligar, mas piora a noite' },
      { id: 'D', text: 'Piora claramente a noite' },
      { id: 'E', text: 'Não sei' }
    ]
  },
  Q66: {
    id: 'Q66',
    type: 'single_choice',
    text: 'Tomas medicação que possa tocar o sono, a vigília ou a noite?',
    options: [
      { id: 'A', text: 'Não' },
      { id: 'B', text: 'Sim, mas pouco relevante' },
      { id: 'C', text: 'Sim, possivelmente relevante' },
      { id: 'D', text: 'Sim, claramente relevante' },
      { id: 'E', text: 'Prefiro não responder' }
    ]
  },
  Q67: {
    id: 'Q67',
    type: 'single_choice',
    text: 'As idas à casa de banho durante a noite são:',
    options: [
      { id: 'A', text: 'Raras' },
      { id: 'B', text: 'Ocasionalmente presentes' },
      { id: 'C', text: 'Regulares' },
      { id: 'D', text: 'Frequentes' },
      { id: 'E', text: 'Uma das principais perturbações' }
    ]
  },
  Q68: {
    id: 'Q68',
    type: 'single_choice',
    text: 'Quando te levantas durante a noite, voltas a adormecer:',
    options: [
      { id: 'A', text: 'Rapidamente' },
      { id: 'B', text: 'Com algum atraso' },
      { id: 'C', text: 'Com dificuldade' },
      { id: 'D', text: 'Muito mal' },
      { id: 'E', text: 'Depende do motivo' }
    ]
  },
  Q69: {
    id: 'Q69',
    type: 'single_choice',
    text: 'O teu corpo à noite parece mais:',
    options: [
      { id: 'A', text: 'Disponível para descansar' },
      { id: 'B', text: 'Cansado mas desconfortável' },
      { id: 'C', text: 'Tenso e vigilante' },
      { id: 'D', text: 'Imprevisível' },
      { id: 'E', text: 'Atrapalhado por sintomas' }
    ]
  },
  Q70: {
    id: 'Q70',
    type: 'single_choice',
    text: 'Se tivesses de escolher um foco físico principal, seria:',
    options: [
      { id: 'A', text: 'Dor / limitação' },
      { id: 'B', text: 'Respiração' },
      { id: 'C', text: 'Digestão' },
      { id: 'D', text: 'Noctúria' },
      { id: 'E', text: 'Inquietação corporal' },
      { id: 'F', text: 'Nenhum em especial' }
    ]
  },
  Q71: {
    id: 'Q71',
    type: 'single_choice',
    text: 'O teu quarto à noite tende a ser:',
    options: [
      { id: 'A', text: 'Bom para dormir' },
      { id: 'B', text: 'Aceitável' },
      { id: 'C', text: 'Sensível a falhas' },
      { id: 'D', text: 'Frequentemente perturbador' },
      { id: 'E', text: 'Muito inconsistente' }
    ]
  },
  Q72: {
    id: 'Q72',
    type: 'single_choice',
    text: 'O ambiente interfere mais por:',
    options: [
      { id: 'A', text: 'Ruído' },
      { id: 'B', text: 'Luz' },
      { id: 'C', text: 'Temperatura' },
      { id: 'D', text: 'Pessoa(s) / animais' },
      { id: 'E', text: 'Mistura de fatores' }
    ]
  },
  Q73: {
    id: 'Q73',
    type: 'multi_choice',
    text: 'Quais destes fatores te acordam mais?',
    options: [
      { id: 'A', text: 'Barulho' },
      { id: 'B', text: 'Luz' },
      { id: 'C', text: 'Temperatura' },
      { id: 'D', text: 'Movimento de outra pessoa' },
      { id: 'E', text: 'Animais' },
      { id: 'F', text: 'Não consigo identificar' }
    ]
  },
  Q74: {
    id: 'Q74',
    type: 'single_choice',
    text: 'A temperatura do quarto costuma ser:',
    options: [
      { id: 'A', text: 'Boa' },
      { id: 'B', text: 'Um pouco quente' },
      { id: 'C', text: 'Um pouco fria' },
      { id: 'D', text: 'Variável / difícil' },
      { id: 'E', text: 'Claramente perturbadora' }
    ]
  },
  Q75: {
    id: 'Q75',
    type: 'single_choice',
    text: 'O teu colchão/almofada/cama parecem:',
    options: [
      { id: 'A', text: 'Adequados' },
      { id: 'B', text: 'Aceitáveis' },
      { id: 'C', text: 'Parte do problema' },
      { id: 'D', text: 'Claramente desconfortáveis' },
      { id: 'E', text: 'Nunca pensei nisso' }
    ]
  },
  Q76: {
    id: 'Q76',
    type: 'single_choice',
    text: 'Existe imprevisibilidade externa à noite?',
    options: [
      { id: 'A', text: 'Não' },
      { id: 'B', text: 'Pouca' },
      { id: 'C', text: 'Moderada' },
      { id: 'D', text: 'Bastante' },
      { id: 'E', text: 'É frequente' }
    ]
  },
  Q77: {
    id: 'Q77',
    type: 'single_choice',
    text: 'A luz artificial ou de ecrãs antes de dormir pesa em ti de forma:',
    options: [
      { id: 'A', text: 'Nenhuma' },
      { id: 'B', text: 'Ligeira' },
      { id: 'C', text: 'Moderada' },
      { id: 'D', text: 'Clara' },
      { id: 'E', text: 'Muito clara' }
    ]
  },
  Q78: {
    id: 'Q78',
    type: 'single_choice',
    text: 'Dormes com:',
    options: [
      { id: 'A', text: 'Escuro e silêncio razoáveis' },
      { id: 'B', text: 'Algumas concessões' },
      { id: 'C', text: 'Demasiada luz' },
      { id: 'D', text: 'Demasiado ruído' },
      { id: 'E', text: 'Condições muito variáveis' }
    ]
  },
  Q79: {
    id: 'Q79',
    type: 'single_choice',
    text: 'Há interrupções externas que não controlas?',
    options: [
      { id: 'A', text: 'Não' },
      { id: 'B', text: 'Às vezes' },
      { id: 'C', text: 'Regularmente' },
      { id: 'D', text: 'Muitas noites' },
      { id: 'E', text: 'Sim, e desgastam bastante' }
    ]
  },
  Q80: {
    id: 'Q80',
    type: 'single_choice',
    text: 'Se melhorasses só uma condição do quarto, seria:',
    options: [
      { id: 'A', text: 'Mais silêncio' },
      { id: 'B', text: 'Mais escuridão' },
      { id: 'C', text: 'Melhor temperatura' },
      { id: 'D', text: 'Melhor cama / ergonomia' },
      { id: 'E', text: 'Mais previsibilidade geral' }
    ]
  },
  Q81: {
    id: 'Q81',
    type: 'single_choice',
    text: 'Há quanto tempo sentes que o sono deixou de ser simples?',
    options: [
      { id: 'A', text: 'Muito recentemente' },
      { id: 'B', text: 'Há alguns meses' },
      { id: 'C', text: 'Há anos' },
      { id: 'D', text: 'Desde sempre' },
      { id: 'E', text: 'Vai por fases' }
    ]
  },
  Q82: {
    id: 'Q82',
    type: 'single_choice',
    text: 'O teu problema de sono é mais:',
    options: [
      { id: 'A', text: 'Novo' },
      { id: 'B', text: 'Antigo' },
      { id: 'C', text: 'Crónico' },
      { id: 'D', text: 'Intermitente' },
      { id: 'E', text: 'Difícil de definir' }
    ]
  },
  Q83: {
    id: 'Q83',
    type: 'single_choice',
    text: 'Se é antigo, sentes que:',
    options: [
      { id: 'A', text: 'Sempre foi parecido' },
      { id: 'B', text: 'Mudou de forma' },
      { id: 'C', text: 'Piorou com a idade / fase de vida' },
      { id: 'D', text: 'Agravou-se recentemente' },
      { id: 'E', text: 'Não se aplica' }
    ]
  },
  Q84: {
    id: 'Q84',
    type: 'single_choice',
    text: 'Que frase descreve melhor a evolução?',
    options: [
      { id: 'A', text: 'Sempre dormi assim' },
      { id: 'B', text: 'Começou numa fase específica' },
      { id: 'C', text: 'Vai e vem' },
      { id: 'D', text: 'Tem piorado' },
      { id: 'E', text: 'Melhorou e voltou a piorar' }
    ]
  },
  Q85: {
    id: 'Q85',
    type: 'single_choice',
    text: 'Consegues ligar o início ou agravamento a algum momento?',
    options: [
      { id: 'A', text: 'Sim, claramente' },
      { id: 'B', text: 'Talvez' },
      { id: 'C', text: 'Apenas parcialmente' },
      { id: 'D', text: 'Não' },
      { id: 'E', text: 'Prefiro não dizer' }
    ]
  },
  Q86: {
    id: 'Q86',
    type: 'single_choice',
    text: 'Quando o problema piorou, isso coincidiu mais com:',
    options: [
      { id: 'A', text: 'Mudança de rotina' },
      { id: 'B', text: 'Relação / família' },
      { id: 'C', text: 'Trabalho / estudo' },
      { id: 'D', text: 'Saúde / sintomas' },
      { id: 'E', text: 'Não sei / mistura' }
    ]
  },
  Q87: {
    id: 'Q87',
    type: 'single_choice',
    text: 'No último ano, o sono:',
    options: [
      { id: 'A', text: 'Melhorou' },
      { id: 'B', text: 'Manteve-se semelhante' },
      { id: 'C', text: 'Oscilou' },
      { id: 'D', text: 'Piorou um pouco' },
      { id: 'E', text: 'Piorou muito' }
    ]
  },
  Q88: {
    id: 'Q88',
    type: 'single_choice',
    text: 'Qual destas frases é mais tua?',
    options: [
      { id: 'A', text: 'Sei quando isto começou' },
      { id: 'B', text: 'Sei quando piorou' },
      { id: 'C', text: 'Nunca desaparece totalmente' },
      { id: 'D', text: 'Aparece por fases' },
      { id: 'E', text: 'Não lhe encontro narrativa' }
    ]
  },
  Q89: {
    id: 'Q89',
    type: 'single_choice',
    text: 'Há épocas em que quase te esqueces do problema?',
    options: [
      { id: 'A', text: 'Sim' },
      { id: 'B', text: 'Às vezes' },
      { id: 'C', text: 'Pouco' },
      { id: 'D', text: 'Raramente' },
      { id: 'E', text: 'Nunca' }
    ]
  },
  Q90: {
    id: 'Q90',
    type: 'single_choice',
    text: 'Em relação ao futuro do teu sono, sentes-te mais:',
    options: [
      { id: 'A', text: 'Confiante' },
      { id: 'B', text: 'Moderadamente esperançoso' },
      { id: 'C', text: 'Incerto' },
      { id: 'D', text: 'Preocupado' },
      { id: 'E', text: 'Bastante desanimado' }
    ]
  },
  Q91: {
    id: 'Q91',
    type: 'single_choice',
    text: 'Quando tens uma noite melhor, o dia seguinte tende a ser:',
    options: [
      { id: 'A', text: 'Claramente melhor' },
      { id: 'B', text: 'Um pouco melhor' },
      { id: 'C', text: 'Só ligeiramente melhor' },
      { id: 'D', text: 'Nem sempre diferente' },
      { id: 'E', text: 'Ainda pesado' }
    ]
  },
  Q92: {
    id: 'Q92',
    type: 'single_choice',
    text: 'Há algo que o teu corpo tenta dizer-te à noite e que tu achas que ainda não entendeste?',
    options: [
      { id: 'A', text: 'Não' },
      { id: 'B', text: 'Talvez' },
      { id: 'C', text: 'Sim, um pouco' },
      { id: 'D', text: 'Sim, bastante' },
      { id: 'E', text: 'Sim, claramente' }
    ]
  },
  Q93: {
    id: 'Q93',
    type: 'single_choice',
    text: 'Qual destas frases te expõe mais?',
    options: [
      { id: 'A', text: 'Não consigo desligar' },
      { id: 'B', text: 'Não me sinto seguro para descansar' },
      { id: 'C', text: 'O meu corpo não acompanha' },
      { id: 'D', text: 'A minha vida não deixa espaço' },
      { id: 'E', text: 'O problema já ganhou peso próprio' }
    ]
  },
  Q94: {
    id: 'Q94',
    type: 'single_choice',
    text: 'Se tivesses de escolher um “saboteur” principal, seria:',
    options: [
      { id: 'A', text: 'Eu próprio / a minha cabeça' },
      { id: 'B', text: 'O meu contexto' },
      { id: 'C', text: 'O meu corpo' },
      { id: 'D', text: 'A minha rotina' },
      { id: 'E', text: 'Ainda não consigo escolher' }
    ]
  },
  Q95: {
    id: 'Q95',
    type: 'single_choice',
    text: 'O teu sono piora mais quando:',
    options: [
      { id: 'A', text: 'Estou sob pressão' },
      { id: 'B', text: 'Estou emocionalmente mexido' },
      { id: 'C', text: 'Estou fisicamente pior' },
      { id: 'D', text: 'Perco rotina' },
      { id: 'E', text: 'Fico mais atento ao próprio sono' }
    ]
  },
  Q96: {
    id: 'Q96',
    type: 'single_choice',
    text: 'A sensação de vigilância à noite vem mais de:',
    options: [
      { id: 'A', text: 'Tensão interna' },
      { id: 'B', text: 'Medo de não dormir' },
      { id: 'C', text: 'Responsabilidade com alguém' },
      { id: 'D', text: 'Sintomas físicos' },
      { id: 'E', text: 'Ambiente' }
    ]
  },
  Q97: {
    id: 'Q97',
    type: 'single_choice',
    text: 'Se retirasses um único fator, qual teria maior probabilidade de melhorar a tua noite?',
    options: [
      { id: 'A', text: 'Pressão mental' },
      { id: 'B', text: 'Ativação emocional' },
      { id: 'C', text: 'Interrupções externas' },
      { id: 'D', text: 'Sintomas físicos' },
      { id: 'E', text: 'Horários irregulares' }
    ]
  },
  Q98: {
    id: 'Q98',
    type: 'single_choice',
    text: 'Que tipo de ajuda sentes que mais falta ao teu sono?',
    options: [
      { id: 'A', text: 'Estrutura' },
      { id: 'B', text: 'Alívio mental' },
      { id: 'C', text: 'Mais segurança / previsibilidade' },
      { id: 'D', text: 'Ajuste físico / corporal' },
      { id: 'E', text: 'Menos interferência externa' }
    ]
  },
  Q99: {
    id: 'Q99',
    type: 'single_choice',
    text: 'Quanto do teu problema sentes que está escondido por baixo da superfície?',
    options: [
      { id: 'A', text: 'Quase nada' },
      { id: 'B', text: 'Alguma coisa' },
      { id: 'C', text: 'Bastante' },
      { id: 'D', text: 'Muito' },
      { id: 'E', text: 'Tenho coisas que nem eu nomeio bem' }
    ]
  },
  Q100: {
    id: 'Q100',
    type: 'single_choice',
    text: 'Se esta app conseguisse descobrir uma única verdade útil sobre o teu sono, preferias que fosse:',
    options: [
      { id: 'A', text: 'O que me ativa por dentro' },
      { id: 'B', text: 'O que me interrompe por fora' },
      { id: 'C', text: 'O padrão temporal mais importante' },
      { id: 'D', text: 'O custo das minhas rotinas' },
      { id: 'E', text: 'O fator escondido que eu estou a subestimar' }
    ]
  }
};
