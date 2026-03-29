import json
import re
import os

raw = """
Q01
Tipo: Escolha única
Pergunta: Quando pensas numa noite "boa", o que costuma estar diferente?
Respostas:
A. O meu corpo desliga mais depressa
B. A minha cabeça vem mais calma
C. O dia foi mais leve
D. Houve menos interrupções à minha volta
E. Não noto um padrão claro

Q02
Tipo: Escolha única
Pergunta: Nas noites mais difíceis, qual é normalmente a primeira coisa que sentes que falha?
Respostas:
A. Demoro a adormecer
B. Adormeço, mas acordo a meio
C. Acordo cedo demais
D. Durmo, mas não descanso
E. Não consigo dizer

Q03
Tipo: Escolha única
Pergunta: Quando te deitas, a sensação mais habitual é:
Respostas:
A. Já estou pronto para dormir
B. O corpo está cansado, mas a cabeça não
C. Ainda estou "preso" ao dia
D. Tenho receio de como a noite vai correr
E. Depende muito do dia

Q04
Tipo: Escolha única
Pergunta: Qual destas frases se aproxima mais de ti?
Respostas:
A. O meu sono piora quando levo o dia comigo para a cama
B. O meu sono piora quando o meu corpo incomoda
C. O meu sono piora quando o ambiente falha
D. O meu sono piora sem razão evidente
E. O meu sono é quase sempre igual

Q05
Tipo: Escolha única
Pergunta: Quando uma noite corre mal, no dia seguinte costumas pensar:
Respostas:
A. "Era previsível"
B. "Houve algo que me ativou"
C. "O meu corpo não ajudou"
D. "Sei que isto vai repetir-se"
E. "Nem sempre percebo porquê"

Q06
Tipo: Escolha única
Pergunta: Se tivesses de apontar a origem mais provável do problema, para onde olharias primeiro?
Respostas:
A. Para a minha cabeça
B. Para o meu corpo
C. Para a minha rotina
D. Para o meu contexto / casa / relações
E. Para várias coisas ao mesmo tempo

Q07
Tipo: Escolha única
Pergunta: Ao final do dia, sentes mais frequentemente:
Respostas:
A. Saturação mental
B. Cansaço físico
C. Irritabilidade / peso emocional
D. Falta de tempo para desacelerar
E. Nenhuma destas domina

Q08
Tipo: Escolha única
Pergunta: O teu sono parece mais vulnerável a:
Respostas:
A. Dias intensos
B. Noites desorganizadas
C. Pessoas / casa / contexto
D. Sintomas físicos
E. Mudanças de horário

Q09
Tipo: Escolha única
Pergunta: Quando a noite corre melhor do que o habitual, isso parece dever-se mais a:
Respostas:
A. Menos pressão interna
B. Mais ordem externa
C. Melhor conforto físico
D. Mais previsibilidade
E. Ainda não percebi

Q10
Tipo: Escolha única
Pergunta: Que frase te descreve melhor?
Respostas:
A. Adormecer é a parte difícil
B. Manter o sono é a parte difícil
C. Acordar cedo demais é a parte difícil
D. O problema é a sensação de sono pouco reparador
E. O problema muda de forma

Q11
Tipo: Escolha única
Pergunta: Quando as luzes se apagam, a tua mente tende a:
Respostas:
A. Abrandar naturalmente
B. Rever o dia
C. Saltar entre assuntos
D. Antecipar o dia seguinte
E. Ficar alerta com o próprio sono

Q12
Tipo: Escolha única
Pergunta: Qual destas situações é mais tua?
Respostas:
A. Penso demais antes de adormecer
B. Penso demais quando acordo a meio da noite
C. Evito pensar, mas o corpo fica tenso
D. Nem penso muito; só não adormeço
E. Muda de noite para noite

Q13
Tipo: Escolha única
Pergunta: Quando tens dificuldade em dormir, o conteúdo mental costuma ser mais:
Respostas:
A. Prático / tarefas
B. Emocional / relacional
C. Inseguranças / medo / antecipação
D. Aleatório e disperso
E. Não noto conteúdo claro

Q14
Tipo: Escolha única
Pergunta: O teu cérebro à noite parece mais:
Respostas:
A. Organizado, mas ativo
B. Acelerado e desordenado
C. Preso a um tema
D. Em vigilância
E. Normal

Q15
Tipo: Escolha única
Pergunta: Até que ponto o próprio sono se tornou um assunto dentro da tua cabeça?
Respostas:
A. Nada
B. Um pouco
C. Bastante
D. Muito
E. É das primeiras coisas em que penso

Q16
Tipo: Escolha única
Pergunta: Quando percebes que não estás a adormecer, o que acontece por dentro?
Respostas:
A. Nada de especial, espero
B. Fico irritado comigo
C. Começo a contar o tempo
D. Sinto receio da noite e do dia seguinte
E. Tento controlar o sono

Q17
Tipo: Escolha única
Pergunta: Qual destas frases te toca mais?
Respostas:
A. "Se eu desligasse a cabeça, dormia."
B. "O problema não é pensar; é o corpo não ceder."
C. "O pior é começar a temer que a noite corra mal."
D. "Se nada me interrompesse, dormia."
E. "Não me revejo totalmente em nenhuma."

Q18
Tipo: Escolha única
Pergunta: Quando o sono falha, sentes que tentas forçá-lo?
Respostas:
A. Nunca
B. Às vezes
C. Muitas vezes
D. Quase sempre
E. Já virou hábito

Q19
Tipo: Escolha única
Pergunta: Em relação ao sono, qual destas é mais verdadeira?
Respostas:
A. Confio que o sono acaba por vir
B. Tenho alguma insegurança
C. Fico em alerta se demorar
D. Temo genuinamente não dormir
E. O medo já interfere mais do que o cansaço

Q20
Tipo: Escolha única
Pergunta: Se acordas a meio da noite, qual destas reações aparece primeiro?
Respostas:
A. Volto a dormir facilmente
B. Vejo as horas
C. Começo a pensar
D. Sinto tensão / alarme
E. Fico logo preocupado com o dia seguinte

Q21
Tipo: Escolha única
Pergunta: Quando dizes a ti próprio "tenho de dormir", isso normalmente:
Respostas:
A. Ajuda
B. Não muda muito
C. Piora um pouco
D. Piora bastante
E. É um ciclo quase automático

Q22
Tipo: Escolha única
Pergunta: Qual destas aproxima melhor o teu medo, quando existe?
Respostas:
A. Medo de estar cansado no dia seguinte
B. Medo de perder controlo
C. Medo de entrar numa fase pior
D. Medo de algo estar errado comigo
E. Não sinto esse medo

Q23
Tipo: Escolha única
Pergunta: Com que frequência sentes que a noite começa antes de te deitares?
Respostas:
A. Quase nunca
B. Algumas vezes
C. Muitas vezes
D. Quase sempre
E. Todos os dias

Q24
Tipo: Escolha única
Pergunta: "Levo o meu estado emocional para a cama."
Respostas:
A. Quase nunca
B. Às vezes
C. Frequentemente
D. Muito frequentemente
E. É quase a regra

Q25
Tipo: Escolha única
Pergunta: Nas noites piores, sentes mais:
Respostas:
A. Excesso de pensamento
B. Excesso de alerta
C. Excesso de emoção acumulada
D. Excesso de esforço para dormir
E. Várias destas ao mesmo tempo

Q26
Tipo: Escolha única
Pergunta: O teu dia tende a terminar com:
Respostas:
A. Fecho claro
B. Transição confusa
C. Trabalho até tarde
D. Tarefas domésticas / familiares
E. Ecrãs / estímulos até ao fim

Q27
Tipo: Escolha única
Pergunta: A tua vida atual parece mais:
Respostas:
A. Estável
B. Exigente, mas previsível
C. Exigente e variável
D. Caótica em horários
E. Difícil de encaixar numa rotina

Q28
Tipo: Escolha única
Pergunta: O teu trabalho/estudo pesa mais por:
Respostas:
A. Carga mental
B. Pressão / responsabilidade
C. Horários
D. Relações / ambiente
E. Não é o principal

Q29
Tipo: Escolha única
Pergunta: No fim do dia, tens espaço real para desacelerar?
Respostas:
A. Sim, quase sempre
B. Em alguns dias
C. Raramente
D. Quase nunca
E. Só à custa de dormir mais tarde

Q30
Tipo: Escolha única
Pergunta: O que rouba mais o teu tempo noturno?
Respostas:
A. Trabalho / estudo
B. Casa / família
C. Telemóvel / séries / distração
D. Inércia / esgotamento
E. Nada em especial

Q31
Tipo: Escolha única
Pergunta: O teu sono parece pagar o preço de:
Respostas:
A. Dias demasiado cheios
B. Falta de movimento / pouca atividade
C. Horários sem consistência
D. Vida social / lazer tardio
E. Exigência acumulada

Q32
Tipo: Escolha única
Pergunta: Ao longo da semana, a tua energia:
Respostas:
A. É relativamente estável
B. Vai caindo
C. Varia muito
D. Depende das noites anteriores
E. Está quase sempre baixa

Q33
Tipo: Escolha única
Pergunta: Como descreverias a tua última hora antes de te deitares?
Respostas:
A. Calma e repetível
B. Funcional, mas não ideal
C. Reativa / improvisada
D. Ainda acelerada
E. Muito diferente de dia para dia

Q34
Tipo: Escolha única
Pergunta: Qual destas descreve melhor a tua rotina?
Respostas:
A. Tenho horas parecidas
B. Tenho intenção de rotina, mas falha
C. A minha rotina depende de outros
D. A minha rotina muda muito
E. Não tenho rotina de deitar

Q35
Tipo: Escolha única
Pergunta: Se o dia foi bom, o sono normalmente:
Respostas:
A. Melhora bastante
B. Melhora um pouco
C. Muda pouco
D. Nem sempre acompanha
E. Às vezes até piora

Q36
Tipo: Escolha única
Pergunta: Trabalhas/estudas em horários:
Respostas:
A. Muito regulares
B. Moderadamente regulares
C. Irregulares
D. Por turnos
E. Com grande variação entre dias

Q37
Tipo: Escolha única
Pergunta: Ao fim de semana, a tua hora de deitar:
Respostas:
A. Mantém-se próxima
B. Atrasa um pouco
C. Atrasa bastante
D. É imprevisível
E. Compensa a semana

Q38
Tipo: Escolha única
Pergunta: Ao fim de semana, a tua hora de acordar:
Respostas:
A. É parecida
B. Derrapa até 1 hora
C. Derrapa mais de 1-2 horas
D. Varia muito
E. Depende do cansaço acumulado

Q39
Tipo: Escolha única
Pergunta: Sentes jetlag social?
Respostas:
A. Não
B. Ligeiro
C. Moderado
D. Forte
E. Nunca tinha pensado nisso, mas sim

Q40
Tipo: Escolha única
Pergunta: A tua vida ativa / exercício tende a acontecer:
Respostas:
A. De manhã
B. Durante o dia
C. Ao fim da tarde
D. À noite
E. Não existe com regularidade

Q41
Tipo: Escolha única
Pergunta: Há alguma relação que entre contigo na cama, mesmo quando a pessoa não está presente?
Respostas:
A. Não
B. Um pouco
C. Sim, moderadamente
D. Sim, claramente
E. É um dos fatores principais

Q42
Tipo: Escolha única
Pergunta: Quando pensas em carga emocional, ela vem mais de:
Respostas:
A. Família
B. Relação amorosa
C. Trabalho / estudo
D. Solidão / falta de apoio
E. Mistura de contextos

Q43
Tipo: Escolha única
Pergunta: À noite, sentes-te mais:
Respostas:
A. Acompanhado
B. Neutro
C. Um pouco só
D. Bastante só
E. Desligado dos outros

Q44
Tipo: Escolha única
Pergunta: Tens alguém com quem possas falar de forma genuína quando estás em baixo?
Respostas:
A. Sim, com facilidade
B. Sim, mas nem sempre
C. Pouco
D. Quase ninguém
E. Ninguém

Q45
Tipo: Escolha única
Pergunta: O teu contexto social atual é mais:
Respostas:
A. Suporte
B. Neutro
C. Exigente
D. Imprevisível
E. Fonte de tensão

Q46
Tipo: Escolha única
Pergunta: A tua cama/quarto é também espaço de tensão relacional?
Respostas:
A. Não
B. Raramente
C. Às vezes
D. Frequentemente
E. Sim, claramente

Q47
Tipo: Escolha única
Pergunta: Existe alguém cujo estado te mantém em alerta à noite?
Respostas:
A. Não
B. Sim, ocasionalmente
C. Sim, de forma regular
D. Sim, quase todas as noites
E. Prefiro não detalhar

Q48
Tipo: Escolha única
Pergunta: Em casa, a noite depende só de ti?
Respostas:
A. Sim
B. Nem sempre
C. Depende de filhos
D. Depende de outro adulto
E. Depende de várias pessoas

Q49
Tipo: Escolha única
Pergunta: Tens filhos, dependentes ou alguém a teu cargo que interfira com a tua noite?
Respostas:
A. Não
B. Sim, raramente
C. Sim, às vezes
D. Sim, frequentemente
E. Sim, é central

Q50
Tipo: Escolha única
Pergunta: Quando a noite não é "tua", isso deve-se mais a:
Respostas:
A. Crianças / dependentes
B. Outra pessoa em casa
C. Preocupação com alguém
D. Responsabilidade doméstica
E. Não se aplica

Q51
Tipo: Escolha única
Pergunta: Sentir-te compreendido em relação ao teu sono é algo que:
Respostas:
A. Tenho
B. Tenho parcialmente
C. Tenho pouco
D. Não tenho
E. Nunca partilho

Q52
Tipo: Escolha única
Pergunta: Nas noites piores, gostavas mais de:
Respostas:
A. Mais silêncio
B. Mais apoio
C. Mais espaço
D. Menos dependência de outros
E. Mais sensação de segurança

Q53
Tipo: Escolha única
Pergunta: Como está a tua vida amorosa/relacional neste momento, no que toca ao impacto no sono?
Respostas:
A. Não pesa
B. Pesa um pouco
C. Pesa moderadamente
D. Pesa bastante
E. É um foco importante

Q54
Tipo: Escolha única
Pergunta: A tua casa à noite parece mais:
Respostas:
A. Refúgio
B. Funcional
C. Inquieta
D. Exigente
E. Imprevisível

Q55
Tipo: Escolha única
Pergunta: Se o teu sono pudesse falar, diria que te falta mais:
Respostas:
A. Ordem
B. Apoio
C. Descarga emocional
D. Espaço próprio
E. Segurança / previsibilidade

Q56
Tipo: Escolha única
Pergunta: O teu corpo atrapalha o sono mais por:
Respostas:
A. Dor
B. Tensão / inquietação
C. Respiração
D. Digestão
E. Não é o principal

Q57
Tipo: Escolha múltipla
Pergunta: Que tipo de desconforto aparece mais nas noites más?
Respostas:
A. Dor lombar
B. Dor cervical / ombros
C. Dor articular
D. Peso nas pernas / inquietação
E. Tensão muscular
F. Nenhum destes

Q58
Tipo: Escolha única
Pergunta: Tens alguma limitação física ou motora que complique posições, virar na cama ou levantar-te?
Respostas:
A. Não
B. Um pouco
C. Moderadamente
D. Bastante
E. Sim, de forma muito clara

Q59
Tipo: Escolha única
Pergunta: Quando a respiração pesa no sono, isso parece-se mais com:
Respostas:
A. Nariz obstruído
B. Boca seca / respirar pela boca
C. Sensação de não respirar bem
D. Ressonar / pausas
E. Não noto isso

Q60
Tipo: Escolha múltipla
Pergunta: Acordas com algum destes sinais?
Respostas:
A. Boca seca
B. Dor de cabeça
C. Garganta seca
D. Sensação de sono pesado / pouco reparador
E. Azia
F. Nenhum

Q61
Tipo: Escolha única
Pergunta: O teu sistema digestivo interfere mais:
Respostas:
A. Depois do jantar
B. Ao deitar
C. Durante a noite
D. Ao acordar
E. Não interfere

Q62
Tipo: Escolha única
Pergunta: Qual destas te descreve melhor?
Respostas:
A. Janto cedo e leve
B. Janto tarde, mas tolero bem
C. Janto tarde e noto peso
D. A comida noturna muda muito
E. Não noto relação

Q63
Tipo: Escolha múltipla
Pergunta: Há substâncias que tocam o teu sono?
Respostas:
A. Cafeína tardia
B. Álcool
C. Nicotina
D. Cannabis / outras substâncias
E. Medicação calmante / para dormir
F. Nenhuma destas

Q64
Tipo: Escolha única
Pergunta: Em relação à cafeína, tu és mais:
Respostas:
A. Sensível
B. Moderadamente sensível
C. Pouco sensível
D. Não sei
E. Quase não consumo

Q65
Tipo: Escolha única
Pergunta: Em relação ao álcool, qual te descreve melhor?
Respostas:
A. Não consumo / raramente
B. Consumo sem impacto claro
C. Ajuda a desligar, mas piora a noite
D. Piora claramente a noite
E. Não sei

Q66
Tipo: Escolha única
Pergunta: Tomas medicação que possa tocar o sono, a vigília ou a noite?
Respostas:
A. Não
B. Sim, mas pouco relevante
C. Sim, possivelmente relevante
D. Sim, claramente relevante
E. Prefiro não responder

Q67
Tipo: Escolha única
Pergunta: As idas à casa de banho durante a noite são:
Respostas:
A. Raras
B. Ocasionalmente presentes
C. Regulares
D. Frequentes
E. Uma das principais perturbações

Q68
Tipo: Escolha única
Pergunta: Quando te levantas durante a noite, voltas a adormecer:
Respostas:
A. Rapidamente
B. Com algum atraso
C. Com dificuldade
D. Muito mal
E. Depende do motivo

Q69
Tipo: Escolha única
Pergunta: O teu corpo à noite parece mais:
Respostas:
A. Disponível para descansar
B. Cansado mas desconfortável
C. Tenso e vigilante
D. Imprevisível
E. Atrapalhado por sintomas

Q70
Tipo: Escolha única
Pergunta: Se tivesses de escolher um foco físico principal, seria:
Respostas:
A. Dor / limitação
B. Respiração
C. Digestão
D. Noctúria
E. Inquietação corporal
F. Nenhum em especial

Q71
Tipo: Escolha única
Pergunta: O teu quarto à noite tende a ser:
Respostas:
A. Bom para dormir
B. Aceitável
C. Sensível a falhas
D. Frequentemente perturbador
E. Muito inconsistente

Q72
Tipo: Escolha única
Pergunta: O ambiente interfere mais por:
Respostas:
A. Ruído
B. Luz
C. Temperatura
D. Pessoa(s) / animais
E. Mistura de fatores

Q73
Tipo: Escolha múltipla
Pergunta: Quais destes fatores te acordam mais?
Respostas:
A. Barulho
B. Luz
C. Temperatura
D. Movimento de outra pessoa
E. Animais
F. Não consigo identificar

Q74
Tipo: Escolha única
Pergunta: A temperatura do quarto costuma ser:
Respostas:
A. Boa
B. Um pouco quente
C. Um pouco fria
D. Variável / difícil
E. Claramente perturbadora

Q75
Tipo: Escolha única
Pergunta: O teu colchão/almofada/cama parecem:
Respostas:
A. Adequados
B. Aceitáveis
C. Parte do problema
D. Claramente desconfortáveis
E. Nunca pensei nisso

Q76
Tipo: Escolha única
Pergunta: Existe imprevisibilidade externa à noite?
Respostas:
A. Não
B. Pouca
C. Moderada
D. Bastante
E. É frequente

Q77
Tipo: Escolha única
Pergunta: A luz artificial ou de ecrãs antes de dormir pesa em ti de forma:
Respostas:
A. Nenhuma
B. Ligeira
C. Moderada
D. Clara
E. Muito clara

Q78
Tipo: Escolha única
Pergunta: Dormes com:
Respostas:
A. Escuro e silêncio razoáveis
B. Algumas concessões
C. Demasiada luz
D. Demasiado ruído
E. Condições muito variáveis

Q79
Tipo: Escolha única
Pergunta: Há interrupções externas que não controlas?
Respostas:
A. Não
B. Às vezes
C. Regularmente
D. Muitas noites
E. Sim, e desgastam bastante

Q80
Tipo: Escolha única
Pergunta: Se melhorasses só uma condição do quarto, seria:
Respostas:
A. Mais silêncio
B. Mais escuridão
C. Melhor temperatura
D. Melhor cama / ergonomia
E. Mais previsibilidade geral

Q81
Tipo: Escolha única
Pergunta: Há quanto tempo sentes que o sono deixou de ser simples?
Respostas:
A. Muito recentemente
B. Há alguns meses
C. Há anos
D. Desde sempre
E. Vai por fases

Q82
Tipo: Escolha única
Pergunta: O teu problema de sono é mais:
Respostas:
A. Novo
B. Antigo
C. Crónico
D. Intermitente
E. Difícil de definir

Q83
Tipo: Escolha única
Pergunta: Se é antigo, sentes que:
Respostas:
A. Sempre foi parecido
B. Mudou de forma
C. Piorou com a idade / fase de vida
D. Agravou-se recentemente
E. Não se aplica

Q84
Tipo: Escolha única
Pergunta: Que frase descreve melhor a evolução?
Respostas:
A. Sempre dormi assim
B. Começou numa fase específica
C. Vai e vem
D. Tem piorado
E. Melhorou e voltou a piorar

Q85
Tipo: Escolha única
Pergunta: Consegues ligar o início ou agravamento a algum momento?
Respostas:
A. Sim, claramente
B. Talvez
C. Apenas parcialmente
D. Não
E. Prefiro não dizer

Q86
Tipo: Escolha única
Pergunta: Quando o problema piorou, isso coincidiu mais com:
Respostas:
A. Mudança de rotina
B. Relação / família
C. Trabalho / estudo
D. Saúde / sintomas
E. Não sei / mistura

Q87
Tipo: Escolha única
Pergunta: No último ano, o sono:
Respostas:
A. Melhorou
B. Manteve-se semelhante
C. Oscilou
D. Piorou um pouco
E. Piorou muito

Q88
Tipo: Escolha única
Pergunta: Qual destas frases é mais tua?
Respostas:
A. Sei quando isto começou
B. Sei quando piorou
C. Nunca desaparece totalmente
D. Aparece por fases
E. Não lhe encontro narrativa

Q89
Tipo: Escolha única
Pergunta: Há épocas em que quase te esqueces do problema?
Respostas:
A. Sim
B. Às vezes
C. Pouco
D. Raramente
E. Nunca

Q90
Tipo: Escolha única
Pergunta: Em relação ao futuro do teu sono, sentes-te mais:
Respostas:
A. Confiante
B. Moderadamente esperançoso
C. Incerto
D. Preocupado
E. Bastante desanimado

Q91
Tipo: Escolha única
Pergunta: Quando tens uma noite melhor, o dia seguinte tende a ser:
Respostas:
A. Claramente melhor
B. Um pouco melhor
C. Só ligeiramente melhor
D. Nem sempre diferente
E. Ainda pesado

Q92
Tipo: Escolha única
Pergunta: Há algo que o teu corpo tenta dizer-te à noite e que tu achas que ainda não entendeste?
Respostas:
A. Não
B. Talvez
C. Sim, um pouco
D. Sim, bastante
E. Sim, claramente

Q93
Tipo: Escolha única
Pergunta: Qual destas frases te expõe mais?
Respostas:
A. Não consigo desligar
B. Não me sinto seguro para descansar
C. O meu corpo não acompanha
D. A minha vida não deixa espaço
E. O problema já ganhou peso próprio

Q94
Tipo: Escolha única
Pergunta: Se tivesses de escolher um "saboteur" principal, seria:
Respostas:
A. Eu próprio / a minha cabeça
B. O meu contexto
C. O meu corpo
D. A minha rotina
E. Ainda não consigo escolher

Q95
Tipo: Escolha única
Pergunta: O teu sono piora mais quando:
Respostas:
A. Estou sob pressão
B. Estou emocionalmente mexido
C. Estou fisicamente pior
D. Perco rotina
E. Fico mais atento ao próprio sono

Q96
Tipo: Escolha única
Pergunta: A sensação de vigilância à noite vem mais de:
Respostas:
A. Tensão interna
B. Medo de não dormir
C. Responsabilidade com alguém
D. Sintomas físicos
E. Ambiente

Q97
Tipo: Escolha única
Pergunta: Se retirasses um único fator, qual teria maior probabilidade de melhorar a tua noite?
Respostas:
A. Pressão mental
B. Ativação emocional
C. Interrupções externas
D. Sintomas físicos
E. Horários irregulares

Q98
Tipo: Escolha única
Pergunta: Que tipo de ajuda sentes que mais falta ao teu sono?
Respostas:
A. Estrutura
B. Alívio mental
C. Mais segurança / previsibilidade
D. Ajuste físico / corporal
E. Menos interferência externa

Q99
Tipo: Escolha única
Pergunta: Quanto do teu problema sentes que está escondido por baixo da superfície?
Respostas:
A. Quase nada
B. Alguma coisa
C. Bastante
D. Muito
E. Tenho coisas que nem eu nomeio bem

Q100
Tipo: Escolha única
Pergunta: Se esta app conseguisse descobrir uma única verdade útil sobre o teu sono, preferias que fosse:
Respostas:
A. O que me ativa por dentro
B. O que me interrompe por fora
C. O padrão temporal mais importante
D. O custo das minhas rotinas
E. O fator escondido que eu estou a subestimar
"""

