# GATE-VERDICT — gen-001 · flight-watcher

> **Papel:** JUIZ FRIO (adversarial, sem acesso ao histórico do maker).
> **Data:** 2026-07-06.
> **Documento julgado:** `~/v1truvio/proofs/gen-001/BRIEF.md` (Design Brief, maker).
> **Mente aplicada:** CONTRACT · MANIFESTO · VECTORS · MODES + cards citados (rams, tadao-ando, lissitzky, moholy-nagy, stuart-hall; + detournement e teenage-engineering lidos para julgar os itens 5/10 e a exclusão declarada).
> **Escopo da verificação factual (read-only) no repo `~/flight-watcher`:** li `analyze.py`, `config.toml`, `flightwatch/storage.py`, `flightwatch/report.py`, `flightwatch/engine.py`, `run.py`; consultei `data/history.sqlite` (tabela `prices`); inspecionei o relatório real `reports/passagens-20260706-1017.html`. **NÃO** abri `secret.toml` (proibido).

---

## Etapa 0 — Conformidade estrutural

Verifico as exigências do CONTRACT antes do gate.

| Exigência estrutural | Estado | Nota |
|---|---|---|
| 9 seções na ordem do pipeline (`operador`→`maquina`→`modo`→`vetores`→`referencias`→`planos`→`atrito`→`sistema`→`prova`) | **OK** | §1 a §9 presentes, na ordem exata. |
| Perfil de 6 vetores completo, cada eixo com justificativa de 1 linha | **OK** | §4: Tat 3 · Den 7 · Geo 6 · Sin 2 · Ent 2 · Cer 3, cada um com justificativa. Nenhum eixo em branco. |
| Modo único justificado; híbrido só como modo-base + acento declarado em zona específica | **OK** | §3: base **Laboratório** (justificada em 1 linha), acento **Equipamento médico/científico** restrito à zona do rito de compra (§7). Conforme a regra de híbrido do MODES. |
| 3–5 cards formais com lei extraída + zona | **OK** | §5: 5 cards (rams, tadao-ando, lissitzky, moholy-nagy, stuart-hall), cada um com lei (não aparência) e zona. Exclusões justificadas (teenage-engineering, detournement-como-card). |
| Mapa de consequência presente porque cerimonialidade > 0 | **OK** | Cer = 3 > 0 → §7 traz a tabela de consequência (1 ação com rito: "Iniciar compra", nível 3) + declaração explícita do que permanece fluido. |
| Rastreabilidade nas decisões não-óbvias do sistema visual | **OK** | §8 carrega `[card:…]`/`[lei:N]`/`[vetor:X=n]`/`[modo]`/`[impl:lacuna]` em cada decisão; índice de origens ao final. |

**Veredito estrutural: VÁLIDO.** O brief chega ao gate.

---

## Etapa 1 — Os 12 itens do gate

Checklist binário do CONTRACT ("GATE ANTI-PADRÕES"). **PASSA** = anti-padrão ausente. **REPROVA** = anti-padrão presente (qualquer SIM à pergunta).

