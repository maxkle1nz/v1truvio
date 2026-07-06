# GATE-VERDICT — gen-004 / MASSIF (view da Human View do m1nd)

> **Juiz frio** (não participou da geração; recebeu apenas o brief + a mente + os cards citados + os dados de telemetria + o produto-alvo read-only). Julgamento dos 12 itens do gate do brief, com evidência citada e verificação factual por amostragem contra o dado real e o código do produto.
> **Data:** 2026-07-07. **Precedência aplicada:** Leis > Modo (Laboratório) > Vetores (declarados no brief) > Cards.

---

## VEREDITO: **APROVADO**

**12 PASSA · 0 REPROVA.** Nenhum item do gate anti-padrões dispara. A verificação factual obrigatória confirmou que TODA fonte de telemetria e TODO fato-âncora citado pelo brief existe verbatim no dado real (`data/*.json`) e no produto-alvo (`~/m1nd/m1nd-ui`). O brief é honesto em cada canal visual: não há um único caso de telemetria sem fonte, referência-cosplay ou proibição de modo violada. Segue para a aterrissagem (estudo formal → artefato → itens 13-14).

---

## ETAPA 0 — Conformidade estrutural

| Requisito | Estado | Evidência |
|---|---|---|
| 9 seções na ordem do pipeline | ✔ | operador·máquina·modo·vetores·referencias·planos·atrito·sistema·prova, todas presentes e nomeadas. |
| Perfil de vetores completo (6 valores + justificativa 1 linha cada) | ✔ | §4: Tat=3, Den=7, Geo=6, Sin=2, Ent=3, Cer=0 — cada um com justificativa e trava endereçada. |
| Modo único ou híbrido declarado | ✔ | §3: **Laboratório**, modo único, justificado em uma linha + 4 modos vizinhos recusados com razão. |
| 3–5 cards | ✔ | §5: exatamente 5 (Ando, Lissitzky, Moholy-Nagy, Rams, Hall), cada um com lei extraída (não aparência) + zona. |
| Mapa de consequência se Cerimonialidade > 0 | ✔ (N/A por declaração) | Cer=0 declarado explicitamente; §7 declara read-only e ausência total de atrito — a trava de cerimonialidade cobra justamente esta declaração do "0", e ela está feita. |
| Assinatura formal completa (nome / material / origem / proibições por gesto) | ✔ | §8 ✶: 3 gestos proprietários — UNPAINTED PLINTH, STATE-STRATUM CAP, PERSISTENCE GLINT — cada um com "o que o olho vê + onde", origem `[card/vetor]` e bloco de proibições. Rams declarado como pré-requisito, não assinatura (conforme verdict 001). |

**Conformidade estrutural: PASSA.** Documento válido para julgamento do gate.

---

## ETAPA 1 — Os 12 itens do gate anti-padrões

### Item 1 — Elemento luminoso/animado que não muda entendimento nem ação? → **PASSA**
Só existe UMA animação ambiente: a `tremor-breath`, e ela é restrita ao bloco cujo estado **mudou entre snapshots** (§2, §8-motion, gesto 3). É informação pura ("novo desde a última leitura"), não brilho decorativo. O manifesto "nothing glows" é herdado como fato-âncora e o material é matte por luminância, sem gradiente de emissão (§8-material). **Verificado:** a `tremor-breath` existe no design system real (`src/index.css:111-117`, opacidade 1↔0.85 ≈ ±0.15, período 3.4s ≥3s) exatamente como o brief a descreve. Nada luminoso sem função.

