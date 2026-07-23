# DESIGN BRIEF — gen-003 · a fidelity product "Direzione"

> **Mente:** O Novo Uomo Vitruviano (V1TRUVIO).
> **Produto-alvo:** a *Direzione* — painel de administração/gestão do a fidelity product, app italiano de programa de fedeltà (loyalty) para negozi + rede comissional de venditori (società the client company), em produção.
> **Papel deste documento:** Design Brief gerado pelo maker. Não é código; não aplica gates (juiz frio separado julga o brief; depois o artefato).
> **Precedência (inviolável):** Leis > Modo > Vetores > Cards.
> **Dado da prova:** `proofs/gen-003/data-sample.json` (estrutura verbatim dos endpoints reais: `server.ts` mapCoreStaff 1855-1880, GET `/api/core/admin/pendenze-denaro` 8536-8611, computeMonthlyCommissions 2320-2426 base INCASSATO).
> **Aviso de honestidade:** o dossiê de produto não contém uma única palavra estética. Tudo abaixo é derivado do diagnóstico do produto e do dado. Onde o dado não sustenta uma decisão, o brief declara a lacuna em vez de inventar (regra de ouro: lacuna declarada > fato inventado).

---

## 1. `operador` — Diagnóstico do operador

**Quem opera.** Três perfis, um posto de comando:

- **Direzione (Filippo, Letizia)** — os donos da the client company. Gente de **negócio**, não técnicos. Gerem uma rede comercial real (agenti/venditori), aprovam pagamentos que saem da conta da società, decidem quem é suspenso, autorizam a emissão de fatture eletrônicas com efeito fiscal. Cada decisão deles tem consequência de **dinheiro real e de fisco real**.
- **Admin de serviço** — operação corrente: cadastra esercente, dá baixa em insoluto, empurra o pipeline de leads. Menos autoridade, mais volume.
- **Contexto físico:** operam no **celular** (Capacitor iOS/Android) **e** no **desktop**, frequentemente **em movimento** — no bar do esercente, no trem, entre reuniões. O celular não é o "caso pobre"; é o caso primário de muitas sessões.

**O que o operador está fazendo (verbo dominante).** A esmagem do tempo é **LEITURA e INTERPRETAÇÃO** — "como está a rede este mês?", "quanto o Marco gerou?", "quem cruzou a soglia?", "o que está parado esperando mim?". Só **poucas** ações movem dinheiro/fisco (aprovar payout, emitir fattura, ativar addebito, suspender esercente). O produto é, em proporção, **90% observatório, 10% sala de decisão** — e o design tem de honrar essa proporção: recuar na leitura, endurecer na decisão.

**Estado emocional provável** (por perfil e momento):
- Direzione em revisão mensal: **autoridade + escrutínio**, quer diagnóstico de relance, não paciência para caçar número.
- Direzione diante de dinheiro parado (banda pendenze): **responsabilidade e leve pressão** — "isto está esperando uma decisão minha e custa se eu errar".
- Admin em movimento no celular: **pressa + distração** — luz forte de rua, uma mão, sinais críticos (SOSPESO, dichiarazione faltando, soglia cruzada) têm de saltar sem zoom.
- Momento fiscal (emitir fattura, cruzar soglia €5k): **ansiedade de irreversibilidade** — número que vira documento com efeito legal.

**Memória geracional deste operador.** NÃO é o operador-nerd de terminal/CRT. É o **gestor comercial italiano**: a memória sensorial certa é a do **documento contábil confiável** — o registro, a tabella, a riga que fecha, o timbro, o numero di protocollo. A máquina que esta interface deve evocar não é a nave; é o **livro-razão de uma società que se leva a sério**. Autoridade vem de **legibilidade e responsabilidade**, não de HUD.
`[modo: Equipamento médico/científico — clareza acima de tudo]` `[card: Rams — honestidade funcional]`

**Regra do recuo (zonas onde a interface RECUA e deixa o operador em paz).** Declaradas explicitamente:
- **KPIs nacionais** — leitura pura. Sem rito, sem confirmação, sem animação de número. Aparecem, são lidos, ficam quietos.
- **Consulta ao organigramma / tabela de agenti** — navegar, expandir, filtrar: fluido, instantâneo, zero atrito. Explorar a rede é leitura.
- **Lista de esercenti / leads** — rolar, filtrar por status/città/agente, buscar: fluido.
- **Audit logs** — leitura de histórico: recuo total; a interface é vitrine, não interlocutora.

O atrito é reservado, cirurgicamente, para a **§7** — só onde a ação move dinheiro ou fisco.

---

## 2. `maquina` — Diagnóstico da máquina

**O que a máquina processa de verdade** (não o que parece processar): a Direzione é a cabine de um **motor de comissões**. O motor real é `computeMonthlyCommissions` sobre a base **INCASSATO** (`server.ts:2320-2426`): o dinheiro efetivamente recebido dos esercenti (canone Publisher €137/mês) sobe pela árvore de agenti e vira provvigione **personale + network + totale** em cada nó, respeitando níveis L1–L6 (Venditore → Supervisore → Coordinatore → Manager) e a regra **SGANCIO** do organigramma. Em paralelo, dois subsistemas de consequência: **fiscal** (soglia €5.000/ano do inquadramento procacciatore⇄agente ENASARCO; dichiarazione annuale; fatturazione elettronica SDI com numerazione `CB/2026/NNNNNN`) e **financeiro** (addebito/billing do canone, insoluti, storni, payout).

**Estados que PRECISAM ser visíveis** (teste de honestidade — cada um aponta para um campo/endpoint real; telemetria sem fonte é cortada aqui):

