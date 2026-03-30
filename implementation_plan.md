# Ligação Global da UI ao Motor de Decisão (Fase Final)

O objetivo desta fase é destruir abstrações da UI. Em vez de painéis genéricos de "O teu sono é um Processo" com botões cegos que podem cair em estados mortos, a interface deve apenas refletir o estado real persistente das camadas inferiores (`decisionEngine` e `Phase2/3Stores`).

## User Review Required

> [!IMPORTANT]
> **Fim dos Painéis Educativos Genéricos na Home**: Vou apagar o bloco dos "process-stages" do fundo do `ProcessHome.tsx`. A Home passará a ser puramente um bloco central situacional que muda 100% o seu layout consoante a *pendência* (tens de registar o dia hoje / a janela expirou para rever / o teu ciclo está em *Hold Prudente* / ainda estás em Fase 1, etc.). De acordo?

> [!WARNING]
> **Footer Tabs**: O Botão "Padrões" do rodapé apontava para `/phase2/context` o que mistura Interpretação pontual (Fase 2) com Leitura longitudinal. Vou corrigir o apontamento do "Padrões" estritamente para a página `/patterns` e deixar o gateway para Interpretação nas mãos puras do motor situacional da Home.

## Proposed Changes

### 1. Reentrada e Home Central (`ProcessHome.tsx`)
- **Remoção de Espaços Mortos e Divagações**: A Home deixará de renderizar as caixas de Estado global (Fase 1/2/3). 
- **Mapping Direto de Outcomes do Motor**: 
   - A Home dita a ação imperativa: "A aguardar Interpretação" (`nightCount >= 5` mas sem `deliverable`).
   - Ciclo `active` = Foco no check-in do dia.
   - Ciclo expirou = Foco máximo na "Revisão Pendente".
   - Outcomes Concluídos (`completed_keep`, `completed_adjust`, `switch`, `pending_reassessment`, `active_hold`) mostram um layout dedicado correspondente e bloqueiam interações redundantes. O copy reflete a semântica de forma determinística ("Nova Direção", etc).
- **Sem Loops**: Os CTA da home injetam o utilizador no percurso certo (`Phase2/Entry` se não interpretou, `/manual_log_hub` se faltam dias, `/phase3_home` se janela para fechar).

### 2. Semântica Dura no Rodapé (`BottomNav.tsx` & Roteamento em App.tsx)
- **Início**: Renders `/process_home`.
- **Noite**: Renders `/manual_log_hub` (onde tens "Adicionar registo", histórico das sestas e edição da privação de sono). Apagarei botões de transição narrativa ("Avançar para interpretação") para que esta tab sirva sempre APENAS a recolha orgânica do sono diário (view history, edit/delete, add new log).
- **Padrões**: Point to `/patterns`. Remover CTA abstrato no final desta página para que seja um visualizador analítico longitudinal puro.
- **Perfil**: Point to `/profile`. A página de perfil reflete propostas do motor e histórico. 

### 3. Histórico e Motor Legacy no Profile (`Profile.tsx`)
- **Bug Fix de Abstração Legacy**: Como mudámos o Motor, o `Profile.tsx` ainda tenta pintar o histórico assumindo labels antigos do `learningStore` como "KEEP_REFINING". Irei refatorizar o Profile para consumir as novas decisões estruturadas em `CycleFeedbackRecord.decisionEngineOutcome`. O perfil passa a listar o teu histórico de evolução longitudinal real baseado nos outputs do motor.

## Open Questions

Desejas manter o botão text-btn no fundo da Home que diz **"Reiniciar Beta"** para os teus testes de usabilidade no momento, ou já o devemos esconder agora que estamos na versão de usabilidade "hardened"? Recomendo manter com baixa opacidade para não trancar ninguém num mau estado durante a experimentação alpha.

## Verification Plan

### Manual Verification
1. Abrir a app e confirmar que não há ciclos em loop.
2. Chegar a 5 noites -> A home reage dinamicamente ditando "Interpretação Pendente".
3. Nas tabs do rodapé, validar o total desacoplamento:
   - "Noite" permite voltar a apagar ou criar sem forçar redirect para Fases.
   - "Padrões" lê a evidência longitudinal.
4. Perfil carrega os *learning records* passados com a linguagem madura ditada pelo motor de decisão central.
