// lint.mjs — o lint MECÂNICO da identidade gen-001 · flight-watcher.
// Regras grepáveis derivadas do BRIEF.md (§8 sistema visual + ASSINATURA FORMAL / §9 prova / leis 1-2-3).
// Exit != 0 em qualquer violação. Zero deps, no espírito do almus-lint.
//
// Regras: (a) preço/veredito nunca anima  (b) prefers-reduced-motion presente
//         (c) luz quente só nas zonas de ação  (d) sem verde-sucesso/vermelho-alarme
//         (e) tabela com <th> reais  (f) compra é <a>/<button>  (g) em-alvo tem rótulo textual
//         (h) zero recurso externo (offline-first)  (i) cor crua proibida no core.css
//         ASSINATURA (verdict 001): (j) as 3 classes da assinatura existem no CSS e no HTML
//         (k) preço nunca vira comprimento de barra (posição em escala, não bar-chart)
//         (l) UMA única fenda luminosa (.corte-limiar 1x no specimen)
//         (m) nenhuma sobreposição de planos além da placa pênsil (allowlist de absolute)
//         (n) posição-x de objeto com preço deriva da FÓRMULA da escala (--preco), nunca left inline
//
// uso: node lint.mjs            (varre a pasta gen-001 inteira)
//      node lint.mjs <arquivo>  (um alvo específico)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', D = '\x1b[2m', X = '\x1b[0m';

// tokens.css é GERADO (definição da paleta — hex esperado). studies.html é ESBOÇO de estudo
// formal (protocolo de aterrissagem): passa pelas regras base, mas está isento das regras de
// assinatura j/l/n, que valem sobre o SPECIMEN (o artefato julgado).
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