| Estado visível | Fonte real (é dado, não enfeite) |
|---|---|
| MRR nazionale, esercenti attivi/omaggio, agenti attivi, incassato do mês, fatture emesse | `kpi.*` (derivado de computeMonthlyCommissions, base INCASSATO) |
| Inquadramento de cada agente (Venditore…Manager) + ordem hierárquica | `agenti[].level`, `agenti[].levelOrder` (1–6) |
| Provvigione personale / network / totale por agente | `agenti[].personalMonthly / networkMonthly / totalMonthly` |
| **Contratto agenzia** sim/não | `agenti[].contrattoAgenzia` (bool) |
| **Dichiarazione annuale presente/faltando** | `agenti[].dichiarazioneAnno` (`2026` ou **`null` = FALTANDO**) |
| Agente **SOSPESO** | `agenti[].suspended` (bool) |
| Esercente: categoria, città, **status ATTIVO/SOSPESO/OMAGGIO**, canone, agente responsável | `esercenti[].*` (canone €137, `0` em OMAGGIO) |
| **Banda PENDENZE** — 5 contadores de dinheiro parado | `pendenze.counts.{daFatturare, insoluti, payoutDaChiudere, soglia5k, storniDaRecuperare}` |
| Cada pendenza detalhada (quanto, de quem, desde quando) | `pendenze.daFatturare[].amountCents`, `pendenze.insoluti[].since`, `pendenze.soglia5k[].{liquidatoAnno, dichiarazioneOk}`, `pendenze.storniDaRecuperare[].amountCents` |

**O que a soglia €5k realmente diz** (o estado mais delicado): `pendenze.soglia5k[]` traz `liquidatoAnno` e `dichiarazioneOk`. O flag **não** é "chegou a €5.000" — verificado em `server.ts:8537-8571`, ele dispara quando o procacciatore (`contrattoAgenzia:false`) **liquidou ≥ €4.000 no ano (80% do teto)** OU tem payout aberto (PENDING/PAYABLE) **sem** dichiarazione do ano corrente. É um gatilho de **compliance da dichiarazione**, não um limite rígido de pagamento. Logo: um agente a €4.280,50 **com** dichiarazione OK é uma coisa; um a €3.910,00 **sem** dichiarazione (`dichiarazioneOk:false`) é um risco fiscal ativo, ainda que o número seja menor. A máquina sabe distinguir os dois — a interface **tem** que mostrar a distinção (estado da dichiarazione manda sobre o montante), não só a distância até €5k.

**O que permanece invisível (para não gerar ruído):** os cálculos intermediários da árvore (como cada centavo subiu de nó a nó), IDs internos (`stf_001`, `mer_003`, `ctr_003`), timestamps de sistema, a mecânica do endpoint. O operador de negócio não lê grafo; lê **resultado com procedência**. Procedência aparece **sob demanda** (expandir um nó), nunca como parede default.
`[card: Rams — cada elemento justifica a presença]` `[vetor: densidade=8, teste de zona §4]`

**O que deve parecer vivo / material / conectado — e por quê:**
- **Vivo, com honestidade:** só o que muda de verdade dentro do mês — o incassato acumula, a banda pendenze ganha/perde itens conforme decisões. Isso pode ter respiração mínima (ver entropia=2). **Nunca** o número fiscal oscilando decorativamente.
- **Material:** a superfície inteira deve ter **peso de documento** — massa escura como papel-carbono/couro de pasta de contabilidade, não a leveza branca do SaaS. Autoridade é matéria. `[card: Ando — qual é a matéria desta máquina]`
- **Conectado:** o organigramma é a única zona onde "conexão" é literal e funcional — a linha de SGANCIO entre um agente e seu upline É a informação. Aqui a conexão desenhada é dado, não cabo decorativo.

**Teste de honestidade — resultado:** nenhuma telemetria proposta neste brief existe sem um campo do `data-sample.json` por trás. Nada de "atividade da rede em tempo real", nada de gráfico pulsante sem série, nada de badge de status inventado. Se um número não vem do endpoint, ele não aparece.

---

## 3. `modo` — Seletor de tom

**Modo escolhido: EQUIPAMENTO MÉDICO/CIENTÍFICO** (base), com **acento de CENTRAL DE COMANDO** na banda pendenze.

**Justificativa (uma linha):** é dinheiro real e dado **fiscal-financeiro** que precisa ser confiável e legível de relance com estados críticos inequívocos — exatamente o domínio "dados sensíveis, saúde, finanças, segurança" do modo, cuja doutrina é **clareza acima de tudo, entropia baixa, sem ambiguidade de estado**.

**Por que ESTA máquina e não outra:**
- **Não Cockpit tático** — não há operação em tempo real sob risco contínuo; o risco é pontual (a decisão que move dinheiro), não ambiente. Usar Cockpit aqui seria o abuso que o próprio MODES adverte.
- **Não Central de comando puro** — a maior parte do tempo é leitura, não orquestração; comando puro militarizaria a leitura. Mas a **banda pendenze** É uma micro-central-de-comando (dinheiro parado esperando decisão), então ela recebe o **acento** de Central de comando (Cer +2 localizado) — declarado como híbrido base+acento conforme MODES permite.
- **Não Laboratório** — não é exploração de dados abertos; é registro contábil com verdade única. Laboratório toleraria entropia que aqui é proibida.
- **Não Terminal editorial** — há telemetria e diagnóstico demais; a tipografia comanda a *leitura do número*, mas não é uma redação.

**Bias do modo aplicado ANTES da calibração:** `Ent −2` (entropia puxada para baixo — estado nunca ambíguo), `Cer +1` (rito onde há consequência), **clareza como trava-mestra**. Proibições do modo que entram no gate como lei: **entropia alta, humor visual, ambiguidade de estado** — banidos. O acento Central de comando traz **Cer +2** e **Den +2**, aplicados **apenas** à banda pendenze.

---

## 4. `vetores` — Calibração

Perfil completo (0–10), cada um com justificativa de uma linha. Ponto de partida = bias do modo (Ent −2, Cer +1; acento local Den +2/Cer +2), calibração fina a seguir.

