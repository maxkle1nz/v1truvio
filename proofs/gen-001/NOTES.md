# NOTES — gen-001 · flight-watcher (CODER)

Decisões nas `[impl:lacuna]` do §8 e limites honestos. A direção veio do BRIEF; aqui só se fecham os valores concretos que o brief deixou ao design system.

## Lacunas fechadas

### Hex finais (a relação que o §8 fixou: massa escura mate × UMA fresta quente × um estado frio)
Todos definidos em `tokens.json` (grupo `cor`), por FUNÇÃO, nunca por nome de cor.

| Token | Hex | Justificativa (amarrada à direção) |
|---|---|---|
| `massa` | `#0E0F12` | Grafite quase-preto mate = a bancada em penumbra (Ando). Frio o bastante para a fresta âmbar "acender" por contraste. |
| `massa-alta` / `massa-media` | `#16181C` / `#1C1F24` | Dois degraus de cinza para hierarquia de midground sem introduzir cor — Rams (massa que aceita ser massa). |
| `luz-de-acao` | `#F4A24C` | A ÚNICA cor quente (a fresta). Âmbar de bancada, não laranja-alarme saturado — evita a "estética de guerra" que o modo Laboratório proíbe. Contraste **8.56:1** sobre `massa-alta` → cumpre AAA no preço-veredito. |
| `luz-de-acao-forte` | `#FFB765` | A luz mais intensa, reservada a `novo-piso` (o achado raro real — §8 Estados). |
| `estado-frio` | `#7E8794` | Ardósia fria e apagada: o veredito "acima-do-alvo" comunica "não é hora" pela AUSÊNCIA de luz (Ando), não por vermelho de erro. |
| `estado-atencao` | `#C9A24B` | Âmbar dessaturado e sóbrio para o selo `desatualizado` — falha VISÍVEL (Lei 1), mas jamais sirene/vermelho pulsante. |
| `texto-alto/medio/fraco` | `#F2EFE9` / `#B9BCC4` / `#868B94` | Trilha de leitura (Moholy-Nagy): alto contraste no preço/veredito, médio-honesto nos labels de midground. |

**Sem** verde-sucesso, **sem** vermelho-alarme permanente, **sem** gradiente de marketing — o lint (regra d) proíbe mecanicamente tokens desse tipo.

### Stack tipográfica (a direção exige: dígitos tabulares + grotesco de bancada, e OFFLINE — sem webfont)
- **Grotesco de bancada:** `-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif` — stack de sistema puro. Zero CDN/webfont: o specimen abre offline (força declarada do produto, §8/edge OFFLINE).
- **Números (preço/piso/matriz):** `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace` com `font-variant-numeric: tabular-nums lining-nums` — dígitos alinham em coluna para varredura vertical (é dinheiro). Confirmado ativo no browser (`lining-nums tabular-nums`).

### Outras decisões dentro da direção
- **Tamanho do veredito:** 72px (56px < 860px de largura) — "o maior peso da tela, objeto material" (Lissitzky). Degrada legível em telas estreitas (assumido desktop-primeiro, §1).
- **A fresta é uma barra de luz de 3px** na borda esquerda do bloco-veredito (`::before`), apagada por padrão (cinza-estrutura) e acesa (âmbar) só em `em-alvo`/`novo-piso`. A luz é literalmente uma fresta, não um fundo pintado.
- **Escala do trilho histórico:** 796→960 (fantasma → alvo), com piso 912 em 70,7% e atual 948 em 92,7%. Escala honesta: mostra visualmente que €948 está a €36 do piso e colado no teto do alvo.
- **Assimetria funcional:** grid Foreground 1.9fr / 1fr — o bloco-veredito recebe mais área que sua vizinhança para o olho cair nele primeiro (§8 Grid, Lei 1). A matriz volta a grid ortogonal calmo.
- **Rito de compra nível 3:** pausa deliberada de 500ms (`aria-disabled` no botão de saída até liberar), não modal de senha. A leitura de consequência é montada com os dados reais do bloco. Escape/voltar/fundo fecham; foco gerido.

