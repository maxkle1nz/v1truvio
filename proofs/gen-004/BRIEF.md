# Design Brief — MASSIF

> Identidade visual da nova view **MASSIF** da Human View do m1nd, gerada sob a mente V1TRUVIO (gen-004).
> Maker: MAKER gen-004. O gate (12 itens do brief + itens 13-14 sobre o artefato) é aplicado por juiz frio separado — a auto-checagem abaixo de cada seção é rascunho interno.
>
> **Fatos-âncora (do dossiê + dados verbatim em `data/`, verificados 2026-07-06 contra o sistema vivo):**
> - MASSIF é uma **view nova DENTRO** da Human View existente (`~/m1nd/m1nd-ui`), não um produto novo. Coabita a mesma janela que Hall / LivingTree / GraphCanvas. Renderiza o grafo de código como **blocos** (prismas isométricos de 3 faces), agrupados em containers por camada/diretório, em vez de nós-e-arestas.
> - Eixo primário de informação: o **estado de evidência estrutural** de cada parte do código (5 estados, vindos das tags `xray:state:*` persistidas no snapshot).
> - **Distribuição REAL de estreia** (`xray_paint_dryrun.json`): `scanned=199, bedrock=0, overgrowth=195, unproven=4, erosion_candidate=0, proof_coverage=0.0`, manifesto PRESENTE. O grafo vivo hoje está **100% unpainted** (`snapshot_slice.json`: zero nós com tag `xray:state:*`). Estes dois cenários — não o ideal — são o que o usuário vê primeiro.
> - Tokens de cor do design system são **fato** e a linguagem do MASSIF é ancorada neles (valores exatos em `index.css`, replicados na §8). Estender é permitido; contradizer exige justificativa por lei.
> - Restrições técnicas do MVP são decididas, não re-projetadas: Canvas 2D, projeção isométrica desenhada à mão, layout `d3-hierarchy` (squarified treemap) com containers aninhados, `d3-zoom` para zoom semântico, 100% offline/local-first, zero CDN/telemetria.

**Precedência de resolução (do CONTRACT):** Leis > Modo > Vetores > Cards.

---

## 1. Diagnóstico do operador → `operador`

**Quem opera, e o que faz.** Três operadores, um único artefato — mas a view responde a **uma** pergunta comum: *"o que está feito, e com que evidência?"*.

1. **O dono do sistema** (dev experiente). Estado: foco frio, quer **leitura de estado num relance** sem abrir arquivos. Não está criando aqui — está **diagnosticando**. Lê o campo, procura a mudança, mergulha na peça suspeita. Verbo dominante: **investigar**.
2. **O vibecoder** (constrói dirigindo agentes de IA, não lê o código linha a linha). Estado: **ansiedade de opacidade** — "os agentes fizeram algo, mas eu não sei o quê nem se está provado". A view é a resposta honesta a essa ansiedade, então NÃO pode mentir "feito/provado". Verbo dominante: **ler o estado** (consumir, não calibrar).
3. **O agente de IA** captura a MESMA verdade por verbos — não é público visual desta view, mas é a prova de que o eixo de informação é o estado real, não decoração.

**Estado emocional provável.** Nenhum dos três está sob risco em tempo real — ninguém vai perder dinheiro ou derrubar produção *dentro* desta tela. O que existe é **incerteza sobre o estado do trabalho**. O inimigo emocional é a falsa confiança ("parece pronto") e a ansiedade da opacidade ("não sei o que tenho"). A view combate os dois com **honestidade legível**: o estado ausente (`unpainted`) é mostrado como um estado próprio, não disfarçado de saúde nem de doença.

**Memória geracional.** O dev e o vibecoder compartilham a memória do **mapa impresso / vista aérea de terreno**: você lê um território de cima, reconhece regiões pela forma e pela cor, e desce onde algo mudou. Também a memória do **diff** — a mudança que salta porque o resto ficou parado. A view evoca essas duas (leitura panorâmica + permanência posicional), sem cosplay de mapa antigo.

**Regra do recuo (zonas onde a interface recua e deixa o operador em paz):**
- **Vista organismo em pan/zoom** = leitura pura. Nada de rito, nada de confirmação, nada de atrito. Navegar o território é exploração; é fluido por lei (Lei 2).
- **Legenda / onboarding dos 5 estados** = leitura. Recua para tipografia calma.
- **Detalhe de peça (rung de leitura)** = consumo de metadados. A view apresenta o estado, as conexões e a proveniência e cala a boca; não pede nada.
- Onde a interface **não** recua: nada nesta view. **MASSIF é read-only** (como LivingTree e GraphCanvas). Não há ação com consequência dentro dela — e isso governa a §7 inteira.

**Auto-checagem (rascunho):** operador, estado e memória nomeados; zonas de recuo declaradas explicitamente; a ausência de zona de risco é declarada, não omitida (entra direto na calibração de cerimonialidade = 0).

---

## 2. Diagnóstico da máquina → `maquina`

**O que a máquina processa de verdade.** O motor x-ray do m1nd classifica cada nó do grafo de código em um de cinco **estados de evidência estrutural**, derivados de fatos do grafo (arestas de referência, ancoragem em teste/`grounded_in`, violação de manifesto) e persistidos como tags `xray:state:*` que já viajam no snapshot que a UI busca. A view **renderiza esse estado verbatim** — ela não computa nem opina; ela **desenha o que o motor provou**.

**A gramática de estados (lei de produto, vem do motor — não é escolha estética):**

