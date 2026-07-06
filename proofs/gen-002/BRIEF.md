# DESIGN BRIEF — gen-002 · A janela do m1nd

> **Produto:** o sistema frontend de visualização do m1nd — a janela humana para dentro de um grafo de código neuro-simbólico que opera com confiança calibrada.
> **Gerado por:** MAKER da gen-002, sob a mente V1TRUVIO.
> **Caso de mente:** revisão de direção / tela de fundação (anti-escopo autorizado pelo dono — "visão completamente nova"). Nada da UI atual é herdado por default.
> **Dado vivo da prova:** `proofs/gen-002/north-packet-sample.json` (north packet REAL, capturado 2026-07-06 do runtime `1.3.2`/`ef9c6e9` em `:1338`).
> **Diagnóstico da máquina:** feito com o próprio m1nd (MCP `north`/`seek`, tier project+medulla, read-only). Fontes citadas por card da medulla ao longo do brief.
> **Precedência aplicada:** Leis > Modo > Vetores > Cards.

---

## Nome de trabalho

**MENISCUS** — o menisco é a curva que um líquido faz na borda do vidro: o instrumento honesto lê a linha de baixo (o fundo do menisco), nunca a de cima. É a metáfora exata do produto — uma janela que lê o nível real da confiança, não o nível que agradaria. O nome não aparece na tela; governa a direção.

---

## 1. `operador` — Diagnóstico do operador

**Quem é.** O DONO, Max — autor do m1nd, dev sênior Rust/TS, terminal-first. Não é "usuário" da mente; é o **supervisor** da mente que os agentes dele usam. Ele não consome o m1nd pela janela do jeito que os agentes consomem (eles falam MCP/JSON) — ele usa a janela para **auditar a máquina**: em que estado ela está, dá para confiar no que ela sabe, o que ela sabe/não sabe de um repo, o que os agentes andaram memorizando, onde o real diverge do planejado.

**O que ele está fazendo (verbo dominante).** Ele está **inspecionando e calibrando confiança** — não lendo, não criando, não navegando um feed. Ele chega com uma pergunta de auditor e quer uma resposta que ele possa acreditar (ou desacreditar com evidência). Isto é o topo do olho do Max: *"o que a tela AFIRMA é verdade, inteiro, e do leitor?"* — movimento #1 da doutrina destilada `[medulla: maxeyedoctrine — "INTERROGAR A SUPERFÍCIE", source_agent claude:main:fable-orchestrator, age ~133M ms]`.

**Estado emocional provável — bimodal, e a janela serve os dois:**
- **Varredura curta, várias vezes ao dia** (janelas de segundos): foco frio, baixa ansiedade, quer *um olhar e a resposta*. "Está tudo verde? Posso confiar? Nada sumiu?" Aqui a densidade é inimiga se não estiver hierarquizada.
- **Mergulho longo quando algo cheira mal** (minutos): desconfiança ativa, o operador virou investigador. Aqui a densidade é aliada — ele QUER ver a idade em ms, o fingerprint, o porquê da sufficiency, o non_claims, a divergência do X-RAY. É o momento em que a máquina precisa deixá-lo *cavar*.

**Memória geracional a evocar.** Não é o dev genérico. É a memória do **instrumento de bancada de laboratório** e do **terminal honesto** que reporta seu próprio estado: o osciloscópio que mostra a linha de base junto do sinal; o `git status` que não mente; o REPL que responde `nil` sem se desculpar. Max é o autor de um sistema cuja tese é *"absent/null/abstain são respostas REAIS"* — a janela dele tem que carregar a mesma dignidade do vazio declarado. Cosplay a proibir: HUD de nave, reticles, "AI dashboard" com números que pulsam sozinhos — que é literalmente a violação já registrada da doutrina do dono `[medulla: m1nd-brand-visuals-violate-aesthetic-doctrine — "live visuals are cyberpunk/neon, violating Max's anti-cyberpunk doctrine", source_agent brand-audit]`.

**Zonas de recuo (Regra do recuo — onde a interface sai da frente):**
- **Leitura de uma memória/claim individual** (o texto do que um agente memorizou): é prosa, o operador só lê — a interface vira quase editorial ali, sem telemetria disputando.
- **Navegação entre projetos/brains e rolagem de listas** (âncoras, focus nodes, o "tree"): é exploração pura — fluidez total, zero atrito, zero rito.
- **Copiar um valor** (um node_id, um sha, um caminho): ação sem consequência — instantânea, sem confirmação.

O operador só é tratado como operador (atrito, rito, peso) quando **age sobre a máquina** — ingerir um repo, promover uma memória para a medulla, reconciliar um `caller_root_mismatch`. Fora disso, a janela é uma superfície de leitura calma.

---

## 2. `maquina` — Diagnóstico da máquina

**O que a máquina processa de verdade (e portanto o que a janela existe para revelar):** um grafo de código neuro-simbólico com confiança calibrada. Fatos de engenharia, todos presentes no `north-packet-sample.json` e no diagnóstico da medulla:

