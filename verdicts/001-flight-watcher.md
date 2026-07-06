# VERDICT 001 — gen-001 · flight-watcher

- **veredito:** rejeitado na execução visual (direção, diagnóstico e honestidade não contestados)
- **passou no gate?** sim — 12/12 ([GATE-VERDICT](../proofs/gen-001/GATE-VERDICT.md)). **Este é o ponto do verdict:** o gate não pegou o que o diretor pegou.
- **nas palavras do Max:** *"vamos falar de VISUALMENTE. cara visualmente o nosso arquiteto deixa um pouco a desejar. não posso dizer que isso é interessante visualmente ainda."*

## Diagnóstico da rejeição (por que passou no gate e ainda assim é sem graça)

A tela é honesta, legível, calibrada — e **genérica**: um dark dashboard de cards retangulares com um accent âmbar. As leis do brief viraram **metáforas mortas** na aterrissagem: "placa Lissitzky com tensão assimétrica" virou *um card maior que o outro*; "fresta de luz de Ando" virou *accent color*; "massa" virou *fundo escuro*; "tipografia como vetor" virou *hierarquia de peso padrão*. Cada conceito foi mapeado no componente mais seguro do vocabulário dashboard-era. Não há uma diagonal, um corte, uma sobreposição, um gesto formal que um template não faria. A única peça com embrião de personalidade própria é a régua de posição histórica.

O defeito não está no brief (a direção sobreviveu ao veredito) nem primariamente no coder: **está na mente, que não exige força formal em nenhum ponto** — nenhum passo pede exploração compositiva, nenhum item do gate pergunta "um template geraria isto?", e citar um card sem executar a lei dele não reprova nada.

## Destilação — candidatos a PR na mente

1. **Gate item 13 — o teste do template:** "trocando a paleta, esta tela poderia sair de um kit de dashboard genérico?" SIM → reprova. A identidade precisa ser irredutível a template.
2. **Assinatura formal obrigatória (CONTRACT §8):** todo brief declara 2–3 **gestos formais proprietários** (forma, corte, composição ou comportamento que SÓ esta identidade tem — o bevel+cabos do ALMUS, o focus-slit do VERITAS); a aterrissagem é obrigada a materializá-los; o lint os verifica quando grepáveis.
3. **Estudo formal antes da aterrissagem (pipeline, passo 8.5):** entre gate e código, 2–3 explorações compositivas divergentes; a escolhida vira base do CSS. Coragem formal como etapa, não como acaso.
4. **Anti-cosplay reverso (extensão da Lei 3):** citar a lei sem executá-la é tão decorativo quanto cosplay. Lissitzky no brief → TEM que haver diagonal/tensão/deslocamento real na tela; Ando → a luz tem que cortar espacialmente, não ser badge. O juiz frio passa a auditar a EXECUÇÃO das leis citadas, não a citação.

## Nota de contexto da cobaia

O produto escolhido (monitor calmo de preços) foi ótimo para testar calibração de TOM (recusa do cockpit) e péssimo para exibir força FORMAL — produto quieto bem resolvido é sutil, e sutileza sem gesto vira tédio. As próximas gerações do P1 devem incluir uma classe de produto que exija presença formal alta.