| estado | tag | significado técnico | é bom/ruim? |
|---|---|---|---|
| **bedrock** | `xray:state:bedrock` | exercido por teste OU ancorado (`grounded_in`) | evidência estrutural (NÃO prova de correção) |
| **overgrowth** | `xray:state:overgrowth` | órfão: zero arestas de referência entrando | sinal, não veredito |
| **unproven** | `xray:state:unproven` | usado (refs entram) mas sem evidência de prova | sinal, não veredito |
| **erosion-candidate** | `xray:state:erosion-candidate` | origem de aresta que viola o manifesto | **candidato**, não veredito |
| **unpainted** | (ausência de tag) | ainda não escaneado | estado próprio e honesto — NUNCA renderizar como `unproven` |

**Estados que PRECISAM ser visíveis:** os cinco, por bloco, com **redundância de canal** (cor + forma/preenchimento + rótulo textual, nunca só cor). O estado agregado de um container precisa ser visível como **proporção** (quantos blocos de cada estado ele contém), não como um único rótulo all-or-nothing — porque a distribuição real é mista e dominada por um estado (overgrowth), e um rótulo único mentiria.

**O que permanece invisível (para não gerar ruído):** PageRank, `layer_confidence`, `avg_out_degree`, `change_frequency`, `last_modified` — presentes no dado, mas **não** promovidos a canal visual no campo organismo; só aparecem no detalhe de peça, sob demanda, quando o operador já escolheu investigar uma peça. `coverage_session` (arquivos visitados pelo agente na sessão) **NÃO é eixo de saúde** e não entra na view como tal (lei de produto explícita).

**O que deve parecer vivo/material/conectado — e por quê:**
- **Material:** cada bloco é matéria com **peso e face** (prisma isométrico), não um ponto. A materialidade serve à função — a face de topo carrega o estado, as faces laterais dão a leitura de que é um **volume** que ocupa lugar (a permanência posicional é o que torna a mudança perceptível).
- **Conectado (apenas no detalhe):** as conexões de uma peça (quem entra, quem sai) aparecem no rung de detalhe, não no campo — no campo, a conexão vira **agrupamento** (containers), que é a leitura de estrutura sem o ruído de 184 arestas cruzando a tela.
- **Vivo (mínimo):** um bloco cujo estado **acabou de mudar entre snapshots** pode receber a `tremor-breath` já sancionada pelo design system (opacidade ±0.15, período ≥3s) — mas só o bloco que mudou, e só como sinal de "isto é novo desde a última leitura". Nunca o campo inteiro respirando.

**Teste de honestidade (toda telemetria aponta para estado real):**
- cor/forma/rótulo do bloco ← tag `xray:state:*` do nó (fato do snapshot). ✔
- proporção de estados no container ← contagem real dos nós-membro. ✔
- `tremor-breath` no bloco ← mudança de estado real entre dois snapshots. ✔
- posição do bloco ← função determinística do `external_id` (estável). ✔ (não é telemetria; é layout)
- **Nada** no campo aponta para um estado que o motor não computou. `proof_coverage` (0.0 no dado real) e as contagens (`bedrock=0` etc.) são exibidas como **números**, não como brilho — número que o operador lê **não oscila** (trava de entropia).

**Auto-checagem (rascunho):** cada canal visual tem fonte citada no dado; o que fica invisível é declarado com razão; "vivo" está amarrado a mudança real e desligável; `coverage_session` explicitamente excluído.

---

## 3. Modo → `modo`

**Modo escolhido: Laboratório** (bias: Densidade +2, Entropia +1).

**Justificativa (uma linha):** MASSIF é uma bancada de **observação de estado** de um organismo de código — o operador lê um campo de evidência para diagnosticar o que está provado e o que não está; é análise/observabilidade, não comando em tempo real, nem instrumento que se toca, nem sala de controle com ações de risco.

**Por que ESTA máquina, não outra:**
- **não Central de comando / Cockpit tático:** não há operação nem risco real *dentro* da view — ela é read-only, ninguém autoriza nem dispara nada. Usar esses modos seria a militarização cosmética que o próprio MODES.md marca como o abuso mais comum. Reprovado por honestidade.
- **não Instrumento musical / Oficina analógica:** o operador não cria, calibra nem ajusta nada aqui — ele **lê**. Tactilidade alta seria teatro (Lei 1).
- **não Arquivo vivo:** tentador (é memória/estado), mas Arquivo vivo pede patina e camadas de tempo; o eixo aqui é **estado de evidência agora**, não a história. Adotar "patina" seria entropia sobre um dado que precisa de clareza fria.
- **Laboratório** é exato: bancada de experimento vivo, densidade a serviço do diagnóstico, um traço de vida (o bloco que mudou), e a proibição do modo — **alarme permanente; estética de guerra** — é justamente o que protege a view de gritar "195 órfãos!" como se fosse uma emergência. Overgrowth-dominante NÃO é alarme; é a leitura honesta de um campo jovem.

**Proibições do modo (entram no gate como lei):** nenhum alarme permanente (nada pisca vermelho de urgência); nenhuma estética de guerra (sem HUD tático, sem retícula de mira, sem vermelho-de-perigo espalhado). O `--state-failure` (brick) do design system fica reservado a erro real de sistema, nunca a um estado de evidência.

**Auto-checagem (rascunho):** um único modo; justificativa em uma linha; os quatro modos vizinhos recusados com razão; proibições do modo transcritas para o gate.

---

## 4. Calibração → `vetores`

Bias de Laboratório aplicado (Den +2, Ent +1) como ponto de partida; calibração fina abaixo. Perfil completo, seis valores.

