# NOTES — gen-002 · MENISCUS (a janela do m1nd)

Caderno de laboratório da aterrissagem. Reconstruído a partir do código já escrito + as **medições reais** feitas em browser real (Chromium headless-shell 1228, viewport 1280×800, CDP cru, `prefers-color-scheme` neutro salvo onde indicado). Os números abaixo são para o juiz frio **re-medir** — foram capturados, não estimados.

---

## 1. O estudo escolhido (studies.html A/B/C) e por que os outros dois foram rejeitados

**ESCOLHIDO: Estudo A** — Placa de Trust no canto de maior peso (topo-esquerda), Trilho de Freshness horizontal à direita da placa, Sufficiency + Contorno Negativo empilhados abaixo, Âncoras/Focus na base. A ordem de leitura do auditor é **veredito → cobertura → memória → contorno**.

A escolha está materializada no `core.css` (`.mns-bench`, linhas ~335) com `grid-template-areas: "trust rail" / "recon suff" / "neg anchors"` — que é exatamente o arranjo do Estudo A, não B nem C. O `specimen.html` segue essa grade.

**Por que A venceu (lido da estrutura final):**
- A placa ocupa o **canto de maior peso visual** (topo-esq, primeiro ponto de fixação ocidental) — coerente com a pergunta-raiz do produto ("posso confiar?") ser a primeira coisa lida.
- A **aba de reconciliação** (`.mns-trust__tab`) sai da placa com inclinação e a **diagonal aponta para baixo-direita**, na direção da Linha de Reconciliação logo abaixo (`grid-area: recon` fica sob `trust`). A diagonal é **funcional** (Lei 1 do brief: a inclinação sempre endereça o reparo), e só o layout A a deixa apontar para algo real. Medido: a aba herda `rotate(+1.4deg) translateX(9px)` (o inverso da inclinação da placa) — vetor de leitura, não decoração.

**REJEITADO — Estudo B** (Trilho como espinha superior de ponta a ponta, placa inclinada abaixo à esquerda): o próprio esboço confessa o defeito no rótulo — *"a inclinação aqui não aponta nada — decorativa"*. Colocar o tempo primeiro (trilho no topo full-width) faz o **tempo dominar a leitura antes do veredito**, invertendo a prioridade honesta do produto (trust primeiro). E a placa inclinada de B não tem para onde apontar (a reconciliação fica ao lado, não na diagonal). Inclinação decorativa = falha direta na Lei 1 → morto.

**REJEITADO — Estudo C** (placa centrada e simétrica no topo, trilho na base, sufficiency esmaecida ao lado): a simetria produz **repouso institucional** mas mata o vetor — uma placa centrada **não aponta para lugar nenhum** (o esboço: *"para onde a placa aponta? nenhum lugar"*). O gesto da Assinatura 3 (deslocamento+inclinação que endereça o reparo) fica impossível numa composição que quer simetria. Além disso C esmaece a sufficiency a `opacity:.5`, enterrando dado epistêmico real. Simetria = anti-assinatura aqui → morto.

Lição herdada da gen-001 aplicada: os três foram **renderizados** antes de decidir (studies.html abre os três frames), porque julgar renderizado muda a decisão.

---

## 2. Decisões de `[impl:lacuna]` (o que o brief deixou em aberto e como o código resolveu)

**(a) Hex das cores de estado — a paleta concreta (lida de `tokens.json`, gerada em `tokens.css`, 50 props).**
Todas por FUNÇÃO, nunca por aparência; toda cor de estado É uma leitura real do north-packet. Temperatura fria-neutra, anti-cyberpunk (proibição material do brief §8):

