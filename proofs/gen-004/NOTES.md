# MASSIF — aterrissagem (gen-004) · NOTES

> Coder da gen-004. Brief aprovado 12/12 pelo juiz frio. Este doc é o registro da
> aterrissagem: estudo escolhido + porquê, as `[impl:lacuna]` decididas DENTRO da
> direção, e — o mais importante — as **MEDIÇÕES** que eu mesmo fiz antes do juiz
> re-medir. Números primeiro; afirmação depois. Tudo medido em browser REAL
> (Chromium headless isolado via CDP cru, driver no scratchpad — profile do host
> não tocado). Zero dependências externas em qualquer entregável.

---

## 1. Estudo escolhido — **B · Squarified Quarter**

Os três estudos foram **renderizados** (em `studies.html`) antes da escolha — julgar
renderizado muda a decisão. Screenshot: `studies-render.png`.

**Escolhido: B — Squarified Quarter** (treemap squarificado, placas com área =
`node_count`, blocos ladrilhados dentro, projeção isométrica).
*Porquê (uma linha):* é o único dos três em que **peso = contagem** é estrutural
(Lissitzky vivo), ele **empacota mais blocos legíveis lado a lado** (o teste de
densidade-7 e da distinção pedestal-vs-grey da instrução (c) do gate), e a **face
de topo da placa é a casa natural do STATE-STRATUM CAP**. É também o que a restrição
técnica decidida nomeia ("squarified treemap, d3-hierarchy") — honrar o dado.

**Rejeitados (justificativa por rejeitado):**
- **A · Stacked Strata** — camadas como bandas geológicas empilhadas. *Rejeitado:*
  honesto com "camadas", mas força **alturas de banda iguais que brigam com
  `node_count`** — uma banda de 15 nós e uma de 82 parecem o mesmo peso; a lei
  "peso = contagem" de Lissitzky morre, e a densidade-7 fica espremida em fileiras
  finas. Renderizado, o defeito é óbvio: as 4 bandas têm o mesmo tamanho.
- **C · Terrace Cascade** — containers como terraços isométricos em elevação
  decrescente. *Rejeitado:* profundidade bonita, mas **a elevação não codifica
  nada real** (é "profundidade bonita" sem função — exatamente o que Rams corta),
  e os terraços **desperdiçam área de campo**, ferindo a densidade que o
  diagnóstico precisa.

---

## 2. `[impl:lacuna]` decididas DENTRO da direção

O brief deixou algumas escolhas de implementação abertas. Decisões, com origem:

1. **Posição estável = FNV-1a sobre `external_id`.** O dossiê exige "posição
   determinística e estável entre snapshots" mas não crava a função. Escolhi
   **FNV-1a** (hash de 32 bits, stdlib-free, determinístico) do `external_id` →
   ordena os membros de cada placa; mesmo nó cai no mesmo slot entre leituras.
   É o pino do PERSISTENCE GLINT (mudança perceptível em lugar conhecido).
2. **Segmentos do STATE-STRATUM CAP em contagem verbatim, ordem fixa.** O brief
   fixa a ordem (`bedrock→unproven→overgrowth→erosion→unpainted`) e proíbe
   normalização a um mínimo visível. Implementei largura = `(n/total)*w` exata —
   um estado com 1 bloco em 195 é uma fatia fina e honesta, não inflada.
3. **A distribuição pintada (cenário 2) é DERIVADA para somar ao agregado real.**
   O dado real dá só o agregado (`overgrowth=195, unproven=4, bedrock=0, erosion=0,
   scanned=199`), não a distribuição por container. Derivei-a honestamente:
   **cada container é overgrowth-dominante; os 4 unproven ficam 1-por-container**
   (nos 4 maiores, que são exatamente os 4 que existem), determinístico. Verificado:
   soma = 195 overgrowth + 4 unproven = 199. O bloco "ochre" de cada container é o
   de menor FNV-1a — determinístico, e é ele que carrega o glint (flip
   unpainted→unproven). **Nada inventado além do necessário; o agregado é o real.**
4. **Acento de violeta no UNPAINTED PLINTH = decisão binária ON** (instrução (b) do
   gate). Regra grepável `MF_UNPAINTED_VIOLET_ACCENT = true` em `specimen.js`; o
   lint (`lint.mjs`, seção *gesture 1*) **falha se a constante sumir ou for `false`**.
   O acento é um único tick triangular no canto do topo, na violeta quarentenada
   (`--iris #7c3aed`) que no design system É literalmente "insufficient evidence /
   honest unknown" — semântica idêntica a `unpainted`. Nada mais colorido no pedestal.
5. **Legenda = tira horizontal dockada no rodapé** (não painel flutuante). Decisão
   tomada DEPOIS de render: o painel flutuante à direita **cobria a placa
   tests·L2** e seus blocos. Uma legenda que esconde um container é desonesta;
   movi-a para uma tira persistente e discreta acima da barra de campo (Midground,
   "dockada" — conforme §6 do brief). Fix visível comparando as iterações.