| Vetor | Valor | Justificativa (uma linha) |
|---|---|---|
| **Tactilidade** | **3** | Blocos têm massa e face (não são pontos), mas a view é read-only e não se toca — botões/estados claros e hover, sem knobs; fica abaixo da trava-7, sem orçamento de "controle físico". |
| **Densidade informacional** | **7** | Centenas a milhares de blocos + proporção de 5 estados por container é um campo denso de diagnóstico (bias Laboratório) — exatamente no limiar que **dispara o teste de zona** obrigatório (feito na §7-densidade). |
| **Geometria** | **6** | Isométrico + treemap aninhado é modular-mecânico e ortogonal, mas a diagonal é a **projeção** (funcional: dá volume e leitura de território), não tensão construtivista agressiva — fica em 6, abaixo da trava-8 que exigiria diagonal de decisão. |
| **Sinestesia** | **2** | Só microanimação visual: a `tremor-breath` do bloco recém-mudado. Sem áudio, sem haptic — nada aqui recompensa nem confirma uma ação (não há ação). Abaixo da trava-5 (nenhum mapa som→significado necessário). |
| **Entropia viva** | **3** | Respiração sutil apenas no bloco que mudou de estado entre snapshots (bias Laboratório +1, mas contido) — o resto do campo é imóvel e preciso; número lido NUNCA oscila (trava de entropia respeitada). |
| **Cerimonialidade** | **0** | Não há ação com risco/irreversibilidade/delegação dentro da view (read-only) — logo, zero rito. Este 0 é a **declaração** que a trava de cerimonialidade cobra: nada aqui merece atrito. |

**Auto-checagem (rascunho):** seis valores, seis justificativas; travas endereçadas (Den≥7 → teste de zona na §7; Sin<5 → sem mapa de som; Ent respeita "não sobre dado crítico"; Cer=0 declarado com a razão read-only; Tat<7 → sem orçamento físico; Geo<8 → diagonal é projeção funcional, não decoração).

---

## 5. RAG → `referencias`

Cinco cards. De cada um: a **lei extraída** (nunca aparência) e a **zona** onde entra.

1. **Tadao Ando** — *lei:* profundidade nasce da relação entre massa escura e fresta luminosa; a luz só significa porque a sombra existe.
   *Zona:* o **corte de foco** ao selecionar/investigar uma peça. Selecionar um bloco ou um container **escurece o resto do campo** (massa) e deixa a peça em foco como a única região plenamente legível — foco é **fresta/corte**, não glow espalhado. Materializa também o sombreamento **matte** das faces do prisma (a face lateral é a "sombra" que dá volume à face de topo). Nunca textura de concreto; a matéria é a diferença de luminância entre as três faces. *(Convive com o "nothing glows" do design system — sombra é escurecimento, não emissão.)*

2. **El Lissitzky / Proun** — *lei:* a composição tem massa, tensão e direção espacial; o plano vira estrutura quando carrega peso e diagonal funcional.
   *Zona:* a **arquitetura do campo** — containers como placas encaixadas de tamanhos diferentes (o peso visual do container = quantos blocos contém), e a **diagonal isométrica** como o eixo que transforma um treemap plano em território com profundidade. A diagonal é funcional (dá volume + leitura de camada), não ornamento. Nunca vermelho/preto de cartaz; a "placa" é o container do treemap.

3. **László Moholy-Nagy** — *lei:* tipografia e linhas são forças de orientação; o texto tem vetor, a leitura tem trajetória.
   *Zona:* a **legenda dos 5 estados** e os **rótulos de container** — cabeçalho linear que se lê como trilho, o rótulo do container ancorado com direção de leitura clara (topo-esquerda, como um carimbo de região). Os números (contagens de estado) em mono tabular alinhados como uma coluna que o olho percorre. Direção sem seta decorativa: a leitura viaja do organismo (topo) para a peça (mergulho).

4. **Dieter Rams Reavaliado** — *lei:* todo elemento justifica sua presença por função, estado ou clareza — honestidade funcional radical, não minimalismo branco. (O freio de emergência da mente.)
   *Zona:* **a view inteira, como contrapeso permanente.** É o card que garante que o prisma isométrico não vire enfeite 3D: cada face carrega informação (topo = estado; laterais = volume/leitura de território), senão a face sai. É o que mantém a densidade-7 legível e não indistinta, e o que corta qualquer tentação de "profundidade bonita" sem função. *Honestidade calibrada (Rams) é pré-requisito, não a assinatura — a assinatura está na §8.*

5. **Stuart Hall / Codificação-Decodificação** — *lei:* toda interface codifica uma posição sobre quem o humano deve ser; projete a leitura que devolve agência, não a que fabrica passividade.
   *Zona:* a **política do estado ausente e do "candidate".** A indústria anestesia com checkmarks verdes de "done". MASSIF recusa: o `unpainted` (o estado de fábrica de 100% do dado real) é mostrado como um estado **honesto e nomeado**, não como vazio nem como falso "pronto"; `bedrock` diz "evidência estrutural", nunca "provado/feito"; `erosion` é sempre "candidate" e expõe a origem do manifesto. É a **copy law** do produto virada lei de composição: a view devolve ao operador a consciência de *o que ele realmente sabe*, em vez de fabricar a confiança de que "está tudo certo". Sem manifesto na tela (evita o risco de clichê do card) — a posição aparece na honestidade do rótulo, não em panfleto.

**Auto-checagem (rascunho):** cinco cards; cada um com lei (não aparência) + zona concreta; risco de clichê de cada um endereçado (Ando≠concreto fake; Lissitzky≠cartaz; Moholy≠seta decorativa; Rams≠SaaS branco; Hall≠manifesto na tela); Rams marcado como pré-requisito e não como assinatura.

---

## 6. Três planos → `planos`

Cada elemento atribuído a UM plano. Elemento sem plano = fora.

