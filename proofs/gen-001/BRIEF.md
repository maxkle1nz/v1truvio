# DESIGN BRIEF — gen-001 · flight-watcher

> **Mente:** O Novo Uomo Vitruviano. **Papel:** MAKER (não aplico o gate — auto-checagem abaixo é rascunho interno).
> **Produto:** monitor local de preço de passagem MXP→GRU, 100% local, usuário único = o dono/construtor.
> **Caso:** FUNDAÇÃO (sem identidade visual estabelecida — hoje a saída é um `<table>` de sistema).
> **Precedência em conflito:** Leis > Modo > Vetores > Cards.
> **Estado real citado (verificado hoje 2026-07-06):** 6.623 cotações · 371 varreduras · janela 25/06→06/07 (~10,4 dias) · só LATAM opera direto · mín. histórica RT €912 / OW €796 · agora RT €948 (ABAIXO do alvo €960 → produto EM ALERTA).

---

## 1. `operador` — Diagnóstico do operador

**Quem opera.** Uma única pessoa: o dono do sistema, que também o construiu. Não é "usuário" de um SaaS — é o operador no sentido pleno do manifesto: ele calibrou os alvos (€960/€900/−10%), leu os sinais por 10 dias, e é ele quem **assume o risco financeiro** da decisão. A interface deve tratá-lo como quem comanda uma máquina que ele entende, não como quem consome um feed.

**O que ele está fazendo, por ato (o operador troca de modo dentro da mesma tela):**
- **LENDO / CONSUMINDO** — 90% das visitas: abre o relatório "algumas vezes por dia, em janelas curtas, entre outras tarefas", só para saber *como está*. Aqui a máquina não pode exigir nada dele. **Zona de recuo.**
- **INVESTIGANDO** — quando o número mexe: "€948 é bom mesmo? Ou já vi melhor? Está subindo ou caindo? Vale esperar?". Aqui ele precisa de contexto que hoje o relatório esconde (o piso histórico, a tendência, a idade do dado).
- **DECIDINDO / ARRISCANDO** — o momento raro e caro: sair do watcher e comprar (~€900-1000, irreversível, a tarifa pode sumir). A compra acontece FORA do produto (o deep_link abre o Google Flights) — mas **a decisão nasce aqui**. É o único ponto de consequência real da interface.

**Estado emocional provável.** Duas camadas:
- *Base (a maioria das visitas):* pressa e distração — ele está entre tarefas, olhando de relance. Precisa da resposta em <2 segundos: "estou em oportunidade ou não?".
- *Pico (quando decide):* tensão de arrependimento. A promoção de €796 já passou e não voltou; ele sabe que esperar pode significar perder, e comprar cedo pode significar pagar a mais. Ansiedade real, legítima, ligada a dinheiro dele. **A interface não pode amplificar essa ansiedade** (Lei 1 / trava de entropia) — mas também não pode anestesiá-la (Stuart Hall): tem de devolver agência dando o contexto que torna a decisão *consciente*.

**Memória geracional deste operador.** Ele é dev, power-user de terminal, Rust/Python, roda isto por `launchd` e lê `sqlite3` na mão. A memória sensorial certa NÃO é a do "app de viagem" (Kayak/Skyscanner com carrossel e selo "melhor preço!" — exatamente a passividade que Stuart Hall manda romper). É a memória do **instrumento de bancada que registra**: o log honesto, o mostrador que diz o valor *e* o histórico, o painel que assume que quem lê sabe ler. Ele confia em número cru com procedência, desconfia de badge de marketing.

**Regra do recuo — zonas declaradas.** Onde o operador só consome, a interface recua:
- A leitura da **melhor oferta atual + veredito** (seções §6 Foreground) é a única coisa que exige atenção na visita comum; tudo mais fica quieto até ele investigar.
- A **tabela completa da matriz de datas** (18 cenários) é referência de consulta — está presente, legível, mas *não pede olhar*; é midground, sem cor de alarme espalhada.
- **Nenhuma** interação, confirmação, animação ou som acontece na simples abertura do relatório. Abrir e ler é gratuito e silencioso (Lei 2: fluidez preservada para leitura).

**Lacuna declarada.** Não tenho medida de com que frequência exata ele abre o relatório, nem se ele o abre no desktop (arquivo HTML local) ou espelhado no celular. Assumo **desktop-primeiro** (o relatório é gerado como arquivo local no Mac; o celular recebe o *alerta* Telegram, não o relatório) e projeto a prova para leitura em tela de Mac, com o layout degradando de forma legível em telas estreitas (§8 acessibilidade). Se o consumo real for majoritariamente mobile, a hierarquia do Foreground se mantém, mas a densidade da matriz precisaria de revisão — sinalizo isso como risco, não invento o fato.

---

## 2. `maquina` — Diagnóstico da máquina

**O que a máquina processa de verdade.** Um scraper agendado que, a cada 30 min, varre uma matriz de datas flexíveis no Google Flights (fast-flights), grava cada cotação no SQLite (`ts, origin, destination, trip, depart_date, return_date, price, airlines, stops, deep_link`) e, por varredura, decide se algum preço cruzou um dos três gatilhos de alerta. **Ela não vende nada** — informa e recomenda; a compra é um deep_link para fora. O valor da máquina não é "mostrar preços de agora": é ter **acumulado 10 dias de verdade** e saber coisas que uma busca única no Google não sabe.

