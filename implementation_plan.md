# Tempo Simulado e App Clock Central

O objetivo é adicionar um motor interno de simulação temporal ("fast-forward") para testar autonomamente ciclos interativos da Fase 3 de forma contínua, isolada, e sem interferir ou causar regressões com a arquitetura do motor. O modo de teste também simulará re-hidratações de dependências como a data dos check-ins diários.

## User Review Required

> [!WARNING]
> Este refactoring obriga a uma pesquisa global e substituição de todas as datas estáticas baseadas em `new Date()` em ficheiros de lógica de negócio e da UI por `appClock.todayStr()` ou `appClock.now()`. Estás de acordo que todos os domínios (incluindo ManualLogs e Stores da Fase 3) passem a receber tempo via `appClock`?

> [!NOTE]
> Vou hospedar os controlos ("Avançar 1 Dia", "Reset Modo Real") no painel flutuante vazio atual que se encontra em `<DevTools />` (que vive globalmente por cima da app invisível para utilizadores normais, no canto inferior direito/debug). Aprovas utilizar este container? Se sim, implemento o relógio lá.

## Proposed Changes

---

### Phase 3 - Domain e Utilidades

#### [NEW] src/utils/appClock.ts
Será a espinha dorsal de todo o _deepSleep_.
Contará com um singleton exportado com métodos que delegam internamente para o standard `Date`:
- `now()`: se a flag `__beta_clock_mode` for `"simulated"`, avalia um offset em dias guardado no local storage (ex: `1` = um dia à frente) e aplica-o sobre `new Date()`. Retorna o Date final. Se for real, só resolve com `new Date()`.
- `todayStr()`: retorna `this.now().toISOString().split('T')[0]`. Prático para indexar datas exatas num fuso correto local.
- `addDays(n: number)`: soma dias ao offset de simulação e ativa o modo _simulated_. Lança um CustomEvent para forçar reactividade global das UIs ativas (Home, Profile, Phase3Context): `window.dispatchEvent(new Event('deepsleep_clock'))`.
- `reset()`: volta ao _real mode_, limpando os offset simulados e despachando o evento `deepsleep_clock`.

#### [MODIFY] src/store/Phase3ContextStore.tsx
- O próprio hook de estado da store de Fase 3 vai passar a ter um `useEffect` para escutar `'deepsleep_clock'` e atualizar o subestado reativo `todayStr` da session atual.
- Tudo o que envolvia `new Date()` em mutadores reativos internos passará para o helper `appClock`.

#### [MODIFY] src/pages/ProcessHome.tsx
- Injeta hooks adaptáveis que dependem de ver qual a data simulada de hoje.
- O ecrã subscreve os eventos temporais para decidir instantaneamente o *nextStep* (ex: O user premir "+1 Dia" deve atualizar do checkin feito para pedir o próximo, ou saltar para o botão final de Review Phase 3).

#### [MODIFY] src/domain/... (ManualLogStore e Engine)
- Atualizar geradores estáticos de datas em logs, check-ins, `createdAt`, etc. para se socorrerem unicamente do relógio simulado (em testes) em vez da máquina.

---

### Controlo de UI na Superfície Beta

#### [MODIFY] src/components/DevTools.tsx
Adição de um pequeno menu UI com os botões rápidos:
- Toggle real / simulado explícito.
- "Avançar +1 Dia."
- Componente reactivo refletindo texto "Modo: Simulado | Data: 2024-05-12".
*A interface será super compacta e restrita propositadamente a Beta Tester Tools invisível.*

## Open Questions

1. Quero confirmar: Queres que a app inteira obedeça a este relógio, certo? **Isto inclui os IDs e campos de data gerados num Formulário Manual (Noites)**. Eu considero isto o cenário ideal, para garantir que registos falsos no modo de teste se agregam nas datas simuladas do futuro ou do passado sem gerar bugs estranhos. Concordas?
2. Em termos do fuso horário para a separação `[T][0]`, tens preferência numa adaptação pura baseada em Local Time do browser (correto e clássico para local-storage na App de Sono) ao invés do estrito UTC global? (Vou usar o offset do fuso local).

## Verification Plan

### Testes Rápidos Frequentes ("Time-travel")
1. Arrancar _deepSleep_.
2. Começar um _Active Phase 3 Cycle_ novo num dispositivo sem ciclo.
3. Submeter um log real, regressar a Home e registar o Check-in positivo. Verificar que bloqueia até "*voltarmos amanhã*".
4. Recorrer ao mini-panel flutuante no canto e clicar **"+1 Dia"**.
5. Validar o refresh instantâneo da Home para "Hoje precisamos deste registo" com o dia do calendário fictício novo atualizado.
6. Repetir e validar expiração. Clicar **Reset Tempo Real** e garantir que se regressa atrás purgado do teste virtual.
