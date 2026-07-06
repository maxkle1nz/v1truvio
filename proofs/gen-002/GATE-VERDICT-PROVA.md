# GATE-VERDICT-PROVA — gen-002 · MENISCUS · o ARTEFATO (itens 13–14)

**Papel:** Juiz frio do gate da prova (maker ≠ judge). Não vi este código nascer; medi tudo eu mesmo, do zero. Aprovei o brief 12/12 em `GATE-VERDICT.md`; este veredito é sobre o ARTEFATO aterrissado, nunca sobre o brief.
**Data:** 2026-07-06
**Artefato julgado:** `proofs/gen-002/` — `specimen.html` + `specimen.js` + `core.css` + `tokens.css`; `studies.html` + `NOTES.md` (estudo formal A escolhido).
**Mente:** `CONTRACT.md` §"Gate da prova — itens 13–14" e §"Aterrissagem"; Assinatura formal do `BRIEF.md` §8 (3 gestos com PROIBIÇÕES).

## Método (medição independente, não os números do NOTES)

O profile do Playwright MCP estava trancado (`Browser is already in use … mcp-chrome-3ea37a1`) — o mesmo bloqueio que o coder relatou. Não reutilizei nenhum arquivo do coder no scratchpad (`cdp-driver.mjs`, `judge-cdp*.mjs`, `chrome-prof*`): escrevi **meu próprio rig** (`scratchpad/judge-rig/rig.mjs` + `shot.mjs`) — cliente CDP-sobre-WebSocket RFC6455 com apenas Node built-ins (`net`+`crypto`+`http`), zero dependências. Subi um `chrome-headless-shell` (Chromium 148.0.7778.96) **isolado em porta 9231 e user-data-dir próprio**, viewport 1280×800, `deviceScaleFactor` 1 (medições) / 2 (screenshots), `force-color-profile=srgb`. Todas as leituras abaixo saíram do CSSOM/geometria via `Runtime.evaluate` com `returnByValue`, recomputando as fórmulas do zero e comparando com o DOM real. Screenshots próprias: `judge-rig/judge-canonical.png`, `judge-rig/judge-abstain.png`. Após medir, encerrei o headless-shell (porta 9231 livre).

**Estados exercitados:** canônico (full_trust + caller_root_mismatch), degraded, stale, abstain, + mergulho (dive) e `prefers-reduced-motion` emulado.

---

## Item 13 — Teste do template (a estrutura é governada pelo dado?)

**Pergunta (CONTRACT):** trocando a paleta, esta tela poderia ter saído de um kit/template genérico (dashboard, admin, landing)?

**VEREDITO: PASSA.** A estrutura é dirigida pelo dado, medido em três eixos que nenhum kit tem:

**(A) O Trilho posiciona por `log(age_ms)` REAL — recomputado por mim e batendo ao subpixel.**
Recomputei `railX(age) = (ln(age)−ln(MIN))/(ln(MAX)−ln(MIN))`, `MIN=3.6e6`, `MAX=2.592e9` (= `STALE_AFTER_MS` 30d), independente do código, e comparei com `window.__mnsRailX` E com o centro-de-haste medido no DOM:

| age_ms (real do sample) | minha railX | railX do código | centro-haste esperado (px) | centro-haste MEDIDO (px) | Δ |
|---|---|---|---|---|---|
| 133637855 (fable-orchestrator, fresco) | 0.549332987121 | 0.549332987121 | 822.389 | **822.375** | 0.014 |
| 271032997 (fable-brand-critic) | 0.656808288497 | 0.656808288497 | 888.594 | **888.594** | 0.000 |
| 272592718 (brand-audit) | 0.657680459505 | 0.657680459505 | 889.131 | **889.125** | 0.006 |