**Estados que PRECISAM ser visíveis** (cada um aponta para dado real no sistema — teste de honestidade aplicado):
1. **Melhor oferta atual, por tipo** (RT e OW) — o que a última varredura achou de menor. *Fonte: `MIN(price)` da varredura corrente, por `trip`.* Já existe no report.
2. **Veredito de oportunidade** — o preço atual está em alvo? (RT≤960 / OW≤900). *Fonte: os thresholds de `[alert]` cruzados com o preço atual — é literalmente o que dispara a notificação.* **Este é o dado que o operador vem buscar** e que hoje aparece só como uma linha de texto "🔔 1 alerta".
3. **Posição contra o próprio histórico** — este €948 é o piso? Está a quanto da mínima de sempre (€912) e da promoção fantasma (€796)? *Fonte: `MIN(price)` histórico por rota (a coluna "Mín. já visto" já existe no report) + mínima global por tipo.* Hoje está subaproveitado: "Mín. já visto €948" numa célula, sem contraste, sem contexto de quão bom isso é.
4. **Direção do mercado** — subindo, caindo ou estável? *Fonte: `analyze.py` já calcula a tendência como slope %/hora sobre preço normalizado pela mediana do trecho.* É o dado que responde "vale esperar?".
5. **Frescor + confiança do dado** — de quando é esta leitura, e a amostra já é confiável ou ainda é ruído? *Fonte: `ts` da última varredura + a HONESTIDADE ESTATÍSTICA de `analyze.py`, que declara "só Xh de dados — padrão ainda é RUÍDO" abaixo de 48h e "sinal confiável ~5-7 dias".* **Este é o estado mais anti-cosplay do sistema:** a máquina sabe quando não sabe, e diz.

**O que permanece invisível (para não virar ruído).** A mecânica do scraping — o contorno do consent do Google, o token `escs`, o `sleep_seconds`/jitter, o parser do donor, os 371 ciclos individuais, os deep_links `tfs=` (ficam atrás do gesto "comprar", não expostos como blob). O operador **construiu** isso; não precisa vê-lo operando. Mostrá-lo seria teatro técnico (Lei 1). A única exceção é o frescor (item 5): *que* a máquina rodou e *quando* importa; *como* ela roda, não.

**O que deve parecer vivo, material ou conectado — e por quê.**
- **Vivo:** só o frescor do dado — "última leitura há 12 min", com o entendimento de que atrás dela há um processo que respira a cada 30 min. Isso é vida honesta (há um daemon real batendo). Nada mais pisca.
- **Material:** o preço-veredito deve ter **massa** — ser o objeto pesado da tela, não um número num carrossel. É a decisão de ~€1000; carrega peso visual à altura (Lissitzky/Ando).
- **Conectado:** o gesto de compra é o único ponto onde a interface toca o mundo externo (Google Flights, dinheiro real). Essa "saída da máquina para o mundo" merece ser sentida como uma passagem, não como um link qualquer (Détournement: o link de checkout vira gesto).

**Teste de honestidade — resultado.** Toda telemetria acima aponta para um estado real e computável do sistema (SQLite / `[alert]` / `analyze.py`). **Zero telemetria decorativa proposta.** Em particular: sem "confiança do modelo" fabricada, sem "N pessoas viram este preço", sem barra de progresso de scraping animada, sem mapa-múndi com rota pulsante. A máquina só mostra o que ela de fato mediu.

---

## 3. `modo` — Modo escolhido

**LABORATÓRIO** — bancada de experimento vivo.

**Justificativa (uma linha):** a máquina não pilota nada em tempo real (não é Cockpit tático — não há risco a *operar* segundo-a-segundo, o modo mais abusado da mente e que eu recuso aqui); ela **observa preço ao longo do tempo, acumula amostra e revela padrão** — é literalmente uma bancada que mede um fenômeno e cuja honestidade estatística é o núcleo (`analyze.py` avisa quando ainda é ruído), então a máquina certa é o laboratório.

**Bias do modo aplicado (ponto de partida antes da calibração fina):** Densidade +2, Entropia +1.

**Acento de um segundo modo (híbrido declarado, permitido pela regra "modo-base + acento em zona específica"):** no **único** gesto de compra — a passagem para fora, ~€1000, irreversível — aplico um acento de **Equipamento médico/científico** (Cer +1, clareza acima de tudo, ambiguidade de estado proibida). Não milito a tela inteira: o acento vive só na zona do rito de compra (§7), onde a consequência é real. O resto permanece bancada calma.

**Proibições do modo (entram no gate como lei):** proibido *alarme permanente* e *estética de guerra*. Consequência de projeto: mesmo com o produto AGORA em estado de alerta (€948 < €960), o "alerta" não pode ser um vermelho pulsante permanente nem sirene — é a bancada sinalizando um achado, não uma sala de guerra soando. O estado de oportunidade é comunicado por **hierarquia e um único marcador**, não por alarme sustentado.

---

## 4. `vetores` — Calibração

Bias de Laboratório (Den +2, Ent +1) + acento médico na zona de compra (Cer +1) aplicados como ponto de partida; calibração fina abaixo. Perfil final:

