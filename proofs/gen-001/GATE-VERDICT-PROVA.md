# GATE-VERDICT-PROVA — gen-001 · flight-watcher (itens 13–14, sobre o ARTEFATO)

> **Papel:** JUIZ FRIO da prova (adversarial; não vi este código nascer).
> **Data:** 2026-07-06.
> **Documento julgado:** o artefato aterrissado — `specimen.html` + `core.css` + `tokens.css` + `specimen.js` (+ `screenshot.png` em-alvo, `screenshot-states.png` acima-do-alvo, contra `screenshot-v1-rejected.png`; `studies.html` e `NOTES.md` como documentação do estudo).
> **Mandato:** CONTRACT § "Gate da prova — itens 13–14" + § "Aterrissagem"; BRIEF §8 "Assinatura formal" (G1 Régua-mestra · G2 Corte do Limiar · G3 Placa Pênsil, com as proibições próprias) e §9(g). Contexto: `verdicts/001-flight-watcher.md` (o padrão de mediocridade que o item 13 existe para pegar).

## Método (declarado)

1. **Leitura integral do código** (`core.css`, `tokens.css`, `specimen.html`, `specimen.js`) — verificação de que a geometria declarada existe como CÓDIGO: fórmula única da escala, posição-como-dado, estados como geometria.
2. **Screenshots entregues** inspecionados (em-alvo, acima-do-alvo, v1 rejeitada) — o que o olho vê.
3. **Medição própria em browser real** — o Playwright MCP seguia indisponível (profile trancado); abri o specimen num **Chromium headless isolado** (perfil descartável) dirigido por **CDP cru via WebSocket nativo do Node 22**, zero dependências, viewport 1280×800 (o mesmo dos screenshots). Medi `getBoundingClientRect`/`getComputedStyle`/`elementFromPoint` nos estados `em-alvo`, `acima-do-alvo` e `vazio`. Driver e screenshots meus no scratchpad da sessão — **nenhum deliverable foi editado; nada commitado**.
4. `node lint.mjs` executado (confirmei antes que é read-only): **EXIT 0** — mas registro que nenhum dos dois defeitos achados abaixo é grepável; ambos são geometria de runtime (limite que o próprio NOTES declara honestamente).
5. `studies.html` conferido: 3 composições divergentes existem (A escolhida, B e C rejeitadas com razão de uma linha) — passo 1 da Aterrissagem cumprido.

## Medições-chave (Chromium isolado, 1280×800)

| Medida | em-alvo | acima-do-alvo (demo) | Esperado |
|---|---|---|---|
| Centro da fenda | **812.0** | 812.0 | x(€960) = 812.0 ✓ |
| Pino da placa | **766.1** | **919.0** | x(€948) = 766.1 ✓ · x(€988) = 919.0 ✓ |
| Tick da linha €948 (background-position) | 62.2222% | 62.2222% | (948−780)/270 = 62.222% ✓ |
| `.corte-limiar` no specimen | 1 | 1 | exatamente 1 ✓ |
| Fenda ::before | rgb(244,162,76) · 2px | **rgb(42,46,53) · 1px (SELADA)** | luz ↔ linha-estrutura ✓ |
| Derramamento | block · 260px, borda direita colada na fenda (811.0) | **display:none** | evento, não ambiente ✓ |
| Sombra do corpo | rgba(4,5,7,.62) 0 22px 44px | **none** (placa rasa) | ✓ |
| Sobreposição placa→matriz | **+48.0px** | **−21.1px** (não sobrepõe) | privilégio do estado aceso ✓ |
| Corredor placa→fenda | 13.2px (o vão dos €12) | — | ✓ |
| **Gap haste→corpo** | **56.0px** | 20.0px | **deveria ser 0 — DEFEITO** |
| **Lado-frio além do campo / sobre a matriz** | **+74.9px** | +75.0px (espelhado à esq.) | **deveria ser ≤0 — DEFEITO** |
| Selo de frescor visível? | **NÃO** (`elementFromPoint` no centro do selo → `v1t-matriz-bloco__cabecalho`) | **NÃO** (→ `v1t-matriz-bloco__titulo`) | deveria ser SIM |

---

## Item 13 — Teste do template: **PASSA**

**Pergunta:** trocando a paleta, esta tela poderia ter saído de um kit/template genérico de dashboard?