| # | Pergunta resumida | Veredito | Evidência citada |
|---|---|---|---|
| **1** | Elemento luminoso/animado sem mudar entendimento nem ação? | **PASSA** | §6 e §8: a única "luz" é a fresta quente reservada ao veredito-em-alvo e ao gesto de compra (`[card:tadao-ando]`); o único movimento contínuo é o "pulso de frescor" — e ele **sinaliza estado real** (daemon batendo a cada 30 min → confirmado por `com.local.flightwatch.plist` e 371 coletas no DB). §6 "Verificação Lei 1" remove explicitamente rota decorativa, contador-vaidade e blob de deep_link. Nenhum brilho/animação órfão de função. |
| **2** | Telemetria sem fonte real no sistema? | **PASSA** | Verificação factual item a item confirmou TODAS as fontes: veredito de oportunidade = thresholds `[alert]` RT≤960/OW≤900 (`config.toml:25-26`, lógica em `run.py:42-49`); melhor oferta atual = `MIN(price)` da varredura (report real); posição histórica "Mín. já visto" = `storage.historical_min` (`storage.py:32-39`, coluna no `report.py:28,75`); tendência = slope %/hora normalizado pela mediana do trecho (`analyze.py:23-32,114-117`); frescor+confiança = `ts` + honestidade estatística "<48h = RUÍDO / confiável ~5-7 dias" (`analyze.py:119-125`, texto literal). §2 declara "Zero telemetria decorativa" e nega explicitamente "confiança do modelo" fabricada / "N pessoas viram" / progresso de scraping / mapa pulsante — nenhum desses aparece no design. **Nenhuma telemetria proposta sem fonte real.** |
| **3** | Atrito em ação sem consequência (buscar, ler, navegar, fechar dica)? | **PASSA** | §7: abrir, ler, investigar, alternar RT/OW, varrer a matriz — todos declarados **fluidos, cerimonialidade 0**. O único atrito (nível 3) recai sobre "Iniciar compra" — ação com consequência financeira real (~€1000, sai para o Google Flights). §7 é explícito: "nenhum rito em abrir, ler, investigar, alternar, fechar"; o selo "amostra é ruído" **informa, não bloqueia**. |
| **4** | Rito não listado no mapa de atrito? | **PASSA** | §7 lista exatamente 1 ação com rito (compra, nível 3). Nenhum outro rito aparece em §6/§8/§9 — a "leitura de consequência" da §9 é a materialização desse mesmo nível-3, não um segundo rito. Confirmação/pausa não surgem em nenhuma outra zona. |
| **5** | Referência como aparência literal (cartaz soviético, concreto fake, botão fofo, terminal falso)? | **PASSA** | §5 e §8 extraem **lei**, não aparência, e nomeiam+barram cada clichê: Lissitzky "traduzido em peso e eixo, NÃO em vermelho/preto de cartaz soviético" (Lei 3); Ando "não é dark mode premium genérico — a escuridão tem função"; Rams "barra app de viagem com badge fofo". Confere com os cards lidos (o campo "evitar"/"risco de clichê" de cada um é respeitado). Nenhuma referência entra como pastiche visual. |
| **6** | Lê como "cyberpunk genérico / military UI / painel de nave"? | **PASSA** | Modo Laboratório proíbe "estética de guerra" e "alarme permanente" (§3), e o resultado descrito é "bancada calma em penumbra" sem HUD/sirene/vermelho pulsante (§3, §6, auto-nota 6). Geometria fixada em 6 (não 8+ ortogonal-militar) justamente para evitar militarização (§4). Ausência de telemetria decorativa (item 2) remove o vocabulário "painel de nave". |
| **7** | Zona densa não responde a pergunta do operador? (trava de densidade) | **PASSA** | Den = 7 dispara a trava de zona (VECTORS §2). Cumprida: cada zona declara por escrito sua pergunta — §6 Foreground ("estou em oportunidade agora?", "como eu ajo?", "e se a volta em aberto?"), Midground ("quão bom contra tudo que já vi?", "vale esperar?", "posso confiar nesta leitura?", "quais cenários e quanto custam?"). §8 acessibilidade reafirma "zona sem pergunta foi removida". Nenhuma zona densa muda de estado. |
| **8** | Dado crítico oscila decorativamente? (trava de entropia) | **PASSA** | Ent = 2. §4, §6 e §8 são explícitos e repetidos: "preço, piso e veredito NUNCA oscilam" (trava de entropia); o único elemento que respira é o pulso de frescor, **sobre dado NÃO-crítico**. §8 Motion: mudança de preço entre gerações é mostrada como fato (novo valor + delta), não como número girando. Consistente com o acento médico (proíbe entropia alta). |
| **9** | Grid/bento/linhas como decoração, sem hierarquia de decisão? | **PASSA** | §8 Grid: a assimetria do Foreground é **funcional** — o bloco-veredito é deslocado para receber o peso da UMA decisão dominante (`[card:lissitzky]`), e a matriz volta a grid ortogonal calmo. §8 marca "a assimetria é funcional (direção de leitura/hierarquia de decisão), não decorativa — cumpre a trava de geometria" (`[lei:1]`). Confere com a trava de geometria (Geo 6 < 8, mas a diagonal/tensão declarada é de hierarquia, não ornamento). |
| **10** | Nostalgia como cosplay de época, não memória sensorial? | **PASSA** | §1 escolhe deliberadamente a memória do "instrumento de bancada que registra" (log honesto, mostrador com histórico) e **recusa** a memória do "app de viagem" (Kayak/Skyscanner com selo "melhor preço!"). Auto-nota 10 e ausência de qualquer motivo retrô (CRT/disquete/skeuomorfismo) confirmam: zero cosplay de época. |
| **11** | Proibição do modo escolhido foi violada? (Modo) | **PASSA** | Laboratório proíbe **alarme permanente** e **estética de guerra**: §3 resolve o produto EM ALERTA sem vermelho pulsante/sirene — a oportunidade é "fresta+etiqueta", comunicada por hierarquia e um único marcador (a linha em-alvo recebe marcador discreto, não fundo gritante — §6/§8). O acento médico (zona de compra) proíbe **entropia alta / humor visual / ambiguidade de estado**: entropia lá é 0, estados são rotulados por texto explícito ("EM ALVO"/"acima do alvo"/"desatualizado"), sem ambiguidade (§8 estados + edge cases). Nenhuma proibição violada. |
| **12** | Som/motion sem opção de desligar, ou `prefers-reduced-motion` ignorado? | **PASSA** | §8 Som/haptic: **nenhum** som nesta superfície (Sin 2; o canal sonoro do produto vive fora, no Telegram/notificação nativa — confere com `config.toml:33-38` e `run.py:168-180`). §8 Motion + §9 + auto-nota 12: "`prefers-reduced-motion` → desliga pulso e transições, mantém tudo legível estático". Trava de sinestesia/entropia cumprida. |

