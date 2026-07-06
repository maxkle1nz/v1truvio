// build-tokens.mjs — gerador DTCG → CSS custom properties. gen-002 · MENISCUS.
// Zero dependência (só node built-ins), no espírito do gerador do ALMUS (padrão, não identidade).
// Lê tokens.json (deste diretório) e escreve tokens.css com prefixo --mns-.
// Chaves internas que começam com "_" (ex.: "_doc") são metadados e não viram token.
// uso: node build-tokens.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const inFile = join(here, 'tokens.json');
const outFile = join(here, 'tokens.css');

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const lines = [];
const walk = (node, path) => {
  if (node && typeof node === 'object' && '$value' in node) {
    const name = ['mns', ...path.map(kebab)].join('-');
    const raw = node.$value;
    const value = Array.isArray(raw)
      ? raw.map((f) => (/\s/.test(f) ? `'${f}'` : f)).join(', ')
      : String(raw);
    lines.push(`  --${name}: ${value};`);
    return;
  }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (key.startsWith('$') || key.startsWith('_')) continue; // pula $schema, $type, e metadados _doc
      walk(node[key], [...path, key]);
    }
  }
};

const tokens = JSON.parse(readFileSync(inFile, 'utf8'));
walk(tokens, []);

const css = `/* GERADO por build-tokens.mjs a partir de tokens.json — não edite à mão. gen-002 · MENISCUS. */\n:root {\n${lines.join('\n')}\n}\n`;
writeFileSync(outFile, css);
console.log(`Gerado ${outFile} — ${lines.length} custom properties.`);
