// build-tokens.mjs — achata tokens.json (W3C DTCG) em custom properties CSS.
// Adaptado do padrão ALMUS (scripts/build-tokens.mjs): zero deps, deriva caminhos de import.meta.url.
// Identidade gen-001 · flight-watcher — prefixo --v1t-*.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const inFile = join(here, 'tokens.json');
const outFile = join(here, 'tokens.css');

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const format = (raw) => {
  // fontFamily / fontFeature list → lista CSS (cita famílias com espaço).
  if (Array.isArray(raw)) {
    if (raw.every((n) => Array.isArray(n) || typeof n === 'number')) return raw.join(' '); // cubicBezier → "x y x y"
    return raw.map((f) => (/\s/.test(String(f)) ? `'${f}'` : f)).join(', ');
  }
  return String(raw);
};

const lines = [];
const walk = (node, path) => {
  if (node && typeof node === 'object' && '$value' in node) {
    const name = ['v1t', ...path.map(kebab)].join('-');
    lines.push(`  --${name}: ${format(node.$value)};`);
    return;
  }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (key.startsWith('$')) continue;
      walk(node[key], [...path, key]);
    }
  }
};

const tokens = JSON.parse(readFileSync(inFile, 'utf8'));
walk(tokens, []);

const css = `/* GERADO por build-tokens.mjs — não edite à mão. Fonte: tokens.json */\n:root {\n${lines.join('\n')}\n}\n`;
writeFileSync(outFile, css);
console.log(`Gerado ${outFile} — ${lines.length} custom properties.`);
