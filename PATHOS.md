# PATHOS — V1TRUVIO

## Norte (North Star)

Ser o **compilador de identidades visuais** da casa: a mente geradora (Novo Uomo Vitruviano) que transforma `produto + operador + contexto` em design systems distintos, rastreáveis e anti-clichê, por calibração de 6 vetores sob 3 leis — nunca por imitação de estilo. ALMUS, HERBÁRIO e os quatro systems da bancada são outputs; este repo é a gramática.

Frase-mãe: *criar interfaces que devolvem ao humano a sensação de operar uma máquina viva, legível e responsável.*

## Estado real (2026-07-06)

**Fase 0 entregue — a mente está compilada, NÃO provada.** Existe hoje, arquivo por arquivo:

- `PRD.md` — PRD v0.1 completo: problema (com evidência da bancada ALMUS de hoje), tese do compilador, RF1–RF10, RNF1–RNF5, provas de vida P1–P4, riscos/travas, roadmap F0–F4, 4 decisões em aberto.
- `docs/MIND-UML.md` — UML mental: flowchart do compilador, classDiagram completo (núcleo, 5 órgãos, 6 vetores, modos, cards, pipeline, gate, brief, prova, preset + 6 invariantes), sequenceDiagram de uma geração, stateDiagram do atrito/rito (níveis 0/3/5/8/10), ciclo de vida/aprendizado.
- `mind/MANIFESTO.md` — a alma destilada: tese, operador vs usuário, inimigo, 3 leis, princípios. **Destilado da análise de 2026-07-06 — o manifesto ORIGINAL do Max ainda não foi mergeado (vive num chat; Spotlight local: zero).**
- `mind/CONTRACT.md` — prompt-mãe operacional: pipeline de 9 passos com seção obrigatória por passo, precedência Leis > Modo > Vetores > Cards, gate anti-padrões de 12 itens binários, formato de saída (Design Brief) e registro de preset.
- `mind/VECTORS.md` — 6 vetores (tactilidade, densidade, geometria, sinestesia, entropia, cerimonialidade) com escalas 0–10, trava bloqueante por vetor e 4 perfis canônicos.
- `mind/MODES.md` — 8 modos de tom com bias de vetores e proibições (trava anti-militarização; cockpit tático exige risco real).
- `mind/rag/` — 7 cards seed (Lissitzky, Moholy-Nagy, Ando, Rams, Teenage Engineering, Stuart Hall, Détournement) no formato lei-extraída + risco-de-clichê + pareia-bem-com, e `_TEMPLATE.md` (card novo = PR).
- `presets/SEEDS.md` — 4 calibrações canônicas NÃO provadas (editorial, cockpit-ia, instrumento, pórtico).
- `presets/LINEAGE.md` — inventário dos 6 filhos pré-mente (ALMUS, HERBÁRIO, TESSERA, APOLLO, KRONOS, VERITAS) + protocolo de retro-registro.
- `README.md` — mapa do repo e uso manual pré-skill.

**O que NÃO existe (não dourar):** a skill de deploy (F1); qualquer geração feita SOB a mente (todas as existentes são pré-mente); as provas de vida P1–P4; o manifesto original mergeado; remote GitHub.

## Doutrina de operação

1. **Assento de escrita:** PRD/visão/identidade da mente = Fable (regra do Max, CLAUDE.md). Implementação de aterrissagem (tokens/CSS/specimen) pode ser delegada.
2. **Consentimento:** a mente NUNCA é aplicada a um projeto sem aprovação explícita do Max naquela conversa (GATE 0, herdado da skill ALMUS).
3. **Curadoria sobre drift:** a mente só muda por PR neste repo — card novo, trava ajustada, preset registrado. Sessão não edita a mente por vibe.
4. **Prova antes de claim:** identidade sem artefato julgado não existe; a mente sem P1–P4 verdes é "compilada", nunca "funcional". Frontend real → uiproof.
5. **Precedência em conflito de doutrina de design:** Leis > Modo > Vetores > Cards. Em conflito de doutrina de trabalho: CLAUDE.md do Max > este PATHOS.
6. Git como Max Kle1nz, commits em inglês, burst discipline (commit local ≠ push).

## Problemas conhecidos

- O manifesto original (texto-fonte) não está no repo — o destilado é fiel à análise, mas o Max deve resgatar o original do chat para `mind/MANIFESTO.md`.
- KRONOS//NEO-BAROQUE provavelmente reprova no gate item 1 (ornamento barroco vs Lei 1) — é o caso de teste perfeito do retro-registro, não um constrangimento.
- Linhagem metodológica a manter coerente: o V1TRUVIO é uma INSTÂNCIA produzida pelo padrão cognitivo `pattern-architect` do Max (`~/.codex/skills/pattern-architect`, lado Codex — Pattern Archaeologist + Liminal Architect: "destilar a mente que gera o artefato"). O método é geral; esta é a mente de direção de arte destilada por ele. Evoluções do método podem pedir re-destilação aqui.
- Risco estrutural nomeado no PRD §10: a mente virar burocracia. O escopo dela é FUNDAÇÃO de identidade, não micro-edit.

## Próximos passos (em ordem)

1. **Max:** veredito sobre nome (`V1TRUVIO`?) e resgate do manifesto original → merge.
2. **F1:** skill `v1truvio` (GATE 0 → carrega mente → exige brief completo → gate como lint de saída), espelhando a anatomia da skill ALMUS.
3. **F2:** provas de vida na bancada ALMUS — P1 (3 produtos → 3 mundos), P2 (teste cego do Max), P3 (red team do gate com clichê plantado), P4 (retro-registro da linhagem).
4. **F3:** ponte brief→tokens DTCG→CSS→specimen (reusar padrão `build-tokens.mjs` do ALMUS).
5. Decidir remote GitHub + primeiro burst de push.

## Prompt para o próximo agente

> Você vai trabalhar no V1TRUVIO (`~/v1truvio`), a mente geradora de direção de arte do Max. Leia `PATHOS.md` (este arquivo), depois `PRD.md` e `mind/CONTRACT.md` antes de qualquer coisa. A mente está compilada mas NÃO provada — não afirme que "funciona". Se a tua missão é GERAR design sob a mente: siga o CONTRACT à risca (9 passos, gate de 12 itens, brief completo, prova mínima) e registre o preset. Se a tua missão é EVOLUIR a mente: toda mudança é PR curado (card novo pelo `_TEMPLATE`, trava, preset) — nunca edite as leis por conveniência da geração que você quer aprovar. Git como Max Kle1nz, commit em inglês, jamais como Claude.