**Foreground (ação humana imediata — maior contraste, decisão):**
- **A peça em foco** — o bloco selecionado/investigado, plenamente iluminado enquanto o resto escurece (corte Ando). É o ponto de maior contraste da tela.
- **O painel de detalhe da peça** — estado (com copy law), conexões (entram/saem), metadados sob demanda, `manifest_source` quando `erosion`.
- **O cursor de leitura / hover** — o bloco sob o ponteiro ganha a aresta de contorno (contact edge) que confirma "é isto que vou abrir".
- *(Não há botão de ação — a "decisão" do operador aqui é escolher onde olhar/mergulhar, não executar.)*

**Midground (contexto — telemetria, estado, memória, controles secundários):**
- **Os containers** — placas do treemap com rótulo, contagem e a **barra de proporção de estados** (o "estado agregado como proporção", não all-or-nothing).
- **Os blocos não-focados** — o campo de prismas, cada um carregando seu estado por cor+forma+(rótulo no zoom próximo).
- **A legenda dos 5 estados** — persistente, discreta, dockada.
- **Controles de zoom semântico** (organismo → sistema → subsistema → peça) e o **breadcrumb** da região focada — espelham a linguagem de LivingTree/`d3-zoom`.
- **Os números de campo** — `scanned`, contagem por estado, `proof_coverage` — em mono tabular, dockados (não flutuando sobre os blocos).

**Background (atmosfera — matéria, luz, sombra, respiração lenta):**
- **O ground do campo** — porcelain `#f7f4ef` (o mesmo chão de Hall/LivingTree: é o que faz a view coabitar a janela sem parecer outro produto).
- **A sombra de contato** sob cada prisma e sob cada placa de container (matte, `--shadow-contact` / `--shadow-card`) — dá assentamento sem glow.
- **O escurecimento do campo** durante o foco (a "massa" de Ando) — atmosfera que recua para destacar a fresta.
- **A `tremor-breath`** do(s) bloco(s) recém-mudado(s) — a única respiração lenta do sistema, sinal de "novo desde a última leitura".

**Auto-checagem (rascunho):** todo elemento tem exatamente um plano; foreground carrega o contraste e a peça; midground carrega estado/contexto/controles; background é matéria/luz/sombra; nada órfão de plano.

---

## 7. Mapa de atrito → `atrito`

**Declaração central: MASSIF é read-only. Não há nenhuma ação com risco, irreversibilidade, autorização ou delegação dentro da view — portanto não há atrito, e a cerimonialidade é 0 (§4).** Isto é conforme à Lei 2 (fricção só onde há consequência) e à trava de cerimonialidade (o 0 é a declaração explícita que impede *friction-first* virar *friction-everywhere*).

**Onde a interface permanece FLUIDA (exploração, sem rito):**
- pan/zoom no campo organismo — instantâneo, sem confirmação;
- abrir/fechar o detalhe de uma peça — clique, sem rito;
- alternar zoom semântico e navegar breadcrumb — fluido;
- ler a legenda / onboarding — leitura pura.

**Nível de cerimonialidade por ação (todas 0, porque nenhuma tem consequência):**

| Ação | Nível | Razão |
|---|---|---|
| pan / zoom / navegar campo | 0 | leitura/exploração — Lei 2 preserva fluidez |
| abrir detalhe de peça | 0 | consumo de metadados, reversível, sem efeito |
| alternar zoom semântico | 0 | mudança de lente, sem efeito no sistema |
| abrir/fechar legenda | 0 | leitura |

**Consciência que a AUSÊNCIA de atrito aumenta:** ao não ritualizar nada, a view comunica honestamente que **ela não muda nada** — é um instrumento de leitura de estado, não um painel de controle. Rito aqui seria uma mentira sobre a natureza da ferramenta.

**A única "pausa deliberada" sancionada (e por que NÃO é atrito):** o corte de foco (Ando) ao selecionar uma peça é uma **transição visual** (escurecer o campo, ~180-250ms, ease-out — no orçamento do design system), não um gate. Ela não pede confirmação nem impõe espera antes de uma consequência; apenas dirige a atenção. Fica registrada aqui para que o gate saiba que ela existe e não a confunda com rito.

**Auto-checagem (rascunho):** todo atrito potencial está mapeado; a ausência de atrito é declarada com razão; zonas fluidas explícitas; o corte de foco é declarado como transição, não gate, para não virar "rito não listado". Nenhum rito aparece que não esteja nesta tabela.

---

## 8. Sistema visual → `sistema`

Toda decisão não-óbvia carrega origem `[card:nome]` / `[lei:N]` / `[vetor:X=n]` / `[modo]`. Decisão sem origem é decoração até prova em contrário.

### Material dominante
**Prisma isométrico matte sobre porcelain.** Cada nó do grafo é um bloco: face de topo (portadora do estado) + duas faces laterais (volume). Sombreamento por **diferença de luminância** entre as três faces — sem gradiente de emissão, sem glow. `[card:tadao-ando]` (luz é o corte entre as faces) `[card:rams]` (a face lateral existe para dar leitura de volume/território, não enfeite) `[vetor:geometria=6]`. Coabita a materialidade "nothing glows" do design system (matte contact shadows) como fato-âncora.

### Paleta
**Âncora = tokens exatos do design system do m1nd (fato — replicados verbatim de `m1nd-ui/src/index.css`):**

```
--porcelain:#f7f4ef  (ground do campo)      --bone:#efeae2  (placas de container, painéis)
--ink:#2b2836        (texto, rótulos)        --ink-soft:#5b5566 (texto secundário)
--wisteria:#a78bfa   --iris:#7c3aed (VIOLETA — QUARENTENADA) --veil:#ede9fe --iris-deep:#4c1d95
--verdict-act:#6fa287 +tint #dee9dc          --verdict-reverify:#c89b3c +tint #f0e3c0
--verdict-abstain:#7c3aed +tint #ede9fe      --state-unverified:#b8b2a8 +tint #e9e5de
--state-failure:#b0563b +tint #edcec3
--shadow-contact:0 1px 2px rgb(43 40 54/.08) --shadow-card:0 1px 3px rgb(43 40 54/.1)
```

