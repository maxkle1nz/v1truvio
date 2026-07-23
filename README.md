# V1TRUVIO

Not a design system. The compiler that generates them.

## What this is

A generative mind for art direction. It turns `product + operator + context` into a distinct, traceable, anti-cliché design system by calibrating six vectors under three laws — never by copying a style. It has four parts: an ontology (thesis, enemy, operator, laws), an aesthetic API (6 calibratable vectors), a bank of composition laws (RAG cards), and a pipeline with objective gates. Style is the output. The mind is the grammar.

Its mother sentence: *interfaces that give the human back the feeling of operating a living, legible, accountable machine.* The enemy it refuses by name is anesthetic flatness — design that stripped out texture, weight, state, and consequence until the human just slides across it.

| Path | What it is |
|---|---|
| [`mind/MANIFESTO.md`](mind/MANIFESTO.md) | The soul: thesis, operator vs. user, the enemy, the three laws. |
| [`mind/CONTRACT.md`](mind/CONTRACT.md) | The generator prompt: a 9-step pipeline, precedence Laws > Mode > Vectors > Cards, a 12-item binary anti-pattern gate, and the Design Brief format. |
| [`mind/VECTORS.md`](mind/VECTORS.md) | The 6 vectors — tactility, density, geometry, synesthesia, entropy, ceremoniality — each 0–10 with a blocking lock. |
| [`mind/MODES.md`](mind/MODES.md) | 8 tone modes with vector bias and prohibitions (the anti-militarization lock). |
| [`mind/rag/`](mind/rag/) | 7 seed cards (Lissitzky, Moholy-Nagy, Ando, Rams, Teenage Engineering, Stuart Hall, Détournement) as extracted laws, plus a template. |
| [`proofs/`](proofs/) | Real generations under the mind. Evidence, kept whether they passed or failed. |
| [`verdicts/`](verdicts/) | The director's taste bank — especially the rejections of generations that passed the gate. |
| [`presets/`](presets/) | Registered calibrations and the lineage of six pre-mind children. |
| [`skill/`](skill/) | The deploy protocol: consent gate, separate-seats law, six phases, real scars. |
| [`PRD.md`](PRD.md) · [`docs/MIND-UML.md`](docs/MIND-UML.md) · [`PATHOS.md`](PATHOS.md) | The full spec, the mental UML, and the living state. |

## Status — honest

**Phase 0 — the mind is compiled, not proven.** That is the house rule, not modesty: an identity without a judged artifact does not exist, and the mind without its life-proofs (P1–P4 in the PRD) is "compiled," never "functional."

What stands today:

- The mind is written, file by file — ontology, vectors, modes, cards, the generator contract.
- The deploy skill (F1) exists in `skill/`, built on the protocol the first generations proved. It has not yet survived a cold red-team — a first invocation by a session that lacks this context.
- **gen-001** (a flight-price panel) closed end to end with separate seats: a maker wrote the brief, a cold judge passed the 12-item gate with source verification, a coder landed W3C DTCG tokens, `core.css` with every state, a live specimen on real data, and its own lint (EXIT 0), validated in real Chromium at AAA contrast, offline-first. The director rejected the first landing, sent four PRs back into the mind, and only approved the re-landing — then the proof gate caught a 56px orphan stem before a final pass at 0.00px. **Preset 001 registered.**
- **gen-002** (a view for a code-graph engine) passed the proof gate on the first try, but has no director verdict yet — so it is not a preset.
- **gen-004** is the most useful failure. The full pipeline ran clean — gate 12/12, lint 56/0, a clean browser — and the director rejected the artifact *and the approach*. The lesson, distilled into `verdicts/004`: for a product that already has a living identity and an active taste-owner, running the mind creates a second authorship fighting for direction. There, the right move is to extend the existing system by the owner's hand. Third confirmation that a green gate is not the same as beautiful.

What does **not** exist, and is not gilded: the full P1 (a third generation of a distinct class), P2 (a blind test), P3 (a red-team of the gate with a planted cliché — the gates have only met honest briefs), P4 (retro-registering the lineage), the skill's cold red-team, and the original manifesto merged from source (the repo holds a faithful distillation; the source text still lives in a chat).

## Run it

There is no build command for the compiler itself. You operate it.

1. Load `mind/MANIFESTO.md` + `mind/CONTRACT.md` + `mind/VECTORS.md` + `mind/MODES.md` into a design agent, plus the 3–5 cards from `mind/rag/` the diagnosis calls for.
2. Follow the contract: nine steps, a full Design Brief, the 12-item gate as an output lint, a minimal proof. Keep the seats separate — the maker, the judge, and the coder are different dispatches.
3. Register the result as a preset only after the gate is green *and* the director has ruled.

`skill/` automates that dispatch behind a consent gate. Each landed identity also ships its own greppable `lint.mjs`, derived from its own brief — so the proof checks itself.

## Continue from here

MIT — see `LICENSE`. Fork it. The mind changes only by a curated PR in this repo — a new card, a tightened lock, a registered preset — never by the vibe of the generation you happen to want approved.

The honest next attacks:

- **Earn the "proven."** Run a third generation of a distinct class to close P1, then the blind test (P2). Until then the mind is a hypothesis with strong evidence, not a working tool.
- **Red-team what only met honest inputs.** Plant a cliché and see if the 12-item gate still passes it (P3), and hand the skill to a cold session that never read this repo.
- **Merge the source.** Only the distillation of the manifesto is here. The original treatise should land so the map matches the territory.

---
<p align="center">
  <img src="assets/deviance-prism-icon.png" width="44" alt="DEViance Intelligence">
  <br>
  <sub>A <b>DEViance Intelligence</b> prototype — <i>beyond the edge</i> · by <a href="https://github.com/maxkle1nz">Max Kle1nz</a></sub>
</p>