6. **Faces laterais = token de topo escurecido por luminância** (−10% / −20% via
   `shade()`), nenhuma cor de matiz nova. Coabitação preservada por construção.

---

## 3. MEDIÇÕES (browser real 1280×800 — o juiz vai re-medir)

### 3.1 Assinatura — geometria dos prismas (medido, não afirmado)
- **Blocos renderizados:** 40 (todos os nós do slice). Distribuição por container
  (real, de `layers.json`): entry_points·L3 = 16, data_access·L1 = 12, tests·L2 = 9,
  data_access·L0 = 3.
- **Placa mais densa (entry_points·L3, 16 blocos):** menor vão centro-a-centro
  entre prismas = **26px**. A meia-largura do tile é 26px → os prismas **tesselam
  aresta-a-aresta sem interpenetração** (26 ≥ 26). A densidade-7 é legível.
- **Polígono da face de topo do 1º bloco L3:** `[[269,109],[295,122],[269,135],[243,122]]`
  — diamante isométrico limpo (26px meia-largura × 13px meia-altura).
- **`elementFromPoint` no centro do canvas** (640, ~335) = **`mf-canvas`** — o campo
  ocupa a stage inteira (rect medido 1280×671); nada flutua indevidamente por cima
  do campo de blocos.

### 3.2 STATE-STRATUM CAP — proporção real (medido)
- **Agregado pintado lido do app ao vivo:** `{bedrock:0, unproven:4, overgrowth:195,
  erosion:0, unpainted:0}` — **soma verbatim ao dado real** (`xray_paint_dryrun.json`).
  Cada topo de placa mostra a fatia ochre fina + a faixa grey larga na proporção
  real. Confirmado nas 4 placas em `screenshot-states.png`.
- **Cap nunca anima** (dado crítico): a função `drawStratumCap` não referencia
  `requestAnimationFrame`/`Math.sin`/`breath` — verificado pelo lint (*gesture 2*).

### 3.3 PERSISTENCE GLINT — animação real + contrato reduced-motion (medido)
- **Normal motion:** dois frames capturados a **1,7s de distância** (meio-período de
  3,4s) no modo pintado **diferem** (md5 `4f611d1e…` ≠ `7b5c444a…`) → o anel de
  respiração sobre os blocos ochre **está animando de fato**. Envelope de opacidade
  **0.85↔1.0 (±0.15)** — o mesmo ±0.15 sancionado pelo `tremor-breath` do design
  system (período 3,4s idêntico).
