// lint.mjs — o lint MECÂNICO da identidade gen-001 · flight-watcher.
// Regras grepáveis derivadas do BRIEF.md (§8 sistema visual / §9 prova / leis 1-2-3).
// Exit != 0 em qualquer violação. No espírito do almus-lint (zero deps).
//
// uso: node lint.mjs            (varre a pasta gen-001 inteira)
//      node lint.mjs <arquivo>  (um alvo específico)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', D = '\x1b[2m', X = '\x1b[0m';

// tokens.css é GERADO — hex cru é esperado lá (é a definição da paleta). Não linta.
const GERADOS = new Set(['tokens.css']);

const target = process.argv[2] ? join(process.cwd(), process.argv[2]) : here;

const collect = (p) => {
  const st = statSync(p);
  if (st.isFile()) return /\.(html|css|js)$/.test(p) ? [p] : [];
  return readdirSync(p)
    .filter((n) => !n.startsWith('.') && n !== 'node_modules')
    .flatMap((n) => collect(join(p, n)));
};

const files = collect(target).filter((f) => !GERADOS.has(basename(f)));
if (!files.length) { console.error('nenhum artefato .html/.css/.js em', target); process.exit(2); }

let fails = 0, warns = 0;
const report = (level, rule, file, line, detail) => {
  const tag = level === 'FAIL' ? `${R}[FAIL]${X}` : `${Y}[WARN]${X}`;
  console.log(`${tag} ${rule} ${D}${basename(file)}:${line}${X} ${detail}`);
  if (level === 'FAIL') fails++; else warns++;
};

const lineOf = (src, idx) => src.slice(0, idx).split('\n').length;

