# Pitfalls — cicatrizes das gerações reais

Cada item abaixo aconteceu de verdade (gen-001/gen-002, 2026-07-06). O spec dos assentos já os previne; este arquivo explica POR QUÊ, para quando alguém quiser "simplificar".

1. **Leis viram metáforas mortas sem assinatura formal.** A gen-001 v1 passou 12/12 no gate do brief e saiu "dark dashboard genérico com accent" — a placa de Lissitzky tinha virado "um card maior", a fresta de Ando virou accent color. O gate do brief mede honestidade, não força. Por isso: assinatura formal obrigatória no §8 + gate da prova (13–14) sobre o artefato. (verdict 001)

2. **A auto-validação do maker/coder mede proxies, não afirmações.** O coder da gen-001 declarou "lado frio cabe no campo"; a medição do juiz refutou (+74.9px de interpenetração, selo 100% invisível por elementFromPoint). Por isso: o juiz NUNCA aceita números de quem fez — re-mede tudo; e o coder anota as medições das AFIRMAÇÕES (vãos, interpenetrações, elementFromPoint), não de aproximações.

3. **Agente termina o turno "esperando" verificação que não vai chegar.** O juiz da gen-002 parou no meio do julgamento aguardando um filho que já tinha morrido. Por isso: todo spec de assento termina com "não termine o turno sem o arquivo escrito e o veredito dado".

4. **Playwright MCP pode estar trancado por sessão concorrente.** Fallback provado da casa: Chromium headless isolado (binário do próprio Playwright) dirigido por CDP cru com Node built-ins, zero deps, mesmo viewport (1280×800). O driver fica no scratchpad, fora dos deliverables.

5. **Memória da casa pode estar stale — diff de permanência antes de obedecer.** O maker da gen-002 achou na medulla do m1nd um brand-audit "cyberpunk" que na verdade descrevia rasters antigos, não a UI atual — verificou contra o código e usou o código como verdade. Regra: claim de memória sobre o produto se confirma contra o estado atual antes de virar decisão de design.

6. **Estudo formal renderizado muda a escolha.** Na gen-001, o coder rejeitou a composição "espinha central" só depois de VER que ela enterrava o veredito abaixo da dobra. Esboço descrito não substitui esboço renderizado.

7. **Contaminação entre gerações.** Maker/coder de uma geração nova = agentes FRESCOS (mundo anterior vaza estética). Juiz pode ser reusado (o gate é checklist objetivo) — mas se estiver ocupado, juiz novo lê a mente do zero em ~10min.

8. **Cerimonialidade explode se cada confirmação virar rito.** A régua: rito só onde o mapa de consequência do §7 mapeou; escolher uma opção e executá-la podem ter níveis DIFERENTES (gen-002: escolher ingest = 3, executar = 5).