### Item 2 — Telemetria sem fonte real no sistema? → **PASSA** (item-âncora — verificado factualmente)
Este é o item que o protocolo manda perseguir. Cada canal visual do brief tem fonte citada (§2 "Teste de honestidade"), e **todas foram confirmadas no dado real**:
- **`tags[]` por nó** — EXISTE em `snapshot_slice.json` (campos por nó: `change_frequency, external_id, label, last_modified, node_type, provenance, tags`). O estado deriva de `xray:state:*` nessas tags. ✔
- **Grafo 100% unpainted** — CONFIRMADO: **0 de 40** nós têm tag `xray:state:*`. O brief trata `unpainted` como o primeiro-contato real; o dado prova. ✔
- **Distribuição de estreia** `scanned=199, bedrock=0, overgrowth=195, unproven=4, erosion_candidate=0, proof_coverage=0.0` — bate VERBATIM com `xray_paint_dryrun.json` (`counts.scanned=199, bedrock=0, overgrowth=195, unproven=4, erosion_candidate=0, painted=0, proof_coverage=0.0`). ✔
- **`manifest_source` presente** — CONFIRMADO (`file:/Users/kle1nz/m1nd/xray.manifest.json`), sustentando a lógica "no manifest active" vs manifesto presente. ✔
- **Números exibidos como número, não brilho; não oscilam** — declarado explicitamente (§2 fim, §8-motion). `coverage_session` excluído como eixo de saúde (§2), fiel à lei de produto do dossiê.

Nenhuma telemetria aponta para estado que o motor não computa. **Zero cosplay técnico.**

### Item 3 — Atrito em ação sem consequência (buscar, ler, navegar, fechar dica)? → **PASSA**
§7 declara MASSIF read-only e tabula TODAS as ações (pan/zoom, abrir detalhe, alternar zoom semântico, abrir/fechar legenda) em cerimonialidade **0**. O corte de foco (Ando) é declarado explicitamente como **transição visual** (~180-250ms), não gate — sem confirmação, sem espera antes de consequência. Nenhum atrito sobre leitura/navegação. Conforme Lei 2.

### Item 4 — Rito não listado no mapa de atrito? → **PASSA**
Não há nenhum rito na view (cerimonialidade 0). A única "pausa" — o corte de foco — está **registrada** na §7 precisamente para o gate não a confundir com rito. Não sobra gesto ritual fora da tabela.

### Item 5 — Referência como aparência literal? → **PASSA**
Cada card entra como LEI de composição e o risco de clichê de cada um é endereçado nominalmente (§5 auto-checagem):
- **Ando** = corte de luz / diferença de luminância entre 3 faces — *"Nunca textura de concreto"* (o card avisa "textura fake de concreto"; o brief obedece). ✔
- **Lissitzky** = placas de peso proporcional + diagonal isométrica funcional — *"Nunca vermelho/preto de cartaz"* (o card avisa "cartaz soviético"; obedecido). ✔
- **Moholy-Nagy** = rótulo com direção de leitura, números em coluna — *"Direção sem seta decorativa"* (o card avisa "seta"; obedecido). ✔
- **Rams** = honestidade funcional, contrapeso permanente — não vira SaaS branco; declarado como pré-requisito. ✔
- **Hall** = política do estado ausente virada copy law — *"Sem manifesto na tela"* (o card avisa "manifesto aparecendo na interface"; explicitamente evitado). ✔
Nenhuma referência aparece como fantasia literal. Lei 3 respeitada.

### Item 6 — Legível como "cyberpunk genérico / military UI / painel de nave"? → **PASSA**
O sistema visual é porcelain `#f7f4ef` + bone + ink + tokens sage/ochre/grey — a paleta calma e clara do design system existente (não neon sobre preto). O modo Laboratório proíbe estética de guerra e o brief transcreve isso para o gate (§3). O campo overgrowth-dominante é lido como "campo jovem" cinza-neutro, explicitamente NÃO como alarme (§8 edge case, `[modo]`). Não há HUD, retícula de mira nem vermelho-de-perigo espalhado. É o oposto do inimigo do manifesto.

### Item 7 — Zona densa que não responde a uma pergunta do operador? → **PASSA** (trava de densidade, Den=7)
Den=7 dispara o teste de zona obrigatório, e o brief o executa: a pergunta comum é *"o que está feito, e com que evidência?"* (§1), e cada zona densa responde a ela — o campo de blocos (estado por peça), o STATE-STRATUM CAP (proporção de evidência por container), a barra de campo (contagens reais). O que NÃO responde a uma pergunta de estado (PageRank, `layer_confidence`, `change_frequency`) é **explicitamente rebaixado** para o detalhe sob demanda (§2). Nenhuma zona densa é indistinta.