| Vetor | Valor | Justificativa (uma linha) |
|---|---|---|
| **Tactilidade** | **4** | Controles com estados claros e massa honesta (o operador toca poucos botões, mas os que movem dinheiro precisam ter peso e resposta); abaixo de 7, então sem orçamento de cockpit — mas todo estado tem foco de teclado + ARIA. |
| **Densidade informacional** | **8** | KPIs + rede de 6 níveis + esercenti + 5 contadores de pendenze + fisco: o operador quer domínio de relance, e domínio aqui É densidade — mas densa nunca indistinta (teste de zona abaixo, obrigatório por ser ≥7). |
| **Geometria** | **6** | Modular-funcional tendendo a ortogonal: a tabella/registro contábil pede grade e alinhamento decimal rígidos; sobe a 6 (não 8) porque a autoridade vem de ordem legível, não de tensão diagonal permanente — a diagonal aparece só onde há a decisão dominante (Lissitzky, §5). |
| **Sinestesia** | **2** | Microanimação visual de confirmação apenas (um estado que muda de peso ao confirmar uma ação fiscal); som/haptic **opcional e desligável**, nunca recompensa — é registro sério, não instrumento. |
| **Entropia viva** | **2** | Respiração sutil só em zonas de agregado que realmente acumulam no mês (incassato, contadores); **zero** entropia sobre qualquer número fiscal-financeiro que o operador lê para decidir (trava dura + bias do modo). |
| **Cerimonialidade** | **5** (base) → **8** local | Base 5: gesto deliberado para ações que movem dinheiro. Local 8 (ritual de autorização) apenas para **emitir fattura SDI** (irreversível, efeito fiscal). Mapa de consequência completo na §7 — sem ele, cerimonialidade>0 seria inválida. |

**Teste de zona (obrigatório porque densidade = 8 ≥ 7) — cada zona responde "que pergunta do operador eu respondo?":**

| Zona | Pergunta que responde |
|---|---|
| Faixa de KPIs nacionais | "Como está o negócio inteiro este mês, num relance?" |
| Banda pendenze (5 contadores) | "O que está parado esperando uma decisão minha — e quanto custa?" |
| Tabela/organigramma de agenti | "Quem gera o quê, quem está sob quem, quem tem pendência de contrato/fisco/soglia?" |
| Lista de esercenti | "Quem paga, quem está suspenso, quem é omaggio, e de qual agente?" |
| Pipeline de leads | "O que está entrando na rede?" |
| Fatturazione / billing | "O que preciso faturar e cobrar, com que numerazione?" |
| Audit | "O que já foi decidido, por quem, quando?" |

Nenhuma zona sem pergunta ⇒ nenhuma zona removida por indistinção. Trava de densidade satisfeita.

---

## 5. `referencias` — RAG (leis, nunca aparências)

Cinco cards. De cada um, a **lei extraída** (não a aparência) e a zona exata onde atua.

1. **Dieter Rams Reavaliado** `[card: Rams]`
   **Lei:** todo elemento justifica a presença por função, estado ou clareza — honestidade funcional radical, não minimalismo branco.
   **Zona:** freio permanente de toda a Direzione. Concretamente: labels em italiano de negócio inequívocos (não jargão de dev), nenhuma decoração de dashboard-kit, cada número com unidade e procedência. É o card que responde "este elemento justifica existir?" em cada componente. **Pré-requisito, não assinatura** (o contrato é explícito: honestidade calibrada não conta como assinatura formal).

2. **Tadao Ando** `[card: Ando]`
   **Lei:** profundidade nasce da relação massa escura ↔ fresta luminosa — a luz só significa porque a sombra existe; foco é corte, não glow espalhado.
   **Zona:** a superfície inteira é **massa** (fundo material escuro, sombra profunda — peso de documento). A **luz** (contraste alto, único destaque claro da tela) é reservada **exclusivamente** para (a) o ponto de ação ativo e (b) o estado crítico que exige decisão — um esercente SOSPESO, uma dichiarazione faltando, um contador de pendenze com valor. O resto da tela **aceita ser massa**. Isso resolve densidade 8 sem virar parede de ruído: tudo pesa, só o que importa **corta a luz**.

3. **El Lissitzky / Espaços Proun** `[card: Lissitzky]`
   **Lei:** a composição tem massa, tensão e direção espacial — o peso visual aponta para onde está a decisão; existe UMA decisão dominante na tela.
   **Zona:** a **banda pendenze**. Ela é a única placa deslocada, de peso e eixo distintos do resto — não uma linha de cards iguais, mas uma **barra de decisão** angular cujo peso puxa o olho porque ali está o dinheiro parado. Materializa a lei em vez de citá-la: a tensão é real (dinheiro esperando), não ornamento. *(evita cartaz soviético: sem vermelho/preto de propaganda, sem diagonal gratuita — o eixo existe porque a decisão existe.)*

4. **László Moholy-Nagy** `[card: Moholy-Nagy]`
   **Lei:** tipografia e linhas são forças de orientação — o texto tem vetor, a leitura tem trajetória; hierarquia se lê como trilho.
   **Zona:** a **tabela de agenti e o organigramma**. A leitura viaja por um trilho: nome → inquadramento → MRR gerado → provvigione totale → sinais (contratto/dichiarazione/soglia). No organigramma, a linha de SGANCIO é o vetor que diz "este desce daquele". Cabeçalhos lineares e alinhamento decimal como trilho, não grade decorativa. Responde "para onde a leitura deve viajar?" numa tabela que, sem vetor, seria só densidade cega.

5. **Stuart Hall / Codificação-Decodificação** `[card: Stuart Hall]`
   **Lei:** toda interface codifica quem o humano deve ser — projete a leitura que devolve agência; revele consequência ANTES da ação.
   **Zona:** as ações que movem dinheiro/fisco (emitir fattura, aprovar payout, ativar addebito, suspender). O rito de autorização (§7) **mostra a consequência antes** — "esta fattura leva o numero CB/2026/000020 e tem efeito fiscal; confirma?". O operador é tratado como quem **assume risco consciente**, não como quem clica um CTA. *(evita panfleto: nenhuma linguagem política; o gesto é o rito, não um manifesto.)*