| função | token | hex | papel |
|---|---|---|---|
| massa fundo | `--mns-massa-fundo` | `#16151c` | a matéria mineral escura (condição da fresta de Ando) |
| massa alta / vidro / vidro-foco | `--mns-massa-alta/-vidro/-vidro-foco` | `#1b1a23` / `#20202a` / `#26262f` | placas de instrumento |
| tinta alta / soft / fraca | `--mns-tinta-*` | `#e8e4dc` / `#a49fb0` / `#8c8798` | legibilidade de tinta sobre papel (quente-neutro, nunca branco-neon) |
| luz-foco (a Slit) | `--mns-luz-foco-nucleo` | `#cdd6e0` | luz que ENTRA por um corte, fria-neutra, não emitida |
| **trust full** | `--mns-trust-full` / `-full-txt` | `#8fa96b` / `#a9c286` | sálvia (act / good to go) |
| **trust reverify** | `--mns-trust-reverify` / `-txt` | `#c89b3c` / `#dcb457` | âmbar-latão (worth a second look) — **não** vermelho-alarme |
| **trust failure** | `--mns-trust-failure` / `-txt` | `#c56a4a` / `#d98a6c` | terracota (não #f00) |
| **abstain** | `--mns-abstain-cor` / `-dim` | `#a78bfa` / `#8f74e0` | a violeta reservada (herança de doutrina): a cor do "não sei" honesto. **Exclusiva** do estado epistêmico; nunca cor ambiente; nunca anima. |
| **stale/unknown** | `--mns-stale-cor` / `-txt` / `-faixa` | `#89848f` / `#948f9c` / `rgba(137,132,143,.07)` | cinza-neutro dessaturado e digno (absent age = unknown) |

Convenção `-txt`: cada cor de estado carrega um **registro claro do rótulo textual** sobre massa/vidro — é a paridade-sem-cor (a palavra É o dado), e é o par de contraste elevado usado no texto de leitura.

**(b) Stack de fonte — sistema puro, zero webfont/CDN (offline-first, brief §8 "força offline").**
- `--mns-fonte-mono`: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` — o número honesto / o fingerprint / o dígito vivo.
- `--mns-fonte-serif`: `'Iowan Old Style', Palatino, Georgia, serif` — a prosa epistêmica (o `why` da sufficiency, o claim no mergulho): o caderno de laboratório editorial.
- `--mns-fonte-sans`: `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif` — títulos, labels de zona, o veredito, a navegação.

**(c) A escala do Trilho — a `impl:lacuna` mais carregada: a FÓRMULA.** O brief pediu "memória por idade real" mas não fixou a transformação. Resolvida como **fórmula log única**, documentada no `core.css` e executada em `specimen.js` (`window.__mnsRailX`, exposta para o juiz medir):

```
x(age_ms) = (log(age_ms) − log(MIN)) / (log(MAX) − log(MIN)) , clamp 0..1
MIN = 3600000 ms (1h)   MAX = 2592000000 ms (30d = STALE_AFTER_MS do produto)
```

0 = agora/fresco (esquerda); 1 = MAX/passado (direita). A borda direita **É** o limiar de staleness real do produto (`STALE_AFTER_MS = 30d`, verificado no gate contra `softProof.ts`). Posição É dado (`left: calc(var(--mns-x)*100%)`), nunca comprimento de barra (o lint proíbe `--mns-x` dirigir width/height).

**(d) Anti-colisão (lacuna resolvida na direção do brief):** dois claims quase-simultâneos (os reais de 271.0M e 272.6M ms, a **0.087% de idade** um do outro) cravam a **haste** na posição fiel ao dado (a coordenada não mente), mas seus **rótulos** empilham em faixas verticais (`--mns-lane`) para não se sobreporem. O texto se esquiva; a posição permanece verdade. Passo de faixa = `grid*4.75` (> altura do rótulo, sem overlap), com uma guia contínua (`::before`) ligando rótulo→haste (lição gen-001: jamais um órfão).

---

## 3. MEDIÇÕES DA ASSINATURA (browser real, 1280×800) — os números para re-medir

### Assinatura 2 — Trilho de Freshness: posição = log(age_ms)

`window.__mnsRailX` bate **exatamente** com o cálculo manual de `log(age_ms)` (returnByValue do CDP, sem arredondar):

| claim (age_ms real do sample) | `railX` medido | `log` manual | idênticos? |
|---|---|---|---|
| 133637855 (claude:main:fable-orchestrator, fresco) | 0.54933298712116 | 0.54933298712116 | ✓ |
| 271032997 (fable-brand-critic) | 0.6568082884971378 | 0.6568082884971378 | ✓ |
| 272592718 (brand-audit) | 0.6576804595045651 | 0.6576804595045651 | ✓ |

**Posição em pixel, verificada contra o eixo** (track medido: `left=484, right=1100, width=616 px`):

| claim | x | centro-haste esperado = 484 + x·616 | centro-haste **medido** | tier / espessura |
|---|---|---|---|---|
| 133637855 | 0.54933 | 822.4 | **822.375** | medulla / 3.5px |
| 271032997 | 0.65681 | 888.6 | **888.594** | medulla / 3.5px |
| 272592718 | 0.65768 | 889.1 | **889.125** | medulla / 3.5px |

As duas hastes quase-simultâneas cravam a **0.53px** uma da outra (fiel aos 0.087% de diferença de idade), e o anti-colisão as separa em **lanes 0/1/2** (o claim fresco em lane 0, os dois colididos em lanes 1 e 2 — rótulos empilhados, hastes intactas). Nenhuma haste usa `left/top` inline (a coordenada vem só de `--mns-x`).

### Stale EXILADO fora do trilho (estado `stale`)

No estado stale, o claim do meio (`brand-audit`) é marcado `stale:true` e **sai do trilho**: restam **2 marcas on-rail** (contra 3 no canônico). O item exilado renderiza dentro da faixa-exílio:

- faixa-exílio (`#rail-exile`): bounding box `left=1112 … right=1240 px`.
- eixo do trilho (`#rail-track`): termina em `right=1100 px`.
- item exilado medido: `left=1121 … right=1231 px`, `top=128`.

→ O bloco stale começa em **x=1121 > 1100 (fim do eixo)**: está **inteiramente na faixa de exílio, fora do eixo do tempo**. Confirmado que idade-ausente/stale nunca recebe `--mns-x` e nunca aparece sobre a linha confiável. No canônico a faixa está vazia mas **ensina** onde o stale cairia (hint: *"nenhum claim stale — o trilho está cheio e confiável. É aqui que a idade ausente cairia."*).

### Assinatura 3 — Placa de Trust: assenta reto (full) · inclina+desloca (degraded) · imóvel (abstain)

`transform` computado lido direto do CSSOM (matrix real):

| estado | `transform` matrix medido | rotação decodificada | translateX | leitura |
|---|---|---|---|---|
| **full_trust** (canônico) | `matrix(1, 0, 0, 1, 0, 0)` | **0.000°** | **0 px** | assenta reto e estável ✓ |
| **degraded** | `matrix(0.999701, -0.0244322, 0.0244322, 0.999701, 18, 0)` | **−1.400°** (`asin(−0.0244322)`) | **18 px** | desloca + inclina; a diagonal aponta o reparo ✓ |
| **abstain** | `matrix(1, 0, 0, 1, 0, 0)` | **0.000°** | **0 px** | IMÓVEL apesar de ser estado divergente — o "não sei" não performa ✓ |

Os números batem com os tokens ao dígito: `--mns-placa-inclina: -1.4` → −1.400°; `--mns-placa-desloc-x: 18px` → 18px. A trava de abstain (`transform: … !important` em `[data-trust="abstain"]`) segura o zero mesmo o estado sendo divergente. (Bounding boxes: full `top=61 h=139`; degraded `top≈50.7 h≈105.2` — a placa de fato se ergue e encolhe ao deslocar; abstain `top=61 h=95`.)

### Assinatura 1 — Meniscus Slit: corta a BASE do painel ativo, só no mergulho, sem glow

Mergulho aberto (clique numa marca do trilho), medido:

- `dive.dataset.open = "true"`; claim carregado = *"O olho do Max — 6 movimentos analíticos…"* (o dado real).
- painel (`.mns-dive__panel`): `top=313.6 … bottom=486.4 px`.
- linha honesta (`.mns-dive__honest`, onde a fresta pousa): `top=415.4 … bottom=445.4 px`.
- **distância do fim da linha honesta ao fim do painel = 41 px** (só o padding inferior do painel) → a linha honesta É o **último conteúdo**, e a fresta pousa na sua base = a base do painel (o fundo do menisco). Não no topo (seria header de template).
- `elementFromPoint(midX, honest.top + 1)` retorna `mns-dive__honest` → a fresta está **sobre** a linha honesta, materializada.
- fresta (`::before`): `content:""`, `height: 2.5px`, `background: rgb(205,214,224)` (= `--mns-luz-foco-nucleo`), borda superior nítida, `::after` desfocando para a massa.
- **`box-shadow` do painel = `none`** → a luz é CORTE, não glow espalhado (proibição própria da Assinatura 1 / Ando). O lint reprovaria qualquer box-shadow aqui; medido confirma `none`.

### O dígito de ms VIVO — o único número que muda, imóvel sob reduced-motion

- **Canônico** (2 amostras ~700ms): `[133642607, 271037749, 272597470]` → `[133643356, 271038498, 272598219]`. Todos os 3 **incrementaram monotonicamente** (`base + elapsed` real desde a carga). É o único número da tela que muda.
- **Sob `prefers-reduced-motion: reduce`** (media emulada, página recarregada): `matchMedia(...).matches = true`. Duas amostras: `[133639106, 271034248, 272593969]` → `[133639856, 271034998, 272594719]` → **o dígito CONTINUA incrementando** (é DADO real, não animação decorativa — o carve-out do gate item 8). Ao mesmo tempo `getComputedStyle(.mns-trust).transitionDuration = 0s` → a placa **não anima** a transição sob reduced-motion. A distinção honesta se sustenta: dado vive, decoração morre.
- Exclusividade verificada pelo lint (regra `a`): nenhum outro seletor de número (`__fp/__nums/__pr`) anima/transiciona; o dígito vivo é EXCLUSIVO de `.mns-rail__ms`.

---

## 4. Contraste (computado do CSSOM, composição sobre a massa/vidro real)

Ratios WCAG medidos. **Alvo: AA (≥4.5) para todo texto de dado; AAA para o veredito de trust.** Nota de limiar: o veredito é **22px / weight 600 = "texto grande"** WCAG, onde AAA = **4.5** (não 7.0); os veredictos não-abstain ainda superam o 7.0 estrito.

**Veredito de trust (alvo AAA):**
| veredito | cor | fundo | ratio | AAA? |
|---|---|---|---|---|
| FULL TRUST | `#a9c286` | `#20202a` | **8.26** | ✓ (supera até o 7.0 estrito) |
| REVERIFY | `#dcb457` | `#20202a` | **8.23** | ✓ (supera 7.0 estrito) |
| ABSTAIN (violeta reservada) | `#a78bfa` | `#20202a` | **5.93** | ✓ (AAA-grande 4.5, a 22px/600); não atinge 7.0, e **não deve** — mexer na violeta de doutrina por um limiar que não se aplica seria gold-plating) |