output = """export type QuestionType = 'single_choice' | 'multi_choice';

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

export const SHORT_MODE_QIDS = ['Q02', 'Q03', 'Q11', 'Q16', 'Q19', 'Q29', 'Q43', 'Q56', 'Q73', 'Q84'];

export const LONG_MODE_QIDS = [
  'Q02', 'Q03', 'Q06', 'Q10', 'Q11', 'Q13', 'Q16', 'Q19', 'Q22', 'Q26', 'Q29', 'Q36', 'Q39',
  'Q43', 'Q49', 'Q53', 'Q56', 'Q58', 'Q63', 'Q67', 'Q73', 'Q77', 'Q84', 'Q86', 'Q99'
];

export const QUESTIONS_BANK: Record<string, Question> = {
"""

blocks = re.split(r'\\nQ(\\d{2,3})\\n', '\\n' + raw.strip())

for i in range(1, len(blocks), 2):
    qid = f"Q{blocks[i]}"
    content = blocks[i+1].strip().split('\\n')
    
    qtype = 'single_choice'
    qtext = ''
    opts = []
    
    for line in content:
        line = line.strip()
        if not line: continue
        if line.startswith('Tipo:'):
            if 'múltipla' in line.lower(): qtype = 'multi_choice'
        elif line.startswith('Pergunta:'):
            qtext = line.replace('Pergunta:', '').strip()
        elif line.startswith('Respostas:'):
            continue
        elif re.match(r'^[A-F]\.', line):
            opt_id = line[0]
            opt_text = line[2:].strip()
            # Escape single quotes and newlines if they exist
            opt_text = opt_text.replace("'", "\\'")
            opts.append(f"      {{ id: '{opt_id}', text: '{opt_text}' }}")
            
    qtext_escaped = qtext.replace("'", "\\'")
    
    output += f"  {qid}: {{\n"
    output += f"    id: '{qid}',\n"
    output += f"    type: '{qtype}',\n"
    output += f"    text: '{qtext_escaped}',\n"
    output += f"    options: [\n"
    output += ",\n".join(opts) + "\n"
    output += f"    ]\n  }},\n"

output += "};\n"

os.makedirs('src/domain/Phase2', exist_ok=True)
with open('src/domain/Phase2/questions.ts', 'w', encoding='utf-8') as f:
    f.write(output)

print('Success')