*(Détournement e Teenage Engineering considerados e **deixados fora**: Détournement — não há fluxo comercial anestesiante a desviar aqui, o produto já é ferramenta séria; TE — o lúdico-tátil contradiria a gravidade fiscal do modo. Citá-los sem execução real reprovaria na Lei 3.)*

---

## 6. `planos` — Três planos

Cada elemento atribuído a **um** plano. Elemento sem plano = sem função = fora.

**FOREGROUND (ação humana imediata — maior contraste, toque, decisão):**
- Botões de ação fiscal/financeira: **Emetti fattura**, **Approva payout**, **Attiva addebito**, **Sospendi/Riattiva esercente**. `[vetor: cerimonialidade]`
- Os **5 contadores da banda pendenze** quando têm valor > 0 (são clicáveis e levam à decisão). `[card: Lissitzky]`
- **Sinais críticos** que exigem ação: badge SOSPESO, marca de **dichiarazione faltante**, marca de **soglia cruzada sem dichiarazione**. Recebem a fresta de luz. `[card: Ando]`
- O item selecionado numa tabela (a riga ativa).

**MIDGROUND (contexto — telemetria real, estado, controles secundários):**
- Faixa de **KPIs nacionais** (leitura, não ação).
- **Tabela de agenti / organigramma** e seus valores de provvigione. `[card: Moholy-Nagy]`
- **Lista de esercenti** e de **leads**.
- Filtros, busca, ordenação, tabs de seção, sidebar (desktop) / bottom-nav (mobile).
- Numerazione SDI atual, período contábil.

**BACKGROUND (atmosfera — matéria, luz, sombra, respiração lenta):**
- O **material dominante**: fundo escuro com peso de documento, sombra profunda que dá gravidade e faz a fresta de luz significar. `[card: Ando]`
- Respiração mínima (entropia=2) apenas nas zonas de agregado que acumulam no mês (incassato/contadores) — sinal de "vivo dentro do mês", nunca sobre número lido para decidir. `[vetor: entropia=2]`
- Grid/eixo estrutural que sustenta a composição (a barra de pendenze deslocada). `[card: Lissitzky]`

---

## 7. `atrito` — Mapa de atrito

**Princípio (Lei 2):** atrito é linguagem de responsabilidade — aparece só em risco/irreversibilidade/autorização; **nunca** em busca, leitura, navegação. Atrito não listado aqui **não pode aparecer** no design.

**Onde a interface permanece FLUIDA (zero atrito, declarado):** abrir a Direzione; ler KPIs; rolar/filtrar/ordenar/buscar agenti, esercenti, leads; **expandir um nó do organigramma**; abrir o detalhe (read-only) de qualquer pendenza; ler audit logs; trocar de seção. Explorar a rede e diagnosticar **nunca** cobram rito.

**Onde há atrito — com nível de cerimonialidade individual e a consciência que cada rito aumenta:**

| Ação | Nível | Por que existe | Consciência que aumenta |
|---|---|---|---|
| **Emitir fattura elettronica SDI** | **8** (ritual de autorização) | Irreversível; gera documento com numerazione `CB/2026/NNNNNN` e **efeito fiscal**. | Mostra numero que será atribuído + valor + destinatário ANTES; o operador confirma que está criando um documento legal, não fechando um card. `[card: Stuart Hall]` |
| **Aprovar/chiudere payout** (dinheiro sai da società) | **5** (gesto deliberado) | Move dinheiro real para fora. | Mostra beneficiário + valor + o que está sendo pago; confirma com gesto, não com clique acidental. |
| **Ativar addebito** (billing recorrente do canone) | **5** | Cria cobrança recorrente sobre um esercente. | Mostra esercente + canone €137 + recorrência; confirma que ligou uma cobrança que se repete. |
| **Suspender / reativar esercente** | **5** | Muda o status ATTIVO⇄SOSPESO — interrompe/retoma serviço e faturamento. | Mostra o esercente e o efeito (para de faturar / volta a faturar); confirma. |
| **Registrar dichiarazione / marcar storno recuperado** | **3** (confirmação leve) | Altera um estado fiscal/financeiro, mas reversível e de baixo montante. | Confirmação leve: "confirma que registrou?" — sem ritual pesado. |
| **Ler / filtrar / navegar / expandir organigramma** | **0** | Sem consequência. | — (recuo total; qualquer atrito aqui reprova na Lei 2). |

**Trava de cerimonialidade satisfeita:** o mapa de consequência acima é a lista explícita exigida quando cerimonialidade > 0 — cada rito ligado a risco/irreversibilidade real, e a declaração do que permanece fluido está no bloco acima. Nenhum rito em ação banal.

---

## 8. `sistema` — Sistema visual + Assinatura formal

**Material dominante.** Superfície de **documento pesado**: fundo escuro-grafite/carbono profundo (não preto puro, não cinza-SaaS), com a sensação de papel-carbono/capa de registro contábil. A profundidade vem de **sombra**, não de gradiente colorido. A tela **inteira é massa**; a legibilidade dos números vem do contraste do texto sobre a massa, não de cards brancos flutuantes. `[card: Ando]` `[card: Rams]`

**Paleta** (papel funcional de cada cor; nenhuma cor decorativa — cor = estado ou hierarquia):
- **Massa/base:** grafite profundo (fundo), grafite um tom acima (superfícies de riga/painel). `[card: Ando]`
- **Tinta/texto:** off-white de tinta (corpo), com um cinza-tinta secundário para rótulos midground. `[card: Moholy-Nagy]`
- **Luz de foco (o único claro forte da tela):** um branco-quente aplicado só no ponto de ação ativo e no estado crítico. `[card: Ando]`
- **Estados semânticos, sóbrios (cor = significado, não enfeite):** ATTIVO — verde-tinta contido; **SOSPESO** — âmbar/ocre de alerta (não vermelho de pânico: é estado gerenciável, não erro de sistema); OMAGGIO — azul-tinta neutro; risco fiscal (dichiarazione faltando / soglia cruzada sem dichiarazione) — a marca de maior contraste da paleta, porque é o que mais custa se ignorado. `[vetor: entropia=2 — cor não pisca]`
- **Proibido:** vermelho/preto de cartaz construtivista; neon; gradiente de marketing; qualquer cor que não seja estado ou hierarquia. `[gate: item 5, item 6]`