| Vetor | Valor | Justificativa (uma linha) |
|---|---|---|
| **Tactilidade** | **3** | O operador lê 90% do tempo e a compra é um único gesto de saída — não há o que manipular continuamente (sem knobs/sliders), então bastam estados claros e um botão honesto com massa; tactilidade alta aqui seria toy UI sem função. |
| **Densidade informacional** | **7** | Ele vem investigar "€948 é bom? sobe ou desce? o dado é confiável?" — precisa de veredito+piso+tendência+frescor densos e simultâneos (base Laboratório +2), mas não de console operacional; **≥7 dispara a trava de zona, cumprida no §6/§8** (cada zona declara a pergunta que responde). |
| **Geometria** | **6** | Há UMA decisão dominante (comprar/esperar) que pede peso e direção construtivistas (Lissitzky/Moholy-Nagy) para hierarquizar, mas o produto é leitura calma de bancada — ortogonal-industrial (8+) seria militarização que o modo proíbe; 6 organiza e aponta sem comandar. |
| **Sinestesia** | **2** | Leitura entre-tarefas em tela local não pede som nem haptic (não há celular no loop de leitura — o alerta sonoro já mora no Telegram/notificação nativa, fora desta superfície); ficam só microanimações visuais de estado, sempre desligáveis por `prefers-reduced-motion`. |
| **Entropia viva** | **2** | Base Laboratório +1 sobre um piso baixo: o **único** sinal que pode respirar é o pulso de frescor do dado (há um daemon real batendo a cada 30 min); **preço, piso e veredito NUNCA oscilam** (trava de entropia — são exatamente os números que o operador lê para decidir dinheiro). |
| **Cerimonialidade** | **3** | A leitura é instantânea e gratuita (0 de rito para abrir/consultar — Lei 2); só o gesto de **compra** recebe rito, e leve: uma confirmação consciente que revela a consequência antes de sair para o Google Flights (acento médico +1). Não é ritual de autorização (8) — a interface não vende, só faz a passagem consciente; rito maior seria atrito sem consequência proporcional dentro do produto. **Mapa de consequência obrigatório no §7.** |

---

## 5. `referencias` — RAG (cards e leis extraídas)

Cinco cards. De cada um, a **lei** (nunca a aparência) e a **zona** onde age.

1. **[card:rams] Dieter Rams Reavaliado** — *Lei:* todo elemento justifica presença por função, estado ou clareza (honestidade funcional radical, não minimalismo branco). *Zona:* a tela inteira, como freio permanente — é o card que segura a densidade 7 e a tactilidade em honestidade. Cada célula da matriz, cada label ("piso", "há 12 min") existe porque responde a uma pergunta; se não responde, sai. Rams também barra o risco de "app de viagem com badge fofo".

