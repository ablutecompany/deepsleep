# DIAGNÓSTICO ESTRUTURADO FASE 2: MOTOR DE CONTEXTO E PROPOSTAS

> [!NOTE]
> Este documento reflete a auditoria exata do código actual localizado em `src/domain/Phase2/engine.ts`, `questions.ts`, e `proposals.ts`, incluindo as recentes amarrações de guardas e intersecções introduzidas na Tarefa anterior.

## A) FICHEIROS INSPECIONADOS
- `src/domain/Phase2/engine.ts` (Matrix de Scoring F1 a F18 e Integração de ManualLogs)
- `src/domain/Phase2/questions.ts` (Banco de Perguntas e Pool de Seleção Dinâmica)
- `src/domain/Phase2/proposals.ts` (Catálogo de Ações e Lógica de Priorização)
- `src/pages/ProcessHome.tsx` / `Phase2Entry.tsx` / `Phase3Home.tsx` (Routing e Guardas)

## B) TAREFA 1: MAPA REAL DO MOTOR ATUAL (A MATRIX)
O `engine.ts` atual funciona com 18 factores ocultos (F1 a F18), extraídos somando opções de 1 a 4. Algumas perguntas têm multiplicadores discricionários (`1.5*`, `0.8*`). 
**Factores (Drivers) atuais avaliados:**
- F1: Aceleração/Latência | F2: Ansiedade com o sono | F3/4: Carga mental/Estilo de vida | F5: Horários
- F6/7: Peso Emocional / Relações | F8: Dependentes/Filhos
- F9: Dor/Físico | F10/F11: Respiração / Digestão | F12: Substâncias | F13: Ambiente
- F14/15: Manutenção (acordar a meio ou cedo) | F16: Noctúria | F17: Cronicidade | F18: Fator Oculto de Contradição

**As respostas não valem o mesmo**. A selecção múltipla (`M('Q57')`) atribui logo `2.0` base. E o index da resposta `A(0)` a `E(4)` mapeia pontuações parciais. 
**Confidence / Contradições:** A confiança inicia a 85% e há 3 guardas actuais. C1 (assume ter medo mas não acorda sob alerta), C2 (diz estar acompanhado mas sem apoio nenhum), C3 (sente dor mas nega problemas físicos). Estes cortam entre 10 a 15% a confiança.
**Fase 1 (Cruzamento rudimentar atual):** O código atual intercepta `avgLatency`, `avgAwakenings` e os rótulos `"Ida à casa de banho" / "Dor" / "Telemóvel"`. Multiplica os Fs estáticos (Ex: `F11 *= 1.6` se acorda mais de 2x; `F9 *= 1.8` se marca Dor).

## C) TAREFA 2: SELEÇÃO 10/25 (O POOLING)
Na intervenção anterior mudámos os Arrays Estáticos absolutos para um motor `getQuestionsForMode` dividido por 6 domínios (P1 a P6).
**Diagnóstico:**
- O slicing já não é rígido. A selecção garante `Q03` e `Q06` como âncoras inamovíveis. 
- Há cobertura garantida dos 6 blocos na proporção desenhada. 
- **O que falha atualmente?** Quando o utente tira as 10 perguntas rápidas, o risco da aleatoriedade atirar com as perguntas marginais em `draw(p1, 2)` sem garantir a mecânica do adormecimento base diminui a fiabilidade do `engine.ts` para capturar `F14` com poucas respostas (são precisas múltiplas para inflacionar a soma).

## D) TAREFA 3: AUDITORIA CRUZAMENTO F1 x F2
Foi injectado ontem o `getManualLogs` no `engine.ts`.
**Como funciona hoje:** A Fase 1 atua apenas como um "multiplicador retroativo". 
- **Fraqueza:** Se o utente não adormeceu (`avgLatency > 40`), o sistema empurra agressivamente F1 e F2 `* 1.4`. 
- **Sinal Verdadeiro no Produto:** A app ainda é **P1-Cêntrica (Doença do Adormecimento)**. Continua a tratar as métricas de Fase 1 via "moduladores de Matrix" em vez de tratar "Problema Biológico" a partir dos dados limpos, com a Fase 2 a afunilar os sub-motivos.