**Tipografia.** Duas famílias, papel claro:
- **Números (o que o negócio lê para decidir):** fonte **monoespaçada / tabular** — MRR, provvigioni, canone, amountCents formatado em €, liquidatoAnno, numerazione. **Alinhamento decimal rígido** em todas as colunas de dinheiro (o registro contábil se lê pela coluna). `[card: Moholy-Nagy]` `[vetor: geometria=6]`
- **Rótulos e prosa:** sem-serifa humanista legível, autoritária sem ser fria. Labels em **italiano de negócio** (Incassato, Provvigione, Esercenti, Insoluti, Soglia) — não jargão técnico. `[card: Rams]`
- Hierarquia por **peso e tamanho**, não por cor: o número totale é o mais pesado da riga; o vetor de leitura (Moholy) é tipográfico.

**Grid.** Registro contábil ortogonal como base (colunas alinhadas, riga como unidade), com **UMA quebra estrutural**: a banda pendenze é uma placa deslocada, de eixo próprio, que rompe o grid regular porque carrega a decisão dominante. `[card: Lissitzky]` `[vetor: geometria=6]`

**Componentes** (todos derivados de card, todos com plano da §6):
- **Riga contábil** (linha de agente/esercente): trilho de leitura horizontal, dinheiro alinhado à direita em tabular. `[card: Moholy-Nagy]`
- **Barra de decisione** (a banda pendenze): 5 contadores numa placa angular deslocada; contador com valor > 0 é foreground e clicável. `[card: Lissitzky]`
- **Nó de organigramma** com **linha de SGANCIO** desenhada (a conexão É dado). `[card: Moholy-Nagy]`
- **Fresta de foco** (focus slit): o destaque de luz sobre o ponto de ação/estado crítico. `[card: Ando]`
- **Selo de emissione** (o rito de emitir fattura): componente que mostra a numerazione a ser gravada. `[card: Stuart Hall]`
- **Etiqueta de estado** (ATTIVO/SOSPESO/OMAGGIO; dichiarazione OK/faltando; contratto sì/no; soglia).
- **Botão honesto** (ações de rito): massa com estado claro, resposta tátil discreta. `[card: Rams]` `[vetor: tactilidade=4]`

**Estados** (cada componente declara vazio / carregando / erro / offline / degradado):
- **Vazio:** "nessun dato per il periodo" honesto, sem ilustração fofa. Uma seção sem itens (ex.: zero insoluti) mostra **0** com sinal calmo de "tudo em ordem", não some.
- **Carregando:** skeleton de riga com a massa da superfície (sem spinner de marketing); número aparece quando existe, nunca um placeholder que engana.
- **Erro:** mensagem de tinta sóbria + ação de retry; nunca esconde que falhou (Lei 1: honestidade de estado).
- **Offline (Capacitor, operador em movimento):** banner discreto "dati non aggiornati — offline"; **ações de rito ficam bloqueadas offline** (não se emite fattura sem rede) e dizem por quê. `[modo: sem ambiguidade de estado]`
- **Degradado:** se um endpoint responde parcial, mostra o que veio + marca o que faltou como lacuna explícita (não inventa número). `[regra de ouro]`

**Motion.** Discreta e funcional (sinestesia=2, entropia=2):
- Transição de estado ao confirmar rito: a riga/selo **muda de peso** brevemente (Moholy: texto muda de peso conforme estado), não coreografia.
- Expandir nó do organigramma / abrir detalhe: deslocamento curto **com peso** (Lissitzky: placas movem, não flutuam líquido). `[card: Lissitzky]`
- Fresta de foco: entrada lenta, corte de luz contido. `[card: Ando]`
- **`prefers-reduced-motion` respeitado sempre**; nenhum número fiscal se move. `[gate: item 12]` `[vetor: entropia — trava]`

**Som / haptic.** Mínimo, confirmatório, **opcional e desligável** (sinestesia=2): um **click seco** de confirmação ao fechar um rito fiscal/financeiro; nada mais. Sem som de leitura, sem recompensa. Mapa som→significado: **um** tom = "ação de consequência confirmada". No mobile, haptic leve equivalente, também desligável. `[vetor: sinestesia — trava]` `[gate: item 12]`

**Acessibilidade.** Todo controle "tátil" tem equivalente por teclado + ARIA (tactilidade<7 dispensa orçamento de cockpit, mas não dispensa paridade). Estado nunca comunicado só por cor: SOSPESO, dichiarazione faltando e soglia cruzada têm **texto/ícone além da cor** (daltonismo). Contraste do texto sobre a massa escura no mínimo AA; a fresta de foco garante o realce sem depender de matiz. Alvos de toque ≥ 44px no mobile.

**Edge cases** (cobertos em detalhe na §9): vazio, erro, carregando, offline, degradado — acima; + os casos de dado (SOSPESO, dichiarazione null, soglia cruzada, OMAGGIO com canone 0) tratados na tela de prova.

---

### ASSINATURA FORMAL *(obrigatória — o que o teste do template cobra)*

Três gestos formais **proprietários**: forma/corte/comportamento que **só a Direzione do Cherry** tem, porque nascem do dado que só este produto possui — o organigramma SGANCIO, a soglia €5k, a numerazione fiscale, a banda pendenze. Honestidade calibrada (Rams) NÃO está aqui — é pré-requisito. Cada gesto: o que o olho vê · onde · origem · proibições.