**Não.** A estrutura não é reproduzível por kit — e isso é verificável no código, não só no acabamento:

- **O sistema de coordenadas do layout É o dado, de verdade.** Existe UMA fórmula de escala no CSS (`core.css:76-78`: `left: calc((var(--preco) − min)/(max − min) × 100%)`) e ela governa: os 5 entalhes nomeados da régua, a fenda (cravada em x(€960) = 812.0 medido), o pino da placa (x(€948) = 766.1 medido, exato) e **cada linha da matriz** (tick por `background-position` com a MESMA fórmula, `core.css:501-503` — medido 62,2222% na linha €948). Nenhum `left` inline, nenhuma célula genérica com enfeite: as posições derivam da escala. Kit nenhum posiciona o hero-card pela coordenada do dado.
- **Os estados são geometria, não badge-swap.** Troquei o estado no browser: o pino re-crava em 919.0 = x(€988) exato; a fenda SELA (rgb(42,46,53), 1px, derramamento removido); a placa recua (rasa, sem sombra, sem sobrepor); o lado frio espelha para o lado barato; no `vazio` a placa vira fluxo estático sem pino ("não finge coordenada") e a régua nasce só com a config. Um template troca classes de cor; aqui a composição inteira se re-arranja pelo dado.
- **A composição tem gestos que kit não tem:** régua-instrumento de ponta a ponta com graduação real de €10 (27 passos) e entalhes vivos; UMA fenda vertical de luz atravessando régua→foreground→matriz (1248px de altura medida), com derramamento direcional de borda dura; uma única massa suspensa interrompendo o plano da tabela com sombra real; trilhos-DNA nas linhas da tabela com entalhe duplo de estouro na borda.
- **Contra-prova A/B:** `screenshot-v1-rejected.png` é exatamente o que um kit gera (grid de cards escuros + accent âmbar — o verdict 001 nomeou). O `screenshot.png` atual não tem leitura de kit: tirando a paleta, sobra uma estrutura (eixo graduado, corte, pêndulo, trilhos) que continuaria irredutível em grayscale.

Partes convencionais restam (cartão OW, painel de instrumentos, tabela) — mas são subordinadas ao campo governado e honestas por brief; não devolvem a tela ao gênero template.

## Item 14 — Anti-cosplay reverso: **REPROVA**

**Pergunta:** cada lei citada tem execução material visível — e as proibições declaradas dos próprios gestos foram respeitadas?

**O que está materializado de verdade (registro justo antes da reprovação):**
- **Ando (G2) executado, não citado:** o limiar é um lugar físico — fenda de 2px em x(€960) descendo a composição inteira, luz entrando com borda dura e decaimento à esquerda (derramamento 260px colado na fenda, medido), hairline seco sobre a matriz, e que **sela de verdade** no estado frio (vira 1px rgb(42,46,53), derramamento `display:none`, entalhe do alvo apaga). Não é accent color: é evento espacial com estado. ✓
- **Moholy-Nagy legível:** trilha régua→veredito→campo por peso tipográfico; a graduação e os trilhos literalizam o trajeto. ✓
- **Proibições G1/G2 respeitadas:** posição, nunca comprimento de barra (`--preco` só dirige `background-position`; lint k); uma única escala (a barra-de-posição da v1 foi absorvida pela régua); uma única fenda (contado: 1); sem fundo-semáforo na matriz (linha em-alvo marcada por tick/cor de texto, fundo intacto); o rótulo "EM ALVO" existe mas a FORMA do estado é o corte. ✓

**Onde reprova — G3 Placa Pênsil (a lei de Lissitzky) falha na materialização em DOIS pontos medidos:**