| Estado real da máquina | Fonte no dado vivo | Precisa ser visível? |
|---|---|---|
| **Vínculo de confiança da sessão** (`trust_mode`: full_trust / degraded) + fingerprint do binário (`binary_version` 1.3.2, `binary_git_sha` ef9c6e9) e do grafo (`node_count` 521, `edge_count` 500, `graph_finalized`) | `binding` | **SIM — é a pergunta-raiz "posso confiar?"** |
| **Recepção**: se o grafo cobre o repo do chamador (`match: caller_root_mismatch`, `bound_workspace` ≠ `caller_root`) | `reception` | **SIM — a máquina declarando o que NÃO cobre** |
| **Memória em camadas**: cada claim com **idade REAL em ms** (`age_ms`), agente autor (`source_agent`), tier (project/medulla), `stale` bool | `memory[]` | **SIM — freshness é a confiança temporal** |
| **Sufficiency**: estado + `captured` + `top_score` + **o porquê em prosa** | `sufficiency.why` | **SIM — a máquina explicando sua própria certeza** |
| **Non-claims**: o que a resposta explicitamente NÃO afirma | `non_claims[]` | **SIM — o contorno negativo do conhecimento** |
| **Âncoras** (nodes por PageRank) e **focus nodes** (por activation) | `context.anchors`, `context.focus_nodes` | SIM, no mergulho (midground) |
| **Honest gaps**: o que a mente NÃO sabe ainda | `honest_gaps[]` | **SIM — mesmo (e sobretudo) quando vazio** |
| **Next move**: o próximo passo sugerido | `next_move` | SIM (foreground do mergulho) |
| **X-RAY**: classificação real-vs-planejado (BEDROCK/BLUEPRINT/OVERGROWTH/EROSION/UNPROVABLE) | fato do produto (não neste sample) | SIM, como camada de auditoria estrutural |

**O que permanece invisível (para não virar ruído):** `process_id`, `cache_generation`, `plasticity_generation`, `graph_path`, `schema` strings, `runtime_root` completo — telemetria de plumbing que não muda decisão do operador. Aparecem só sob demanda (um "detalhes do fingerprint" expansível), nunca no foreground. **Rams como auditor:** *"este elemento justifica a própria existência?"* `[card:04-rams]` — se um campo não responde a uma pergunta que o Max realmente faz, ele não ocupa pixel de foreground.

**O que deve parecer vivo, material ou conectado — e por quê (teste de honestidade de telemetria):**
- **Vivo** só a **idade da memória**: o único dado do produto que muda continuamente por conta própria (`age_ms` cresce em tempo real). Merece um sinal de vida REAL — o relógio da confiança correndo. Todo o resto é estado discreto, e estado discreto **não oscila**.
- **Conectado** o **vínculo binário↔grafo↔sessão**: o fingerprint é literalmente um acoplamento (binário `ef9c6e9` ligado ao grafo de 521 nós ligado a esta sessão). A conexão é real, então pode ser mostrada como conexão — mas material, não neon.
- **Nada mais pulsa.** `trust_mode`, `node_count`, `top_score` são leituras de instrumento: precisos, imóveis, legíveis. **Trava de entropia:** número que o operador lê não oscila decorativamente `[vetor:entropia=2]`.

**Telemetria cortada aqui por falta de fonte:** qualquer "atividade neural", "processando…", grafo animado de fundo, partículas, medidores de carga sem carga real. Não há fonte no `north-packet` para nada disso — seria cosplay técnico, o inimigo do manifesto.

---

## 3. `modo` — Modo

**LABORATÓRIO** — bancada de experimento vivo.

**Justificativa (uma linha):** o m1nd é uma máquina de *observabilidade epistêmica* (o operador lê instrumentos e julga confiança), não uma sala de comando sob risco em tempo real — escolher Cockpit/Central de Comando seria a militarização cosmética que a doutrina do dono proíbe e que o gate item 6 reprova; Laboratório é a máquina que **mede a si mesma e mostra a leitura, inclusive quando a leitura é "não sei"**.

**Bias do modo aplicado ANTES da calibração:** Densidade +2, Entropia +1 (bancada tem instrumentos densos e sinais vivos sutis).
**Proibições do modo (entram no gate como lei):** alarme permanente; estética de guerra. — A janela nunca grita; um estado degradado é uma leitura honesta e séria, não um alarme vermelho pulsante.

*(Acento de um segundo modo, declarado: nas zonas de leitura de um claim/memória individual, um respiro de **Terminal editorial** — a prosa do que o agente memorizou é tratada como texto, tipografia no comando, telemetria recuada. Base = Laboratório; acento editorial localizado.)*

---

## 4. `vetores` — Calibração

Perfil completo (0–10), partindo do bias do Laboratório (Den +2, Ent +1) e calibrado fino:

| Vetor | Valor | Justificativa (uma linha) |
|---|---|---|
| **Tactilidade** | **4** | Controles com estado claro e massa leve (um dial de tier, um switch de brain), mas o operador **lê** muito mais do que **toca** — não é cockpit físico; abaixo de 7, sem orçamento de performance pesado. |
| **Densidade informacional** | **8** | É um console de diagnóstico: fingerprint, idade em ms, sufficiency, non_claims, gaps, X-RAY coexistem — a densidade É o domínio do auditor. `[modo: Laboratório Den+2]` **Trava ≥7 satisfeita no §7-densidade (teste de zona).** |
| **Geometria** | **7** | Ortogonal, mecânica, modular — a máquina se organiza em placas de instrumento com hierarquia de decisão; abaixo de 8 de propósito, porque geometria 8+ exigiria tensão diagonal em TUDO e a maioria das zonas é leitura calma — a tensão fica concentrada onde há decisão (ver assinatura). |
| **Sinestesia** | **2** | Microanimações visuais funcionais (a idade correndo, a fresta de foco abrindo) e nada mais; sem áudio por default. O operador faz varreduras silenciosas o dia todo — som seria punição. `[modo: proíbe alarme]` |
| **Entropia viva** | **2** | Quase imóvel e preciso — **só a idade da memória tem vida real** (dado que de fato muda); todo o resto é leitura de instrumento estável. **Trava:** entropia nunca sobre dado crítico; `prefers-reduced-motion` respeitado. `[modo: Ent+1]` puxaria para 3, a calibração fina baixa para 2 porque o dado do produto quase todo é discreto. |
| **Cerimonialidade** | **5** | Gesto deliberado nas MUTAÇÕES da máquina (ingerir repo, promover à medulla, reconciliar mismatch) — mas o dono faz isso raramente e a supervisão diária é fluida; nem 8 (não é autorização de missão crítica), nem 0 (mutar a mente merece peso). **Mapa de consequência obrigatório no §7.** |

