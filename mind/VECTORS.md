# VECTORS — Os seis vetores gerativos

Os vetores são a API estética da mente: seis eixos de 0 a 10 que, calibrados por produto, geram identidades distintas a partir do mesmo núcleo filosófico. **Toda geração declara o perfil completo — os seis valores, cada um com justificativa de uma linha.** Perfil não declarado = geração inválida.

Precedência em conflito: **Leis > Modo > Vetores > Cards.** (Um vetor alto nunca autoriza violar uma lei; um card nunca autoriza extrapolar o perfil.)

---

## 1. Tactilidade

**Pergunta:** quanto esta interface precisa parecer tocável?

| Valor | Significado |
|---|---|
| 0 | software abstrato, quase editorial |
| 3 | botões com estados claros |
| 5 | controles com massa, sombra e resposta |
| 8 | knobs, switches, sliders, plugs |
| 10 | cockpit físico completo |

**Trava:** tactilidade ≥ 7 exige orçamento de performance declarado (sombras, estados e motion custam) e paridade de acessibilidade — todo controle "físico" tem equivalente por teclado e ARIA.

## 2. Densidade informacional

**Pergunta:** quanta informação aumenta domínio sem virar ruído?

| Valor | Significado |
|---|---|
| 0 | silêncio contemplativo |
| 3 | contexto mínimo |
| 5 | status, histórico e próximos passos |
| 8 | telemetria, diagnóstico, múltiplos estados |
| 10 | console operacional completo |

**Trava:** densidade ≥ 7 exige o teste de zona: cada zona da tela responde por escrito "que pergunta do operador eu respondo?". Zona sem pergunta = zona removida. *A interface pode ser densa, mas nunca indistinta.*

## 3. Geometria

**Pergunta:** a interface deve acolher, organizar ou comandar?

| Valor | Significado |
|---|---|
| 0 | orgânica, fluida, biomórfica |
| 3 | suave, editorial |
| 5 | modular, funcional |
| 8 | ortogonal, mecânica |
| 10 | construtivista, angular, industrial |

**Trava:** geometria ≥ 8 exige diagonal/tensão **funcional** (direção de leitura, hierarquia de decisão) — ângulo decorativo reprova na Lei 1.

## 4. Sinestesia

**Pergunta:** quais canais sensoriais confirmam estado?

| Valor | Significado |
|---|---|
| 0 | silêncio total |
| 3 | microanimações visuais |
| 5 | haptic/áudio opcional |
| 8 | som, luz, vibração e ritmo |
| 10 | instrumento audiovisual completo |

**Trava:** som/vibração sempre desligáveis; sinestesia ≥ 5 exige mapa som→significado (cada tom confirma UM estado; som sem estado = teatro). Nunca recompensa viciante — sinal de atenção, não dopamina.

## 5. Entropia viva

**Pergunta:** o sistema deve parecer estável, vivo ou em combustão?

| Valor | Significado |
|---|---|
| 0 | imóvel, preciso, rígido |
| 3 | respiração sutil |
| 5 | dessincronia leve |
| 8 | sinais vivos, oscilação, ruído controlado |
| 10 | máquina instável, laboratório em atividade |

**Trava:** entropia NUNCA sobre dado crítico — número que o operador lê não oscila decorativamente. Oscilação legítima representa sinal real (carga, latência, atividade); `prefers-reduced-motion` respeitado sempre.

## 6. Cerimonialidade

**Pergunta:** esta ação merece rito?

| Valor | Significado |
|---|---|
| 0 | ação instantânea |
| 3 | confirmação leve |
| 5 | gesto deliberado |
| 8 | ritual de autorização |
| 10 | sequência completa de acoplamento, calibragem ou ativação |

**Trava (a mais importante do sistema):** cerimonialidade > 0 exige o **mapa de consequência** — a lista explícita das ações com risco/irreversibilidade/delegação que recebem rito, e a declaração do que permanece fluido. Rito em ação banal reprova na Lei 2. Este vetor existe para impedir que *friction-first* vire *friction everywhere*.

---

## Perfis de exemplo (calibrações canônicas)

| Produto | Tat | Den | Geo | Sin | Ent | Cer | Resultado |
|---|---|---|---|---|---|---|---|
| Escrita editorial | 3 | 4 | 5 | 1 | 2 | 3 | interface calma, tipografia no comando, sinais discretos de máquina |
| Painel de automação IA | 7 | 8 | 8 | 4 | 6 | 8 | cockpit operacional, conectores, logs, rituais de ativação |
| Ferramenta criativa A/V | 9 | 6 | 6 | 8 | 7 | 5 | instrumento visual, knobs, pads, resposta sonora |
| Login/autenticação | 5 | 2 | 6 | 3 | 2 | 7 | pórtico ritualizado — passagem, acoplamento, confiança |

O mesmo núcleo, quatro mundos. É isso que prova que a mente é compilador, não tema.
