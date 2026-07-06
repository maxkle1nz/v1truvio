# NOTES — gen-001 · flight-watcher (CODER, re-aterrissagem pós-verdict 001)

A v1 passou no gate 12/12 e foi REJEITADA na execução visual ("dark dashboard genérico; leis viraram metáforas mortas"). Esta v2 re-aterrissa o mesmo brief com a **Assinatura formal** (§8 emendado): G1 Régua-mestra · G2 Corte do Limiar · G3 Placa Pênsil. O screenshot rejeitado está preservado em `screenshot-v1-rejected.png` (A/B contra o `screenshot.png` atual).

## Estudo formal (protocolo de aterrissagem, passo 1) — `studies.html`

Três composições estruturais divergentes dos mesmos 3 gestos, julgadas RENDERIZADAS (não só de cabeça):

- **A — régua no alto · pêndulo curto · derramamento médio → ESCOLHIDO.** Ordem de leitura de instrumento (escala → veredito → campo), pêndulo curto mantém a matriz na primeira tela, derramamento de 260px lê como EVENTO preso à fenda.
- **B — régua como espinha central · derramamento forte → rejeitado:** o veredito cai abaixo da dobra da primeira leitura (quebra o critério <2s) e o derramamento de 400px vira ambiente do quadrante — exatamente o que o G2 proíbe a luz de ser.
- **C — haste longa · placa inclinada (−0.7°) → rejeitado:** na escala real a inclinação lê como defeito de renderização, não como pêndulo físico; a haste de 120px gasta vertical e empurra a matriz para fora da dobra sem ganho compositivo.

Decisão de composição emergente do estudo (registrada como doutrina do template): quando o pino cruza para o lado caro (`acima-do-alvo`), o **lado frio espelha para o lado barato** (agora vazio) e a **placa pende rasa, sem sombra e sem sobrepor a matriz** — massa recua quando não é hora (Ando); a interrupção de planos é privilégio dos estados acesos (`em-alvo`/`novo-piso`).

## A assinatura materializada (o que existe e é nomeável na tela)

- **G1 `.regua-mestra`** — faixa €780–1050 atravessando o topo, graduação real de €10 (27 passos), entalhes REAIS: fantasma €796, alvo-OW €900, piso €912, alvo €960 (config aponta para cima, história para baixo), OW atual €1004. **Fórmula única da escala** em `.v1t-escala-x` e nos trilhos: `x = (−−preco − min) / (max − min) × 100%`. Confirmado no browser: pino 62,27% ≈ x(948), piso 48,89 % = x(912), fenda 66,67 % = x(960), tick da linha 948 em 62,2222 %. **Distância na tela = distância em euros.** Trilho-DNA: cada `<tr>` da matriz carrega `--preco` e pinta trilho+tick por **background de `<tr>`** (posição em %, técnica sem hack de layout, tabela semântica intacta). Estouro (>€1050): entalhe DUPLO encostado na borda + legenda única no rodapé da matriz ("preço além da faixa encosta na borda") — o rótulo por-linha é o próprio preço na 1ª coluna.
- **G2 `.corte-limiar`** — UMA fenda em x(960) nascendo no entalhe do alvo e descendo a composição inteira; na banda do foreground é a fenda (aberta em-alvo: slit âmbar + `__derramamento` de 260px com borda dura na fenda decaindo à esquerda — **estático**, animationName=none confirmado); sobre a matriz desce SEMPRE como hairline seco. Selada (`acima-do-alvo`/`desatualizado`/`vazio`): slit vira hairline `linha-estrutura` e o derramamento some — confirmado `rgb(42,46,53)` no browser. O entalhe do alvo na régua também apaga quando a fenda sela — **a luz é evento, não ambiente**.
- **G3 `.placa-pensil` + `.placa-pensil__haste`** — a placa suspensa pela haste-pino (56px, 1px, `texto-medio`) cravada em x(preço) via a fórmula; corpo pende com o pino a 92% da largura (assimetria funcional — massa para o lado barato); **sobrepõe a matriz em +48px com sombra real** (`0 22px 44px rgba(4,5,7,.62)`) — confirmado no browser (sobreposição 48.0px, sombra presente, corredor de 13px até a fenda = o vão dos €12). Estado muda → o pino re-crava com deslocamento de 260ms com peso (confirmado: 62,27% → 77,08% em acima-do-alvo; entalhe do piso desloca para x(889) no novo-piso).

