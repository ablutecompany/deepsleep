export const FACTOR_LABELS: Record<string, string> = {
  P1: 'Sono dominado por hiperativação interna',
  P2: 'Sono condicionado pelo medo de não dormir',
  P3: 'Sono condicionado por carga emocional/relacional',
  P4: 'Sono condicionado por solidão / baixo suporte',
  P5: 'Sono condicionado por carga doméstica / cuidadores',
  P6: 'Sono condicionado por dor / limitação / corpo',
  P7: 'Sono condicionado por respiração',
  P8: 'Sono condicionado por digestão',
  P9: 'Sono condicionado por substancias / estimulantes',
  P10: 'Sono condicionado por ambiente / quarto / interrupções externas',
  P11: 'Sono condicionado por fragmentação / manutenção',
  P12: 'Sono condicionado por despertar precoce / irregularidade temporal',
  P13: 'Sono condicionado por irregularidade circadiana / jetlag social',
};

export const FACTOR_DESCRIPTIONS: Record<string, { weight: string, aggravating: string, testFirst: string }> = {
  P1: {
    weight: 'Um ritmo acelerado de pensamento que não desliga quando o corpo pede descanso.',
    aggravating: 'Excesso de foco em como a noite vai correr.',
    testFirst: 'Criar uma desconexão passiva 1 hora antes de deitar (sem telemóvel).'
  },
  P2: {
    weight: 'A própria procura do sono gera alerta e receio.',
    aggravating: 'Muitos episódios passados de noites seguidas sem descanso.',
    testFirst: 'Estratégia de distração mental quando não adormeces rapidamente.'
  },
  P3: {
    weight: 'Tensão relacional ou emocional vivida ativamente durante a noite.',
    aggravating: 'Quarto ou casa que funciona como lembrete constante.',
    testFirst: 'Fazer o "download" mental para um diário antes da cama.'
  },
  P4: {
    weight: 'Sentimento orgânico de isolamento que aumenta a sensação de alerta.',
    aggravating: 'Ausência noturna de diálogo sobre esse mesmo peso.',
    testFirst: 'Aumentar segurança sentida (iluminação residual confortável base).'
  },
  P5: {
    weight: 'Carga contínua devotada a outros (filhos pequenos, pais doentes, animais exigentes).',
    aggravating: 'Falta de tempo partilhado para ti mesmo.',
    testFirst: 'Definir pequenas vitórias de proteção ao sono. Otimizar a qualidade entre interrupções.'
  },
  P6: {
    weight: 'Sintomas físicos diretos que roubam conforto natural.',
    aggravating: 'Condições persistentes sem ajuste ergonómico no quarto.',
    testFirst: 'Avaliar suportes físicos, colchão e temperatura e gerir farmacologia associada.'
  },
  P7: {
    weight: 'O padrão respiratório entra em stress.',
    aggravating: 'Cansaço excessivo ou uso de ecrãs na cama.',
    testFirst: 'Maneio da posição, evitar dormir de barriga para cima.'
  },
  P8: {
    weight: 'O esvaziamento gástrico atrasado impede o corpo de descer a temperatura.',
    aggravating: 'Jantares densos muito próximos da hora do sono.',
    testFirst: 'Manter jantares muito precoces e tolerância a líquidos noturnos.'
  },
  P9: {
    weight: 'Sistema nervoso com falsos arranques mediados por químicos ou medicação noturna ou cafeína.',
    aggravating: 'Ciclo diário com picos acentuados e ausência de desaceleração.',
    testFirst: 'Limitar todo o estímulo químico 4h a 6h antes da noite começar.'
  },
  P10: {
    weight: 'Um microambiente ou casa que interrompe ou sinaliza perigo (luz, som).',
    aggravating: 'Sentimento de impotência para corrigir as falhas visíveis.',
    testFirst: 'Mascarar. Usar fones bloqueadores ou luz vermelha.'
  },
  P11: {
    weight: 'Sensibilidade aos alarmes mínimos que fracionam o descanso no primeiro e segundo ciclo do sono.',
    aggravating: 'Temperatura do corpo não diminui.',
    testFirst: 'Consolidação de vigília: diminuir o tempo inútil que se passa na cama.'
  },
  P12: {
    weight: 'Quebra abrupta do sono terminal, abrindo porta à ansiedade de antecipação temporal.',
    aggravating: 'Oscilar agressivamente horários durante a semana.',
    testFirst: 'Manter janela de levantar matinal fixa sem falhas (nem ao fim-de-semana).'
  },
  P13: {
    weight: 'O corpo não sabe que horas são porque as tuas exigências flutuam severamente num curto espaço de dias.',
    aggravating: 'Trabalho rotativo ou social tardio constante.',
    testFirst: 'Uso forte de luz brilhante matinal diária nos momentos estipulados de inicio de jornada funcional.'
  }
};