### Item 8 — Dado crítico oscila decorativamente? → **PASSA** (trava de entropia, Ent=3)
Declaração explícita: número que o operador lê **não oscila** (§2 fim, §8-motion, gesto 2 STATE-STRATUM CAP: *"NUNCA anima nem oscila (é dado crítico)"*). A `tremor-breath` é a única oscilação e incide sobre um **bloco** que mudou de estado (sinal real), nunca sobre um número. `proof_coverage 0.0` é fato mono estático. Trava respeitada.

### Item 9 — Grid/bento/linhas como decoração, sem hierarquia de decisão? → **PASSA**
O grid é o treemap squarified aninhado onde **peso do container = contagem real de membros** (`[card:lissitzky]`) e **posição do bloco = função determinística do `external_id`** — o grid existe para tornar a mudança perceptível como mudança no lugar conhecido (`[lei:1]`, §8-grid). É estrutura de decisão (leitura de território + diff posicional), não ornamento. **Verificado:** a posição estável é requisito real do dossiê e os `external_id` existem no slice.

### Item 10 — Nostalgia como cosplay de época, não memória sensorial? → **PASSA**
A memória geracional invocada (§1) é **mapa impresso / vista aérea de terreno + diff** — evocada como *leitura panorâmica + permanência posicional*, com a ressalva explícita *"sem cosplay de mapa antigo"*. Não há CRT, disquete, skeuomorfismo nem patina (o brief inclusive RECUSA o modo Arquivo vivo justamente para não introduzir patina decorativa, §3). Memória sensorial, não fantasia de época. Lei 3 respeitada.

### Item 11 — Proibição do modo escolhido violada? → **PASSA**
Modo Laboratório proíbe **alarme permanente** e **estética de guerra**. O brief não só evita como constrói a view em torno disso: overgrowth (o estado DOMINANTE, 195/199) recebe o grey `--state-unverified` neutro *precisamente para não gritar como alarme* (§8, `[modo]`); `--state-failure` (brick) fica reservado a erro real de sistema, nunca a estado de evidência (§3). Nenhuma proibição do modo é violada.

### Item 12 — Som/motion sem opção de desligar, ou `prefers-reduced-motion` ignorado? → **PASSA**
Som: **nenhum** (§8, `[vetor:sinestesia=2]`). Motion: `prefers-reduced-motion` é tratado como **contrato, não cortesia** — a `tremor-breath` para e um **tick estático** preserva a informação (§8-motion, gesto 3). **Verificado no design system real:** `src/index.css:136-148` implementa exatamente isso ("Reduced motion is a CONTRACT, not a courtesy… a static tick replaces it… every transition/animation is zeroed"), reforçado por teste de componente (INV-02 abstain-never-animates). Trava de sinestesia/entropia respeitada.

---

## Verificação factual consolidada (amostragem read-only — o que sustenta o item 2 e os fatos-âncora)