1. **A suspensão está fisicamente quebrada: a haste não toca a placa.** Medido no estado provado (em-alvo): haste = [101.8 → 157.8]; corpo da placa começa em 213.8 — **vão de 56.0px** entre o fim do pino e o topo da placa (20px no estado frio). Causa no código: `.placa-pensil__haste { bottom: 100% }` (`core.css:229-236`) pendura a haste ACIMA da caixa da placa, enquanto `.placa-pensil__corpo { margin-top: var(--v1t-assinatura-haste) }` empurra o corpo 56px para baixo DENTRO dela — a haste cobre a metade da régua e o corpo fica órfão. O olho vê (confirmado no `screenshot.png`, x≈766): um fio que termina no ar e uma placa flutuando desconectada 56px abaixo. O §8 especifica "**suspensa** na régua-mestra **por** uma haste-pino hairline visível"; §9(g) exige os gestos "materialmente **como especificados**". A tensão, o deslocamento, a sobreposição e a sombra existem (medidos: +48.0px, corredor 13.2px ≈ os €12, sombra real) — mas o gesto-título, o pêndulo, não se sustenta ao olhar: a corrente régua→haste→corpo está interrompida exatamente no estado que a prova prova.
2. **Proibição própria do G3 violada: a interrupção de planos NÃO é exclusiva da placa** — e o que ela engole é telemetria obrigatória. Medido nos DOIS estados: o `.v1t-lado-frio` estoura o campo em **+74.9px** e interpenetra o bloco da matriz; o **selo de frescor+confiança fica 100% invisível** (`elementFromPoint` no centro do selo devolve o cabeçalho da matriz; `seloVisivel=false`) — visível nos próprios screenshots entregues: em ambos, "FRESCOR E CONFIANÇA" aparece como título cortado e as linhas "leitura 06/07 10:17 · amostra 10 dias · 371 varreduras · Confiável" **não existem na tela**. O G3 declara: "**sobreposição de qualquer outro elemento** [proibida] — a interrupção de planos é exclusiva da decisão dominante; dominância só significa se é única". Como renderizado, um segundo elemento colide com o plano da matriz (acidental, camuflado pelo fundo igual), a exclusividade do gesto morre e, de quebra, some da tela o estado nº 5 do diagnóstico da máquina ("o estado mais anti-cosplay do sistema") e o único elemento que respira (o pulso do daemon). Registro ainda que o `NOTES.md` alega "lado frio cabe no campo" verificado em browser — **minha medição no mesmo viewport (1280×800) refuta a alegação**, e os screenshots do próprio maker já a refutavam.

Violação de proibição própria = reprovação no 14 (mandato). A reprovação é de **execução do gesto G3**, não de direção: o item 13 passa e G1/G2 estão materializados.

## Observações de coerência (não reprovam — notas para o diretor)

1. **O glow do rito tangencia uma proibição do G2.** `.v1t-rito__caixa` carrega `box-shadow: 0 0 32px var(--v1t-cor-luz-de-acao-brasa)` — uma aura âmbar ao redor de uma caixa. Li como legal (o rito é a cerimônia mapeada, overlay, não um card da bancada comunicando estado), mas "aura/glow ao redor de cards" está proibido pelo G2 em letra; na re-correção, ou troca por borda+sombra neutra, ou o brief declara a exceção do rito explicitamente.
2. **A auto-validação do coder afirmou o que a medição refuta.** "Lado frio cabe no campo" e a haste "cravada" constam como verificados no NOTES — e os dois defeitos da reprovação estavam visíveis nos screenshots anexados por ele mesmo. Reforça a doutrina do CONTRACT (maker ≠ judge) e sugere que o protocolo de aterrissagem ganhe uma checagem mecânica de colisão de planos (overflow de containers absolutos vs. irmãos) no harness de validação, já que o lint declaradamente não a alcança.
3. **A assinatura não sobrevive <900px por remoção, não por tradução.** No responsivo a fenda some (`display:none`) e o pêndulo vira fluxo — declarado no NOTES, mas o §8/Assinatura do brief não declara essa degradação. Dado que o §1 assume desktop-primeiro com risco sinalizado, é coerente; mas se o consumo real do operador migrar para mobile, os gestos precisam de tradução formal (régua e trilhos sobrevivem; o corte e o pêndulo não têm equivalente declarado).

---

## VEREDITO FINAL: **REPROVADO** — item 13 PASSA · item 14 REPROVA

**Item violado:** 14 (anti-cosplay reverso) — gesto **G3 Placa Pênsil** (lei de Lissitzky): (a) suspensão materialmente quebrada (vão medido de 56.0px entre haste e corpo no estado provado; `core.css:229-239`), (b) proibição própria de sobreposição exclusiva violada como renderizado (lado-frio interpenetra a matriz em +74.9px nos dois estados e o selo de frescor — telemetria obrigatória — fica invisível).

