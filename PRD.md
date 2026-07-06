# PRD — V1TRUVIO (Vitruvian Machine Mind)

**Versão:** 0.1 · 2026-07-06 · autoria do assento Fable, direção Max Kle1nz
**Status:** Fase 0 entregue (mente compilada); provas de vida pendentes

---

## 1. Uma frase

Compilar a filosofia de direção de arte do Novo Uomo Vitruviano numa **mente geradora operacional** — artefatos versionados + skill de deploy — que agentes carregam para gerar identidades visuais completas, distintas entre si, consistentes com o núcleo e imunes a clichê, calibrando seis vetores em vez de imitar um estilo.

## 2. O problema real (evidência de hoje)

1. **Cada design system nasce de uma sessão irrepetível.** ALMUS e HERBÁRIO são fortes porque um agente inspirado + o Max no loop acertaram a mão. A filosofia que os gerou mora em chats mortos e na cabeça do Max — não é executável de novo.
2. **O meta-motor já está sendo testado sem mente formalizada.** Hoje (2026-07-06), a bancada ALMUS gerou quatro systems num dia — TESSERA//FLUID, APOLLO//MONOLITH, KRONOS//NEO-BAROQUE, VERITAS//COLUMN — como "teste prático do meta-motor de design gerativo" (PATHOS do ALMUS, v0.6–v0.9). Funciona, mas é vibe dirigida: sem vetores declarados, sem gates, sem rastreabilidade das decisões. O VERITAS aplica a fresta de Ando e o APOLLO aplica memória CRT **porque o agente estava embebido do manifesto naquele contexto** — não porque uma gramática o obrigou. Isso não sobrevive à troca de sessão, de agente ou de modelo.
3. **Sem a mente, agentes produzem os dois inimigos:** SaaS branco genérico (planicidade anestesiante) ou cyberpunk de template (teatro técnico). Não existe hoje nenhum gate objetivo que reprove um resultado "parecido mas clichê".

## 3. Tese do produto

A mente é um **compilador de identidades**, não um tema:

```
INPUT   produto + operador + contexto cultural
        │
MENTE   diagnóstico → modo → calibração de 6 vetores → leis dos órgãos → 3–5 RAG cards
        │                                    (gates reprovando a cada passo)
OUTPUT  Design Brief rastreável → sistema visual/tokens → PROVA mínima → preset registrado
```

**Estilo é output, nunca input.** Pedir "faça estilo X" à mente é erro de uso; pede-se "produto Y, operador Z" e o estilo emerge da calibração. É isso que permite que a MESMA mente gere uma redação editorial calma e um cockpit de agentes — e explique por quê.

## 4. O que é / o que não é

| É | Não é |
|---|---|
| Ontologia de design compilada (tese, operador, inimigo, leis) | Moodboard, board de referências |
| API estética: 6 vetores calibráveis com travas | Um estilo único ("o estilo V1TRUVIO" não existe) |
| Banco de leis de composição (RAG cards curados via PR) | Lista de artistas para "se inspirar" |
| Pipeline com outputs obrigatórios e gate binário | Prompt vago de "seja criativo e industrial" |
| Fábrica de design systems (ALMUS-e-irmãos são outputs) | Substituto do uiproof, de tokens ou de biblioteca de componentes |

## 5. Usuários e assentos

- **Max** — diretor. Dá o veredito estético final; a mente estrutura, não substitui o olho dele.
- **Assento de escrita da visão (Fable)** — por doutrina do CLAUDE.md, PRD/visão/identidade nascem em Fable.
- **Agentes de geração/implementação** — carregam o contrato via skill; qualquer modelo competente deve conseguir gerar sob a mente **porque os gates seguram a qualidade** (é o mesmo princípio do spec grounded: a gramática é o que faz um agente mediano acertar).
- **Projetos-alvo** — qualquer repo com frontend; a identidade gerada aterrissa como tokens + CSS + specimen, no padrão provado pelo ALMUS.

## 6. Anatomia da mente (artefatos deste repo)