// ---- regras que operam sobre CSS ----
function lintCss(file, src) {
  const lines = src.split('\n');

  // (a) nenhuma animação/transição em seletor de preço/piso/veredito (trava de entropia).
  //     Detecta blocos cujo seletor casa preço/piso/veredito E que contêm animation/transition.
  const bloco = /([^{}]+)\{([^{}]*)\}/g;
  let mb;
  while ((mb = bloco.exec(src))) {
    const sel = mb[1];
    const corpo = mb[2];
    const tocaCritico = /v1t-preco|v1t-ow__preco|__valor|v1t-trilho__marca\[data-tipo="atual"\]|data-estado="[^"]*"\]\s*\.v1t-preco/.test(sel)
      || /\bv1t-preco\b|\bv1t-ow__preco\b/.test(sel);
    if (tocaCritico && /\b(animation|transition)\s*:/.test(corpo) && !/\b(animation|transition)\s*:\s*none\b/.test(corpo)) {
      report('FAIL', 'a preço/piso/veredito-animado', file, lineOf(src, mb.index),
        'seletor de preço/piso/veredito com animation/transition — trava de entropia (§8/Lei 1)');
    }
  }

  // (b) prefers-reduced-motion presente no CSS de identidade.
  if (basename(file) === 'core.css' && !/prefers-reduced-motion/.test(src)) {
    report('FAIL', 'b sem-reduced-motion', file, 1, 'core.css deve conter @media (prefers-reduced-motion) (§8/gate:12)');
  }

  // (c) a cor quente (luz-de-acao) só nas zonas Foreground permitidas:
  //     veredito, gesto de compra, rito, linha em-alvo da matriz, E os estados-achado da barra
  //     histórica (no-piso / novo-piso) — o brief §8 declara "novo-piso é o único momento que
  //     merece a luz mais forte". Proíbe luz-de-acao no CHROME de recuo (painel, tendência, OW,
  //     cabeçalho, demo, e o corpo em repouso do histórico).
  const ZONA_PROIBIDA = /\.v1t-painel\b|\.v1t-tendencia__(seta|rotulo|nota)|\.v1t-ow\b(?![_-])|\.v1t-cabecalho|\.v1t-demo/;
  // exceção declarada: seletor de estado-achado da barra histórica pode acender a luz.
  const EXCECAO_ACHADO = /data-estado="(no-piso|novo-piso|em-alvo)"/;
  const bloco2 = /([^{}]+)\{([^{}]*)\}/g;
  let mc;
  while ((mc = bloco2.exec(src))) {
    const sel = mc[1], corpo = mc[2];
    if (!/luz-de-acao/.test(corpo)) continue;
    if (EXCECAO_ACHADO.test(sel)) continue;                 // §8 Estados: achado real merece a luz
    // histórico em repouso (sem data-estado de achado) não pode ter luz quente
    const chromeRepouso = /\.v1t-historico(__titulo|__leitura)?\b(?![^{]*data-estado="(no-piso|novo-piso)")/.test(sel)
      || ZONA_PROIBIDA.test(sel);
    if (chromeRepouso && ZONA_PROIBIDA.test(sel)) {
      report('FAIL', 'c luz-quente-fora-de-zona', file, lineOf(src, mc.index),
        'cor quente (luz-de-acao) em zona de recuo — só Foreground: veredito, compra, rito, linha em-alvo, achado histórico (§8/Ando)');
    }
  }

  // (d) proibidos tokens/valores de verde-sucesso e vermelho-alarme permanente.
  //     Nomes de token proibidos + hex crus notórios de verde-ok / vermelho-alarme.
  lines.forEach((ln, i) => {
    if (/--v1t-cor-(ok|sucesso|success|verde|danger|alarme|erro|red)\b/i.test(ln)) {
      report('FAIL', 'd token-proibido', file, i + 1, 'token de verde-sucesso / vermelho-alarme é proibido (§8/modo/Stuart Hall)');
    }
  });

  // (i) cores hardcoded fora de tokens.css: no core.css, nenhum hex/rgb() cru — tudo via var(--v1t-*).
  if (basename(file) === 'core.css') {
    lines.forEach((ln, i) => {
      const semComentario = ln.replace(/\/\*.*?\*\//g, '');
      const hex = semComentario.match(/#[0-9A-Fa-f]{3,8}\b/);
      if (hex) report('FAIL', 'i hex-cru-no-core', file, i + 1, `hex cru ${hex[0]} — use var(--v1t-*)`);
      const rgb = semComentario.match(/\b(rgb|rgba|hsl|hsla)\(/);
      if (rgb) report('FAIL', 'i cor-crua-no-core', file, i + 1, `${rgb[1]}() cru — use var(--v1t-*)`);
    });
  }
}

// ---- regras que operam sobre HTML ----
function lintHtml(file, src) {
  const lines = src.split('\n');

  // (e) tabela com <th> reais.
  if (/<table/.test(src)) {
    if (!/<th\b/.test(src)) report('FAIL', 'e tabela-sem-th', file, 1, '<table> sem <th> real (§8 acessibilidade — leitor de tela)');
    // cada coluna do cabeçalho deve ser <th scope="col">
    const thead = (src.match(/<thead[\s\S]*?<\/thead>/) || [''])[0];
    if (thead && !/<th[^>]*scope="col"/.test(thead)) {
      report('FAIL', 'e th-sem-scope', file, 1, 'cabeçalho da matriz sem <th scope="col"> (§8 acessibilidade)');
    }
  }

  // (f) gesto de compra é <a>/<button> focável, nunca div clicável.
  //     Detecta div/span com onclick ou class de compra.
  lines.forEach((ln, i) => {
    if (/<(div|span)[^>]*\bv1t-compra\b/.test(ln)) {
      report('FAIL', 'f compra-em-div', file, i + 1, 'gesto de compra em <div>/<span> — deve ser <a>/<button> focável (§8/atrito:3)');
    }
    if (/<(div|span)[^>]*\bonclick=/.test(ln)) {
      report('FAIL', 'f div-clicavel', file, i + 1, 'div/span com onclick — use <a>/<button> (§8 acessibilidade)');
    }
  });

  // (g) estado em-alvo carrega rótulo textual, não só cor.
  if (/data-estado="em-alvo"/.test(src)) {
    // deve existir o texto "Em alvo" na etiqueta (não depender só da cor da fresta).
    if (!/Em alvo/i.test(src)) {
      report('FAIL', 'g em-alvo-sem-rotulo', file, 1, 'estado em-alvo sem rótulo textual "Em alvo" — paridade sem cor (§8/Lei 1)');
    }
  }

  // (h) zero URLs externas (offline-first): nenhum src/href http(s) para host externo
  //     (deep_links do Google Flights são permitidos — são o gesto de compra real, não um asset de página;
  //      o que proíbe-se é CARREGAR recurso externo: <script src=http>, <link href=http>, <img src=http>, @import http, url(http)).
  lines.forEach((ln, i) => {
    const carregaExterno = /(<script[^>]+src=|<link[^>]+href=|<img[^>]+src=|@import\s+|url\()\s*["']?https?:\/\//i.test(ln);
    if (carregaExterno) {
      report('FAIL', 'h recurso-externo', file, i + 1, 'carrega recurso de host externo — offline-first proíbe (§8 força offline)');
    }
  });
}

// ---- regra (h) também vale para CSS (@import / url() externos) e JS (fetch/import externo) ----
function lintExternoGenerico(file, src) {
  const lines = src.split('\n');
  lines.forEach((ln, i) => {
    if (/@import\s+["']?https?:\/\//i.test(ln) || /url\(\s*["']?https?:\/\//i.test(ln)) {
      report('FAIL', 'h recurso-externo', file, i + 1, 'CSS carrega recurso externo — offline-first proíbe');
    }
    if (/\b(fetch|import)\s*\(\s*["']https?:\/\//i.test(ln) || /importScripts\(\s*["']https?:\/\//i.test(ln)) {
      report('FAIL', 'h fetch-externo', file, i + 1, 'JS busca recurso externo — offline-first proíbe');
    }
  });
}

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const ext = file.split('.').pop();
  if (ext === 'css') { lintCss(file, src); lintExternoGenerico(file, src); }
  else if (ext === 'html') { lintHtml(file, src); }
  else if (ext === 'js') { lintExternoGenerico(file, src); }
}

console.log('');
if (fails > 0) {
  console.log(`${R}FAIL${X} — ${fails} violação(ões), ${warns} aviso(s), ${files.length} arquivo(s)`);
  process.exit(1);
}
console.log(`${G}PASS${X} — 0 violações, ${warns} aviso(s), ${files.length} arquivo(s) verificado(s)`);
