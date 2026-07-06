# Dossiê gen-004 — MASSIF (nova view da Human View do m1nd)

Fatos verificados 2026-07-06 contra o sistema vivo. Zero vocabulário de estilo — calibração é trabalho da mente.

## O produto

MASSIF é uma nova modalidade de visualização dentro da Human View existente do m1nd (`~/m1nd/m1nd-ui`, app React/Vite servida pelo owner local). Renderiza o **grafo de código de um repositório como blocos** — cada bloco é um prisma em projeção isométrica (face de topo + 2 faces laterais), agrupados em containers por camada/diretório — em vez de nós-e-arestas. O eixo de informação primário é o **estado de evidência estrutural** de cada parte do código, que o motor já computa e persiste. Interação: pan/zoom com zoom semântico (organismo → sistema → subsistema → peça), clique em bloco abre detalhe. Posição de cada bloco é estável entre snapshots (mesmo nó → mesmo lugar), para que mudança de estado seja perceptível como mudança no lugar conhecido.

Público operador: (1) o dono do sistema (desenvolvedor experiente que quer leitura de estado num relance, sem abrir arquivos); (2) "vibecoders" — pessoas que constroem software dirigindo agentes de IA e não leem o código linha a linha; a view é a resposta de "o que está feito e com que evidência?"; (3) agentes de IA que capturam a mesma verdade por verbos.

## A gramática de estados (lei de produto, vem do motor)

Cinco estados por nó, derivados das tags persistidas `xray:state:*` que já viajam no snapshot que a UI busca (`/api/graph/snapshot` → cada nó tem `tags[]`):

| estado | tag | significado técnico |
|---|---|---|
| bedrock | `xray:state:bedrock` | exercido por teste OU ancorado (`grounded_in`) |
| overgrowth | `xray:state:overgrowth` | órfão: zero arestas de referência entrando |
| unproven | `xray:state:unproven` | usado (refs entram) mas sem evidência de prova |
| erosion-candidate | `xray:state:erosion-candidate` | origem de aresta que viola o manifesto (candidato, não veredito) |
| unpainted | (ausência de tag) | ainda não escaneado — NUNCA renderizar como se fosse `unproven` |

Leis de produto não-negociáveis (origem: veredito de oráculo em repo público):
- **Copy law:** nunca "proven/done/provado/feito". Sempre "structural evidence" / "test-exercised or grounded" / "candidate drift". Bedrock é evidência estrutural, não prova semântica de correção.
- **Erosion é "candidate"** e a UI expõe `manifest_source` (ou "no manifest active" quando não houver).
- **Estado ausente ≠ estado ruim:** `unpainted` é um estado próprio e honesto.
- **Redundância de canal:** o estado nunca é sinalizado só por cor (daltonismo; miniaturas; escala de grão pequeno).
- `coverage_session` (arquivos visitados pelo agente na sessão) NÃO é eixo de saúde e não entra na view como tal.

## Dado real (amostras verbatim em `data/`, capturadas hoje do sistema vivo)

1. **`xray_paint_dryrun.json`** — o breakdown REAL do repo m1nd hoje: `scanned=199, bedrock=0, overgrowth=195, unproven=4, erosion_candidate=0, proof_coverage=0.0`, com manifesto PRESENTE (`manifest_source: file:...xray.manifest.json`). Fato central: a distribuição típica NÃO é dominada por bedrock; o cenário realista de estreia é um campo quase inteiro de overgrowth com proof_coverage 0.0. A view precisa ser informativa e legível NESSA distribuição, não apenas na ideal.
2. **`layers.json`** — agrupamento real: 4 camadas detectadas, 199 nós classificados, `has_cycles=false`, `layer_separation_score=1.0`. Fato: nomes de camada REPETEM (`data_access` aparece como L0 com 15 nós E L1 com 60 nós) — o nome sozinho não identifica um container. Fato: a detecção trunca por padrão (40 nós/camada) — membership completa exige pedir mais.
3. **`snapshot_slice.json`** — 40 nós verbatim do snapshot vivo do brain do repo. Campos disponíveis por nó: `label`, `external_id`, `node_type`, `tags[]`, `provenance`, `change_frequency`, `last_modified`. Fato: hoje ZERO nós têm tag `xray:state:*` (o grafo vivo está unpainted — o estado de fábrica que todo usuário novo verá primeiro). Lacuna declarada: o slice de edges veio vazio (os ids de aresta referenciam outro campo que o recorte não casou); total real de arestas do brain: 184.
4. **`xray_orient.json`** — módulos e matriz de dependência do mesmo brain (agregado por módulo).

## Superfície existente (a view nasce DENTRO dela)

Views atuais da Human View: **Hall** (grid de cards por brain, com contadores e receipts), **LivingTree** (árvore de arquivos com pontos de trust por nó, lentes por diretório/tipo/camada, busca por significado), **GraphCanvas** (nós-e-arestas 2D via @xyflow/react + dagre). Stack: React 18 + Vite + Tailwind; tipografia `Instrument Sans`; rendering 2D (SVG/HTML/CSS), sem GPU/3D.

**Tokens de cor existentes do design system (fatos, valores exatos):**

```
--porcelain:#f7f4ef (app ground) · --bone:#efeae2 (cards) · --ink:#2b2836 (text)
--ink-soft:#5b5566 · --wisteria:#a78bfa · --iris:#7c3aed (brand primary)
--veil:#ede9fe · --iris-deep:#4c1d95
--verdict-act:#6fa287 + tint #dee9dc
--verdict-reverify:#c89b3c + tint #f0e3c0
--verdict-abstain:#7c3aed + tint #ede9fe
--state-unverified:#b8b2a8 + tint #e9e5de
--state-failure:#b0563b + tint #edcec3
```

Direção decidida pelo dono: a linguagem do MASSIF é **calibrada pela mente** mas **ancorada nestes tokens como fato** — deve poder conviver na mesma janela com Hall/LivingTree sem parecer outro produto. Estender a paleta é permitido; contradizê-la exige justificativa por lei.

## Restrições técnicas do MVP (decididas, não re-projetar)

- Rendering: Canvas 2D, projeção isométrica desenhada à mão (prisma de 3 faces), layout por `d3-hierarchy` (squarified treemap) com containers aninhados, `d3-zoom` para o zoom semântico. 100% offline/local-first, zero CDN/telemetria.
- Fonte de dado: exclusivamente o snapshot já buscado pela UI (tags per-node) + `layers` (com membership completa solicitada) + `xray_orient` (agregados). Sem verbo novo de backend no MVP.
- Escala alvo: centenas a poucos milhares de blocos com pan/zoom fluido.
- Repo é público; a prova renderiza o dado verbatim de `data/`, sem paths pessoais no artefato final.

## Telas que a linguagem precisa cobrir

1. Vista organismo (todos os containers, estado agregado como proporção — não all-or-nothing).
2. Zoom semântico intermediário (containers abertos, blocos individuais legíveis).
3. Detalhe de peça (um bloco: estado, conexões, metadados; copy law aplicada).
4. Estados vazios/degradados: grafo inteiro `unpainted` (o primeiro contato REAL de todo usuário — ver dado 3); "no manifest active" (erosion indisponível); distribuição realista overgrowth-dominante (ver dado 1).
5. Legenda/onboarding: os 5 estados explicados em linguagem de operador não-técnico.