**Passo de origem a que volta:** **Aterrissagem, passo 2 — "Assinatura materializada"** (a correção é do coder sobre o artefato; o brief não está em questão — direção, G1 e G2 provaram-se materiais, e o item 13 confirma que a identidade é irredutível a template). **Ciclo único de correção**, que deve atacar exatamente:
1. **Unir a corrente do pêndulo:** a haste deve correr, visível e contínua, da linha da régua ao topo do corpo — nos dois regimes (haste 56px / haste-recuo 20px). Hoje `bottom:100%` + `margin-top` a deixam acima da placa com o corpo órfão.
2. **Devolver a exclusividade do plano e o selo à tela:** dimensionar campo/lado-frio (ou tornar o campo elástico à altura real do lado frio) de modo que **nada além da placa acesa** cruze a borda da matriz e o selo de frescor volte a ser visível no viewport provado (1280×800), nos dois estados.
3. **Re-medir e re-screenshotar** (em-alvo e acima-do-alvo) com as mesmas métricas desta tabela; se reprovar de novo, parar e reportar (protocolo do juiz frio).

— Assinado: o juiz frio, 2026-07-06.

---

# Re-julgamento (ciclo único) — 2026-07-06

> O julgamento original acima permanece intacto como registro do primeiro ciclo. Esta seção julga o artefato **corrigido** (core.css/specimen.html/tokens.css de 15:47–15:52). **Método idêntico e independente:** medição própria em Chromium headless isolado (perfil descartável, CDP cru via WebSocket nativo do Node 22, viewport 1280×800), estados `em-alvo` e `acima-do-alvo`, com driver estendido — corrente do pêndulo nos dois regimes, varredura de interpenetração de **todos** os elementos da tela contra o bloco da matriz, `elementFromPoint` no selo, alinhamento **em pixels** dos trilhos/hairline contra a régua, rito aberto de verdade. Números do coder não foram aceitos; abaixo estão os MEUS.

## Minhas medições (Chromium isolado, 1280×800)

| Medida | em-alvo | acima-do-alvo | Critério |
|---|---|---|---|
| Haste nasce na linha da régua (haste.top − linha.top) | **0.00px** | **0.00px** | = 0 ✓ |
| **Vão haste→corpo** (corpo.top − haste.bottom) | **0.00px** | **0.00px** | = 0 ✓ (era 56.0/20.0) |
| Selo de frescor: `elementFromPoint` no centro | **o próprio selo** (`v1t-num`) · visível · integral no viewport | **o próprio selo** · visível · integral | era `v1t-matriz-bloco__*` ✗ |
| Lado-frio vs borda da matriz | **−16.0px** (termina acima) | **−16.0px** (espelhado à esquerda) | ≤ 0 ✓ (era +74.9) |
| **Varredura de interpenetração da matriz** (todos os elementos ≠ família placa/corte) | **0 ofensores** | **0 ofensores** | = 0 ✓ |
| Campo (elástico) vs matriz | campo.bottom = matriz.top = 544.7 | = 594.1 | encosta sem colidir ✓ |
| Sobreposição placa→matriz | **+48.0px** com sombra real | **−120.1px** (rasa, sem sombra) | privilégio só do estado aceso ✓ |
| Pino da placa | **766.1** = x(€948) | **919.0** = x(€988) | fórmula intacta ✓ |
| Fenda (centro) | **812.0** = x(€960) · rgb(244,162,76) · 2px · derramamento colado (folga 0.0) | 812.0 · **selada** rgb(42,46,53) · 1px · derramamento `none` | ✓ |
| Hairline do corte na matriz (fundo do bloco, mesma fórmula) | **811.8** (desvio −0.17px de x(€960)) | 811.8 | continuidade sub-pixel ✓ |
| Trilhos da matriz (tick center vs régua, em PIXELS) | €948: **−0.24px** · máx entre as 18 linhas: **0.73px** | idem | era ~6px no tick e até ~±24px nas bordas ✗→✓ |
| Estouro (>€1050) | ticks encostados na borda exata (1156.0) | idem | ✓ |
| `.corte-limiar` no specimen | 1 | 1 | exatamente 1 ✓ |
| Rito aberto: sombra da caixa | `rgba(4,5,7,.62) 0 22px 44px` — **elevação neutra com offset** (não é glow 0-0), borda âmbar mantida | — | observação 1 sanada ✓ |