#### Gesto 1 — **La Riga di Sgancio** (a linha de desacoplamento do organigramma)
- **O que o olho vê:** no organigramma, a conexão entre um agente e seu upline não é uma linha de árvore genérica. É um **traço horizontal curto que "quebra" (offset em degrau) exatamente no ponto onde a regra SGANCIO se aplica**. A regra real (verificada em `server.ts:2388-2401`): um ancestral só ganha network% de um descendente se **`ancestor.levelOrder > descendant.levelOrder`** — mesmo nível **não** paga network; quando o descendente ultrapassa o ancestral em carreira, há **desacoplamento** (sgancio). Onde ocorre o sgancio (ou onde a network do pai é `0`), a linha tem um **corte visível** — um degrau ortogonal com uma micro-fresta de luz no vértice; onde o pai efetivamente ganha network daquele filho, a linha é reta e íntegra e a provvigione **network** aparece ancorada no vértice. O olho lê a topologia comercial pela **integridade ou ruptura da linha**.
- **Onde:** exclusivamente no organigramma de agenti (midground; o vértice de corte vira foreground quando selecionado).
- **Origem:** a regra SGANCIO real do piano provvigionale — `ancestor.levelOrder > descendant.levelOrder` (`server.ts:2388-2401`) + `networkMonthly`; `[card: Moholy-Nagy — linha como vetor/força]` + `[card: Lissitzky — o corte com peso]` + `[card: Ando — a micro-fresta no vértice]`.
- **Proibições:** a linha nunca é decorativa — sem sgancio, sem corte; o degrau só existe onde o dado diz que a contribuição de network para. Nunca animar a linha como "fluxo" (seria entropia sobre estrutura). Nunca curva orgânica (geometria ortogonal).

#### Gesto 2 — **La Soglia** (o umbral fiscal de €5.000 como corte de luz, não barra de progresso)
- **O que o olho vê:** o estado de um agente perante o teto ENASARCO de €5.000/ano **não** é uma progress-bar. É uma **coluna vertical de massa escura** (o "cofre" do ano) onde o `liquidatoAnno` preenche de baixo para cima como **sedimento de tinta**; **duas** frestas de luz horizontais fixas atravessam a coluna: a linha-teto dos **€5.000** e, abaixo dela, a **linha-gatilho dos €4.000 (80%)** — porque é aos 80% que o compliance começa a cobrar (verificado no endpoint). Duas leituras simultâneas e inequívocas: (a) **quão perto** o sedimento chegou das frestas; (b) se a `dichiarazione` está OK, as frestas são **serenas** (luz contida); se **falta** (`dichiarazioneOk:false`), a fresta-gatilho **vira a marca de maior contraste da tela** e ganha uma micro-etiqueta "dichiarazione mancante" — mesmo que o valor seja menor que o de um colega em dia. O risco fiscal salta **acima** do mero montante.
- **Onde:** no card de cada agente em `pendenze.soglia5k[]` e como coluna-síntese na tabela de agenti (foreground quando em risco).
- **Origem:** `pendenze.soglia5k[].{liquidatoAnno, dichiarazioneOk}` + teto €5k real; `[card: Ando — massa escura ↔ fresta de luz, luz significa porque há sombra]` + `[card: Stuart Hall — revelar a consequência fiscal antes]`.
- **Proibições:** o sedimento (número lido para decidir) **não oscila** (entropia trava); a fresta não pisca decorativamente — só muda de contraste conforme o estado real da dichiarazione. Nunca vermelho de pânico: é âmbar/alto-contraste de responsabilidade. Nunca esconder o caso "€3.910 sem dichiarazione" atrás do caso "€4.280 em dia".

#### Gesto 3 — **Il Protocollo** (a numerazione SDI como selo gravado, não como toast)
- **O que o olho vê:** emitir uma fattura não fecha um modal comum. Aparece um **selo retangular monoespaçado** que exibe o **próximo numero na sequência** — `CB/2026/000020` — com o formato `CB / AAAA / NNNNNN` **segmentado por finas frestas verticais** (prefisso · anno · progressivo), o progressivo em maior peso. Ao confirmar o rito (cerimonialidade 8), o selo **assenta com um deslocamento curto e um click seco** e o número passa de "da assegnare" (tinta esmaecida) a **gravado** (tinta plena) — a irreversibilidade fica visível na transição de peso do próprio número. O olho vê um **documento sendo protocolado**, não uma notificação.
- **Onde:** no rito de emissione (foreground puro, §7 nível 8) e, esmaecido, ao lado de cada pendenza `daFatturare` (prévia do numero que ela receberá).
- **Origem:** numerazione SDI real `CB/2026/NNNNNN` + `pendenze.daFatturare[]`; `[card: Détournement/Stuart Hall — o checkout/emissão vira ritual de autoria consciente]` + `[card: Lissitzky — o selo com peso e assentamento]` + `[card: Moholy-Nagy — a segmentação tipográfica do protocollo]`.
- **Proibições:** o numero nunca aparece "gravado" antes da confirmação (mentira de estado — Lei 1); sem confetes/celebração (é fisco, não jogo); o click é opcional/desligável (sinestesia trava). Fora do rito de emissione o selo é sempre a prévia esmaecida, nunca sugere que já foi emitido.

*(Nota de aterrissagem, não vinculante ao gate do brief: os três gestos são grepáveis quando virarem código — `sgancio-vertex`, `soglia-column`, `protocollo-seal` — e entram no lint da identidade.)*

---

## 9. `prova` — O menor artefato que prova a direção

**Artefato:** **a tela-home da Direzione** — "Comando" — renderizada em **duas larguras (mobile 375px e desktop)**, com dado real do `data-sample.json`, contendo as zonas que carregam a identidade e todos os edge cases pedidos. É a menor superfície que exercita os três gestos de assinatura + a proporção leitura/decisão + o modo. O implementador deve conseguir construí-la **sem falar com o maker**; abaixo está o suficiente.

### 9.1 Layout e composição (o implementador constrói a partir disto)