/* ================= CSS ================= */
function lintCss(file, src) {
  const lines = src.split('\n');
  const ehCore = basename(file) === 'core.css';

  // (a) o NÚMERO do preço/veredito nunca anima (trava de entropia: número não gira).
  //     Deslocamento de pino/placa/entalhe é motion MAPEADO no brief (deslocamento com peso) — permitido.
  const bloco = /([^{}]+)\{([^{}]*)\}/g;
  let mb;
  while ((mb = bloco.exec(src))) {
    const sel = mb[1], corpo = mb[2];
    const tocaNumero = /\bv1t-preco\b|\bv1t-ow__preco\b/.test(sel);
    if (tocaNumero && /\b(animation|transition)\s*:/.test(corpo) && !/\b(animation|transition)\s*:\s*none\b/.test(corpo)) {
      report('FAIL', 'a numero-animado', file, lineOf(src, mb.index),
        'seletor do NÚMERO (preço/veredito) com animation/transition — trava de entropia (§8/Lei 1)');
    }
  }

  // (b) prefers-reduced-motion presente no CSS de identidade.
  if (ehCore && !/prefers-reduced-motion/.test(src)) {
    report('FAIL', 'b sem-reduced-motion', file, 1, 'core.css deve conter @media (prefers-reduced-motion) (§8/gate:12)');
  }

  // (c) a cor quente (luz-de-acao) só nas zonas de AÇÃO: corte-limiar, placa acesa, compra, rito,
  //     linha em-alvo da matriz, entalhe do alvo na régua. Proibida no chrome de recuo.
  const ZONA_PROIBIDA = /\.v1t-lado-frio\b|\.v1t-instrumentos\b|\.v1t-tendencia(__|\b)|\.v1t-selo(__|\b)|\.v1t-ow(__|\b)|\.v1t-cabecalho|\.v1t-demo|\.v1t-nota-estado|\.v1t-matriz-bloco__(titulo|legenda|cabecalho)/;
  const EXCECAO_ACAO = /data-estado="(em-alvo|novo-piso|no-piso)"|data-marca="em-alvo"|data-tipo="alvo"|corte-limiar|placa-pensil|v1t-compra|v1t-rito/;
  const bloco2 = /([^{}]+)\{([^{}]*)\}/g;
  let mc;
  while ((mc = bloco2.exec(src))) {
    const sel = mc[1], corpo = mc[2];
    if (!/luz-de-acao|derramamento/.test(corpo)) continue;
    if (EXCECAO_ACAO.test(sel)) continue;
    if (ZONA_PROIBIDA.test(sel)) {
      report('FAIL', 'c luz-quente-fora-de-zona', file, lineOf(src, mc.index),
        'cor quente em zona de recuo — a luz é evento do Foreground: fenda, placa acesa, compra, rito, linha em-alvo (§8/Ando)');
    }
  }

  // (d) proibidos tokens de verde-sucesso e vermelho-alarme permanente.
  lines.forEach((ln, i) => {
    if (/--v1t-cor-(ok|sucesso|success|verde|danger|alarme|erro|red)\b/i.test(ln)) {
      report('FAIL', 'd token-proibido', file, i + 1, 'token de verde-sucesso / vermelho-alarme é proibido (§8/modo/Stuart Hall)');
    }
  });

  // (i) cores cruas proibidas no core.css — tudo via var(--v1t-*).
  if (ehCore) {
    lines.forEach((ln, i) => {
      const semComentario = ln.replace(/\/\*.*?\*\//g, '');
      const hex = semComentario.match(/#[0-9A-Fa-f]{3,8}\b/);
      if (hex) report('FAIL', 'i hex-cru-no-core', file, i + 1, `hex cru ${hex[0]} — use var(--v1t-*)`);
      const rgb = semComentario.match(/\b(rgb|rgba|hsl|hsla)\(/);
      if (rgb) report('FAIL', 'i cor-crua-no-core', file, i + 1, `${rgb[1]}() cru — use var(--v1t-*)`);
    });
  }

  // (k) PREÇO NUNCA É BARRA: --preco jamais dirige width/height (posição em escala, não comprimento).
  const bloco3 = /([^{}]+)\{([^{}]*)\}/g;
  let mk;
  while ((mk = bloco3.exec(src))) {
    const corpo = mk[2];
    if (/(width|height)\s*:[^;]*var\(--preco\)/.test(corpo)) {
      report('FAIL', 'k preco-como-barra', file, lineOf(src, mk.index),
        '--preco dirigindo width/height = bar-chart — a assinatura é POSIÇÃO em escala compartilhada (G1 proíbe)');
    }
  }

  // (m) SOBREPOSIÇÃO EXCLUSIVA DA PLACA: todo position:absolute/fixed no core.css precisa estar
  //     numa família permitida (a régua e a fenda são estrutura do eixo; o lado frio é coluna fixa
  //     do campo; pulso/rito são overlays declarados). Fora da allowlist = plano intruso.
  //     Margens negativas: só a placa pênsil poderia usar (hoje: ninguém usa).
  if (ehCore) {
    const ALLOW_ABS = /(regua-mestra|corte-limiar|placa-pensil|v1t-lado-frio|v1t-selo__pulso|v1t-rito)/;
    const bloco4 = /([^{}]+)\{([^{}]*)\}/g;
    let mm;
    while ((mm = bloco4.exec(src))) {
      const sel = mm[1], corpo = mm[2];
      if (/position\s*:\s*(absolute|fixed)/.test(corpo) && !ALLOW_ABS.test(sel)) {
        report('FAIL', 'm plano-intruso', file, lineOf(src, mm.index),
          `position absolute/fixed fora da allowlist da assinatura: ${sel.trim().slice(0, 60)} — a interrupção de planos é exclusiva da placa (G3)`);
      }
      const corpoSemVar = corpo.replace(/var\([^)]*\)/g, 'VAR');   // nomes de token têm hífen+dígito
      if (/margin[^:;{]*:\s*[^;{]*-\d/.test(corpoSemVar) && !/placa-pensil/.test(sel)) {
        report('FAIL', 'm margem-negativa-intrusa', file, lineOf(src, mm.index),
          'margem negativa fora da placa pênsil — sobreposição é exclusiva do gesto G3');
      }
    }
  }

  // (n-css) a FÓRMULA ÚNICA da escala existe no core.css (posição deriva do dado).
  if (ehCore) {
    const FORMULA = /calc\(\(var\(--preco\) - var\(--v1t-regua-min\)\) \/ \(var\(--v1t-regua-max\) - var\(--v1t-regua-min\)\) \* 100%\)/;
    if (!FORMULA.test(src)) {
      report('FAIL', 'n formula-ausente', file, 1,
        'core.css não contém a fórmula da escala ((--preco − min) / (max − min) × 100%) — G1 exige o eixo como esqueleto');
    }
  }
}

/* ================= HTML ================= */
function lintHtml(file, src) {
  const lines = src.split('\n');
  const ehSpecimen = basename(file) === 'specimen.html';

  // (e) tabela com <th> reais.
  if (/<table/.test(src)) {
    if (!/<th\b/.test(src)) report('FAIL', 'e tabela-sem-th', file, 1, '<table> sem <th> real (§8 acessibilidade — leitor de tela)');
    const thead = (src.match(/<thead[\s\S]*?<\/thead>/) || [''])[0];
    if (thead && !/<th[^>]*scope="col"/.test(thead)) {
      report('FAIL', 'e th-sem-scope', file, 1, 'cabeçalho da matriz sem <th scope="col"> (§8 acessibilidade)');
    }
  }

  // (f) gesto de compra é <a>/<button> focável, nunca div clicável.
  lines.forEach((ln, i) => {
    if (/<(div|span)[^>]*\bv1t-compra\b/.test(ln)) {
      report('FAIL', 'f compra-em-div', file, i + 1, 'gesto de compra em <div>/<span> — deve ser <a>/<button> focável (§8/atrito:3)');
    }
    if (/<(div|span)[^>]*\bonclick=/.test(ln)) {
      report('FAIL', 'f div-clicavel', file, i + 1, 'div/span com onclick — use <a>/<button> (§8 acessibilidade)');
    }
  });

  // (g) estado em-alvo carrega rótulo textual, não só cor/geometria.
  if (/data-estado="em-alvo"/.test(src) && !/Em alvo/i.test(src)) {
    report('FAIL', 'g em-alvo-sem-rotulo', file, 1, 'estado em-alvo sem rótulo textual "Em alvo" — paridade sem cor (§8/Lei 1)');
  }

  // (h) zero recurso externo (offline-first). Deep_links do gesto de compra são permitidos
  //     (são a ação real, não asset carregado).
  lines.forEach((ln, i) => {
    if (/(<script[^>]+src=|<link[^>]+href=|<img[^>]+src=|@import\s+|url\()\s*["']?https?:\/\//i.test(ln)) {
      report('FAIL', 'h recurso-externo', file, i + 1, 'carrega recurso de host externo — offline-first proíbe (§8 força offline)');
    }
  });

  /* ---- regras da ASSINATURA (só sobre o specimen — o artefato julgado) ---- */
  if (!ehSpecimen) return;

  // (j) as três classes da assinatura existem no specimen.
  for (const cls of ['regua-mestra', 'corte-limiar', 'placa-pensil', 'placa-pensil__haste']) {
    if (!new RegExp(`class="[^"]*\\b${cls}\\b`).test(src)) {
      report('FAIL', 'j assinatura-ausente', file, 1, `classe .${cls} não existe no specimen — gesto da assinatura não materializado (§8)`);
    }
  }

  // (l) UMA única fenda luminosa: .corte-limiar aparece exatamente 1x (filhos __ não contam).
  const fendas = (src.match(/class="[^"]*\bcorte-limiar\b(?!__)[^"]*"/g) || []).length;
  if (fendas !== 1) {
    report('FAIL', 'l fendas!=1', file, 1, `${fendas} elementos .corte-limiar — a tela tem UM corte (a decisão dominante), nem zero nem dois (G2)`);
  }

  // (k-html) preço como barra também é proibido inline.
  lines.forEach((ln, i) => {
    if (/style="[^"]*(width|height)\s*:[^"]*var\(--preco\)/.test(ln)) {
      report('FAIL', 'k preco-como-barra', file, i + 1, '--preco dirigindo width/height inline — posição, não barra (G1)');
    }
  });

  // (n) posição deriva da escala: proibido left/top/background-position INLINE;
  //     todo elemento .v1t-escala-x e toda linha do tbody carregam --preco.
  lines.forEach((ln, i) => {
    if (/style="[^"]*(left|top|background-position)\s*:/.test(ln)) {
      report('FAIL', 'n posicao-inline', file, i + 1, 'posição inline (left/top/background-position) — a coordenada vem da fórmula da escala via --preco (G1)');
    }
  });
  let mt;
  const tagEscala = /<[^>]*class="[^"]*v1t-escala-x[^"]*"[^>]*>/g;
  while ((mt = tagEscala.exec(src))) {
    if (!/--preco\s*:/.test(mt[0])) {
      report('FAIL', 'n escala-sem-preco', file, lineOf(src, mt.index), 'elemento .v1t-escala-x sem style="--preco:" — posição sem dado (G1)');
    }
  }
  const tbody = (src.match(/<tbody[\s\S]*?<\/tbody>/) || [''])[0];
  if (tbody) {
    let mr;
    const trRe = /<tr\b[^>]*>/g;
    while ((mr = trRe.exec(tbody))) {
      if (!/--preco\s*:/.test(mr[0])) {
        report('FAIL', 'n trilho-sem-preco', file, lineOf(src, src.indexOf(tbody) + mr.index), 'linha da matriz sem --preco — trilho-DNA sem coordenada (G1)');
      }
    }
  }
}

/* ================= genérico (h para CSS/JS) ================= */
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

/* ================= regra (j) lado CSS ================= */
function lintAssinaturaCss(file, src) {
  if (basename(file) !== 'core.css') return;
  for (const cls of ['regua-mestra', 'corte-limiar', 'placa-pensil', 'placa-pensil__haste']) {
    if (!new RegExp(`\\.${cls}\\b`).test(src)) {
      report('FAIL', 'j assinatura-ausente', file, 1, `seletor .${cls} não existe no core.css — gesto da assinatura sem CSS (§8)`);
    }
  }
}

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const ext = file.split('.').pop();
  if (ext === 'css') { lintCss(file, src); lintAssinaturaCss(file, src); lintExternoGenerico(file, src); }
  else if (ext === 'html') { lintHtml(file, src); }
  else if (ext === 'js') { lintExternoGenerico(file, src); }
}

console.log('');
if (fails > 0) {
  console.log(`${R}FAIL${X} — ${fails} violação(ões), ${warns} aviso(s), ${files.length} arquivo(s)`);
  process.exit(1);
}
console.log(`${G}PASS${X} — 0 violações, ${warns} aviso(s), ${files.length} arquivo(s) verificado(s)`);