**Mapeamento estado→token (a decisão de coabitação mais importante; cada uma justificada por lei de produto + semântica de token existente):**

| estado do motor | token de face (topo) | por quê (lei) |
|---|---|---|
| **bedrock** | `--verdict-act` sage `#6fa287` | sage já é "low risk / act / fired" no design system; bedrock = evidência estrutural presente. Reaproveita a semântica calma existente, não inventa cor. `[card:hall]` copy: a cor diz "evidência", o rótulo diz "test-exercised or grounded", nunca "provado". |
| **unproven** | `--verdict-reverify` ochre `#c89b3c` | ochre já é "worth a second look / medium" — exato para "usado mas sem evidência de prova". |
| **overgrowth** | `--state-unverified` grey `#b8b2a8` | grey já é "unfired / no-evidence / stale" — o órfão sem refs é precisamente ausência de uso comprovado; grey neutro impede que o estado DOMINANTE (195/199) grite como alarme. `[modo]` (proibição: sem alarme permanente). |
| **erosion-candidate** | `--state-failure` brick `#b0563b`, **contornado/hachurado**, nunca preenchido chapado | brick é "hard error/loss" — o mais forte, reservado ao candidato a drift; mas como é **candidate**, não veredito, a face é hachurada (não sólida) e o detalhe expõe `manifest_source`. `[card:hall]` `[card:rams]`. No dado real erosion=0, então este token quase nunca aparece — é correto que o mais alarmante seja o mais raro. |
| **unpainted** | **face vazia**: porcelain-sobre-porcelain, apenas o **contorno/greca** (linha `--ink-soft` fina), preenchimento igual ao ground | **ESTA é a decisão-chave.** `unpainted` = "ainda não escaneado", o estado de fábrica de 100% do dado real. Ele NÃO recebe cor de estado (não é bom nem ruim) e NUNCA se parece com `unproven`. O bloco aparece como um **volume por-preencher** — um lugar reservado, um contorno sem tinta. Se algum acento for necessário para o "honest unknown", usa a **violeta quarentenada** (`--iris`/`--veil`) — que no design system é literalmente e SÓ a cor do "insufficient evidence / honest unknown", exatamente a semântica de `unpainted`. `[card:hall]` (estado ausente é estado próprio) — respeita a quarentena de violeta lint-enforced do design system. |

Estender a paleta ficou restrito a **luminância** (as duas faces laterais são o token de topo escurecido ~12% e ~22% para o volume matte) — nenhuma cor de matiz novo é introduzida; a coabitação é preservada por construção.

### Tipografia
**Fato-âncora do design system:** `Instrument Sans` 400/500/600 (UI, rótulos), `IBM Plex Mono` 400/500 (**todo número** — contagens, proporções, `proof_coverage`, id de peça), `Fraunces` 400 italic (a "voz do hedge" — usada aqui para a linha honesta de incerteza, ex.: *"ainda não escaneado"*, *"candidato, não veredito"*). Todos self-hosted (air-gapped). Números **sempre** em mono tabular, alinhados à direita (via os primitivos `StatValue`/`StatCell` existentes). `[card:moholy-nagy]` (rótulo com direção de leitura) `[card:rams]` (número é fato, não enfeite).

### Grid
**Treemap squarified aninhado** (`d3-hierarchy`) projetado em isométrico. Containers = placas de peso proporcional ao nº de membros `[card:lissitzky]`. **Posição de cada bloco é função determinística do `external_id`** → mesmo nó cai no mesmo lugar entre snapshots (fato-requisito do dossiê). O grid não é decoração: é o que torna a **mudança perceptível como mudança no lugar conhecido** `[lei:1]`.

### Componentes
- **Bloco (prisma)** — 3 faces, estado no topo, hover=contact edge, selecionado=iluminado + campo escurece.
- **Container (placa)** — rótulo (carimbo topo-esquerda), contagem mono, **barra de proporção de estados** (segmentos nas cores de estado, larguras = contagem real).
- **Legenda de estados** — 5 linhas, cada uma: swatch de face + forma/hachura + nome de operador + uma linha em Fraunces do significado honesto.
- **Painel de detalhe de peça** — estado (copy law), conexões (entram/saem), metadados sob demanda, `manifest_source` ou "no manifest active".
- **Barra de campo** — `scanned` / contagem por estado / `proof_coverage` em mono; controles de zoom semântico; breadcrumb.
- **Minimapa** (opcional, herdado do padrão GraphCanvas) — o território inteiro em miniatura, estado por cor **+ o minimapa também é redundante** (a forma de container sobrevive na miniatura).

### Estados (redundância de canal — lei de produto)
O estado **NUNCA** é sinalizado só por cor (daltonismo, miniatura, grão pequeno). Cada estado tem **três canais**:
1. **cor** de face (tabela acima);
2. **forma/preenchimento**: bedrock=face sólida plena; unproven=face sólida; overgrowth=face sólida grey; erosion=face **hachurada** (diagonais); unpainted=face **vazia com contorno** (sem tinta);
3. **rótulo textual** (no zoom próximo e sempre no detalhe), em linguagem de operador.
`[card:rams]` `[card:hall]` — origem: copy law + redundância de canal do dossiê.