**Desktop** (≥1024px): sidebar de seções à esquerda com os labels reais do produto (`Dashboard Generale`, `Gestione Rete Staff`, `Pipeline Lead CRM`, `Lista Merchant Attivi`, `Approvazioni Omaggio`, `Piani & Provvigioni`, `Audit & Security Logs` — curtos no mobile: Home/Rete/Lead/Merchant/Omaggio/Piani/Audit), conteúdo à direita empilhado nesta ordem de leitura (Moholy: a leitura viaja de cima). A banda pendenze **atravessa** essas seções: é a camada de decisão da Dashboard, não uma aba isolada.
1. **Faixa KPI** (midground, recuo/leitura): 6 blocos tabulares — `MRR nazionale € 3.151`, `Esercenti attivi 23` (+ `2 omaggio` em tinta secundária), `Agenti attivi 8`, `Incassato mese € 2.603`, `Fatture emesse 19`, `Periodo 2026-07`. Números em mono, sem cor, sem animação. Respiração de entropia=2 permitida **só** em MRR/Incassato (acumulam no mês).
2. **La Barra di Decisione — banda pendenze** (foreground; a placa deslocada de Lissitzky, eixo próprio, rompe o grid): 5 contadores lado a lado, cada um `rótulo + contagem`, clicável se >0:
   - `Da fatturare · 3` → abre lista com `Bar Centrale · 2026-07 · € 167,14`, `Trattoria da Nino · 2026-07 · € 167,14`, `Panificio Aurora · 2026-06 · € 167,14`, cada um com o **selo Protocollo esmaecido** do numero que receberá.
   - `Insoluti · 1` → `Estetica Luce · ctr_003 · dal 2026-07-02` (SOSPESO relacionado — ver 9.2).
   - `Payout da chiudere · 5` (rito nível 5 ao abrir cada um).
   - `Soglia 5k · 2` → mostra os **Gesto 2** (coluna Soglia) dos dois agentes (ver 9.2).
   - `Storni da recuperare · 1` → `Marco Bianchi · 2026-05 · Bar Vecchio · € 137,00`.
   Contador em `0` mostra `0` calmo (não some, não alarma).
3. **Tabella agenti + organigramma** (midground; trilho Moholy + Gesto 1): colunas `Agente | Inquadramento | MRR generato | Personale | Network | Totale | Stato`, dinheiro em mono alinhado à direita. Toggle "vista tabella / vista organigramma"; no organigramma, a **Riga di Sgancio** (Gesto 1) desenha a hierarquia por `levelOrder`.
4. **Lista esercenti** (midground): `Nome | Categoria | Città | Stato | Canone | Agente` — com o tratamento de status de 9.2.

**Mobile (375px)** (Capacitor; operador em movimento, uma mão): bottom-nav com as mesmas seções; conteúdo em coluna única, ordem idêntica:
- KPIs viram **2 por linha** (3 linhas), mono, legíveis sob luz de rua.
- A **banda pendenze** vira uma **pilha vertical de 5 rigas de decisão** (mantém o peso/eixo distinto do resto por contraste de massa, já que não cabe deslocamento horizontal) — cada uma com contagem à direita e chevron; toque abre o detalhe. **Este é o elemento primário da home mobile** (é o que exige decisão em movimento).
- Tabela de agenti → **cards empilhados** de riga contábil (nome + totale em destaque; demais valores em segunda linha); dinheiro sempre alinhado. Alvos ≥44px.
- Organigramma no mobile: **acordeão** por nó — tocar um agente expande filhos; a Riga di Sgancio aparece como o **corte/degrau** entre pai e filho (Gesto 1 preservado na vertical).
- Sinais críticos (SOSPESO, dichiarazione mancante, soglia) recebem a **fresta de luz** (Ando) para saltar sem zoom.

### 9.2 Edge cases obrigatórios (todos com dado do sample, ambas larguras)

| Caso | Dado | Comportamento exigido |
|---|---|---|
| **Esercente SOSPESO** | `mer_003 Estetica Luce · Torino · SOSPESO · €137 · Alessandro Conti` | Riga com **fresta de luz** (Ando) + etiqueta SOSPESO em âmbar/ocre **com texto** (não só cor). Cruza-referência com o insoluto `ctr_003` (mesma origem). Botão foreground **Riattiva** (rito 5). Nunca some da lista; nunca vira erro. |
| **Agente com dichiarazione FALTANDO** | `stf_003 Alessandro Conti · Venditore · dichiarazioneAnno: null` **e** `pendenze.soglia5k`: Conti `€3.910 · dichiarazioneOk:false` | **Gesto 2 (Soglia)** em estado de risco: fresta de alto contraste + etiqueta "dichiarazione mancante". O risco de Conti aparece **acima** do de Giulia Ferrari (`€4.280,50 · dichiarazioneOk:true`, fresta serena) **apesar** do valor menor. Este contraste é a prova visível de que a interface lê estado, não só montante. |
| **Agente SOSPESO na rede** | `stf_005 Davide Greco · Manager · suspended:true` | No organigramma/tabela: nó/riga em massa rebaixada (dessaturado) + etiqueta SOSPESO com texto; a Riga di Sgancio até ele fica visível mas **atenuada**. Continua contando na leitura (não desaparece), mas não é foreground. |
| **Organigramma SGANCIO** | `agenti[].levelOrder` 1–6 (Coordinatore 5, Supervisore 2, Venditore 1, Manager 4) + `networkMonthly` | **Gesto 1** desenha a hierarquia; onde `networkMonthly:0` (Venditori Alessandro/Francesca, Manager Davide) a linha ao pai **não carrega network** → tratada como ponta contínua; onde há network (Marco 148,30; Giulia 54,80) o **vértice de corte** ancora o valor. Expandir/colapsar é fluido (atrito 0). |
| **OMAGGIO com canone 0** | `mer_005 ONLUS Il Sorriso · No-profit · OMAGGIO · €0 · Francesca Russo` | Etiqueta OMAGGIO azul-tinta neutra; canone exibido como `€ 0` explícito (não vazio, não "grátis!"); **não** entra em pendenze de fatturazione (é omaggio) — a ausência é correta, não um bug. |
| **Banda pendenze com contador 0** | qualquer counter que fosse 0 | Mostra `0` sereno (estado "tudo em ordem"), não some e não alarma — a ausência de dinheiro parado é informação boa e legível. |
| **Lista de pendenze truncada (>100)** | endpoint limita cada categoria a 100 linhas | O contador da banda usa `counts.*` (a contagem **real**); a lista expandida mostra as primeiras 100 + faixa honesta "**+N oltre le prime 100**". Nunca deixar o operador crer que a lista é o total. |
| **Vazio / carregando / offline / degradado** | — | Vazio: "nessun dato per il periodo" sóbrio. Carregando: skeleton de riga na massa. **Offline (mobile):** banner "dati non aggiornati — offline" + **ritos bloqueados** (Emetti fattura/Payout/Addebito desabilitados com motivo). Degradado: renderiza o que veio, marca o que faltou como lacuna explícita — nunca inventa número. |