Screenshot meu do em-alvo confirma o que os números dizem: a haste corre contínua da linha da régua ao topo do corpo; o selo ("leitura 06/07 10:17 · há 0h · amostra 10 dias · 371 varreduras · Confiável" + pulso) está inteiro na tela; o COMPRAR ancora na borda de baixo da placa, junto do campo que ela invade.

## Veredito por defeito

1. **Suspensão quebrada (vão haste→corpo)** — **SANADO.** A correção é estrutural, não cosmética: `--haste-atual` é fonte única (haste nasce em `top: -régua/2` = a linha, altura = régua/2 + `--haste-atual`; corpo desce `margin-top: var(--haste-atual)`) — **vão zero por derivação nos dois regimes**, medido 0.00px em ambos. A corrente régua→haste→corpo existe materialmente nos estados aceso e recuado.
2. **Exclusividade do plano violada + selo invisível** — **SANADO.** O lado-frio saiu do absoluto para o **fluxo** e é ele quem dimensiona o campo (elástico, `min-height` 296): medido, **nenhum** elemento fora da família placa/corte intersecta o bloco da matriz (varredura completa, 0 ofensores nos dois estados), o lado-frio termina 16px acima da borda, e o selo de frescor voltou: `elementFromPoint` devolve o próprio selo, integral no viewport, nos dois estados. A invasão da placa acesa agora é constante declarada (`--v1t-assinatura-sobreposicao: 48px`) — medido +48.0px exato, com sombra; no estado frio, recuo real (−120.1px, sem sombra).

**Auditoria da correção adicional declarada (afeta G1 — escala única):** o coder detectou e corrigiu um defeito que o meu primeiro julgamento **não pegou**: os trilhos da matriz viviam num sistema de coordenadas ~50px mais estreito que a régua (padding horizontal do bloco), ou seja, a MESMA fórmula em % projetada sobre larguras diferentes — eu validei a igualdade percentual (62,2222%) e não medi a projeção em pixels; registro o limite do meu método de então. Estado atual medido: padding horizontal do bloco zerado (respiro movido para as células), tick de €948 a **−0.24px** do x da régua, desvio máximo **0.73px** entre as 18 linhas, hairline do corte desenhado pelo fundo do próprio bloco com a mesma fórmula a **−0.17px** — tudo sub-pixel. **Não nasceu segunda escala:** o hairline herda o mesmo `--preco: 960` do corte e os trilhos permanecem na mesma faixa €780–1050 com a mesma fórmula; o que havia eram DUAS projeções da mesma escala, e agora há UMA. G1 segue PASSA — mais forte: "distância na tela = distância em euros" agora vale em pixels também na matriz.

**Item 13 (confirmação de não-regressão):** a natureza da fórmula não mudou — pino 766.1 = x(€948), re-crava em 919.0 = x(€988), fenda 812.0 = x(€960), estados seguem sendo geometria (fenda sela, placa recua, lado frio espelha, vazio sem pino). A correção **reforçou** o argumento do item 13 (a projeção da escala agora é exata de ponta a ponta). **PASSA mantido.**

## VEREDITO FINAL DO GATE DA PROVA: **APROVADO** — item 13 PASSA · item 14 PASSA

Os dois defeitos do primeiro ciclo foram sanados estruturalmente e verificados por medição independente; nenhuma proibição própria dos gestos segue violada (uma fenda; posição-não-barra; escala única — agora também em pixels; sobreposição exclusiva da placa acesa; estado-como-forma com rótulo textual por acessibilidade); a observação do glow do rito foi atendida com elevação neutra + borda. As observações remanescentes do julgamento original (nº 2 — maker≠judge e checagem mecânica de colisão de planos no harness; nº 3 — tradução da assinatura <900px) seguem como notas para o diretor, não bloqueios.

A assinatura formal de gen-001 — Régua-mestra, Corte do Limiar, Placa Pênsil — **existe materialmente, é nomeável na tela e sobrevive aos estados.** O gate da prova está fechado; a identidade pode ser registrada em `presets/` conforme o CONTRACT.

— Assinado: o juiz frio, 2026-07-06 (re-julgamento do ciclo único).