### Motion
- **`tremor-breath`** (a ÚNICA animação ambiente sancionada pelo design system: opacidade ±0.15, período ≥3s) — só no bloco cujo estado mudou entre snapshots. `[vetor:entropia=3]`.
- **Corte de foco** ao selecionar: campo escurece em ~180-250ms ease-out `[card:tadao-ando]`. Não é rito (§7).
- **Zoom semântico**: transição de `d3-zoom`, curta, com peso (não flutuação líquida) `[card:lissitzky]` (motion).
- **`prefers-reduced-motion`**: contrato, não cortesia (fato-âncora do design system) — a `tremor-breath` para; um **tick estático** marca o bloco novo (a INFORMAÇÃO sobrevive, a moção não); todas as transições zeradas. `[gate:12]`.

### Som / haptic
**Nenhum.** `[vetor:sinestesia=2]` — não há ação a confirmar; som seria teatro (trava de sinestesia). (Consistente com o design system, que também não tem som.)

### Acessibilidade
- **Redundância de canal** já garante daltonismo (cor+forma+rótulo).
- Cada bloco é focável por teclado (Tab/setas, espelhando a navegação por teclado da LivingTree); Enter abre detalhe; Esc fecha/sobe.
- `role`/`aria-label` por bloco: `"<label> — <estado em linguagem de operador>"` (espelha o padrão `aria-label` do `TrustDot`).
- Contraste: ink `#2b2836` sobre porcelain/bone satisfaz AA; rótulos de estado nunca dependem só de cor.
- `prefers-reduced-motion` respeitado (acima).
- Alvos de clique dos blocos ≥ tamanho mínimo no zoom de peça; no zoom organismo, a seleção é por região (container), não por bloco de 3px.

### Edge cases (vazio, erro, carregando, offline, degradado)
- **Grafo 100% `unpainted`** (o **primeiro contato REAL de todo usuário** — `snapshot_slice.json`: zero tags de estado): o campo aparece como um **território de volumes por-preencher** (contornos sem tinta), com uma linha em Fraunces: *"nada escaneado ainda — cada bloco é um lugar reservado"* e um convite calmo a rodar o paint (a AÇÃO de escanear vive fora desta view read-only; a view só a nomeia). NUNCA um campo cinza que se confunda com overgrowth. `[card:hall]`.
- **Distribuição realista overgrowth-dominante** (`bedrock=0, overgrowth=195, unproven=4, proof_coverage=0.0` — dado real): o campo é legível como **quase-tudo-grey com 4 pontos ochre**, e a barra de campo mostra `proof_coverage 0.0` como **fato mono**, não como alarme vermelho. A leitura honesta é "campo jovem, pouca evidência ainda" — informativa, não catastrófica. `[modo]` (sem alarme permanente).
- **"No manifest active"** (erosion indisponível): a categoria erosion na legenda fica **esmaecida** com a nota *"sem manifesto ativo"*; nenhum bloco recebe brick; o detalhe de qualquer peça diz "no manifest active" em vez de inventar `manifest_source`. `[card:hall]`.
- **Nomes de container repetidos** (`data_access` como L0 **e** L1 — fato de `layers.json`): o rótulo do container **nunca** é a chave de identidade; cada placa carrega `nome + nível` (ex.: `data_access · L0`) e a identidade real é o caminho/nível, não o nome. `[card:rams]` (clareza honesta) — origem: fato do dado.
- **Membership truncada** (`layers` trunca em 40/camada por padrão — fato de `layers.json`): quando uma camada tem mais membros do que o retornado, o container mostra a contagem como **floor**: *"≥ 40 blocos"* (reaproveita o `blastCountPhrase`/`floor-not-ceiling` do design system, INV-08) e oferece "carregar todos". Nunca desenha 40 e mente que é o total. `[card:rams]` `[card:hall]`.
- **Carregando**: em palavras, nunca barra de progresso falsa — *"lendo o mapa…"* (espelha LivingTree `status==='loading'`).
- **Erro / graph inalcançável**: reusa o `FreshnessBanner tone="degraded"` do design system + Retry.
- **Offline**: é o normal (local-first, air-gapped) — nenhum estado especial; a view nunca esperou rede externa.

### ✶ Assinatura formal (obrigatória — 3 gestos proprietários)

> Doutrina do verdict 002: a assinatura mais forte nasce **do dado que só este produto tem**. O dado único do MASSIF: a gramática de 5 estados de evidência, a distribuição real overgrowth-dominante com `proof_coverage 0.0`, o **estado `unpainted` de fábrica**, containers de nome repetido, e **posição estável** entre snapshots. Os três gestos abaixo saem daí — não de um kit isométrico genérico.

**1. THE UNPAINTED PLINTH (o pedestal por-preencher)**
- **O que o olho vê, e onde:** no campo, ao lado de blocos com tinta (topo sage/ochre/grey), os nós `unpainted` aparecem como prismas de **face de topo VAZIA** — mesmo porcelain do ground, sem cor de estado — desenhados **apenas pelo contorno das três arestas** (linha fina `--ink-soft`) e pela **sombra de contato matte** por baixo. É um volume que ocupa lugar mas ainda não recebeu tinta: um pedestal esperando. Num grafo de estreia (100% unpainted, o caso real), o campo inteiro é um **relevo de pedestais vazios** — claramente "território mapeado, nada escaneado", nunca confundível com o grey de overgrowth (que é sólido e preenchido).
- **Origem:** `[card:tadao-ando]` (a face vazia é massa sem a fresta de luz — a luz/tinta só significa porque o vazio existe ao lado) + `[card:hall]` (estado ausente é um estado honesto, não um buraco) + a **quarentena de violeta** do design system (o "honest unknown" = iris, reaproveitada como o acento opcional do pedestal). Nasce do fato de que `unpainted` é o estado de fábrica que 100% dos usuários veem primeiro.
- **Proibições:** o pedestal NUNCA é preenchido com cor de estado; NUNCA usa o grey de overgrowth (seria a mentira "sem uso" no lugar de "não olhado"); NUNCA recebe `tremor-breath` (não há o que respirar num nó não escaneado — espelha `abstain-never-animates`); NUNCA vira um "vazio" decorativo sem contorno (some a leitura de que é um lugar reservado).

