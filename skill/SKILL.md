---
name: v1truvio
description: Gera uma identidade visual/direção de arte NOVA para um produto usando a mente V1TRUVIO (repo ~/v1truvio) — pipeline maker→juiz frio→coder com gates anti-clichê e assinatura formal obrigatória. SOMENTE com pedido/aprovação explícita do usuário NESTA conversa e NUNCA sobre projeto que já tem identidade visual própria (exceto revisão de direção pedida pelo dono) — a skill começa por um gate de consentimento que bloqueia tudo. Use quando o usuário pedir "v1truvio" pelo nome, pedir uma identidade/design system/fundação visual nova, ou aceitar uma oferta explícita. NÃO é para manutenção de UI existente nem micro-edits.
---

# V1TRUVIO — protocolo de geração

Fonte canônica da mente: `~/v1truvio` (verdade viva: `PATHOS.md`). Esta skill não substitui o contrato (`mind/CONTRACT.md`) — ela ordena a orquestração e a prova. O protocolo abaixo foi destilado das gerações reais gen-001 (flight-watcher) e gen-002 (m1nd) — os pitfalls em `references/pitfalls.md` são cicatrizes, não teoria.

## GATE 0 — consentimento e escopo (bloqueante)

Responda por escrito ANTES de qualquer coisa:
1. **O usuário pediu/aprovou explicitamente NESTA conversa?** Não → PARE e ofereça; só prossiga com sim explícito.
2. **O produto-alvo tem identidade visual própria?** Sim → PARE, a menos que o dono tenha pedido explicitamente "revisão de direção / visão nova" (caso legítimo do anti-escopo do CONTRACT). Manutenção de identidade existente NUNCA re-roda a mente.
3. **O produto-alvo está claro?** Não → pergunte qual produto, antes de gastar qualquer token de pipeline.

## Papéis (a lei dos assentos separados)

| Assento | Quem | Nunca |
|---|---|---|
| ORQUESTRADOR | a sessão que invocou a skill | escreve brief, julga gate ou aterrissa — orquestra, verifica barato e commita |
| MAKER | subagente (Opus) | vê vocabulário estético no spec; aplica o próprio gate |
| JUIZ FRIO | subagente SEPARADO (Opus) | vê o histórico do maker/coder; aceita números sem re-medir |
| CODER | subagente (Opus) | re-projeta; herda identidade de outra geração ou da casa |

Specs prontos por assento: `references/seat-specs.md` (esqueletos parametrizados — use-os, eles carregam as regras que já falharam uma vez).

## Fase 1 — Dossiê (orquestrador)

1. Colete FATOS do produto: o que o sistema processa de verdade, dados vivos (banco/API/logs reais), quem é o operador real, estado atual da superfície. Ferramentas da casa valem (m1nd para repos ingeridos, SQLite na mão, etc.).
2. Salve uma AMOSTRA DE DADO REAL em `~/v1truvio/proofs/gen-NNN/` (ex.: um payload capturado hoje) — a prova renderiza dado verbatim, nunca mock inventado.
3. **Regra da esterilidade estética:** o dossiê e o spec do maker não carregam UMA palavra de tom/estilo/estética ("calmo", "industrial", "denso"...). Se o orquestrador sugerir o tom, o teste morre — o que sair é o orquestrador falando, não a mente.

## Fase 2 — MAKER → BRIEF.md

Despache o maker (spec em `references/seat-specs.md#maker`): carrega a mente na ordem (MANIFESTO → CONTRACT → VECTORS → MODES → rag/), explora o produto read-only, produz `proofs/gen-NNN/BRIEF.md` com as 9 seções + **Assinatura formal no §8** (2–3 gestos proprietários; a doutrina provada: a assinatura mais forte nasce DO DADO que só este produto tem). Verifique barato ao voltar: 9 seções presentes, perfil de 6 vetores justificado, assinatura com nome/material/origem/proibições.

## Fase 3 — JUIZ FRIO → GATE-VERDICT.md

Despache o juiz (spec `#judge-brief`): adversarial, evidência citada por item, **verificação factual das fontes de telemetria contra o código/dado real** (item 2 é onde brief bonito morre). Reprovou → UM ciclo de correção no maker → re-julga → reprovou de novo = pare e reporte ao diretor.

## Fase 4 — CODER → aterrissagem

Despache o coder (spec `#coder`): (a) **estudo formal primeiro** — `studies.html` com 3 composições divergentes RENDERIZADAS (julgar renderizado muda a escolha), escolha justificada; (b) aterrissagem — `tokens.json` DTCG por função + `build-tokens.mjs` (padrão zero-dep da casa) + `core.css` com TODOS os estados + `specimen.html` com o dado real verbatim + `lint.mjs` próprio da identidade (regras do brief + proibições dos gestos, EXIT 0); (c) **medições anotadas** em NOTES.md — posições/vãos/interpenetrações/elementFromPoint dos elementos críticos: o juiz vai medir, quem não se mede primeiro reprova.

## Fase 5 — GATE DA PROVA (juiz re-entra)

O MESMO juiz (contexto vivo via SendMessage) julga o ARTEFATO: item 13 (teste do template — estrutura, não acabamento) e item 14 (anti-cosplay reverso — cada lei citada tem execução material; proibições dos próprios gestos valem como lei). **Com medição própria em browser real** — nunca aceitando os números do coder. Reprovou → um ciclo cirúrgico no coder (só os defeitos medidos) → re-julga → fim.

## Fase 6 — Veredito do diretor (fecha o ciclo)

1. Verificação própria do orquestrador: lint na mão, screenshot com os próprios olhos.
2. Entregue ao usuário: screenshot + specimen aberto no browser (`open .../specimen.html`) + A/B se houver versão anterior.
3. **O veredito cru do diretor vai para `verdicts/NNN-*.md`** no formato do `verdicts/README.md` — rejeição sem destilação é veredito perdido; cada destilação vira candidato a PR na mente (a mente só muda por PR, nunca por drift de sessão).
4. Aprovado pelo diretor + gates verdes → registrar preset em `presets/`.
5. Commits locais atômicos pelo orquestrador (identidade do dono, mensagens em inglês, regra de burst da casa). PATHOS do v1truvio atualizado na mesma sessão.

## Invariantes (violação = geração inválida)

- Estilo NUNCA é input; estilo é output de calibração.
- Produto-alvo INTOCADO — tudo nasce em `~/v1truvio/proofs/gen-NNN/`.
- Maker ≠ juiz ≠ coder; juiz re-mede tudo; ciclo de correção é ÚNICO por gate.
- Dado renderizado é real e citável; telemetria sem fonte é cosplay e reprova.
- Lacuna declarada > fato inventado, em qualquer assento.