## Estados previstos no template (§9 exige)
Além do estado provado `em-alvo`, o mesmo template reage a: `acima-do-alvo`, `novo-piso`, `amostra-ruído` (tendência vira "ainda é ruído"), `desatualizado` (selo âmbar, veredito neutro, pulso PARADO), `vazio` (sem veredito falso), `offline` (lê normal, só o gesto de compra avisa). Switcher de demonstração no rodapé, visualmente separado da tela provada (borda tracejada), com nota de que a tela real é `em-alvo`.

## Contraste (computado dos hex escolhidos — WCAG 2.1)
Limiares: AA normal 4.5 · AA large 3.0 · AAA normal 7.0 · AAA large 4.5. O preço-veredito é large text (72px bold) → alvo AAA large = 4.5.

| Texto | Sobre | Ratio | Veredito |
|---|---|---|---|
| **preço-veredito** `luz-de-acao` | `massa-alta` (corpo do bloco) | **8.56:1** | **AAA** (passa até AAA normal 7.0) ✓ |
| texto-alto | massa | 16.70:1 | AAA ✓ |
| texto-medio | massa | 10.09:1 | AAA ✓ |
| texto-fraco (labels) | massa | 5.60:1 | AA ✓ |
| texto-fraco (labels) | massa-media (matriz) | 4.83:1 | AA ✓ (limiar mais apertado) |
| estado-frio (veredito acima-do-alvo) | massa-alta | 4.89:1 | AA large ✓ |
| luz-de-acao | massa | 9.23:1 | AAA ✓ |

Todo texto de dado ≥ AA; o preço-veredito cumpre AAA com folga. Paridade sem cor garantida: o estado `em-alvo` carrega o rótulo textual **EM ALVO** (não depende da cor da fresta) — verificado pelo lint (regra g).

## Validação — status
- `node build-tokens.mjs` → gera `tokens.css` (40 custom properties), sem erro.
- `node lint.mjs` → **EXIT 0** (PASS, 0 violações). As 9 regras (a–i) foram testadas negativamente: cada uma pega sua violação (não é carimbo).
- **Browser real:** o profile do Playwright MCP estava TRANCADO por outra sessão concorrente (`Browser is already in use … use --isolated`). Limite honesto: não usei o Playwright MCP. Em vez de degradar para parse estático, validei em um **Chromium headless ISOLADO** (o binário do próprio Playwright, `chromium-1228`) dirigido por **CDP cru via Node built-ins (net+crypto, zero dep)** — browser real, viewport 1280×800. Resultado:
  - **console: 0 erros, 0 exceções.**
  - veredito legível: `€948` / `EM ALVO` / estado `em-alvo`; preço em `rgb(244,162,76)` (a fresta); fundo `rgb(14,15,18)` (massa); dígitos tabulares ativos.
  - gesto de compra é elemento focável (A/BUTTON), não div.
  - matriz: 7 `<th>` reais, 18 linhas, linha em-alvo marcada.
  - **zero recursos externos carregados** em runtime (offline-first confirmado).
  - rito de compra funcionando: clique → diálogo abre → linha de consequência real → saída `aria-disabled=true` imediatamente → `false` após a pausa → deep_link real no href → fecha no "voltar".
  - switcher de edge state funcionando (`acima-do-alvo` troca estado+rótulo; restaurado a `em-alvo`).
  - `screenshot.png` salvo (1280×800).

## Limites / desvios honestos
1. **Playwright MCP indisponível** (profile trancado por sessão concorrente) — validado por Chromium headless isolado + CDP cru em vez do MCP. Mesmo rigor (browser de verdade, mesmos asserts), transporte diferente. O `.mjs` do driver mora no scratchpad, fora de `proofs/gen-001/` (não é deliverable).
2. **Tendência = mercado agregado, não por-rota** (GATE-VERDICT obs. 3): rotulada honestamente na UI como "mercado agregado · +0,02 %/hora · não é a tendência desta rota específica". O valor +0,02 %/hora e o estado "estável" são a saída real do `analyze.py` hoje.
3. **`.mjs` não é lintado** pelo `lint.mjs` (o regex de alvo casa `.js`, não `.mjs`) — intencional: o lint mira a SUPERFÍCIE de identidade (core.css / specimen.html / specimen.js), não o tooling Node (build/lint), espelhando o escopo do almus-lint (que só linta HTML de autor).
4. **`specimen.js` externo** (não inline no HTML): mantém o HTML lint-limpo e o JS legível; ambos são arquivos locais servidos junto — não fere offline-first (o lint confirma zero recurso externo).