## E) TAREFA 4: FALHAS DA ÁLGEBRA E SOBREPESO (Ecrã vs Função)
**1. Telemóvel (F1 Exagerado):** O `engine.ts` atual lê a "Q26 (uso de ecrãs/distração ao deitar)" ou a tag da Fase 1 e, mesmo com as deduções recém instaladas, o motor tende a forçar "Interrupção luminosa" ou "Aceleração Mental", ignorando que rolar TikToks pode ser a distração necessária para o utente baixar a ansiedade pre-sono (hipoteticamente, a sua única estratégia sedativa actual).
**2. Fatores Sobrepesados:** `F1` e `F2` (Arousal e Ansiedade). Dominam facilmente a soma da Matrix porque têm 11 e 8 somas no `evaluate()`. Em contrapartida, F9 a F12 ("Problemas Físicos reais e rotina") têm muito poucas perguntas. Como F1 soma 11 valores e divide por 3, frequentemente ultrapassa factores graves como Apneia silenciosa / Dor.
**3. Indistinção Estrutural:** A matriz é uma misturada aditiva. Se sofres de Noctúria verdadeira (F16), mas tiveres muitas pressões de trabalho, o P1 (Arousal) vai roubar as dominantDrivers, escondendo o facto puramente fragmentário orgânico.

## F) TAREFA 5: AUDITORIA ÀS PROPOSTAS E FAMÍLIAS
Atualmente há apenas **quatro** propostas implementadas (`prop_ancora`, `prop_reentrada`, `prop_ergo`, e `prop_descomp` / `prop_hidrica`). E a `prop_ancora` atesta por defeito como fallback preguiçoso para "falta do que recomendar, define uma hora regular". 
- Não distingue `"aliviar a mente"` de `"estagnação para exaustão cognitiva"`.
- Considera de forma pobre a manutenção do sono durante a reentrada (as madrugadas no escuro são uma família em branco tirando `prop_reentrada`).

## G) TAREFA 6: O PLANO EM CURSO (ROUTING ERROR)
Apesar do meu ajuste transacional prévio ao botão "2" no `ProcessHome`, o routing de regresso (abrir a app do zero na via `<Auth />` -> `navigate('/process_home')`) bloqueava num lapso conceptual: se passarem 3 dias e houver um ciclo a decorrer, o `ProcessHome` obriga o humano a clicar no Card 3. A ausência de um "Painel Activo" de ecrã inteiro na raíz faz a app ignorar o momento crítico do utilizador, escondendo o facto de que "estamos num protocolo experimental" por trás de uma lista de etapas (Fase 1, Fase 2, Fase 3).

## H) TAREFA 7: 4 CASOS DE USO CONCRETOS

**1. Latência mínima + Fragmentação Forte + Rolar Vídeos no Cansaço**
- *Fase 1 Input:* Latência: 5min. Despertares: 4. Marcadores: "Telemóvel na cama". 
- *Fase 2 Respostas:* Ansioso por acordar, mente ligada nas madrugadas.
- *Falso Positivo Atual:* Vai dar "Âncora Circadiana" ou vai forçar "Redução de estímulo na hora de apagar" (Assumindo que o telemóvel arruinou estruturalmente), sem atacar a manutenção central da quebra de arquitectura a meio da noite.