### 9.3 O que a prova precisa demonstrar (critério de sucesso para o juiz da prova, itens 13–14)
- **Teste do template (13):** trocar a paleta **não** deve reduzir a tela a um admin-kit genérico — porque a **Riga di Sgancio**, a **coluna Soglia** e o **selo Protocollo** são formas que só existem por causa deste dado. Se sumissem, sumiria a identidade.
- **Anti-cosplay reverso (14):** cada card citado tem execução material visível — Ando na fresta de foco sobre o estado crítico e na coluna Soglia; Lissitzky na banda de decisão deslocada e no selo que assenta; Moholy no trilho da riga e na segmentação do Protocollo; Stuart Hall no rito que revela a consequência fiscal antes; Rams na ausência total de ornamento. Nenhuma lei fica só citada.

---

### Rastreabilidade — índice das decisões não-óbvias
`[modo: Equipamento médico/científico + acento Central de comando]` · `[vetores: Tat4 Den8 Geo6 Sin2 Ent2 Cer5→8]` · `[cards: Rams, Ando, Lissitzky, Moholy-Nagy, Stuart Hall]` · Leis: 1 (função antes de teatro — nada aparece sem fonte no data-sample), 2 (fricção só nas 6 ações que movem dinheiro/fisco; leitura/rede/busca fluidas), 3 (cada card materializado, nenhum literal). Precedência aplicada: Leis > Modo > Vetores > Cards.

### Lacunas declaradas (honestas)
1. **Canone €137 vs €129:** o `data-sample.json` traz `canone: 137`, mas a verificação read-only do backend (`prod-seed.ts` `cb_settings.pricing.baseMonthlyPrice: 129`) **não** reconcilia 137 com o base 129 (129×1,22 IVA ≈ 157, não 137). O preço real é travado na assinatura (`monthly_price_at_signature` por contrato) e pode variar por plano. **Não afirmo** que €137 é o canone universal — a tela deve exibir o `canone` que o endpoint retornar por esercente, não uma constante. Lacuna a reconciliar na fatturazione durante a aterrissagem.
2. **Numerazione — próximo número exato:** o formato `CB/2026/NNNNNN` é fato (sezionale "CB", 6 dígitos que crescem sem quebrar; `server.ts:627-635`, atômico por (sezionale, ano)). O próximo progressivo (ex.: `000020`) é **ilustrativo** derivado de `fattureEmesse:19`. O selo Protocollo deve puxar o número real via `allocateProgressiveInvoiceNumber` do backend, **nunca** calcular no cliente.
3. **Truncamento de pendenze:** o endpoint `pendenze-denaro` **limita cada categoria a 100 linhas**. A banda de decisione e as listas expandidas devem exibir a **contagem real** (`counts.*`) mesmo quando a lista vier truncada, e sinalizar "+N oltre le prime 100" honestamente — nunca deixar o operador crer que viu tudo.
4. **Superfície atual (confirmada, read-only):** `AdminView.tsx` em `~/FIDELITY-PRODUCT/FidelityProduct1/src/components/AdminView.tsx`, **4.246 linhas**, **Tailwind inline sem tokens** (cores hardcoded: `#1D2D44`, `#E63946`, paletas slate/emerald/rose), 7 seções (dashboard/staff/leads/merchants/freeplans/listino/audit), **sidebar desktop → bottom-nav mobile** no breakpoint `md:`, KPIs no mount + banda pendenze lazy sob demanda. Verificado — não é dossiê não-checado. (Produto-alvo permanece **intocado**.)
5. **SGANCIO — resolvido, não lacuna:** a condição exata (`ancestor.levelOrder > descendant.levelOrder`, `server.ts:2388-2401`) foi confirmada e já está no Gesto 1; registrada aqui só para rastreabilidade.

---

## Assinatura

**Maker:** mente V1TRUVIO (O Novo Uomo Vitruviano), geração **gen-003**, produto **a fidelity product — Direzione**.
**Data:** 2026-07-06.
**Escopo respeitado:** nenhum código escrito; nada fora de `proofs/gen-003/`; produto-alvo `~/FIDELITY-PRODUCT/FidelityProduct1` **read-only e intocado**; nenhum commit.
**Estilo como input:** **negado** — nenhuma decisão estética veio do dossiê; todas derivam do diagnóstico do operador (§1), da máquina (§2) e do dado (`data-sample.json`).
**Precedência:** Leis > Modo > Vetores > Cards, aplicada em todo conflito.
**Gates:** este brief **não** foi auto-julgado como aprovado — a auto-checagem do maker é rascunho; o veredito é do juiz frio (12 itens sobre o brief; 13–14 sobre o artefato aterrissado).
**Assinatura formal (§8):** *La Riga di Sgancio* · *La Soglia* · *Il Protocollo* — três gestos que só a Direzione do Cherry possui, nascidos do organigramma SGANCIO, da soglia €5k e da numerazione fiscale.