## Lacunas fechadas (v1, ainda válidas)

| Token | Valor | Justificativa |
|---|---|---|
| `massa` / `massa-alta` / `massa-media` | `#0E0F12` / `#16181C` / `#1C1F24` | Bancada em penumbra (Ando); hierarquia de cinzas sem cor. |
| `luz-de-acao` | `#F4A24C` | A única cor quente — âmbar de bancada, não laranja-alarme. 8.56:1 sobre a placa (AAA). |
| `luz-de-acao-forte` | `#FFB765` | Exclusiva de `novo-piso` (o achado raro). |
| `estado-frio` | `#7E8794` | "Não é hora" pela AUSÊNCIA de luz, não por vermelho. |
| `estado-atencao` | `#C9A24B` | `desatualizado`: falha visível, âmbar sóbrio, jamais sirene. |
| `texto-alto/medio/fraco` | `#F2EFE9` / `#B9BCC4` / `#868B94` | Trilha de leitura Moholy-Nagy. |
| Tipografia | stack de sistema + `ui-monospace` tabular | Zero webfont/CDN — specimen abre OFFLINE. |

Tokens NOVOS da assinatura (por função): grupo `regua` (min/max/graduação/alturas dos entalhes/tick da matriz) e grupo `assinatura` (espessura da fenda, alcances do derramamento normal/forte, haste/haste-recuo, largura e fração do pino da placa, altura do campo, geometria da sombra) + cores `derramamento`, `derramamento-forte`, `sombra-placa`.

## Lint estendido (regras da assinatura) — todas testadas negativamente

(a) número do preço nunca anima (rescopo: deslocamento de pino/entalhe é motion MAPEADO no brief) · (b) reduced-motion presente · (c) luz quente só em zona de ação (fenda/placa acesa/compra/rito/linha em-alvo/entalhe do alvo) · (d) sem verde-sucesso/vermelho-alarme · (e) `<th>` reais · (f) compra focável · (g) em-alvo com rótulo textual · (h) zero recurso externo · (i) zero cor crua no core.css · **(j)** as 3 classes da assinatura existem no core.css E no specimen · **(k)** `--preco` jamais dirige width/height (posição, não barra) · **(l)** `.corte-limiar` exatamente 1× no specimen · **(m)** `position:absolute/fixed` só na allowlist da assinatura + margem negativa só na placa · **(n)** a fórmula da escala existe no core.css; no specimen: zero `left:`/`top:`/`background-position` inline, todo `.v1t-escala-x` e toda `<tr>` do tbody carregam `--preco`.

**Limites honestos das regras (declarados):**
- **(n)** é grep, não prova formal: garante que nenhum elemento posicionado do specimen carrega coordenada literal e que a fórmula existe e é a única fonte de `left` para a família da escala — mas não EXECUTA o CSS para provar que cada left computado veio dela. A prova de execução é feita no browser (pino/fenda/piso/tick medidos contra os valores esperados da escala — bateram).
- **(m)** audita o core.css; overflow em runtime (um lado-frio mais alto que o campo, por ex.) não é grepável — foi verificado no browser/screenshot (placaRecuou = −21px no estado frio; lado frio cabe no campo).
- `studies.html` passa pelas regras base mas está ISENTO das regras de assinatura j/l/n (é esboço do protocolo, contém 3 fendas por definição). `.mjs` (tooling) não é lintado — o lint mira a superfície da identidade, como no almus-lint.

## Contraste (WCAG 2.1, computado dos hex; browser confirmou as cores aplicadas)