(track medido: `left=484, right=1100, width=616`.) As três fórmulas são **idênticas ao 12º dígito**; a posição em pixel é a fórmula aplicada, com erro subpixel (<0.02px). A haste NÃO usa `left/top` inline (`hasInlineLeftTop:false`) — a coordenada vem só de `--mns-x`. Tier medulla = haste 3.5px. Os dois claims quase-simultâneos (271M/272M, 0.087% de diferença) cravam a **0.53px** um do outro e o anti-colisão sobe só os rótulos em lanes 0/1/2 — a haste é fiel ao dado, o texto se esquiva.

**(B) O stale é EXILADO fora do eixo — medido.** No estado `stale` (claim do meio marcado), restam **2 marcas no eixo** (contra 3 no canônico) e o item exilado começa em `left=1121`, `> trackRight=1100` (`exiledStartsRightOfAxis:true`), na faixa "FORA DO TRILHO", rótulo "stale". A lei `absent age = unknown, never faked to now` está em pixel: idade-ausente/stale nunca recebe `--mns-x` nem toca a linha confiável.

**(C) A Placa deriva do estado, não é card.** `data-trust`/`data-coverage` no DOM comandam forma, cor e a aba de reconciliação (visível só em `coverage=mismatch` — confirmado na screenshot canônica). Nenhum template resolve trust como uma placa que muda de assento físico.

Evidência visual (`judge-canonical.png`): a leitura é veredito → cobertura → memória → contorno; massa mineral escura fria-neutra, zero glow/neon. Um kit de dashboard posicionaria a memória como lista/feed cronológico e o trust como pill — nada disso está aqui.

---

## Item 14 — Anti-cosplay reverso (cada lei citada tem execução material?)

**Pergunta (CONTRACT / Lei 3 estendida):** alguma lei citada no brief foi apenas citada, sem execução material visível no artefato?

**VEREDITO: PASSA.** As quatro leis executam de fato, e cada gesto respeita as PROIBIÇÕES que ele mesmo declarou no §8. Medições próprias do CSSOM:

**Lissitzky (Assinatura 3 — Placa que assenta ou desloca).** `transform` computado, lido da matriz real:

| estado | matrix medida | rotação | translateX | leitura |
|---|---|---|---|---|
| full_trust | `matrix(1,0,0,1,0,0)` | **0.000°** | **0px** | assenta reto e estável; sombra curta (8/20) |
| degraded | `matrix(0.999701,-0.0244322,0.0244322,0.999701,18,0)` | **−1.400°** | **18px** | desloca + inclina; sombra longa (22/44); verdict REVERIFY |
| abstain | `matrix(1,0,0,1,0,0)` | **0.000°** | **0px** | IMÓVEL apesar de divergente |

É deslocamento/inclinação REAL (−1.4°/18px), não "um card maior que o outro" (o erro nomeado no verdict 001). **Proibição do gesto respeitada.**

**Ando (Assinatura 1 — Meniscus Slit).** No mergulho, medido: painel `top=313.6..486.4`; linha honesta `top=415.4..445.4` — só **41px** dela ao fim do painel (o padding inferior), logo é o último conteúdo. `elementFromPoint(midX, honest.top+1)` retorna `mns-dive__honest` → a fresta pousa **na base do conteúdo honesto**, não no topo (não é "header destacado"). A fresta é `::before` com `content:""`, `height:2.5px`, `background:rgb(205,214,224)` (`--mns-luz-foco-nucleo`) — um CORTE. **`panelBoxShadow: none`** → é luz que entra por corte, não glow espalhado (a proibição própria de Ando). **Proibição respeitada.**

**Moholy-Nagy (eixo de leitura).** O trilho É um eixo real (posição = log(idade), agora→esquerda / passado→direita), com etiqueta-vetor (`source_agent`) apontando a marca e espessura = tier — não é hierarquia de peso genérica. Confirmado em (A).

