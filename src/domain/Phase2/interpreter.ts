export const FACTOR_LABELS: Record<string, string> = {
  P1: 'Ritmo mental ativo ao deitar',
  P2: 'Foco na dificuldade de adormecer',
  P3: 'Processamento de carga relacional/emocional',
  P4: 'Impacto possível de isolamento',
  P5: 'Carga contínua com terceiros/doméstica',
  P6: 'Impacto de desconforto físico',
  P7: 'Sinais orgânicos respiratórios',
  P8: 'Sinais associados ao ritmo digestivo',
  P9: 'Impacto potencial de estimulantes/substâncias',
  P10: 'Sensibilidade ao ambiente do quarto',
  P11: 'Fragmentação ao longo da noite',
  P12: 'Despertares matinais antecipados',
  P13: 'Irregularidade nos horários diários',
};

export const FACTOR_DESCRIPTIONS: Record<string, { weight: string, aggravating: string, testFirst: string }> = {
  P1: {
    weight: 'Os dados apontam para uma aparente dificuldade em abrandar o ritmo de pensamento antes do sono.',
    aggravating: 'Isto pode prolongar o onset do sono quando há foco excessivo na forma como a noite vai correr.',
    testFirst: 'Pode ajudar tentar reduzir ecrãs e trabalho ativo na hora anterior à cama.'
  },
  P2: {
    weight: 'A própria demora em adormecer parece estar a gerar um nível de alerta que dificulta o relaxamento.',
    aggravating: 'Pode tornar-se mais persistente após episódios anteriores de noites mal dormidas.',
    testFirst: 'Levantar da cama se o sono não surgir parece ser a estratégia mecânica mais prudente testar.'
  },
  P3: {
    weight: 'Sinais apontam para a presença de preocupações do dia-a-dia a serem processadas ativamente durante a noite.',
    aggravating: 'Falta de momentos limpos ao longo do dia para processar esses temas.',
    testFirst: 'Escrever os tópicos pendentes num bloco antes de deitar pode ajudar a externalizar a carga.'
  },
  P4: {
    weight: 'A leitura sugere um possível sentimento de falta de apoio que eleva o nível de alerta do corpo.',
    aggravating: 'O silêncio do quarto pode realçar este estado.',
    testFirst: 'Experimentar usar ruído branco suave ou manter apenas a luz mais fria/apagada gradualmente.'
  },
  P5: {
    weight: 'O padrão reflete possivelmente interrupções ligadas às responsabilidades com outros (filhos pequenos, animais, cuidados).',
    aggravating: 'A ausência de tempo de pausa pessoal durante o dia parece agravar a qualidade do descanso transversal.',
    testFirst: 'Se for possível evitar interrupções, garantir pausas intencionais durante o ciclo diurno é prioritário.'
  },
  P6: {
    weight: 'O registo mostra que a dor ou o desconforto físico estão ativamente a limitar a continuidade do teu sono.',
    aggravating: 'Manter a mesma postura ou tolerar equipamento desajustado prejudica a recuperação global.',
    testFirst: 'Considerar priorizar o alívio do desconforto antes de tentar ajustar rotinas de horários.'
  },
  P7: {
    weight: 'Parece haver sinais que intersetam instabilidade respiratória e fragmentação.',
    aggravating: 'Pode agravar-se com secura ambiente, posições específicas ou fadiga severa.',
    testFirst: 'Avaliar a posição (evitar dormir sobretudo de barriga para cima) e o fluxo de ar no quarto.'
  },
  P8: {
    weight: 'A digestão ativa perto da hora de deitar parece ser um fator que abranda o arrefecimento natural do corpo.',
    aggravating: 'Refeições ou hidratação muito densas com menos de 2h de distância da cama.',
    testFirst: 'Tentar observar a diferença ao afastar as refeições mais pesadas do momento de ir dormir.'
  },
  P9: {
    weight: 'Sinais inferem que o sistema nervoso pode estar mediado pelo ciclo tardio de resíduos (ex: cafeína ou equivalentes).',
    aggravating: 'Não existir um momento de abrandamento diário ou consumos ao final da tarde.',
    testFirst: 'Esta direção sugere estabilizar o consumo de estimulantes para lá do início da tarde.'
  },
  P10: {
    weight: 'Ruído externo, vibrações ou luzes residuais parecem estar a ter impacto na manutenção do sono.',
    aggravating: 'Falta de isolamento adequado no ambiente em que descansas.',
    testFirst: 'Mascarar sons e isolar luz é muitas vezes uma métrica simples que compensa testar primeiro.'
  },
  P11: {
    weight: 'Nas noites registadas até agora, o teu sono tem sugerido estar mais fragmentado do que contínuo.',
    aggravating: 'Isto aumenta o tempo total na cama de forma contraproducente.',
    testFirst: 'Sustentar o tempo fora da cama quando não se dorme pode ajudar a reconsolidar amanhã.'
  },
  P12: {
    weight: 'Há indícios de despertar antecipado em relação ao horário que inicialmente tinhas previsto.',
    aggravating: 'Alterar a hora de acordar para tentar compensar o cansaço costuma manter este padrão.',
    testFirst: 'A leitura aconselha, como primeiro teste, fixar a hora de levantar incondicionalmente todos os dias.'
  },
  P13: {
    weight: 'O ritmo do sono parece estar dessincronizado devido a oscilações amplas nos horários diários (laborais ou sociais).',
    aggravating: 'Mudanças drásticas do fim-de-semana para os dias úteis.',
    testFirst: 'Manter uma exposição a luz brilhante matutina fixa todos os dias sugere ser a melhor tentativa.'
  }
};