| Caso real | Ratio | Barra |
|---|---|---|
| **Preço-veredito** (luz sobre placa) | **8.56:1** | AAA (supera até AAA normal 7.0) ✓ |
| Preço novo-piso (luz-forte sobre placa) | 10.34:1 | AAA ✓ |
| Preço acima-do-alvo (frio sobre placa) | 4.89:1 | AA ✓ (large: AAA) |
| Etiqueta EM ALVO (tinta sobre luz) | 8.90:1 | AAA ✓ |
| Texto alto/médio sobre massa | 16.70 / 10.09 | AAA ✓ |
| Rótulos da régua (fraco sobre massa) | 5.60:1 | AA ✓ |
| Texto fraco sobre matriz (pior caso real) | 4.83:1 | AA ✓ |
| Selo desatualizado (atenção sobre matriz) | 6.89:1 | AA ✓ |

**Zona do derramamento (pedido do diretor):** o derramamento NÃO carrega texto por regra de design — a placa é OPACA (a luz passa por trás dela; o contraste do texto da placa não é afetado) e o vão placa→fenda é vazio deliberado. Referência computada do pior caso hipotético (pixel colado na fenda, α=0.16 sobre massa = rgb(51,39,27)): texto-fraco daria 4.24:1 (<AA) — por isso a regra "sem texto no derramamento"; texto-medio (7.64:1) e texto-alto (10.42:1) sobreviveriam se um dia precisarem.

## Ciclo único de correção (GATE-VERDICT-PROVA: item 13 PASSOU · item 14 reprovou no G3)

O juiz da prova mediu dois defeitos que minha auto-validação NÃO mediu — e que meus próprios screenshots já mostravam. **Retrato honesto:** eu afirmei "lado frio cabe no campo" e "haste cravada" verificados, mas medi proxies (altura da haste; recuo da placa), não as afirmações em si. As claims estavam ERRADAS: vão haste→corpo de 56.0px (o `bottom:100%` pendurava a haste ACIMA da caixa enquanto o `margin-top` empurrava o corpo para baixo DENTRO dela) e lado-frio estourando o campo em +74.9px, engolindo o selo de frescor (telemetria obrigatória do §2). Lição aplicada: a validação agora mede EXATAMENTE as afirmações (as métricas do juiz, abaixo).

**Correções (geometria derivada, zero números mágicos):**
1. **Corrente do pêndulo unida:** `--haste-atual` (56px aceso / 20px recuo) é a fonte única — a haste nasce na LINHA da régua (`top: −régua/2`) com `height: régua/2 + var(--haste-atual)` e o corpo desce `margin-top: var(--haste-atual)` → **vão = 0 por derivação**, nos dois regimes.
2. **Campo elástico:** o lado frio saiu do absoluto e entrou no FLUXO — é ele quem dimensiona o campo (min-height = token 296px), então interpenetração de planos é impossível por construção; a placa ACESA estica com `bottom: −sobreposição` (novo token `assinatura.sobreposicao: 48px`) — o overlap vira constante derivada. Estados frios: `bottom: auto` (recua, sem sombra). O gesto de compra ancora na borda inferior da placa (a que invade o campo).
3. **Fenda elástica + campo que conhece o limiar:** `.corte-limiar` agora é o segmento vivo (linha da régua → borda da matriz, dentro do campo); o hairline seco sobre a matriz é desenhado pelo FUNDO do próprio bloco com a MESMA fórmula (`--preco: 960` na seção) — continuidade sem altura mágica.
4. **Coerência G1 que eu mesmo achei auditando:** os trilhos das linhas viviam num sistema de coordenadas ~50px mais estreito que a régua (padding horizontal do bloco) — tick da linha €948 caía ~31px à esquerda do pino. Zerei o padding horizontal do bloco (respiro foi para a 1ª/última coluna) → **desvio medido agora: −0.2px** ("distância na tela = distância em euros" vale na matriz também).
5. **Rito sem aura (obs. 1 do juiz):** o glow âmbar (`0 0 32px brasa`) virou elevação neutra (`sombra-projecao + sombra-placa`) — foco por borda/peso, proibição G2 respeitada.

**As medições que reprovaram, re-medidas (Chromium isolado, 1280×800):**