**2. Noctúria silenciosa mascarada com Insónia Tensão**
- *Fase 1 Input:* Latência longa (45min). Marcador: Cansaço e alguma ida ao WC.
- *Fase 2 Respostas:* Fogo denso cruzado entre o medo de não dormir (Arousal) e as idas à casa de banho.
- *Falha Atual:* Porque D1 e D2 somam mais rápido os pontinhos na matriz algébrica, o motor assume "P2: Ansiedade" antes sequer de aconselhar a cortar líquidos ou abordar as micções, que podem ser a agulha causadora do disparo ansioso.

**3. Irregularidade Exaustiva Transversa (Turnos disfarçados)**
- *Fase 1 Input:* Camas deitadas às 23h, 04h, 21h, entre 3 noites.
- *Fase 2 Input:* Pouco assinalamento ao cansaço mas assumiu horários loucos na Q36.
- *Falha Atual:* Como não é grave numericamente na ANSIEDADE, atira a proposta parva "Acordar sempre à mesma hora (prop_ancora)", forçando uma regra insalubre para quem chega tarde a casa da rotação laboral. 

**4. Carga Mental Pura / Cuidador passivo**
- *Fase 1:* Deita e acorda muitas vezes, marca "Interrupções".
- *Fase 2:* Q49 confirma ter crianças. 
- *Falha Atual:* O `engine` actual lê "F8 > 1.5", adiciona a flag `Cuidadores`, mas as dominant drivers recaem no P1 (Arousal Mental) sugerindo para "redução do atrito com luzes de ecrã". Inócuo.

---

> [!WARNING]
> ## TAREFA 8: PROPOSTA DE NOVA ARQUITETURA PARA VALIDAÇÃO HUMANA
> **[Não está implementado. Aguarda que decidas prosseguir na próxima mensagem]**

### A) Eixo Fase 1: Árvore Base
Mudar o Motor para um conceito de Árvore Primária (A, B, C):
1. Problema de Adormecimento (Latência Elevada).
2. Problema de Manutenção (Duração cortada por n pedaços).
3. Problema Orgânico Visível (Noctúrias frequentes/Dor transversal explícita na medição pura).
4. Problema de Reentrada/Ritmo (Acorda 1h às 04 da manhã, insónia pontual de matina).

### B) Função da Fase 2 (Diagnóstico Fino Complementar)
A Fase 2 deixa de lutar pelos mesmos terrenos com notas. As suas 10/25 perguntas passam a ser exclusivas para responder não O QUE TENHO, mas O PORQUÊ DISSO ESTAR PRESENTE, ramificando o Padrão Biológico F1 medido.
- *Exemplo*: F1 revela que adormecimento é imediato, mas há Fragmentação Crónica. O `engine.ts` só usa Fase 2 para descobrir a Família: "Isto é Dor Física?", "Este micro-despertar está em chamas pelo Arousal ansioso do escuro?". 

### C) Famílias Ricas de Propostas (Táticas Funcionais)
Reescrever o `proposals.ts` para assumir o Telemóvel como "Funcional" nos limites certos:
- **Tática de Dissociação Condicionada** (Ir dar a volta à casa e não forçar escuridão se despertar em ansiedade).
- **Tática de Carga Cognitiva Neutra** (Rolar o Tiktok não é pecado mortal se a latência não existe e o problema é outro. Mas substituir TikTok por Focus Tasking pode ser sugerido em adormecimentos mortos).
- **Tática do Defensor Térmico** (Banho antes de deitar com controlo estrito). 

### D) Repensar o Routing (O "Ecrã Protocolo")
Mudar o `App.tsx` global. No lugar de arrancar para `<ProcessHome>`, se houver ciclo de testes a valer (`cycle`), arranca um ecrã fullscreen de *"Plano 21 dias em curso. Está na hora de apontar a marca e ver as tendências. Continuas forte?"* Nada de botões para reler a Fase 2 (só disponíveis em "Consultar Perfil nas Definitions / Menu"). 
Se houver falha de ciclo declarada após os X dias, entramos numa mini-rotação (`Q03` e 3 relacionadas com a falha apenas) e nunca repetir todos os inquéritos longos.
