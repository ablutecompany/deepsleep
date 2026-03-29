# Transformação Beta-Interno Real: Arquitetura de Dados Manuais e Perfil

> [!NOTE]
> Este plano aborda a reconstrução final da Fase 1 e a erradicação absoluta do "Flow Fake/Demo" (Sensores e sementes falsas de noites). A aplicação passará a reger-se estrutural e visualmente pelos *Logs* reintroduzidos pelo utilizador.

## User Review Required

Nenhuma das alterações reabrirá as árvores implementadas na Fase 2 ou 3 da versão atual. Concentra-se meramente na criação limpa, manual, do "Motor Alimentador" (A BaseLine de Fase 1). Por favor, valida a divisão arquitetónica descrita.

## Proposed Changes

---

### UI Core & Routing (Blocos 1 e 2)

#### [MODIFY] [Auth.tsx](file:///c:/Users/nunom/Documents/projetos%20Code/deepsleep/src/pages/Auth.tsx)
- Reafirmar copy estritamente "Beta Interno, não há conta, dados neste browser".

#### [MODIFY] [DataSourceSelection.tsx](file:///c:/Users/nunom/Documents/projetos%20Code/deepsleep/src/pages/DataSourceSelection.tsx)
- Bloquear as opções (1) Automático e (3) Smartwatch com opacidade/label `[Em desenvolvimento]`.
- Ao escolher (2) _Registar Manualmente_, fazer persistência absoluta (`localStorage.setItem('dataSourceType', 'manual')`) e encerramento de qualquer via para `Phase1Entry`.
- Rota passa a enviar para `ProcessHome`.

### Formulário de Registo e Histórico (Blocos 3 a 5)

#### [MODIFY] [ManualLogHub.tsx](file:///c:/Users/nunom/Documents/projetos%20Code/deepsleep/src/pages/ManualLogHub.tsx) (Novo Ficheiro)
- Ecrã principal para quando o DataSource se fixa em Manual.
- Mostra: "Noites Registadas (X/5 válidas)", com botão "Registar nova noite".
- Mostrar lista minimalista (não-administrativa) de noites já gravadas (data, latência declarada, fragmentação declarada).
- Botão/Swipe para Editar/Apagar noites da lista. Se a noite não validar os campos primários de preenchimento, ela bloqueia submissão.

#### [NEW] [ManualLogForm.tsx](file:///c:/Users/nunom/Documents/projetos%20Code/deepsleep/src/pages/ManualLogForm.tsx)
- Formulário clínico contido: 
  - Data Base
  - Hora de Deitar e Acordar
  - Latência (Minutos Adormecer)
  - Despertares (Qtd)
  - Tempo Acordado e Recuperação
  - Marcadores checkbox list (Os `markers` já suportados).

### A Criação do Perfil Puro (Blocos 6 e 7)

#### [MODIFY] [Profile.tsx](file:///c:/Users/nunom/Documents/projetos%20Code/deepsleep/src/pages/Profile.tsx)
- Abandono total da demodata hardcoded (*que antes listava tempos absurdos ou temperaturas*).
- Adição da tag editorial `(Perfil em construção)`.
- Fazer parse do `getManualLogs()`. O componente converte os dados reias:
  - Latência Média (Soma das latências / número de Logs).
  - Soma da Fragmentação (Despertares).
  - Extração de `Marcadores Frequentes` se baterem taxa superior a 50% das noites.
- Mostrar "O que parece fixo" e "O que ainda está em avaliação" caso haja menos de 5 noites.

### Clean-up de Falsas Sessões (Bloco 10)

#### [MODIFY] [ProcessHome.tsx](file:///c:/Users/nunom/Documents/projetos%20Code/deepsleep/src/pages/ProcessHome.tsx)
- Cortar botão "Reset Flow Simulation".
- Garantir que o gate "1. Monitorização" abre o `<ManualLogHub />` e nunca o `Phase1Progress/ActiveSession`.

## Open Questions

> [!CAUTION]
> Ao mudar a arquitetura de base para "Sem Mock Dados", o Perfil ficará em branco se não houver noites registadas. Consideras aceitável que o utente tenha primeiro de registar 1 a 2 noites reais para que a caixa de "Baseline" comece sequer a gerar parágrafos? (A resposta lógica é Sim, mas exijo confirmação).

## Verification Plan

### Manual Verification
1. Abrir a app de fresco (Limpar cache).
2. Tocar em "Registar Manualmente" e verificar que as outras fontes não arrancam.
3. Inserir manualmente que demorei 60 minutos a dormir.
4. O Perfil de Fase 1 mostrar 60m Média em vez de "0h40 artificial".
5. Entrar em Fase 2, e garantir que a minha simulação é apanhada de raiz pela árvore já reestruturada de latência prolongada, rebatendo propostas limpas.
