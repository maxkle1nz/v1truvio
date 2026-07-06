# VERDICTS — o banco de vereditos do diretor

O gate pega **clichê**; ele não pega **mediocridade**. Uma geração pode passar nos 12 itens e ser sem graça — e o que separa isso do bonito é o veredito do Max. Este banco existe para que esse olho vire dado: **especialmente as rejeições de gerações que passaram no gate**, que são o material mais valioso de calibração da mente (o erro ensina mais que o acerto).

## Formato — `NNN-slug.md`

```markdown
# VERDICT NNN — <geração julgada, ex.: gen-001 flight-watcher>
- **veredito:** aprovado | rejeitado | aprovado-com-ressalvas
- **passou no gate?** sim/não (link para o GATE-VERDICT)
- **nas palavras do Max:** <o porquê, cru, sem tradução>
- **destilação:** o que disso vira candidato a card / trava / anti-padrão / modo (cada item = um PR possível na mente)
```

## Regras

1. **Rejeição sem destilação é veredito perdido** — sempre extrair o princípio por trás do "não gostei".
2. O veredito nunca edita a mente diretamente; ele gera **candidatos a PR** (curadoria, não drift).
3. Geração aprovada aqui + gate verde = pode virar preset em `presets/`.