| Claim do brief | Fonte verificada | Resultado |
|---|---|---|
| 13 tokens de cor "replicados verbatim de `index.css`" | `~/m1nd/m1nd-ui/src/index.css:64-93` | **13/13 batem VERBATIM** (porcelain #f7f4ef, bone #efeae2, ink #2b2836, ink-soft #5b5566, wisteria #a78bfa, iris #7c3aed, veil #ede9fe, iris-deep #4c1d95, verdict-act #6fa287, verdict-reverify #c89b3c, verdict-abstain #7c3aed, state-unverified #b8b2a8, state-failure #b0563b) |
| Distribuição `scanned=199…overgrowth=195…proof_coverage=0.0` | `data/xray_paint_dryrun.json` | **Bate verbatim** |
| Grafo 100% unpainted (0 nós com `xray:state:*`) | `data/snapshot_slice.json` (40 nós) | **Confirmado: 0/40** |
| `tags[]` por nó existe | `data/snapshot_slice.json` | **Existe** (campo `tags` em cada nó) |
| `data_access` nome repetido (L0 e L1) | `data/layers.json` | **Confirmado: L0 (15) e L1 (60)** |
| Membership truncada (floor "≥ N") | `data/layers.json` | **Confirmado:** `truncated=true`; L1 node_count=60/returned=40, tests=42/40, entry_points=82/40, `nodes_truncated=true` — os 60/42/82 do §9 batem com `node_count` real |
| `has_cycles=false`, `layer_separation_score=1.0` | `data/layers.json` summary | **Ambos batem** |
| `tremor-breath` (±0.15, ≥3s) do design system | `src/index.css:111-117` | **Existe** (1↔0.85, 3.4s) |
| `prefers-reduced-motion` como contrato + tick estático | `src/index.css:136-148` | **Existe verbatim** |
| Quarentena de violeta lint-enforced | `scripts/violet-lint.mjs` | **Existe** |
| `blastCountPhrase` / floor "≥ N" / INV-08 | `src/lib/softProof`, `PreFlightCard.tsx:173`, `preflight-card.test.tsx` (INV-08) | **Existe + testado** |
| `abstain-never-animates` / INV-02 | `src/components/soft/soft.test.tsx:84`, `VerdictChip.tsx` | **Existe + testado** |
| `StatValue`/`StatCell`, `TrustDot`, `FreshnessBanner` | `src/components/soft/` | **Todos existem** |

Nenhum fato-âncora do brief é inventado. A telemetria é integralmente rastreável ao dado e ao código.

---

## ETAPA 2 — Observações de coerência (NÃO reprovam; instruções para a aterrissagem)

1. **A prova é honesta sobre seu próprio limite, e isso é uma força — mas o STATE-STRATUM CAP e o PERSISTENCE GLINT ficam sub-demonstrados na tela de estreia.** Como o dado real é 100% unpainted, a tela de prova mostra o CAP como faixa inteira de pedestal-vazio e o GLINT apenas *descrito* (§9). Dois dos três gestos de assinatura, portanto, não aparecem em execução material nesta tela — e é o item 14 (anti-cosplay reverso) que vai cobrar exatamente "lei citada sem execução visível". **Aterrissagem:** o "segundo estudo recomendado" (Vista Organismo *pintada*, §9 fim) deixa de ser recomendação e vira **obrigatório** para o gate 13-14 — é a única tela onde o CAP mostra segmentos sage/ochre/grey reais e o campo overgrowth-dominante fica colorido. Sem ela, o juiz do artefato terá plinth materializado, mas cap+glint só no papel.

2. **O acento de violeta no UNPAINTED PLINTH é declarado como "opcional" e isso precisa virar decisão binária na aterrissagem.** §8 diz que o pedestal usa porcelain-sobre-porcelain com contorno `--ink-soft`, e "se algum acento for necessário… usa a violeta quarentenada". Semanticamente a violeta é impecável aqui (o token é literalmente "insufficient evidence / honest unknown" — verificado em `index.css:82` e no `violet-lint.mjs`), mas "opcional" é ambíguo para um gesto que É a assinatura nº1. **Aterrissagem:** decidir on/off explicitamente no artefato e nomear a regra, senão o lint da identidade (§ aterrissagem passo 3) não tem o que grepar.

3. **A distinção material pedestal-vazio (unpainted) × grey-sólido (overgrowth) é o pino de toda a honestidade da view — e no zoom-organismo, com blocos de poucos pixels, ela vive ou morre no contorno.** O brief acerta ao dar redundância de canal (cor+forma+rótulo) e ao reservar o rótulo textual "para o zoom próximo", mas na Vista Organismo com centenas de blocos o operador distingue "reservado" de "sem uso" só pela diferença contorno-sem-tinta × preenchimento-grey. **Aterrissagem:** provar essa distinção legível **na densidade real** (não só no bloco isolado da legenda) — é o coração do card Hall materializado, e o que separa o MASSIF de um treemap genérico cinza.

---

**Assinatura do juiz frio:** gate de 12 itens aplicado sobre o brief gen-004/MASSIF com verificação factual por amostragem contra `data/*.json` e `~/m1nd/m1nd-ui`. **APROVADO, 12 PASSA / 0 REPROVA.** As 3 observações são instruções de aterrissagem, não reprovações — o brief prossegue para o estudo formal e o gate da prova (itens 13-14), onde a Vista Organismo pintada é agora requisito.