**Leitura do perfil:** um instrumento de bancada denso e legível, geometricamente firme, quase silencioso, com um único sinal vivo (o tempo da memória) e rito reservado para o momento em que o operador **muda** a mente em vez de só olhá-la.

---

## 5. `referencias` — RAG

Cinco cards. De cada um, a lei extraída e a zona onde ela executa (nunca aparência — lei). O verdict 001 é o alerta permanente: **card citado é card materializado, ou é decoração intelectual que reprova no item 14.**

1. **`[card:04-rams]` — honestidade funcional radical.**
   **Lei:** todo elemento justifica presença por função, estado ou clareza.
   **Zona:** a mente inteira, como freio. É o card-mãe deste produto porque a *tese do produto* é a *tese do card* — honestidade calibrada. **Não é assinatura** (o §8 avisa: Rams é pré-requisito, não gesto); é o auditor que corta plumbing do foreground e proíbe o número decorativo.

2. **`[card:03-tadao-ando]` — profundidade nasce de massa escura + fresta luminosa.**
   **Lei:** a luz só significa porque a sombra existe; foco é um corte, não um glow espalhado.
   **Zona:** o campo de leitura do mergulho. Quando o operador abre um claim/node para investigar, o resto da bancada **escurece como massa** e só o objeto ativo recebe luz — a fresta. É a base material da assinatura #1 (Meniscus Slit). Executa de verdade: há corte espacial de luz, não um `accent-color`. *(Prova de campo do próprio RAG: o Focus Slit do VERITAS//COLUMN já aplicou esta lei — aqui ela reencarna sobre dado de confiança, não sobre artigo.)*

3. **`[card:02-moholy-nagy]` — tipografia e linha são forças de orientação.**
   **Lei:** o texto tem vetor, a leitura tem trajetória.
   **Zona:** a régua da confiança e a linha do tempo da memória. A idade em ms, a tier, o autor não são tabela — são um **trilho** que se lê da esquerda (agora/fresco) para a profundidade do passado; a tipografia mono carrega a direção. Base da assinatura #2 (Trilho de Freshness).

4. **`[card:01-lissitzky]` — massa, tensão e direção espacial; o peso aponta a decisão.**
   **Lei:** o plano vira estrutura quando carrega peso e diagonal funcional; há UMA decisão dominante.
   **Zona:** o veredito de confiança (a "placa de trust") e a divergência do X-RAY. A resposta à pergunta-raiz "posso confiar?" não é um badge — é uma **placa pesada e assimétrica** cujo peso e inclinação mudam com o estado (full_trust assenta reto e estável; degraded desloca e inclina). Aqui a diagonal é funcional: aponta o olho para a reconciliação. **Anti-cosplay:** proibido virar "um card maior que o outro" (o erro exato do verdict 001) — tem que haver deslocamento/tensão real.

5. **`[card:06-stuart-hall]` — a interface codifica quem o humano deve ser; devolva agência.**
   **Lei:** revelar consequência ANTES da ação; linguagem de operador; estado transparente.
   **Zona:** os estados honestos (degraded, stale, abstain, mismatch) e o rito de mutação. O padrão da indústria é *esconder a incerteza* para parecer competente — este produto **desvia** isso: a incerteza é mostrada com dignidade, com as opções de reconciliação na cara (as `reception.options[]` do dado real). O operador nunca é anestesiado numa falsa certeza.

*(Cards deliberadamente fora: Teenage Engineering — o produto é de leitura, não de criação lúdica; um dial de tier toma emprestado a seriedade dele, mas o núcleo não é instrumento tocável. Détournement — o desvio de Stuart Hall já cobre a única inversão relevante, e Détournement pediria "login como pórtico"/superfície familiar reencaixada que este produto não tem.)*

---

## 6. `planos` — Três planos

Cada elemento pertence a UM plano. Elemento sem plano = sem função = fora.

**FOREGROUND — a decisão imediata do auditor (maior contraste, o único lugar de toque/decisão):**
- A **Placa de Trust** (o veredito da pergunta-raiz): `trust_mode` + o gesto que muda com o estado. `[card:01-lissitzky]`
- Quando há problema, a **linha de reconciliação**: `caller_root_mismatch` com as `reception.options[]` acionáveis. `[card:06-stuart-hall]`
- No mergulho: o **objeto ativo iluminado** (o claim/node aberto) + o `next_move`. `[card:03-ando]`

**MIDGROUND — o contexto de instrumento (telemetria, estado, memória, controles secundários):**
- O **Trilho de Freshness**: `memory[]` com `age_ms` viva, `source_agent`, tier, `stale`. `[card:02-moholy-nagy]`
- O **bloco de sufficiency**: estado + `captured`/`top_score` + `why` em prosa.
- As **âncoras e focus nodes** (PageRank/activation) como lista navegável.
- O seletor de **brain/projeto** e o **dial de tier** (project / medulla / project+medulla / all-brains).
- O **contorno negativo**: `non_claims[]` e `honest_gaps[]` — presentes, discretos, legíveis.