| Artefato | Papel | Estado |
|---|---|---|
| `mind/MANIFESTO.md` | A alma: tese, operador, inimigo, 3 leis | ✅ destilado (original do Max a mergear) |
| `mind/CONTRACT.md` | O prompt-mãe: pipeline de 9 passos + gate de 12 itens | ✅ |
| `mind/VECTORS.md` | Os 6 vetores com escalas e travas por vetor | ✅ |
| `mind/MODES.md` | Seletor de tom (8 modos) — trava anti-militarização | ✅ |
| `mind/rag/*.md` | 7 cards seed + template; card novo = PR | ✅ |
| `presets/` | Calibrações provadas + linhagem dos filhos | ✅ seeds; retro-registro pendente |
| `docs/MIND-UML.md` | O UML mental (classes, sequência, estados) | ✅ |
| skill `v1truvio` | Deploy: carrega mente no agente, com gate de consentimento | ❌ Fase 1 |

**Órgãos da mente** (as cinco lentes perceptivas que o pipeline consulta — formalizadas no UML): Olho Construtivista (*onde está o peso da decisão?*), Pele Brutalista (*qual é a matéria desta máquina?*), Mão Analógica (*onde o operador precisa sentir que tocou algo real?*), Cérebro Telemetrista (*que parte do sistema precisa ficar visível para gerar confiança?*), Memória Geracional (*que memória sensorial torna isto imediatamente familiar para ESTE operador?*).

## 7. Requisitos funcionais

- **RF1 — Diagnóstico antes de pixel:** nenhuma geração começa sem operador, máquina e emoção nomeados (contrato, passos 1–2).
- **RF2 — Modo único justificado** (passo 3) com bias e proibições aplicados.
- **RF3 — Perfil de 6 vetores declarado com justificativa por eixo** (passo 4); travas por vetor são bloqueantes.
- **RF4 — Seleção de 3–5 cards por LEI, nunca por aparência** (passo 5).
- **RF5 — Três planos:** todo elemento atribuído a fore/mid/background (passo 6).
- **RF6 — Mapa de atrito explícito:** atrito fora do mapa é bug (passo 7).
- **RF7 — Rastreabilidade:** decisão visual não-óbvia carrega origem `[card|lei|vetor|modo]` (passo 8).
- **RF8 — Gate anti-padrões binário** reprova a entrega (não é sugestão): 12 itens sobre o brief + 2 sobre o artefato (gate da prova: teste do template e anti-cosplay reverso — *verdict 001*).
- **RF9 — Prova mínima obrigatória:** a identidade só existe com artefato julgável (passo 9).
- **RF10 — Registro de preset:** geração aprovada vira preset versionado (o loop de aprendizado da mente).
- **RF11 — Força formal estrutural** *(verdict 001)*: todo brief declara 2–3 gestos formais proprietários (assinatura); a aterrissagem começa por estudo formal (2–3 composições divergentes) e é obrigada a materializar a assinatura, verificada no gate da prova.

## 8. Requisitos não-funcionais

- **RNF1 — Anti-clichê estrutural:** as 3 leis + gate são a defesa; nenhum vetor/card as sobrepõe (precedência Leis > Modo > Vetores > Cards).
- **RNF2 — Portabilidade de host:** a mente é markdown puro; funciona em Claude Code (skill), Codex, ou colada num chat. Zero dependência de runtime.
- **RNF3 — Auditabilidade:** dado um design pronto, deve ser possível reconstituir o brief (vetores, cards, atrito) — o inverso de vibe.
- **RNF4 — Acessibilidade não-negociável:** paridade teclado/ARIA em tactilidade alta, `prefers-reduced-motion`, som desligável (travas dos vetores).
- **RNF5 — Curadoria sobre acúmulo:** RAG cresce por PR com o template; card que não vira lei não entra.

## 9. Provas de vida (o que separa "de pé de verdade" de vaporware)

A mente **só é declarada funcional** quando as quatro passarem:

- **P1 — Teste do compilador:** mesma mente, 3 produtos distintos (ex.: editor de texto, orquestrador de agentes, ferramenta de música) → 3 identidades claramente distintas, todas rastreáveis ao núcleo, nenhuma reprovada no gate. Falha se saírem 3 skins do mesmo tema.
- **P2 — Teste cego do diretor:** Max recebe as telas de P1 + os 3 perfis de vetores embaralhados e pareia perfil↔tela. Acerto pleno = os vetores realmente governam o resultado.
- **P3 — Red team do gate:** uma geração deliberadamente contaminada (telemetria falsa, neon decorativo, atrito em busca) deve ser REPROVADA pelo gate de 12 itens aplicado por um agente frio. Falha se o clichê passa.
- **P4 — Teste da linhagem:** ALMUS e HERBÁRIO reconstituídos como presets (perfil + modo + cards retro-atribuídos). A mente tem que conseguir explicar os filhos que nasceram antes dela — se não consegue, a gramática está incompleta.