**Stuart Hall (incerteza com dignidade e opções).** A Linha de Reconciliação mostra a frase real da máquina ("this graph does NOT cover your repo"), os dois caminhos reais (`bound` / `caller`) em mono, e as duas `options[]` acionáveis com a cerimônia declarada — a incerteza revelada ANTES da ação (screenshot canônica), não copy. No abstain, `honest_gaps: []` vira afirmação em serif itálico digno, não espaço morto.

**Doutrina herdada do produto — medida:**
- **Dígito de ms vivo é o ÚNICO número que anima.** Controle (sem reduce): em 900ms os 3 dígitos cresceram +750ms cada (`msAllGrew:true`); fingerprint, sufficiency-nums e pageranks **não mudaram** (`fpChanged:false, numsChanged:false, prChanged:false`). É sinal real (o carve-out do item 8), exclusivo do trilho.
- **Sobrevive a `prefers-reduced-motion` E a decoração morre.** Sob `reduce` emulado (`reducedActive:true`): os 3 dígitos ainda cresceram +750ms (`allGrew:true`) — dado não é animação; ao mesmo tempo `plateTransitionDuration: 0s` — a transição da placa morre. Distinção honesta sustentada. *(Nota de método: minha primeira tentativa usou busy-loop síncrono e bloqueou o event loop, dando falso-negativo; refeito com sleep assíncrono, o resultado acima é o correto.)*
- **"abstain nunca anima."** A Placa em abstain fica `matrix(1,0,0,1,0,0)` — 0°/0px — mesmo sendo estado divergente (medição acima). O `!important` em `[data-trust="abstain"]` do `core.css` segura o zero. O "não sei" não performa.

---

## Observações (o binário não captura — nenhuma bloqueia)

1. **Divergência de rótulo entre core.css e NOTES sobre a distância de anti-colisão** (0.5% no comentário do `core.css` linha ~10 vs 0.087% no NOTES). O valor fisicamente medido é 0.087% (Δ 0.53px). É um comentário desatualizado, não um defeito de comportamento — a haste está correta. Corrigir o comentário na próxima passagem.

2. **A ambiguidade 3-vs-5 do brief (Observação 2 do meu veredito do brief) foi resolvida com honestidade no artefato:** o `core.css` (`.mns-recon__opt[data-ceremony="3"]`) e a nota da opção de ingest ("escolher = rito 3; a ingestão executa com rito 5") deixam explícito o que o brief havia deixado ambíguo. Boa aterrissagem.

3. **`deviceScaleFactor` importa para reproduzir os números.** Minhas posições (dPR=1) batem com as do NOTES; quem reconferir em Retina (dPR=2) verá as mesmas coordenadas CSS, não físicas. Registrado para reprodutibilidade, não é falha.

---

## VEREDITO FINAL

# **APROVADO — itens 13 e 14 PASSAM**

O artefato não é um template repintado: a memória é posicionada por `log(age_ms)` real ao subpixel (recomputado por mim, idêntico ao código ao 12º dígito), o stale é exilado para fora do eixo do tempo (medido: `left 1121 > trackRight 1100`), e o trust é uma placa que muda de assento físico (0°/0px em full → −1.4°/18px em degraded → 0°/0px imóvel em abstain, matrizes lidas do CSSOM). As quatro leis citadas têm execução material medida — Ando é corte na base do painel com `box-shadow:none` (não glow), Lissitzky é deslocamento/inclinação real (não card maior), Moholy é eixo de leitura, Stuart Hall é incerteza com opções acionáveis. As três proibições próprias das assinaturas são respeitadas, e a doutrina herdada do produto (dígito vivo único, sobrevida ao reduced-motion com a decoração morrendo, abstain imóvel) foi confirmada por medição independente. As três observações são polimento de aterrissagem, não bloqueios.

A identidade MENISCUS existe, foi julgada com o artefato diante do juiz, e passou. Próximo passo conforme CONTRACT: registrar o perfil em `presets/`.

*— Juiz frio, gate da prova gen-002, 2026-07-06.*