**2. THE STATE-STRATUM CAP (o topo-estrato do container)**
- **O que o olho vê, e onde:** a face de **topo de cada container** (placa) não é chapada — é uma **barra-estrato** dividida em segmentos horizontais nas cores de estado, com **largura de cada segmento = contagem real** de blocos daquele estado dentro do container. Um container todo-overgrowth mostra um topo grey inteiro; um container misto mostra faixas sage/ochre/grey/pedestal-vazio proporcionais. É o "estado agregado como proporção, não all-or-nothing" virado **face física** do container — você lê a composição de evidência de uma região **antes** de abri-la, olhando a tampa.
- **Origem:** `[card:lissitzky]` (a placa que carrega peso e informação estrutural na própria superfície) + `[card:moholy-nagy]` (a faixa como trilho de leitura da proporção) + a lei de produto "proporção, não all-or-nothing" do dossiê. Nasce da distribuição real ser **mista e dominada por um estado** — um rótulo único mentiria, o estrato não.
- **Proibições:** os segmentos são **contagem verbatim**, nunca normalizados a um mínimo visível (um estado com 1 bloco em 195 é uma fatia fina e honesta, não um bloco inflado); a ordem dos segmentos é fixa (bedrock→unproven→overgrowth→erosion→unpainted) para leitura estável; a barra-estrato NUNCA anima nem oscila (é dado crítico — trava de entropia).

**3. THE PERSISTENCE GLINT (o brilho da permanência)**
- **O que o olho vê, e onde:** como a posição de cada bloco é **estável entre snapshots** (mesmo `external_id` → mesmo lugar), quando um bloco **muda de estado** entre duas leituras, ele — e SÓ ele — ganha a **`tremor-breath`** (a respiração sancionada, opacidade ±0.15, ≥3s) por um intervalo curto, sobre um bloco que **não se moveu**. O olho, que já memorizou o território, percebe a mudança como um **pulso num lugar conhecido** — o diff tornado sensorial. Sob `prefers-reduced-motion`, o pulso vira um **tick estático** (um pequeno marcador de canto), preservando a informação sem a moção.
- **Origem:** `[vetor:entropia=3]` + a `tremor-breath` do design system (reaproveitada, não inventada) + o **requisito de posição estável** do dossiê (a permanência é o que dá sentido ao brilho). Nasce do fato de que o valor da view no uso contínuo é ver **o que mudou desde a última vez** — e isso só é legível porque o resto ficou parado.
- **Proibições:** o glint aparece SÓ sobre mudança de estado real entre snapshots (nunca sobre hover, nunca sobre carregamento, nunca decorativo); NUNCA sobre um número (dado crítico não oscila); um bloco `unpainted`→pintado ganha o glint, mas um bloco `unpainted` que continua `unpainted` NUNCA (não houve mudança); é sempre desligável (reduced-motion).

**Nota de honestidade:** Rams (honestidade calibrada) percorre a view inteira, mas — pela doutrina do verdict 001 — **não é** a assinatura; é pré-requisito. Os três gestos acima são o que sobra quando se troca a paleta e ainda assim a tela só poderia ser o MASSIF.

**Auto-checagem (rascunho):** cada decisão não-óbvia tem tag de origem; a paleta é ancorada nos tokens exatos (fato) e cada mapeamento estado→token é justificado por semântica de token existente + lei de produto; 3 gestos proprietários, cada um com nome próprio + o que o olho vê + onde + origem + proibições; a assinatura nasce do dado único (unpainted de fábrica, proporção mista, posição estável); Rams declarado como pré-requisito.

---

## 9. Prova → `prova`

**O menor artefato que prova a direção:** **uma tela estática da Vista Organismo em Canvas 2D**, renderizando **o dado real verbatim de `data/`**, com os três gestos da assinatura visíveis e nomeáveis, mais os edge cases reais embutidos. O implementador constrói isto sem falar comigo.

### Tela de prova — "Vista Organismo, dado de estreia do m1nd"

**Fonte de dado (verbatim, sem inventar):**
- Contagens da barra de campo ← `xray_paint_dryrun.json`: `scanned=199, bedrock=0, overgrowth=195, unproven=4, erosion_candidate=0, proof_coverage=0.0`, `manifest_source` presente.
- Containers e membership ← `layers.json`: 4 camadas (`data_access` L0 = 15 nós; `data_access` L1 = 60 nós [truncado em 40 → mostrar floor "≥ 40"]; `tests` L2 = 42 nós [truncado]; `entry_points` L3 = 82 nós [truncado]). `has_cycles=false`, `layer_separation_score=1.0`.
- Blocos e rótulos ← `snapshot_slice.json` (40 nós verbatim; **tags de estado ausentes → todos `unpainted`**). Posição de cada bloco = função determinística do `external_id`.

**Layout (o que desenhar):**
1. **Ground** porcelain `#f7f4ef`, ocupando a janela; a tela deve caber ao lado de um mock de aba Hall/LivingTree para provar coabitação (mesma família visual).
2. **Quatro placas de container** (treemap squarified aninhado, projeção isométrica), peso proporcional: `entry_points·L3` (82) a maior, depois `data_access·L1` (60), `tests·L2` (42), `data_access·L0` (15). Cada placa com:
   - **rótulo** carimbado topo-esquerda em Instrument Sans: `data_access · L0` etc. (nome + nível — prova o edge case de nome repetido);
   - **contagem** em IBM Plex Mono tabular;
   - **THE STATE-STRATUM CAP** na face de topo: como o dado real é 100% unpainted, o estrato aparece como uma faixa inteira de **pedestal-vazio** (contorno, sem tinta) — e o brief anota que, com dado pintado, a mesma face mostraria segmentos sage/ochre/grey proporcionais.