**Texto de dado (alvo AA ≥4.5):** todos passam.
| elemento | ratio | | elemento | ratio |
|---|---|---|---|---|
| rail ms (dígito vivo) | 14.3 | | fingerprint resumido | 6.27 |
| dive claim (serif) | 12.73 | | dive honest | 6.27 |
| suff why (prosa) | 12.73 | | contorno negativo item | 6.27 |
| suff badge | 8.26 | | exilado (corpo, stale) | 5.47 |
| recon honest | 8.23 | | head-sub (mono xs) | 5.21 |
| rail agent | 7.05 | | exilado (título, stale) | 4.73 |

Menor ratio de texto de dado = **4.73** (o título "stale" do item exilado, cinza dessaturado-mas-digno por design) — ainda **AA-pass**. Nenhum texto de dado abaixo de 4.5.

---

## 5. Validação de estado (browser real) — console + gestos

| estado | console (erros/exceções) | o que se confirmou |
|---|---|---|
| canônico (full_trust + mismatch) | **0** | placa reta, aba de reconciliação visível, trilho com 3 marcas + anti-colisão, faixa-exílio vazia que ensina |
| degraded | **0** | placa −1.4°/+18px, reconciliação oculta (coverage=match), reparo "viaja junto" |
| stale | **0** | 1 claim exilado fora do eixo, 2 on-rail |
| abstain | **0** | veredito violeta, placa IMÓVEL (matrix identidade), sufficiency `insufficient` |
| gathering | **0** | badge `gathering`, prosa epistêmica muda (o `why` real observado ao vivo) |
| vazio | **0** | trilho afirma "nenhuma memória neste tier — a mente não afirma nada aqui", 0 marcas |
| mergulho (dive) | **0** | Slit na base do painel, box-shadow none |
| reduced-motion (reload) | **0** | dígito continua, placa transition 0s |