## 10. Riscos e travas (compilados do tratado)

| Risco | Trava estrutural |
|---|---|
| Degenerar em cyberpunk genérico / military UI | Gate itens 5–6; direção declarada "industrial, diegética e tátil — não decorativa" |
| Militarizar produto que não é guerra | MODES obrigatório; cockpit tático exige risco real justificado |
| PNL soar pseudociência | Rebaixada no manifesto a "vocabulário sensorial heurístico" — nunca claim |
| Atrito em excesso (friction everywhere) | Vetor cerimonialidade + mapa de consequência obrigatório + gate item 3–4 |
| Densidade virar ruído | Trava do teste de zona ("que pergunta do operador eu respondo?") |
| Referência virar cosplay | Lei 3 + campo "risco de clichê" em todo card + gate item 5/10 |
| A própria mente virar burocracia de 9 passos para um botão | Escopo: a mente gera IDENTIDADES e telas de fundação, não micro-edits; mudanças pontuais seguem o system já gerado |

## 11. Relação com o ecossistema

- **ALMUS (`~/almus`)** — bancada empírica e primeiro filho. Os experimentos TESSERA/APOLLO/KRONOS/VERITAS de 2026-07-06 são provas embrionárias do meta-motor; a Fase 2 os retro-registra como presets. O padrão de aterrissagem (tokens DTCG → CSS → specimen → lint mecânico → skill com gate de consentimento) é **herdado como padrão de output** da mente.
- **HERBÁRIO (DOOB)** — segundo filho pré-mente (cartógrafo-botânico + calm tech); prova que o núcleo gera também identidades CALMAS — importantíssimo contra o viés cyber.
- **uiproof** — continua sendo o Q&A determinístico de qualquer frontend gerado; a mente não substitui prova.
- **PATHOS** — continuidade do próprio repo; verdade viva em `PATHOS.md`.
- **pattern-architect (`~/.codex/skills/pattern-architect`)** — o método-mãe cognitivo do Max (Pattern Archaeologist + Liminal Architect: destilar a mente que gera o artefato). O V1TRUVIO é uma instância desse método aplicado à direção de arte; o método continua geral e válido para destilar outras mentes.
- **Doutrina Max (CLAUDE.md)** — consentimento explícito para aplicar a mente num projeto (mesmo GATE 0 da skill ALMUS); commits como Max; docs no mesmo PR.

## 12. Roadmap

- **F0 — Compilar a mente** *(esta sessão)*: repo, PRD, UML mental, manifesto destilado, contrato, vetores, modos, 7 cards, seeds, PATHOS. ✅
- **F1 — Deploy:** skill `v1truvio` fina (GATE 0 de consentimento → carrega contrato+cards → exige brief completo); merge do manifesto original do Max; decidir remote GitHub.
- **F2 — Provas de vida:** rodar P1–P4 de verdade na bancada ALMUS; ajustar travas/gate com o que a realidade ensinar; retro-registrar a linhagem.
- **F3 — Ponte para código:** do Design Brief aprovado para tokens W3C DTCG + CSS core + specimen automaticamente (reusar `build-tokens.mjs` do ALMUS como padrão); lint mecânico por identidade gerada.
- **F4 — Evolução do RAG:** novos cards por PR (candidatos naturais: Otl Aicher, Massimo Vignelli, Syd Mead, interfaces NASA/Apollo reais, Susan Kare, Ettore Sottsass); presets acumulando como memória da mente.

## 13. Decisões em aberto (para o Max)

1. **Nome:** `V1TRUVIO` está no padrão da casa (m1nd, kle1nz); alternativas: `UOMO`, `VMM`. Renomear agora é barato.
2. **Manifesto original:** onde está o texto-fonte completo? (Spotlight não achou nada local — deve estar num chat. Colar em `mind/MANIFESTO.md` § fonte.)
3. **Remote:** criar `github.com/maxkle1nz/v1truvio`? (Hoje: repo local, commit local, regra de burst.)
4. **Skill:** auto-oferecer quando detectar trabalho de design, ou só por invocação explícita? (Recomendo invocação explícita + GATE 0, como ALMUS — coerente com a tua doutrina de consentimento.)