3. **Blocos (prismas)** dentro das placas: os 40 nós do slice como **THE UNPAINTED PLINTH** — prismas de topo vazio, contorno `--ink-soft`, sombra de contato matte. O campo inteiro é um relevo de pedestais (o primeiro-contato real).
4. **Barra de campo** (dockada, mono tabular): `scanned 199 · bedrock 0 · unproven 4 · overgrowth 195 · erosion 0 · proof_coverage 0.0`. `proof_coverage 0.0` como fato calmo, não vermelho.
5. **Legenda dos 5 estados** (dockada): 5 linhas, swatch de face + forma/hachura + nome de operador + linha em Fraunces italic do significado honesto. A linha `erosion-candidate` mostra a hachura brick; a linha `unpainted` mostra o pedestal vazio e diz, em Fraunces, *"ainda não escaneado — um lugar reservado"*.
6. **Uma linha honesta de estado de campo** em Fraunces italic: *"nada escaneado ainda — cada bloco é um lugar reservado"*.

**Gestos da assinatura visíveis nesta tela (para o gate 13-14):**
- **UNPAINTED PLINTH** — presente em todos os 40 blocos (é o caso real).
- **STATE-STRATUM CAP** — presente nas 4 placas (aqui todo-pedestal; o brief descreve a variante pintada).
- **PERSISTENCE GLINT** — **descrito** (não animável numa tela estática): anotar qual bloco receberia o glint num segundo snapshot e como o tick estático apareceria sob reduced-motion. (A prova navegável/animada é o passo seguinte da aterrissagem; a tela estática já prova plinth + cap + coabitação + os edge cases.)

**Edge cases que esta tela prova de uma vez:**
- ✔ grafo 100% `unpainted` (dado 3) — é o estado da tela;
- ✔ distribuição overgrowth-dominante com `proof_coverage 0.0` (dado 1) — na barra de campo, e o brief mostra como o campo pintado leria (quase-tudo-grey + 4 ochre);
- ✔ nomes de container repetidos (dado 2) — `data_access · L0` vs `data_access · L1`;
- ✔ membership truncada (dado 2) — floor `≥ 40` nas placas truncadas;
- ✔ coabitação — mesmo porcelain/bone/ink/mono de Hall/LivingTree, violeta intocada fora do unpainted-acento.

**Segundo estudo recomendado na aterrissagem (não obrigatório para esta prova):** a **Vista Organismo pintada** (mesmo layout, mas com os estados mapeados aos tokens sage/ochre/grey/brick-hachura), para o juiz frio ver o STATE-STRATUM CAP com segmentos reais e o campo overgrowth-dominante colorido — provando que a linguagem é legível também na distribuição realista, não só na de estreia.

**Como o Q&A roda quando virar frontend real:** pelo padrão **uiproof** do repo-alvo (Playwright Test agents na autoria/heal; execução determinística) — não por agente de browser em runtime.

**Auto-checagem (rascunho):** a prova é uma tela concreta; renderiza dado verbatim de `data/` (sem paths pessoais no artefato final — os `external_id` do slice contêm `light::…`, não caminhos de usuário); os 3 gestos aparecem ou estão anotados; os edge cases REAIS (100% unpainted + distribuição overgrowth-dominante) estão embutidos; o implementador tem layout, fonte de dado e mapeamento suficientes para construir sem me consultar.

---

### Rastreabilidade consolidada (índice `[card|lei|vetor|modo]`)

| Decisão | Origem |
|---|---|
| Prisma isométrico matte, sombra por luminância | `[card:tadao-ando]` `[card:rams]` `[vetor:geometria=6]` + "nothing glows" (design system) |
| Containers como placas de peso proporcional | `[card:lissitzky]` |
| Diagonal = projeção funcional (não tensão construtivista) | `[vetor:geometria=6]` `[lei:1]` |
| Rótulos com direção de leitura; números em coluna mono | `[card:moholy-nagy]` `[card:rams]` |
| bedrock→sage, unproven→ochre, overgrowth→grey, erosion→brick-hachura | semântica dos tokens existentes + `[card:hall]` (copy law) |
| unpainted → pedestal vazio / acento violeta quarentenada | `[card:tadao-ando]` `[card:hall]` + quarentena de violeta (design system) |
| Estado agregado como proporção (state-stratum cap) | lei de produto (dossiê) `[card:lissitzky]` `[card:moholy-nagy]` |
| Redundância de canal (cor+forma+rótulo) | lei de produto (dossiê) `[card:rams]` |
| Corte de foco escurece o campo | `[card:tadao-ando]` |
| tremor-breath só no bloco mudado (persistence glint) | `[vetor:entropia=3]` + design system |
| Zero som/haptic | `[vetor:sinestesia=2]` |
| Zero atrito / cerimonialidade 0 (read-only) | `[lei:2]` `[vetor:cerimonialidade=0]` |
| Sem alarme no campo overgrowth-dominante | `[modo:laboratório]` |
| Floor "≥ N" em membership truncada | design system (INV-08) `[card:rams]` `[card:hall]` |
| prefers-reduced-motion como contrato | design system `[gate:12]` |
| Posição estável entre snapshots | requisito do dossiê `[lei:1]` |

---

**Fim do Design Brief — MASSIF (gen-004).** As 9 seções estão na ordem do pipeline; o §8 inclui a assinatura formal (3 gestos com origem + descrição material + proibições). Os vereditos do gate (12 itens do brief; 13-14 sobre o artefato) são documentos separados assinados pelo juiz frio.