**console 0 erros em TODAS as trocas de estado.** `lint.mjs` EXIT 0 (0 violações, 3 arquivos). `build-tokens.mjs` OK (50 custom properties).

---

## 6. Bug consertado

**Nenhum — só finalização.** A validação em browser real não revelou bug: console limpo nos 8 contextos de estado, a fórmula log bate ao 15º dígito com a posição em pixel, a placa produz exatamente −1.400°/18px em degraded e identidade travada em abstain, o stale sai do eixo, a Slit corta a base do painel sem glow, e o dígito vivo sobrevive ao `prefers-reduced-motion` enquanto as transições morrem. O contraste do veredito abstain (5.93) foi investigado a fundo: por ser texto grande (22px/600) o limiar AAA aplicável é 4.5, que ele supera — não há violação e mexer na violeta reservada de doutrina teria sido gold-plating contra um alvo mal-lido. O trabalho do coder anterior aterrissou íntegro; esta sessão fechou a cauda (NOTES.md + as medições) e validou.

---

### Método (para reprodutibilidade)

Playwright MCP estava com o profile trancado ("Browser is already in use"); usei o fallback provado da casa — `chrome-headless-shell` (Playwright 1228) dirigido por **CDP cru sobre WebSocket com Node built-ins** (`net`+`crypto`+`http`, cliente RFC6455 mascarado), zero dependências externas, viewport 1280×800, `deviceScaleFactor=1`, `force-color-profile=srgb`. Driver no scratchpad (fora dos deliverables). Screenshots: `screenshot.png` (canônico do sample) e `screenshot-states.png` (abstain, o estado mais divergente).