| Métrica do juiz | em-alvo | acima-do-alvo | Exigido |
|---|---|---|---|
| Vão haste→corpo | **0.0px** (haste 104px desde a linha) | **0.0px** (68px) | 0 ✓ |
| `elementFromPoint` centro do selo | **o próprio selo** ✓ | **o próprio selo** ✓ | selo visível ✓ |
| Elementos ≠ placa interpenetrando a matriz | **[] (nenhum)** | **[] (nenhum)** | só a placa ✓ |
| Sobreposição da placa | +48.0px (com sombra real) | −120.1px (recuada, sem sombra) | privilégio do aceso ✓ |
| Alinhamento tick-948 ↔ escala | −0.2px | −0.2px | mesma coordenada ✓ |
| Pino / fenda / corredor | 62.27% / 66.67% / 13.2px | 77.08% / selada rgb(42,46,53) | ✓ |

## Validação — status

- `node build-tokens.mjs` → 60 custom properties, sem erro. `node lint.mjs` → **EXIT 0** (4 arquivos); as 5 regras novas + 2 rescopadas testadas negativamente uma a uma (11 testes, todos mordem).
- **Browser real** (Playwright MCP seguia TRANCADO por outra sessão → mesmo caminho da v1: Chromium headless isolado do Playwright dirigido por CDP cru, Node built-ins, zero dep): **console 0 erros/0 exceções** através de todas as trocas de estado; rito nível 3 completo (consequência real → pausa 500ms `aria-disabled` → liberação → deep_link real → volta); geometria da assinatura MEDIDA e batendo com a escala; **zero recursos externos**; `prefers-reduced-motion` re-verificado após o ciclo: pulso, animação da fenda, revelação da placa e transições TODOS `none`/0s.
- `screenshot.png` (1280×800, em-alvo real de hoje) e `screenshot-states.png` (acima-do-alvo: fenda selada, pino no lado caro, lado frio espelhado, placa rasa) — regenerados PÓS-correção e inspecionados: corrente régua→haste→corpo contínua nos dois estados, selo de frescor integral, matriz sem intrusos.

## Limites honestos / desvios

1. **Playwright MCP indisponível** (profile em uso por sessão concorrente) — validação via Chromium isolado + CDP, mesmo rigor, transporte diferente. Driver no scratchpad, fora dos deliverables.
2. **Tendência = mercado agregado** (obs. 3 do gate) — rotulada na UI: "mercado agregado · +0,02 %/hora · não é a tendência desta rota" (saída real do `analyze.py` hoje).
3. **Switcher de demonstração re-encena o VEREDITO/régua/fenda, não a matriz** — a matriz permanece a REAL de hoje em todos os estados demo (no `acima-do-alvo` demo a linha €948 continua marcada em-alvo porque ela é real). Num relatório real acima do alvo, nenhuma linha estaria marcada. `vazio` demo idem: a matriz não se esvazia.
4. **Assinatura plena é desktop-primeiro** (lacuna declarada do §1): <900px a composição desce ao fluxo legível (placa estática, fenda recolhida, trilhos e régua mantidos em %) — a hierarquia de leitura sobrevive, o gesto pênsil não.
5. **Estudos são esboços** — `studies.html` usa hex cru inline e posições literais de propósito (rascunho estrutural); está isento das regras de assinatura, e rotulado como tal no próprio arquivo.
6. **A haste é 1px por spec** ("haste-pino hairline visível") — cor `texto-medio`, agora CONTÍNUA da linha da régua ao corpo (104px no estado aceso). Se o diretor quiser mais peso, é 1 token (`--v1t-dimensao-fio` na regra da haste).
7. **Interpenetração medida exclui o rito fechado** (display:none → sem bbox) e considera a placa + descendentes como o único plano licenciado (G3). O corte-limiar termina exatamente na borda da matriz (bottom: 0 do campo) — toca, não interpenetra; a continuação sobre a matriz é fundo do próprio bloco, não elemento.
8. **A validação agora mede as afirmações, não proxies** — consequência direta da observação 2 do juiz; o harness (scratchpad) carrega as métricas do juiz verbatim (vão da haste, elementFromPoint no selo, varredura de intrusos na matriz, alinhamento tick↔escala).