**Contagem: 12 PASSA · 0 REPROVA.**

---

## Etapa 2 — Juízo de coerência (observações; não reprovam)

Três notas para o diretor — coisas que o binário não captura, nenhuma delas invalida o brief:

1. **Card `detournement` citado numa decisão sem ser puxado como card formal.** §5 lista 5 cards e declara detournement **fora** do conjunto formal ("fica implícito… não puxo o card inteiro"). Porém §7 e §8 (componente 7) invocam a lei do detournement ("o link vira passagem consciente" / `[card:07-detournement (implícito)]`) numa decisão de design real. É coerente com a regra dos 3–5 cards e a lei citada existe de fato no card lido, mas há uma leve tensão de fronteira: uma lei de card não-formal está governando o rito de compra. A lei de stuart-hall ("revelar consequência ANTES da ação") já sustenta sozinha essa decisão, então o brief não depende do detournement — mas o diretor pode querer que detournement seja o 6º card formal OU que a citação implícita seja absorvida por stuart-hall, para não deixar lei órfã de card.

2. **Geometria declarada 6, mas o sistema visual invoca vocabulário construtivista forte (Lissitzky/Moholy-Nagy) que costuma implicar valor mais alto.** §8 descreve "placa pesada", "tensão assimétrica", "eixo deslocado", "peso construtivista" — linguagem de geometria 7–8. O brief se protege bem (justifica 6 como "organiza e aponta sem comandar", reserva a assimetria ao só Foreground e devolve a matriz a grid ortogonal calmo), e a trava de geometria só morde em ≥8. Não é violação; é um ponto onde o valor declarado e a intensidade retórica do sistema visual ficam no limite — vale conferir na prova se a "placa Lissitzky" renderizada ainda lê como 6 (bancada) e não escala para 8 (construtivismo industrial).

3. **A prova (§9) delega a tendência real a uma chamada de `analyze.py` na geração, mas hoje `analyze.py` imprime a tendência global agregada, não por-rota.** Verifiquei: `analyze.py:114-117` computa UM slope sobre o preço relativo de todos os trechos com 2+ leituras (não um slope específico do RT MXP⇄GRU 13/07→27/07). O brief pede "rótulo sub/cai/estável… chamar `analyze.py` ou computar o slope na geração" e prevê o estado "estável" — factualmente coerente com o que o código entrega hoje, mas o implementador deve saber que a tendência disponível é a **do mercado agregado**, não a da linha exata do veredito. Não é telemetria falsa (a fonte existe e é honesta); é uma nota de granularidade para o diretor/implementador, não um defeito do brief.

---

## VEREDITO FINAL: **APROVADO**

**12 PASSA · 0 REPROVA.** Estrutura válida (9 seções, perfil completo, modo+acento conforme, 5 cards, mapa de consequência presente, rastreabilidade). Todas as fontes de telemetria (item 2) foram verificadas contra o repo real `flight-watcher` e existem de fato no código (`analyze.py`, `config.toml [alert]`, `storage.historical_min`, `report.py`, schema `prices`); todos os fatos de estado citados (6.623 cotações · 371 varreduras · 10,43 dias · só LATAM direto · piso RT €912 / OW €796 · atual RT €948 / OW €1004 · matriz de 18 cenários €948→€1847 · datas 13/07→27/07 · EM ALERTA) batem com `data/history.sqlite` e o relatório real de hoje. Nenhum anti-padrão presente.

O brief pode seguir para a etapa de prova (frontend real sob o padrão uiproof do repo-alvo). As 3 observações de coerência acima são notas para o diretor, não bloqueios.

— Assinado: o juiz frio, 2026-07-06.