**BACKGROUND — atmosfera e matéria (respiração lenta, sombra, nada acionável):**
- A **massa** da bancada: o fundo material escuro que existe para que a fresta de foco signifique (Ando). Não é decoração — é a condição da luz.
- O **fingerprint detalhado** recolhido (binary sha, node/edge counts, roots) — matéria de fundo que sobe sob demanda, nunca disputa foreground.
- A respiração única e lenta do sistema: **apenas** o incremento da idade da memória. O resto do background é imóvel.

---

## 7. `atrito` — Mapa de atrito

**Princípio (Lei 2):** atrito só onde há consequência; fluidez preservada para exploração. Cerimonialidade = 5 exige este mapa de consequência explícito.

**ONDE HÁ ATRITO (e o rito de cada ação):**

| Ação | Cerimônia | Por quê existe / que consciência aumenta |
|---|---|---|
| **Ingerir um repo** (`ingest`, cria um brain novo, muda o que a mente cobre) | **5 — gesto deliberado** | Muda a fundação do que a máquina sabe; o operador confirma escopo (`project_root`) vendo o que será coberto. Consciência: "estou dando à mente um novo território." |
| **Promover uma memória à medulla** (claim de projeto vira doutrina compartilhada entre brains) | **8 — ritual de autorização** | É irreversível na prática e **cruza fronteiras de projeto** (a medulla é lei para todos os brains). O operador confirma origem, autor e conteúdo. Consciência: "isto deixa de ser fato de um repo e vira doutrina de todos." Este é o pico de cerimônia do produto. `[card:06-stuart-hall]` |
| **Reconciliar `caller_root_mismatch`** (escolher continuar-bound vs ingerir) | **3 — confirmação leve** | A máquina já declarou o mismatch honestamente; o operador só escolhe conscientemente entre as `reception.options[]`. Rito leve porque a consequência de "continuar bound" é reversível. |

**ONDE A INTERFACE PERMANECE FLUIDA (declarado — Lei 2):**
- **Buscar / seek / navegar âncoras, focus nodes, o tree** — exploração, zero atrito.
- **Abrir e ler um claim/memória** — a fresta de foco abre suave, sem confirmação (a leitura não tem consequência).
- **Trocar de brain/projeto e mudar o dial de tier** — inspeção; muda o que se vê, não o que a máquina é. Instantâneo.
- **Copiar node_id / sha / caminho** — ação sem consequência, sem rito.
- **Recolher/expandir o fingerprint detalhado** — leitura, instantâneo.

**Trava:** nenhum atrito fora desta tabela pode aparecer no design. Um rito em ação de leitura reprova no item 3 do gate.

---

## 8. `sistema` — Sistema visual

### Material dominante
**Vidro de instrumento sobre massa mineral escura.** O fundo é uma massa profunda e fosca (não preto puro — massa com temperatura), sobre a qual as leituras vivem em **placas de vidro fosco** com borda fina de precisão. A luz não é emitida pela interface (não há glow neon `[medulla: anti-cyberpunk doctrine]`); a luz **entra por frestas** onde há foco `[card:03-ando]`. A matéria é a condição da legibilidade, não ornamento.

> **Ruptura consciente declarada (não acidente).** A UI atual do m1nd é o tema **SOFT PROOF** de fundo CLARO — porcelana `#f7f4ef`, tinta `#2b2836`, verdictos sálvia/ocre/tijolo, violeta em quarentena (verificado por leitura direta de `tailwind.config.ts` e do inventário de componentes). O crítico de "neon cyberpunk" da medulla `[medulla: m1nd-brand-visuals-violate-aesthetic-doctrine]` é FATO, mas aponta os rasters de `.github/` e o homepage `m1nd-demo`, **não** esta UI — a UI servida já fez a virada calma. Portanto a virada calma NÃO é o que falta: o que falta é **força formal** (a UI resolve trust como um ponto de 2px, veredito como pílula com ícone, memória como linha com idade — exatamente o diagnóstico do verdict 001: cada conceito no componente mais seguro do vocabulário dashboard). Esta fundação inverte o VALOR de fundo (claro → massa escura) por uma razão de LEI, não de gosto: a lei de Ando (profundidade = massa escura + fresta) **não pode** executar sobre um campo claro — luz não corta o claro. A assinatura #1 (Meniscus Slit) exige a massa. A alma calibrada (SOFT PROOF acertou) é preservada e herdada como doutrina; a estrutura é inteiramente nova. Esta é a ruptura que o caso "visão completamente nova" autoriza.

### Paleta
Derivada do diagnóstico, não pré-decidida. Duas decisões carregam origem forte:

- **A violeta é rara e reservada — herança da doutrina, não da UI.** O único ativo de marca on-doctrine confirmado é o logo (`#a78bfa` wisteria / `#7c3aed` iris / `#4c1d95` deep, anéis de spreading-activation, glow suave) `[medulla: m1nd-brand-visuals-violate-aesthetic-doctrine — "logo-svg-is-on-brand-keep"]`. A violeta aqui **não é cor de UI ambiente**: é reservada para o estado epistêmico de **incerteza/abstenção** (abstain, insufficient_evidence, unknown) — a cor do "não sei" honesto. Isto respeita a quarentena de violeta já existente no domínio e a torna semântica, não decorativa.
- **Base mineral + tinta:**
  - `massa` — a matéria de fundo, mineral escura e fosca (registro de valor ~#16151c–#1c1a24, temperatura fria-neutra; nunca navy cyberpunk).
  - `vidro` — placa de instrumento, um degrau acima da massa, fosca.
  - `tinta` — o texto de leitura, alto contraste sobre vidro (registro claro ~#e8e4dc, quente-neutro; a legibilidade de tinta sobre papel, não branco-neon sobre preto).
  - `tinta-soft` — texto secundário/labels.
- **Cores de estado (semânticas, uma leitura = uma cor, nunca ambiente):**
  - `trust-full` — verde-sálvia sóbrio (não verde-tela): full_trust assentado.
  - `trust-degraded` — âmbar-latão: degraded / reverify (a cor do "verifique de novo", já viva no domínio como `reverify #c89b3c`).
  - `stale` / `unknown` — cinza-neutro dessaturado: o `absent age = unknown`, o vazio declarado tem cor própria e digna.
  - `failure` — terracota queimado (não vermelho-alarme `[modo: proíbe alarme]`).
  - `abstain` — a violeta reservada, acima.
- **Regra dura de paleta:** nenhuma cor de estado é usada como cor ambiente/decorativa; cada aparição de cor **é** um estado real do `north-packet`. `[card:04-rams]`

### Tipografia
- **Mono como voz primária dos instrumentos** (idade em ms, sha, counts, node_ids, scores): uma mono técnica e legível (o domínio já vendoriza IBM Plex Mono — direção compatível, sem herdar layout). A mono carrega a honestidade numérica: o operador vê `age_ms: 133846415` como número real, não "há ~1 dia" arredondado por cima.
- **Serial/serif para a prosa epistêmica** (o `sufficiency.why`, o texto de um claim memorizado): a explicação da máquina sobre a própria certeza merece o registro de um caderno de laboratório, não de um label de app. `[modo: acento editorial]` (o domínio já vendoriza Fraunces — direção compatível).
- **Sans neutra para navegação e labels de controle.**
- Nenhuma fonte é escolhida por moda; cada registro serve uma função (número honesto / prosa epistêmica / navegação).

### Grid
Grid ortogonal de placas de instrumento `[vetor:geometria=7]`, assimétrico onde há decisão `[card:01-lissitzky]`: a Placa de Trust não fica centrada nem em coluna igual às outras — ocupa peso desproporcional e desloca a leitura para si, porque é a pergunta dominante. As zonas de leitura calma (memória, âncoras) seguem colunas regulares e silenciosas.

### Componentes (cada um lê campos REAIS do north-packet)
- **Placa de Trust** — `binding.trust_mode`, `binding.ok`, resumo do fingerprint.
- **Trilho de Freshness** — `memory[]`: por claim, `age_ms` (viva), `source_agent`, `tier`, `stale`.
- **Bloco de Sufficiency** — `sufficiency.{state, captured, top_score, why}`.
- **Contorno Negativo** — `non_claims[]` + `honest_gaps[]` (com estado-vazio que afirma, ver edge cases).
- **Linha de Reconciliação** — `reception.{match, honest, bound_workspace, caller_root, options[]}`.
- **Lista de Âncoras/Focus** — `context.anchors[]` (pagerank), `context.focus_nodes[]` (activation), `coverage`.
- **Dial de Tier** — project / medulla / project+medulla / all-brains.
- **Cartela X-RAY** — classes BEDROCK/BLUEPRINT/OVERGROWTH/EROSION/UNPROVABLE (camada de auditoria estrutural; fora do sample, mas do produto).
- **Gaveta de Fingerprint** — o detalhe de plumbing sob demanda (background).

### Estados (por componente, os REAIS do produto — vocabulário confirmado no runtime/UI atual)
- **Trust (binding):** full_trust · degraded. **Veredito epistêmico (ternário, a linguagem real do produto):** **act** ("good to go") · **reverify** ("worth a second look") · **abstain** ("I won't guess this one"). Este ternário é o coração honesto — abstain é uma resposta, não uma falha; herdo o vocabulário, dou-lhe a forma da placa. **Sufficiency:** sufficient · gathering · insufficient. **Memory (post-it):** fresh · aging (≥30d, regra real `STALE_AFTER_MS`) · stale (evidência mudou) · **unknown (proveniência/idade ausente)**. **Reception:** match (silenciosa) · caller_root_mismatch. **X-RAY:** BEDROCK · BLUEPRINT · OVERGROWTH · EROSION · UNPROVABLE.
- **Regra dura de estado (INV — herdada como lei do produto):** **abstain/unknown NUNCA anima** — o "não sei" é imóvel e digno; só o vivo (idade) e o foreground respiram. Cor de estado sempre acompanhada de rótulo textual (a palavra É o dado).

### Motion
- **A idade correndo** — o único movimento contínuo: o `age_ms` incrementa em tempo real no Trilho de Freshness. É vida REAL (o dado muda). `[vetor:entropia=2]`
- **A fresta de foco** — ao abrir um objeto no mergulho, a massa ao redor escurece e a luz entra por um corte; entrada lenta, contida `[card:03-ando]`. `prefers-reduced-motion`: a fresta vira um corte estático (o foco continua legível sem animação).
- **Deslocamento da placa** — a Placa de Trust assenta (full) ou desloca/inclina (degraded) com um movimento curto e pesado, mecânico, não líquido `[card:01-lissitzky]`.
- Nenhum outro motion. Nada pulsa decorativamente.

### Som / haptic
Nenhum por default `[vetor:sinestesia=2]`. Opcional e desligável: um único tom seco de confirmação no pico de cerimônia (promover à medulla) — sinal de atenção, não recompensa. **Trava:** som sempre desligável; mapa som→estado (um tom = uma confirmação).

### Acessibilidade
- Todo controle "físico" (dial de tier, switch de brain) tem equivalente teclado + ARIA `[vetor:tactilidade=4, abaixo da trava 7 mas paridade mantida]`.
- Cor de estado nunca é o único portador de significado: cada estado carrega **rótulo textual** (full_trust / degraded / stale / abstain) além da cor — crítico para daltonismo e para a honestidade (a palavra é o dado).
- `prefers-reduced-motion` respeitado em todas as três animações.
- Contraste de tinta sobre vidro em nível de leitura prolongada (o operador cava por minutos).

### Edge cases — os estados honestos do produto SÃO os edge cases (e são cidadãos de primeira classe)
- **Vazio (`honest_gaps: []`, `memory: []`):** não é tela em branco — é uma **afirmação**: "a mente não declara lacunas conhecidas aqui" / "nenhuma memória neste tier". O vazio declarado tem tipografia própria e dignidade. `[card:06-stuart-hall]`
- **Erro / degraded (`trust_mode: degraded`):** leitura séria, não alarme. A Placa de Trust desloca e mostra o reparo que **viaja com o estado** (o produto sempre manda o reparo junto do degradado). Cor âmbar-latão, nunca vermelho pulsante `[modo: proíbe alarme]`.
- **Carregando:** a bancada aparece como **massa antes da luz** — placas presentes em estado fosco/silencioso, preenchendo conforme a leitura chega; nunca spinner genérico girando sobre vazio.
- **Offline / air-gapped:** o produto é local-first (fontes self-hosted); a janela funciona sem rede. Um estado de rede ausente é declarado como fato, não como falha.
- **Stale (`stale: true` ou `age` ausente):** o dado NÃO some e NÃO é falsificado para "agora" — é marcado como stale/unknown com a cor cinza-neutro. Esta é a lei central do produto (`absent age = unknown, never faked to now`) materializada em pixel.

### Rastreabilidade (origem de cada decisão não-óbvia)
Cada bloco acima carrega `[card:…]` / `[lei:…]` / `[vetor:…]` / `[modo]` na origem. Decisões sem origem seriam decoração — não há nenhuma aqui.

---

### ASSINATURA FORMAL OBRIGATÓRIA

Três gestos proprietários que SÓ esta identidade tem. Seguindo a doutrina destilada no verdict 002 — *a assinatura mais forte nasce do dado que só este produto tem* — os três nascem de dados que só o m1nd expõe: idade real em ms, o porquê da sufficiency, e o vínculo de confiança da sessão. Honestidade calibrada (Rams) NÃO é assinatura; é pré-requisito. Estes são forma.

**Assinatura 1 — MENISCUS SLIT (o corte de foco que lê o nível de baixo).**
- **O que o olho vê e onde:** no mergulho, quando o operador abre um objeto (um claim, um node, a Placa de Trust), toda a bancada escurece para massa e a luz entra por **uma única fresta horizontal fina** que corta a placa ativa — e a linha de luz **não fica no topo da placa: ela pousa na base do conteúdo, no "fundo do menisco"**, exatamente onde mora a informação mais honesta e menos confortável (a idade real, o non_claim, o gap). A borda superior da fresta é nítida; a inferior desfoca em direção à massa. A luz é fria-neutra, nunca neon.
- **Origem:** `[card:03-tadao-ando]` (luz como corte, não glow) + a metáfora-mãe do produto (o instrumento lê o menisco por baixo) + `[vetor:entropia=2]` (movimento contido, uma vez).
- **Proibições:** proibido virar `box-shadow`/glow espalhado; proibido a luz no topo (isso seria "header destacado" de template); proibido cor emitida (Ando é sombra revelando luz, não LED). Um template de dashboard jamais corta a base do conteúdo com uma fresta — ele ilumina o card inteiro uniformemente.

**Assinatura 2 — TRILHO DE FRESHNESS (o tempo da memória como eixo físico, com o dígito vivo).**
- **O que o olho vê e onde:** o `memory[]` não é lista de cards nem tabela — é um **trilho horizontal único** que corre da esquerda (agora / fresco) para a direita-profundidade (passado). Cada claim é uma marca no trilho posicionada pela sua `age_ms` real (escala logarítmica do tempo); a marca carrega, em mono, **o dígito de ms correndo em tempo real** (o único número vivo da tela), o `source_agent` como etiqueta-vetor de Moholy-Nagy apontando para a marca, e o `tier` como espessura da marca (medulla = traço pesado, project = traço fino). Uma marca `stale` ou de idade ausente **cai para uma faixa cinza fora do trilho** — literalmente fora da linha do tempo confiável, porque `absent age = unknown`.
- **Origem:** `[card:02-moholy-nagy]` (tipografia/linha como força de orientação, leitura como trajetória) + `[vetor:entropia=2]` (o único sinal vivo, e ele é real) + a lei central do produto (idade nunca falsificada).
- **Proibições:** proibido arredondar a idade para "há 1 dia" no lugar do número (mata a honestidade do dado); proibido a marca stale ocupar o trilho como se fosse confiável; proibido o dígito vivo em qualquer outro lugar da tela (a vida é exclusiva do tempo da memória). Nenhum template de "activity feed" posiciona itens por log(idade) num eixo físico nem exila o stale para fora do eixo.

**Assinatura 3 — PLACA DE TRUST QUE ASSENTA OU DESLOCA (o veredito com peso físico).**
- **O que o olho vê e onde:** a resposta à pergunta-raiz "posso confiar?" é uma **placa pesada e assimétrica** no foreground, não um badge. Em `full_trust` ela **assenta reta e estável**, alinhada ao grid, sombra de contato curta e firme — a máquina em repouso confiável. Em `degraded`/`caller_root_mismatch` a mesma placa **desloca do alinhamento e inclina alguns graus**, projetando uma sombra mais longa, e a inclinação **aponta o olho para a Linha de Reconciliação** (as `reception.options[]`) — a diagonal é literalmente o vetor de leitura para o reparo. O peso e a inclinação são função do estado, medidos, não animados à toa.
- **Origem:** `[card:01-lissitzky]` (massa + tensão + diagonal funcional; o peso aponta a decisão) + `[card:06-stuart-hall]` (a consequência — "este grafo não cobre seu repo" — revelada antes da ação) + `[vetor:geometria=7]`.
- **Proibições:** proibido virar "um card maior" (o erro nomeado no verdict 001); proibido a inclinação ser decorativa (ela SEMPRE aponta para a ação de reparo, ou não existe — Lei 1); proibido badge de cor no lugar da placa. Um kit de admin resolve trust como um pill verde/vermelho — jamais como uma placa que muda de assento físico e cuja diagonal endereça a próxima ação.

---

## 9. `prova` — A tela mínima que prova a direção

**Artefato:** UMA tela — **a Bancada de Supervisão**, no estado que só este produto sabe mostrar: **confiança DEGRADADA e honesta**, renderizando os dados REAIS de `north-packet-sample.json`. Um implementador constrói isto sem falar comigo. Escolho o estado degradado de propósito: é onde a alma do produto (dizer "não sei / não cubro isto") e as três assinaturas aparecem juntas.

### Dados reais a renderizar (verbatim do `north-packet-sample.json`)
- **binding:** `trust_mode: "full_trust"`, `ok: true`, `fingerprint`: `binary_version 1.3.2`, `binary_git_sha ef9c6e9`, `node_count 521`, `edge_count 500`, `graph_finalized true`, `runtime_root /Users/kle1nz/.m1nd/runtimes/claude`.
  *(Nota honesta de estado: neste sample o `binding.trust_mode` é full_trust ENQUANTO a `reception` é mismatch — o produto trata "confio no binário/grafo" e "este grafo cobre seu repo?" como DUAS perguntas independentes. A tela deve mostrar as duas verdades lado a lado, sem colapsar uma na outra: Placa de Trust assentada (full) + Linha de Reconciliação ativa (mismatch). Este é o retrato honesto real; não invente um degraded que o dado não tem.)*
- **reception:** `match: "caller_root_mismatch"`, `honest: "this graph does NOT cover your repo"`, `bound_workspace: "/Users/kle1nz/.m1nd/runtimes/claude/agent-memory"`, `caller_root: "/Users/kle1nz"`, `options[]`: `continue_bound` e `ingest_your_repo` (com as notas reais).
- **memory[3]:** os três claims da medulla, com `age_ms` REAIS: `133637855` (maxeye, `source_agent claude:main:fable-orchestrator`), `272592718` (brand-visuals, `source_agent brand-audit`), `271032997` (brand-critique, `source_agent fable-brand-critic`); todos `tier medulla`, `stale false`.
- **sufficiency:** `state "sufficient"`, `captured 0.2638`, `top_score 0.2426`, `why: "the top match scores 0.24; everything left out scores at most 0.14 (weak tail) — the strongest context is in hand"`.
- **honest_gaps:** `[]` (vazio — renderizar como afirmação, não como buraco).
- **non_claims[4]:** os quatro verbatim, incluindo `"an absent memory age means unknown authored time, never freshly authored."`
- **next_move:** `"Call surgical_context on the top focus node to ground the task before editing."`
- **context.anchors[5]:** `walk` (pagerank 1.0), `collect` (0.8191), `README.md` (0.5485), `_observeTargets` (0.1972), `draw` (0.1972).
- **context.focus_nodes[5]:** os cinco, com `activation` e `path` reais (o topo é a doutrina do olho do Max, activation 0.8122).

### Layout da tela (foreground → background)

**FOREGROUND (a decisão do auditor):**
1. **Placa de Trust** (assinatura 3), canto de maior peso, deslocada do grid: mostra `full_trust` **assentada e reta** (a máquina confia no próprio binário/grafo) — porém com uma **aba de reconciliação inclinada** saindo dela, porque a `reception` é mismatch. A inclinação aponta para (2). Rótulo textual "FULL TRUST · binário ef9c6e9 · grafo 521/500 finalizado". A dualidade honesta (trust full + cobertura ausente) é o coração da tela.
2. **Linha de Reconciliação** (Stuart Hall): em tinta clara sobre a massa, a frase real da máquina — *"this graph does NOT cover your repo"* — seguida de `bound_workspace` e `caller_root` (os dois caminhos reais, em mono, para o operador ver a divergência com os próprios olhos, movimento #4 do olho do Max "de quem é este número"), e as duas `options[]` como escolhas conscientes acionáveis (a de `ingest` carrega cerimônia 3 — confirmação leve, ver §7). Consequência revelada ANTES da ação.

**MIDGROUND (o instrumento):**
3. **Trilho de Freshness** (assinatura 2): os 3 claims da medulla posicionados por `age_ms` em escala log — o de `133M ms` mais à esquerda (mais fresco), os dois de `~271–272M ms` mais à direita; cada marca com o dígito de ms **correndo ao vivo** em mono, o `source_agent` como etiqueta-vetor, tier medulla = traço pesado. Nenhum está stale, então o trilho está cheio e confiável — mas a faixa cinza de "fora do trilho" está visível e VAZIA, ensinando o operador onde o stale cairia.
4. **Bloco de Sufficiency**: `state: sufficient` como leitura, e o `why` real em **prosa serif** (acento editorial) — a máquina explicando por que acha que basta ("the top match scores 0.24… the strongest context is in hand"). `captured 0.2638` e `top_score 0.2426` em mono ao lado, como as duas leituras que sustentam a prosa.
5. **Contorno Negativo**: `non_claims[]` listados discretamente (o operador pode ler o que a resposta NÃO afirma), e `honest_gaps: []` renderizado como a afirmação *"a mente não declara lacunas conhecidas para esta tarefa"* — **vazio que afirma, cor cinza-neutro digna**, não espaço morto.
6. **Lista de Âncoras/Focus**: âncoras por pagerank (barra de peso proporcional, `walk` cheio em 1.0) e focus nodes por activation; navegável, silenciosa, colunas regulares (zona de recuo — fluida).

**BACKGROUND (matéria):**
7. A **massa mineral escura** que sustenta tudo e faz a fresta significar.
8. A **Gaveta de Fingerprint** recolhida (o `runtime_root`, `process_id`, counts crus) — sobe só se o operador puxar.
9. Respiração única: apenas os dígitos de ms do trilho incrementando.

### A assinatura 1 (Meniscus Slit) nesta tela
Quando o operador **abre um dos claims da memória** (clica a marca do trilho para ler o texto inteiro do que o agente memorizou), a bancada escurece para massa e a **fresta horizontal corta a base** do painel do claim — a luz pousa exatamente sobre a linha `source_agent` + `age_ms` (a informação mais honesta), borda superior nítida, inferior desfocando na massa. Leitura calma, editorial, fresta estática sob `prefers-reduced-motion`.

### Estados honestos que o implementador DEVE renderizar (variações da mesma tela, para provar a alma)
1. **O estado do sample (canônico):** full_trust + caller_root_mismatch + sufficiency sufficient + gaps vazios (acima).
2. **Trust degradado:** trocar `trust_mode` para `degraded` → a Placa de Trust **desloca e inclina** (assinatura 3 em pleno gesto), cor âmbar-latão, o reparo viajando junto; sem alarme vermelho.
3. **Memória stale:** marcar um claim com `stale: true` (ou idade ausente) → a marca **cai para a faixa cinza fora do trilho**, com rótulo "unknown age" — nunca falsificada para agora.
4. **Abstain / insufficient_evidence:** um bloco de resposta epistêmica em que a máquina retorna abstenção → renderizado na **violeta reservada** com o rótulo textual real do produto — **"abstain — I won't guess this one"** — tratado como resposta REAL e digna, não como erro. **Imóvel:** abstain nunca respira (regra INV herdada) — é a única placa do foreground que não recebe gesto, porque o "não sei" honesto não performa.
5. **Sufficiency gathering:** o `why` real observado no meu próprio diagnóstico ao vivo — *"the strongest match left out still scores 0.23 — relevant context did not fit… raise token_budget/top_k or narrow the goal"* — provando que a prosa epistêmica muda com o estado e é sempre honesta.

### Critério de prova (o que esta tela tem que provar quando o juiz frio a olhar)
- As **três assinaturas visíveis e nomeáveis** (Meniscus Slit no mergulho; Trilho de Freshness com dígito vivo e faixa-stale; Placa de Trust assentando/deslocando).
- **Teste do template (item 13):** trocando a paleta, isto NÃO poderia sair de um kit de dashboard — porque nenhum kit posiciona memória por log(idade) num eixo físico com stale exilado, nem corta a base do conteúdo com uma fresta, nem resolve trust como uma placa que muda de assento físico apontando a reconciliação.
- **Anti-cosplay reverso (item 14):** Ando é corte espacial de luz real (não accent); Lissitzky é deslocamento/inclinação real da placa (não card maior); Moholy-Nagy é um eixo de leitura real (não hierarquia de peso genérica); Stuart Hall é a incerteza mostrada com opções acionáveis (não copy).
- A **alma do produto**: o vazio (`honest_gaps: []`), o stale exilado, o abstain em violeta e o mismatch honesto são cidadãos de primeira classe — a janela é digna quando a mente diz "não sei".

*(Quando esta direção virar frontend real no repo-alvo, o Q&A segue o padrão uiproof — fora do escopo deste brief.)*

---

### Auto-checagem do maker (rascunho interno — NÃO é veredito; o juiz frio decide)
- Perfil de 6 vetores completo, com justificativa e travas endereçadas (densidade ≥7 → teste de zona no §7/§9; entropia sobre dado crítico proibida; tactilidade <7 com paridade a11y). ✓
- Modo único (Laboratório) + acento declarado (editorial), proibições do modo respeitadas (sem alarme, sem estética de guerra). ✓
- 5 cards, cada um com lei + zona + proibição anti-cosplay; Rams marcado como pré-requisito, não assinatura. ✓
- Três planos com todo elemento atribuído; nenhum elemento órfão. ✓
- Mapa de atrito com mapa de consequência (cerimônia 3/5/8) e zonas fluidas declaradas. ✓
- Assinatura formal: 3 gestos proprietários, cada um nascido de dado que só este produto tem, com origem + descrição material + proibições. ✓
- Prova: uma tela, dados reais verbatim, edge cases E estados honestos (degraded/stale/abstain/mismatch/vazio) especificados para construção sem contato. ✓
- Telemetria: toda leitura aponta um campo real do north-packet; nada oscila decorativamente; nenhuma fonte inventada. ✓