2. **[card:tadao-ando] Tadao Ando** — *Lei:* profundidade nasce da relação entre massa escura e fresta de luz; a luz só significa porque a sombra existe; o resto da tela aceita ser massa. *Zona:* Background + Foreground. O fundo é matéria escura e quieta (bancada em penumbra); a **luz** (contraste, cor) é reservada ao ponto de ação — o preço-veredito e o gesto de compra. Isso resolve o "alerta sem alarme": a oportunidade é uma **fresta iluminada**, não um vermelho espalhado. *(Prova de campo já validada: Focus Slit Mode do VERITAS//COLUMN.)*

3. **[card:lissitzky] El Lissitzky / Prouns** — *Lei:* a composição tem massa, tensão e direção espacial; o peso visual aponta para onde está a decisão. *Zona:* Foreground. Há UMA decisão dominante na tela → o bloco do veredito é a **placa pesada** que ancora tudo, deslocada e assimétrica o suficiente para que o olho caia nela primeiro. Traduzido em peso e eixo, **não** em vermelho/preto de cartaz soviético (risco de clichê barrado pela Lei 3).

4. **[card:moholy-nagy] László Moholy-Nagy** — *Lei:* tipografia e linhas são forças de orientação, não decoração; o texto tem vetor, a leitura tem trajetória. *Zona:* Foreground→Midground, a trilha de leitura. A hierarquia se lê como trilho: **veredito → piso/tendência → matriz completa**, guiada por peso tipográfico e uma direção visual clara, para que o operador apressado siga o vetor em <2s sem se perder na densidade.

5. **[card:stuart-hall] Stuart Hall / Codificação-Decodificação** — *Lei:* toda interface codifica quem o humano deve ser; projete a leitura que devolve agência, não a que fabrica passividade; revele consequência ANTES da ação. *Zona:* a semântica do veredito e o rito de compra. O padrão da indústria (Skyscanner: "PREÇO BAIXO! compre já!") fabrica urgência passiva; aqui a interface diz a **verdade calibrada** — "€948, €36 acima do seu piso histórico, tendência estável, dado confiável" — e deixa o operador decidir. É o antídoto direto contra a ansiedade de arrependimento: agência por informação honesta, não empurrão.

**Cards deliberadamente NÃO usados e por quê:** *Teenage Engineering* (não há criação/calibração tátil contínua — tactilidade 3 não sustenta knobs); *Détournement* como card estrutural fica implícito no gesto de compra (o link vira passagem), mas não puxo o card inteiro para não flertar com "culture jamming" panfletário num produto de uso pessoal — a lei de Stuart Hall já cobre a devolução de agência sem risco de manifesto na tela (Lei 3).

---

## 6. `planos` — Três planos (todo elemento atribuído a UM plano)

**FOREGROUND** — ação humana imediata, maior contraste, a fresta de luz:
- **Bloco-veredito** (a placa Lissitzky): a melhor oferta atual RT + o **veredito de oportunidade** ("EM ALVO" / "acima do alvo") como o objeto de maior peso e único ponto luminoso da tela. Responde: *"estou em oportunidade agora?"* [Foreground]
- **Gesto de compra** da melhor oferta: o botão honesto que inicia o rito de saída para o Google Flights. Único ponto de consequência. Responde: *"como eu ajo sobre isto?"* [Foreground]
- **Melhor OW atual**, secundário ao RT mas ainda em foco (o operador tem dois cenários vivos: ida-volta e volta-em-aberto). Responde: *"e se eu deixar a volta em aberto?"* [Foreground]

**MIDGROUND** — contexto, telemetria honesta, controles secundários (massa legível, sem luz de alarme):
- **Barra de posição histórica**: atual €948 · piso de sempre €912 · promoção fantasma €796, com a distância explícita ("+€36 do seu piso"). Responde: *"quão bom é este preço contra tudo que já vi?"* [Midground]
- **Indicador de tendência**: subindo / caindo / estável (do slope de `analyze.py`). Responde: *"vale esperar?"* [Midground]
- **Selo de frescor+confiança**: "leitura de há 12 min · amostra: 10 dias, confiável" OU "amostra ainda curta — padrão é ruído" (direto da honestidade estatística). Responde: *"posso confiar nesta leitura?"* [Midground]
- **Matriz completa** dos 18 cenários (a tabela atual, redesenhada): referência de consulta, legível, sem cor de alarme espalhada; a linha em alvo recebe um marcador discreto, não fundo gritante. Responde: *"quais são todos os meus cenários de data e quanto custam?"* [Midground]

**BACKGROUND** — atmosfera, matéria, luz/sombra, respiração lenta:
- **Superfície-bancada**: fundo material escuro e quieto (Ando) contra o qual a fresta do veredito ganha profundidade. Não é textura decorativa — é a massa que faz a luz significar. [Background]
- **Pulso de frescor** (respiração única do sistema): uma marcação sutil no selo de frescor que indica que há um processo vivo por trás (daemon a cada 30 min). Entropia 2 — o único elemento que respira, e sobre dado NÃO-crítico. [Background]

**Verificação Lei 1:** nenhum elemento sem plano. Removidos por não terem plano/função: rota decorativa no mapa, contador de "371 varreduras" como vaidade, blob de deep_link visível, qualquer selo de marketing.

---

## 7. `atrito` — Mapa de atrito

**Princípio:** fricção só onde há consequência (Lei 2). Neste produto há **exatamente um** ponto de consequência real — a decisão de comprar (~€1000, irreversível, sai do produto para o mundo). Todo o resto é leitura e permanece **fluido**.

### Onde a interface permanece FLUIDA (zero atrito — cerimonialidade 0):
- **Abrir e ler o relatório** — gratuito, silencioso, instantâneo. Nenhuma confirmação, nenhum gate, nenhum som.
- **Investigar** — ler o piso histórico, a tendência, o frescor, percorrer a matriz de 18 cenários. Exploração é livre (Lei 2 explícita: nunca atrito em busca/leitura/navegação).
- **Alternar entre RT e OW**, ordenar/varrer a tabela — navegação pura, sem rito.

### Onde haverá ATRITO — mapa de consequência (obrigatório porque cerimonialidade > 0):

| Ação | Consequência | Nível | Rito |
|---|---|---|---|
| **Iniciar compra** (clicar "comprar" na melhor oferta) | Sai do produto para o Google Flights com dinheiro real em jogo (~€1000), tarifa pode mudar/sumir, escolha de datas se concretiza | **3** (confirmação consciente, leve) | Antes de abrir o deep_link, uma **leitura de consequência** de uma linha revela o que ele está prestes a fazer — *"€948 ida-volta 13/07→27/07, LATAM direto · €36 acima do seu piso · você sairá para o Google Flights para confirmar"* — com a saída como gesto deliberado (Stuart Hall: consequência ANTES da ação; Détournement: o link vira passagem consciente). **Não** é modal de autorização de senha; é uma pausa de meio-segundo que troca clique-reflexo por escolha. |

**Por que 3 e não mais:** o produto **não** executa a compra (não há irreversibilidade *dentro* dele — a irreversibilidade mora no Google Flights, depois). Rito 5/8/10 aqui seria atrito desproporcional à consequência que a *interface* controla → reprovaria na Lei 2. Rito 0 (link nu) desperdiçaria o único momento onde consciência importa e devolveria o operador à passividade de checkout que Stuart Hall condena. **3 é o ponto calibrado.**

**Atrito que NÃO existe (declarado para o gate):** nenhum rito em abrir, ler, investigar, alternar, fechar. Nenhuma confirmação para consultar histórico. O selo "amostra ainda é ruído" **informa**, não bloqueia — não é atrito, é honestidade.

---

## 8. `sistema` — Sistema visual

Toda decisão não-óbvia carrega origem. Onde eu declaro um valor concreto (hex, px) sem base no diagnóstico, marco como **[impl:lacuna]** — cabe ao implementador fechar dentro da direção, não é lei.

### Material dominante
Superfície de **bancada em penumbra**: plano escuro, mate, quieto, que aceita ser massa — a luz (contraste/cor) é gastada só no ponto de ação. `[card:tadao-ando]` `[vetor:entropia=2]`. Não é "dark mode premium" genérico (risco de clichê do Ando barrado): a escuridão tem *função* — é a sombra que faz a fresta do veredito significar. `[lei:1]`

### Paleta (por função, não por gosto)
- **Fundo/massa:** grafite quase-preto, mate, uma família de cinzas para hierarquia de midground. A maior parte da tela vive aqui. `[card:tadao-ando]` `[card:rams]`
- **Luz de ação (a fresta):** UMA cor quente de alta legibilidade reservada ao veredito-em-alvo e ao gesto de compra. Aparece **só** quando há oportunidade e **só** no Foreground. `[card:tadao-ando]` `[modo]` (Laboratório proíbe alarme permanente → a cor é evento, não ambiente).
- **Veredito "acima do alvo" (estado neutro):** o mesmo bloco em tom frio/apagado, sem a luz quente — comunica "não é hora" pela *ausência* de luz, não por vermelho de erro. Distingue estados por presença/ausência de luz (Ando), não por semáforo. `[vetor:sinestesia=2]`
- **Texto:** alto contraste para o veredito e o preço; contraste médio-honesto para labels de midground (legível, não gritante). `[card:rams]` `[vetor:densidade=7]`
- **Sem** vermelho de alarme permanente, sem verde "sucesso!" de recompensa, sem gradientes de marketing. `[modo]` `[card:stuart-hall]`
- **[impl:lacuna]** os hex exatos — a direção fixa a *relação* (massa escura mate × uma fresta quente legível, um estado frio para "não é hora"); os valores fecham no design system, respeitando contraste AA (§acessibilidade).

### Tipografia
- **Preço-veredito:** o maior peso da tela, tabular (dígitos alinham — é dinheiro, precisa comparar coluna). Tratado como objeto material, não como texto. `[card:lissitzky]` `[card:moholy-nagy]`
- **Trilha de leitura:** hierarquia que se lê como trilho — veredito (peso máximo) → posição/tendência/frescor (peso médio) → matriz (peso de dado). O peso tipográfico *é* o vetor de leitura. `[card:moholy-nagy]` `[vetor:geometria=6]`
- **Labels técnicos** ("piso", "há 12 min", "confiável"): etiqueta honesta, compacta, sem enfeite. `[card:rams]`
- **Números tabulares/monoespaçados** nas colunas de preço da matriz para varredura vertical rápida. `[card:rams]` `[vetor:densidade=7]`
- **[impl:lacuna]** famílias tipográficas exatas — a direção exige (a) dígitos tabulares e (b) um grotesco legível de bancada; as fontes concretas ficam a critério do design system.

### Grid
Grid modular-funcional com **tensão assimétrica** no Foreground: o bloco-veredito é deslocado do eixo central e recebe mais peso/área que sua "vizinhança", para que o olho caia nele primeiro (a placa Lissitzky). A matriz volta a um grid ortogonal calmo (tabela honesta). `[card:lissitzky]` `[vetor:geometria=6]`. A assimetria é **funcional** (direção de leitura/hierarquia de decisão), não decorativa — cumpre a trava de geometria. `[lei:1]`

### Assinatura formal *(emenda pós-verdict 001 — os gestos proprietários desta identidade)*

Os três gestos abaixo formam UM sistema: **a tela inteira é governada por um eixo de euros — o sistema de coordenadas do layout É o dado.** Nenhum kit de dashboard posiciona composição por coordenada de dado; é isto que o teste do template (gate 13) cobra, e é assim que as leis citadas ganham execução material (gate 14 — a tensão de Lissitzky como geometria real, a fresta de Ando como corte espacial, não accent color). Os gestos concretizam o grid assimétrico acima e o layout do §9: o "deslocamento" da placa deixa de ser escolha arbitrária — vira coordenada. **A direção aprovada não muda** (bancada calma, sem alarme, entropia 2, rito único nível 3): os gestos dão dentes formais, não barulho. Honestidade calibrada (Rams) não está listada como gesto — é pré-requisito, como o CONTRACT agora explicita.

**G1 — RÉGUA-MESTRA** *(o eixo de euros como esqueleto da tela — o embrião salvo pelo verdict, a régua de posição histórica, promovido de componente a estrutura-mestra)*
- **O que o olho vê e onde:** uma escala horizontal graduada, fina como instrumento de bancada, atravessando a zona alta da tela de ponta a ponta, mapeando a **faixa de decisão** (~€780–€1050) com entalhes nomeados e reais — fantasma €796, alvo-OW €900, piso €912, alvo €960 (todos de SQLite/`[alert]`). **Todo objeto que carrega preço se posiciona horizontalmente por esse mapeamento único:** a placa do veredito pinada em x(€948), o tick do OW em x(€1004). A mesma escala desce ao midground como DNA: cada linha da matriz carrega um trilho-hairline com o tick do seu preço na MESMA coordenada x — a coluna de trilhos forma o campo topológico do mercado, legível de cima a baixo (quais cenários flertam com o limiar). Preço fora da faixa encosta na borda do trilho com entalhe de estouro rotulado — honesto, sem esconder. **Distância na tela = distância em euros; uma escala só por tela.**
- **Viva e honesta:** os entalhes são dados vivos — novo piso histórico desloca o entalhe do piso com o deslocamento curto e pesado já mapeado no motion (`novo-piso`); no estado `vazio`, a régua nasce só com os entalhes de config (alvos) — fantasma/piso só existem quando o histórico existe.
- **Origem:** embrião do verdict 001 · `[card:lissitzky]` (o plano vira estrutura quando o eixo carrega peso e tensão) · `[card:moholy-nagy]` (a leitura tem trajetória — aqui o trilho é literal) · `[lei:1]` (a geometria é o dado: responde espacialmente "quão bom é este preço contra meus limiares?") · `[vetor:densidade=7]`.
- **Proíbe:** layout por células genéricas onde posição é arbitrária; contexto de preço como chip/badge/percentual solto; codificação por comprimento de barra (aqui é POSIÇÃO em escala compartilhada, não bar chart); qualquer segunda escala na mesma tela.

**G2 — CORTE DO LIMIAR** *(o alvo €960 como fenda espacial de luz — Ando executado, não citado)*
- **O que o olho vê e onde:** UMA linha vertical que nasce no entalhe do alvo na régua-mestra e desce a composição inteira, atravessando foreground e matriz — **o limiar é um lugar físico na tela, não um rótulo.** Materialmente: o encontro de duas massas escuras que não se tocam. Estado `em-alvo` (hoje): a fenda está **aberta** — a única luz quente da tela entra por ela como se viesse de trás da superfície e se derrama **direcionalmente** sobre o lado barato (borda dura na fenda, decaimento suave para a esquerda), banhando o que estiver aquém do limiar — hoje, a placa a €12 dela. O derramamento vive só na banda do foreground; na matriz, o corte desce como hairline seco (midground calmo, regra do recuo), e os ticks à esquerda dele SÃO os cenários em alvo. Estado `acima-do-alvo`: a fenda sela — hairline apagada, superfície de volta a massa contínua fria. A luz é **arquitetura estática** — não pisca, não pulsa; na carga, abre pelo corte de luz contido já especificado no motion.
- **Um único corte por tela:** o do limiar da decisão dominante (RT €960). O alvo-OW €900 permanece entalhe graduado na régua com estado textual no cartão OW — dois cortes diluiriam a hierarquia (o peso aponta UMA decisão).
- **Origem:** `[card:tadao-ando]` (a luz só significa porque a sombra existe; foco como fresta, não glow) · `[modo]` (Laboratório: achado sinalizado, não sirene) · `[lei:1]` (a luz é o estado real do gatilho que dispara a notificação) · `[vetor:entropia=2]`.
- **Proíbe:** estado-como-badge (a pílula âmbar como portador único do estado — o rótulo "EM ALVO" permanece por acessibilidade, mas a FORMA do estado é o corte); aura/glow ao redor de cards; fundo-semáforo em linhas da matriz; qualquer segunda fenda luminosa.

**G3 — PLACA PÊNSIL** *(o veredito como massa Proun suspensa — sobreposição e tensão reais, não "um card maior que os outros")*
- **O que o olho vê e onde:** a placa do veredito não mora numa célula — está **suspensa na régua-mestra por uma haste-pino hairline visível**, cravada exatamente em x(€948); o corpo pende abaixo do eixo, deslocado, e **sobrepõe a borda superior do campo da matriz, projetando sombra real sobre ele** (profundidade por sobreposição, não flat fake). A tensão de Lissitzky vira composição literal: a placa pende no corredor estreito entre o entalhe do piso (€36 à esquerda) e a fenda acesa (€12 à direita) — **o drama do mercado (cai a piso novo ou escapa do alvo?) é visível como geometria antes de qualquer número ser lido.** Mudança de estado re-pina a placa com deslocamento curto e com peso (motion já mapeado), nunca flutuação líquida.
- **Origem:** `[card:lissitzky]` (placas sobrepostas, painéis deslocados, o peso visual aponta a decisão) · `[vetor:geometria=6]` (tensão funcional: posição = dado, hierarquia = decisão) · `[lei:1]`.
- **Proíbe:** o veredito como card igual entre cards; centralização arbitrária; sobreposição sem sombra; **sobreposição de qualquer outro elemento** (a interrupção de planos é exclusiva da decisão dominante — dominância só significa se é única); separar a placa da régua (o x dela é dado, não escolha de layout).

**Acessibilidade da assinatura:** os três gestos são camada formal sobre informação que permanece textual (preços, "EM ALVO", "+€36", estado por linha) — a geometria nunca é portador único de significado (mantém o § acessibilidade). **Auto-teste do template (rascunho do maker; gate 13/14 é do juiz frio):** trocando a paleta, um kit genérico não gera uma tela cujo sistema de coordenadas é o dado, cortada por um limiar arquitetônico de luz e com uma única massa suspensa interrompendo o grid.

### Componentes
1. **Bloco-veredito** (Foreground) — placa com massa: melhor RT + estado (EM ALVO / acima do alvo) + gesto de compra embutido. `[card:lissitzky]` `[card:tadao-ando]`
2. **Cartão OW** (Foreground) — irmão secundário do veredito para o cenário só-ida. `[card:rams]`
3. **Barra de posição histórica** (Midground) — atual · piso €912 · fantasma €796, com a distância explícita. `[card:stuart-hall]` (contexto que devolve agência).
4. **Indicador de tendência** (Midground) — sub/cai/estável, do slope real. `[card:moholy-nagy]` (seta mínima como vetor).
5. **Selo frescor+confiança** (Midground/Background) — idade da leitura + estado da amostra (confiável/ruído). `[card:rams]` (honestidade — a máquina diz quando não sabe).
6. **Matriz de cenários** (Midground) — os 18 trechos, tabela redesenhada, linha-em-alvo com marcador discreto. `[card:rams]` `[vetor:densidade=7]`
7. **Leitura de consequência** (rito de compra) — a linha que precede a saída para o Google Flights. `[card:stuart-hall]` `[card:07-detournement (implícito)]` `[atrito:nível 3]`

### Estados (por componente)
- **Bloco-veredito:** `em-alvo` (fresta acesa) · `acima-do-alvo` (frio, apagado) · `sem-dado` (ver edge cases).
- **Barra histórica:** `no-piso` (atual == mínima de sempre) · `acima-do-piso` (mostra +€N) · `novo-piso!` (atual < mínima anterior — o único momento que merece a luz mais forte, porque é um achado real da bancada). `[card:tadao-ando]`
- **Tendência:** `subindo` · `caindo` · `estável` · `indefinida` (amostra curta).
- **Selo de confiança:** `confiável` (≥5-7 dias) · `parcial` · `ruído` (<48h) — texto direto de `analyze.py`.

### Motion
- Discreta, funcional, sem coreografia (Rams). `[card:rams]` `[vetor:sinestesia=2]`
- **Entrada:** a fresta do veredito revela-se por **corte de luz** contido (Ando: entrada lenta, revelação contida), não fade genérico. `[card:tadao-ando]`
- **Deslocamentos** curtos com peso quando um estado muda (ex.: virou "novo piso"), não flutuação líquida. `[card:lissitzky]`
- **Pulso de frescor:** respiração única e lenta no selo, sinalizando o daemon vivo — o único movimento contínuo, sobre dado NÃO-crítico. `[vetor:entropia=2]`
- **Preço, piso, veredito NUNCA animam de forma decorativa** — trava de entropia. Se o preço mudar entre duas gerações do relatório, a mudança é mostrada como *fato* (novo valor + delta), não como número girando. `[lei:1]`
- `prefers-reduced-motion`: desliga pulso e transições, mantém tudo legível estático. `[gate:12]`

### Som / haptic
- **Nenhum** nesta superfície. `[vetor:sinestesia=2]`. O canal sonoro do produto (o *alerta*) já vive fora daqui — notificação nativa do macOS e Telegram no celular. Duplicar som na leitura seria teatro (trava de sinestesia: som sem estado novo = teatro). A superfície de leitura é silenciosa por design.

### Acessibilidade
- **Trava de densidade (≥7) — teste de zona cumprido:** cada zona declara por escrito a pergunta que responde (§6 e a lista de componentes acima). Zona sem pergunta foi removida.
- Contraste **AA** mínimo em todo texto de dado; o preço-veredito mira AAA (é o número que decide dinheiro). `[card:rams]`
- **Paridade sem cor:** o estado "em alvo" nunca depende só da cor da fresta — carrega rótulo textual explícito ("EM ALVO") e posição/peso. Daltônico-seguro. `[lei:1]`
- Toda a informação é **texto real** (o report já é HTML semântico) — navegável por leitor de tela, tabela com `<th>` de verdade. `[card:rams]`
- O gesto de compra é um link/botão real, focável por teclado, com o texto da consequência lido antes da saída. `[atrito:nível 3]`
- `prefers-reduced-motion` respeitado (acima).

### Edge cases (obrigatórios pelo contrato — todos com estado real de origem)
- **VAZIO / primeira execução** (banco sem dados, ou `analyze.py` retorna "Sem dados ainda"): sem veredito falso. A tela declara honestamente *"a bancada ainda não coletou — primeira varredura em curso"*, com o selo de confiança em `ruído`. Nunca inventa um "melhor preço". `[card:rams]` `[card:stuart-hall]`
- **AMOSTRA CURTA (<48h)** (a honestidade estatística de `analyze.py`): o veredito de preço aparece (o preço é real), mas a **tendência** e o piso vêm marcados *"padrão ainda é ruído — sinal confiável em ~5-7 dias"*. A máquina não finge saber a direção quando não sabe. `[card:rams]` `[modo]` (Laboratório: honestidade estatística é o núcleo).
- **ERRO de scraping** (Google mudou o layout / consent falhou — risco declarado no README): a tela **não** mostra a última leitura como se fosse atual. O selo de frescor vira `desatualizado` com a idade real ("última leitura há 6h — a varredura falhou") e o veredito fica em estado neutro, não em alvo. Falha visível, jamais silenciosa. `[card:rams]` `[lei:1]` (telemetria honesta: frescor aponta estado real).
- **CARREGANDO:** como o report é gerado por varredura (arquivo estático, não app ao vivo), "carregando" ≈ abrir um relatório enquanto a próxima varredura roda. Não há spinner falso; se houver defasagem, o selo de frescor a comunica pela idade. Sem barra de progresso de scraping decorativa. `[gate:2]`
- **OFFLINE / sem rede:** o relatório é um arquivo HTML **local** — abre e lê normalmente offline (é a força do produto). O que degrada offline é o gesto de compra (o deep_link precisa de rede): o botão permanece, e ao acionar sem rede informa *"sem conexão — a compra abre o Google Flights"*, sem quebrar. `[card:rams]`
- **DEGRADADO — só um tipo disponível** (ex.: nenhum RT em alvo, só OW; ou uma varredura só trouxe parte da matriz): mostra o que tem, marca o que falta ("sem cotação RT nesta varredura"), nunca extrapola. `[card:rams]`
- **NOVO PISO** (preço atual < mínima histórica — o achado que a bancada existe para pegar): é o **único** estado que merece a luz mais intensa + o deslocamento com peso; é um evento real e raro, não decoração. `[card:tadao-ando]` `[card:lissitzky]`

---

## 9. `prova` — O menor artefato que prova a direção

**Artefato:** UMA tela — a **superfície principal do watcher**, o painel/relatório de passagens, no estado **EM ALERTA de hoje (2026-07-06 10:17)**, renderizada como HTML local estático (o formato real que o produto já emite). É a prova mínima porque é a superfície que o operador abre "algumas vezes por dia" *e* a que expõe o veredito, o contexto histórico e o rito de compra num só lugar. Se esta tela prova a direção, o resto do produto é consequência.

Descrição suficiente para um implementador construir **sem falar comigo**:

### Dados reais a renderizar (da varredura de hoje — não inventar)
- Melhor RT: **€948** · MXP⇄GRU · **13/07 → 27/07** · LATAM · direto · deep_link real do report.
- Veredito: **EM ALVO** (€948 ≤ €960).
- Melhor OW: **€1004** · MXP→GRU · 10/07 (e 13/07) · LATAM.
- Posição histórica: atual €948 · **piso de sempre €912** · **promoção fantasma €796** · distância **+€36 do piso**.
- Tendência: derivada do slope de `analyze.py` (rótulo sub/cai/estável — [impl] chamar `analyze.py` ou computar o slope na geração; se ainda `estável`, mostrar "estável").
- Frescor+confiança: leitura de **06/07 10:17** · amostra **~10 dias / 371 varreduras → confiável** (span > 48h, dentro da janela "~5-7 dias" que `analyze.py` chama de confiável).
- Matriz: os **18 cenários** do report de hoje (€948 … €1847), com a linha €948 marcada `em-alvo`.

### Layout (os três planos, concretos)
1. **Foreground — bloco-veredito** (placa Lissitzky, deslocada do eixo, maior peso da tela): "€948" em tipografia tabular grande + etiqueta **EM ALVO** + rota/datas + **botão "comprar"**. A **fresta de luz** (a única cor quente da tela) acende aqui porque está em alvo. `[card:lissitzky]` `[card:tadao-ando]`
2. **Foreground secundário — cartão OW**: "€1004 · só-ida 10/07" menor, mesma família, sem a luz quente (não é o veredito principal).
3. **Midground — a trilha de contexto** (peso médio, sem luz de alarme): barra de **posição histórica** (€948 · piso €912 · fantasma €796 · +€36) · **tendência** · **selo de frescor "há 12 min · amostra confiável"**. `[card:moholy-nagy]` `[card:stuart-hall]`
4. **Midground — matriz** dos 18 cenários: tabela ortogonal calma, dígitos tabulares, linha €948 com marcador discreto (não fundo gritante). `[card:rams]`
5. **Background — bancada em penumbra**: fundo grafite mate; a luz do veredito ganha profundidade contra ele. Pulso de frescor lento e sutil no selo (o daemon vivo). `[card:tadao-ando]` `[vetor:entropia=2]`

### Rito de compra (a única cerimônia — nível 3)
Ao acionar "comprar": antes de abrir o deep_link, exibir a **leitura de consequência** de uma linha — *"€948 ida-volta 13/07 → 27/07, LATAM direto · €36 acima do seu piso · abrindo o Google Flights para você confirmar"* — e então a saída. Pausa deliberada de meio-segundo, não modal de senha. `[card:stuart-hall]` `[atrito:nível 3]`

### Motion da prova
Na abertura: o bloco-veredito revela-se por **corte de luz** contido (Ando), o resto já está posto. Pulso de frescor respira. `prefers-reduced-motion` → tudo estático. `[card:tadao-ando]` `[gate:12]`

### Edge cases que a prova DEVE também especificar (mesmo mostrando o estado feliz)
O implementador deve deixar previstos, no mesmo template, os estados:
- **acima-do-alvo** (fresta apagada, tom frio) — para quando o preço subir do alvo;
- **novo-piso** (luz máxima + deslocamento com peso) — se a próxima varredura bater < €912;
- **amostra-ruído** (<48h — tendência marcada "ainda é ruído");
- **erro/desatualizado** (selo de frescor `desatualizado`, veredito neutro, falha visível);
- **vazio** (primeira varredura — sem veredito falso);
- **offline** (lê normal; só o botão de compra avisa "sem conexão").
Cada um já mapeado em §8; a prova é o estado `em-alvo`, mas o template nasce sabendo dos outros.

### Critério de aprovação da prova (o que o juiz frio verifica contra o gate)
A tela prova a direção SE, e só se: (a) o operador apressado lê "estou em oportunidade?" em <2s (Foreground/Moholy-Nagy); (b) toda luz aponta para ação e o resto é massa (Ando/Lei 1); (c) toda telemetria mostrada existe no SQLite/`analyze.py`/`[alert]` (Lei 1/teste de honestidade); (d) o único atrito é o rito de compra nível 3 e ler/investigar é fluido (Lei 2); (e) nenhuma referência aparece como aparência literal (Lei 3); (f) não lê como "cyberpunk/military/painel de nave" (inimigo do manifesto) nem como "app de viagem com badge" (Stuart Hall); (g) **os gestos da assinatura formal estão visíveis e nomeáveis na tela** — a **Régua-mestra** (o eixo único de euros governando as posições, com os trilhos-DNA na matriz), o **Corte do Limiar** (a fenda vertical de luz em x(€960) atravessando a composição) e a **Placa Pênsil** (a massa suspensa pela haste-pino, sobrepondo a matriz com sombra real) existem materialmente como especificados no §8/Assinatura formal e podem ser apontados pelo nome; lei citada sem execução material reprova (gate 14), tela que trocando a paleta poderia sair de um kit genérico reprova (gate 13).

**A identidade não existe até esta tela existir e ser julgada.** Este brief a especifica; a próxima etapa (frontend real) segue o padrão uiproof do repo-alvo para o Q&A.

---

## Rastreabilidade — índice das origens citadas
`[lei:1]` função antes de teatro · `[lei:2]` fricção só com consequência · `[lei:3]` referência como princípio.
`[modo]` Laboratório (+acento médico na compra).
`[vetor:tactilidade=3] [vetor:densidade=7] [vetor:geometria=6] [vetor:sinestesia=2] [vetor:entropia=2] [vetor:cerimonialidade=3]`.
`[card:rams] [card:tadao-ando] [card:lissitzky] [card:moholy-nagy] [card:stuart-hall]` (+`07-detournement` implícito no gesto de compra).
`[impl:lacuna]` = valor concreto (hex/fonte) deixado ao design system dentro da direção fixada.
`[Lacuna de fato]` = frequência/plataforma exata de consumo do operador (§1) — assumido desktop-primeiro, sinalizado como risco, não inventado.

## Auto-checagem interna do maker (RASCUNHO — não é veredito; o juiz frio decide)
1. Elemento luminoso sem função? Não — a única luz é a fresta do veredito-em-alvo/compra (Ando). 2. Telemetria sem fonte? Não — cada uma mapeada a SQLite/`analyze.py`/`[alert]`. 3. Atrito em ação sem consequência? Não — ler/investigar é fluido; só a compra tem rito. 4. Rito fora do mapa? Não — só o nível 3 da §7. 5. Referência literal? Não — leis, não aparências; clichês nomeados e barrados. 6. Lê como cyberpunk/military? Não — bancada calma em penumbra, sem HUD/sirene. 7. Zona densa sem pergunta? Não — teste de zona no §6/§8. 8. Dado crítico oscilando? Não — preço/piso/veredito imóveis; só frescor respira. 9. Grid decorativo? Não — assimetria funcional (hierarquia de decisão). 10. Nostalgia cosplay? Não uso nostalgia literal. 11. Proibição do modo violada? Não — sem alarme permanente/estética de guerra (o "alerta" é fresta+etiqueta, não sirene). 12. Som/motion sem desligar? Não — sem som; motion respeita `prefers-reduced-motion`.