- **Reduced motion:** com `prefers-reduced-motion: reduce` emulado, o app renderiza
  um **tick estático** (marcador de canto violeta, sem anel/respiração) sobre cada
  bloco que mudou — `screenshot-reduced-motion.png`. A INFORMAÇÃO ("mudou desde a
  última leitura") sobrevive; a moção não. `core.css` também zera toda transição
  sob a media query (contrato, não cortesia).
- **Gatilho honesto:** o glint só aparece sobre `changedIds` (flip real de estado
  entre snapshots), nunca sobre hover/carregamento; `unpainted` que continua
  `unpainted` nunca recebe glint (resolvido antes de qualquer caminho de glint).

### 3.4 Distinção pedestal-vazio × grey-sólido — a honestidade, na densidade (instrução (c))
- **Separação de luminância medida:** porcelain (pedestal vazio) L=**0.9071** vs
  grey overgrowth L=**0.4486** → razão **1.92**. O pedestal lê **distintamente mais
  claro** que o bloco grey sólido, lado a lado, em dezenas de blocos (compare
  `screenshot.png` — campo de pedestais de contorno — com `screenshot-states.png`
  — campo grey sólido). Não é distinção de bloco isolado de legenda: é o campo
  inteiro.
- **Contorno do pedestal:** ink-soft sobre porcelain = **6.52** de contraste — a
  linha fina que carrega "lugar reservado" é legível (bem acima do limiar 3.0 de
  componente e do 4.5 de texto).
- **Canal redundante:** além da cor/preenchimento, o pedestal tem contorno (forma)
  + rótulo de operador ("unpainted / not yet scanned") na legenda e no detalhe.
  A distinção não depende de cor sozinha (daltonismo coberto).

### 3.5 Contrastes WCAG (medidos — AA/AAA)
Todos os pares carregadores de texto passam AA; os dois primários passam AAA:

| par | razão | nível |
|---|---|---|
| ink on porcelain (corpo/rótulos) | 13.12 | AA ✓ AAA ✓ |
| ink on bone (rótulos de placa) | 12.02 | AA ✓ AAA ✓ |
| ink-soft on porcelain (secundário/contorno) | 6.52 | AA ✓ |
| ink-soft on bone (contagens) | 5.97 | AA ✓ |
| ink on sage chip (bedrock) | 4.93 | AA ✓ |
| ink on ochre chip (unproven) | 5.62 | AA ✓ |
| ink on grey chip (overgrowth) | 6.83 | AA ✓ |
| iris on veil (chip unpainted) | 4.80 | AA ✓ |
| iris on porcelain (tick/anel de foco) | 5.19 | AA ✓ |

### 3.6 Console / build / lint (medido)
- **Console:** 0 erros em TODAS as trocas de cenário (unpainted↔painted) e sob
  reduced-motion. 0 exceções (`Runtime.exceptionThrown`). 0 requisições de rede
  (offline-first — nenhum fetch, nenhuma webfont remota, nenhum CDN).
- **`node build-tokens.mjs`** → 38 custom properties, exit 0.
- **`node lint.mjs`** → **56 passed, 0 failed, EXIT 0** no artefato entregue.

---

## 4. Rastreabilidade da identidade (o que a torna MASSIF e não um kit)

- Prefixo próprio **`--mf-`** (nunca `--alm-`); zero faces/matizes de ALMUS ou de
  gerações anteriores (lint *no foreign identity*). Só o **formato de build**
  (DTCG→CSS vars, walk zero-dep) é compartilhado com a casa — a identidade é a do
  BRIEF gen-004.
- Paleta ancorada **verbatim** aos 13 tokens do `m1nd-ui/src/index.css` (verificado
  contra o arquivo vivo); extensão só por luminância (faces laterais = topo
  escurecido). Coabitação com Hall/LivingTree/GraphCanvas preservada por construção
  (mesmo porcelain/bone/ink/mono).
- Os **3 gestos** nascem do dado único do MASSIF (unpainted de fábrica, proporção
  mista overgrowth-dominante, posição estável), não de um kit isométrico.

---

## 5. Limites honestos

1. **O maior:** o specimen é a **Vista Organismo** (a prova do §9) em Canvas 2D com
   os 40 nós do slice + 4 containers reais. **Não** implementa o pan/zoom semântico
   navegável (organismo→sistema→subsistema→peça) nem o `d3-zoom`/`d3-hierarchy`
   reais — a restrição do MVP os nomeia, mas o menor artefato que prova a direção
   é a tela estática+interativa (plinth + cap + glint + coabitação + edge cases +
   os dois cenários). O treemap aqui é um squarify **simplificado** (split por peso,
   eixo alternado), suficiente para provar a linguagem; a produção usaria
   `d3-hierarchy` squarified pleno.
2. **A distribuição pintada por-container é derivada, não medida** — porque o dado
   real só traz o agregado (§2.3). É honesta (soma ao real, overgrowth-dominante,
   4 ochre) e determinística, mas não é uma leitura per-container do motor (que não
   existe no dado fornecido). Rotulado como derivação, não como fato do snapshot.
3. **`erosion-candidate` e `bedrock` não aparecem preenchidos em nenhum cenário**
   porque o dado real tem `bedrock=0, erosion=0`. A legenda e o CAP os mostram
   (hachura brick para erosion; sage para bedrock), e o código os desenha se
   existirem — mas o campo honesto é "o mais alarmante é o mais raro (zero)". Um
   terceiro cenário sintético com erosion>0 provaria a hachura no campo; ficou de
   fora por fidelidade ao dado (não inventar estado que o motor não computou).
4. **Fontes self-hosted:** o specimen usa os fallbacks das stacks de token
   (system-ui / Georgia / Menlo) para renderizar idêntico offline; no m1nd-ui real
   as `@font-face` apontam para Instrument Sans / IBM Plex Mono / Fraunces já
   vendorizadas. A hierarquia (UI / mono-para-número / Fraunces-hedge) está correta;
   os glyphs exatos dependem do vendor do repo-alvo.
5. **Harness de medição:** o `Runtime.evaluate` do meu driver CDP mínimo tem um
   quirk ao marshalar valores `undefined`/promises — por isso algumas sondas
   intermediárias imprimiram `undefined`. Contornei retornando **strings JSON**
   (que marshalam de forma confiável) e provando por **pixel-diff de frames** e
   **screenshots** — o app em si tem 0 erros e comportamento correto verificado por
   ground-truth visual, não por leitura de variável frágil.

---

## 6. Entregáveis (todos em `~/v1truvio/proofs/gen-004/`)

| arquivo | o quê |
|---|---|
| `studies.html` | 3 composições divergentes renderizadas + justificativa por rejeitado |
| `tokens.json` | DTCG, função-nomeado, prefixo `--mf-`, ancorado ao m1nd |
| `build-tokens.mjs` | build zero-dep (walk DTCG→CSS), formato da casa |
| `tokens.css` | gerado (38 custom properties) |
| `core.css` | componentes + 5 estados + 3 gestos por estado + a11y + reduced-motion |
| `specimen.html` + `specimen.js` | a tela §9, dado real verbatim, switcher 2 cenários, vanilla/offline |
| `lint.mjs` | regras da assinatura + proibições dos 3 gestos + violeta binária — EXIT 0 |
| `NOTES.md` | este doc |
| `screenshot.png` | estado canônico (estreia unpainted), 1280×800 |
| `screenshot-states.png` | estado mais divergente (organismo pintado real) |
| `screenshot-reduced-motion.png` | contrato reduced-motion (tick estático) |
| `studies-render.png` | os 3 estudos renderizados |
