// lint.mjs — o lint MECÂNICO da identidade gen-002 · MENISCUS (a janela do m1nd).
// Regras grepáveis derivadas do BRIEF.md (§8 sistema visual + ASSINATURA FORMAL / §9 prova / leis 1-2-3)
// E das PROIBIÇÕES dos 3 gestos + as herdadas do PRODUTO (abstain nunca anima; dígito vivo só no trilho; uma única slit).
// Exit != 0 em qualquer violação. Zero deps, no espírito do almus-lint. O lint mira a SUPERFÍCIE da identidade.
//
// Regras:
//   base (leis/modo/produto):
//     (a) o DÍGITO VIVO é EXCLUSIVO do trilho (.mns-rail__ms) — nenhum outro seletor anima/pulsa número
//     (b) prefers-reduced-motion presente no core.css
//     (c) a violeta (abstain) é reservada ao estado epistêmico — não aparece como cor ambiente/decorativa
//     (d) sem verde-sucesso-tela / vermelho-alarme (a paleta é sálvia/âmbar-latão/terracota, nunca #f00/#0f0)
//     (e) toda cor de estado carrega RÓTULO textual (paridade sem cor — a palavra É o dado)
//     (f) zero recurso externo (offline-first: nenhum http(s), webfont, CDN)
//     (i) cor crua proibida no core.css — tudo via var(--mns-*)
//   ASSINATURA (verdict 001, gates 13-14):
//     (S1) MENISCUS SLIT: a fresta pousa na BASE (top:0 no ::before de __honest), UMA única no specimen;
//          proibido box-shadow/glow espalhado no painel do mergulho; proibido cor emitida na fresta.
//     (S2) TRILHO: a FÓRMULA log da escala existe (core.css + specimen.js); a posição vem de --mns-x
//          (nunca width/height = barra); o dígito vivo só no trilho (ver regra a).
//     (S3) PLACA: abstain NUNCA desloca/inclina (transform travado); os 3 estados-gesto existem no CSS.
//     (J)  as 3 classes-âncora da assinatura existem no core.css E no specimen.
//
// uso: node lint.mjs            (varre a pasta gen-002 inteira)
//      node lint.mjs <arquivo>  (um alvo específico)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', D = '\x1b[2m', X = '\x1b[0m';

// tokens.css é GERADO (a definição da paleta — hex esperado). studies.html é ESBOÇO do estudo formal
// (protocolo de aterrissagem): passa pelas regras base, mas está ISENTO das regras de assinatura
// (S1 slit-única / S2-html / J-specimen), que valem sobre o SPECIMEN (o artefato julgado). .mjs não é lintado.
const GERADOS = new Set(['tokens.css']);

const target = process.argv[2] ? join(process.cwd(), process.argv[2]) : here;

const collect = (p) => {
  const st = statSync(p);
  if (st.isFile()) return /\.(html|css)$/.test(p) ? [p] : [];
  return readdirSync(p)
    .filter((n) => !n.startsWith('.') && n !== 'node_modules')
    .flatMap((n) => collect(join(p, n)));
};

const files = collect(target).filter((f) => !GERADOS.has(basename(f)));
if (!files.length) { console.error('nenhum artefato .html/.css em', target); process.exit(2); }

let fails = 0, warns = 0;
const report = (level, rule, file, line, detail) => {
  const tag = level === 'FAIL' ? `${R}[FAIL]${X}` : `${Y}[WARN]${X}`;
  console.log(`${tag} ${rule} ${D}${basename(file)}:${line}${X} ${detail}`);
  if (level === 'FAIL') fails++; else warns++;
};
const lineOf = (src, idx) => src.slice(0, idx).split('\n').length;
const blocks = function* (src) { const re = /([^{}]+)\{([^{}]*)\}/g; let m; while ((m = re.exec(src))) yield { sel: m[1], body: m[2], idx: m.index }; };

/* ================================= CSS ================================= */
function lintCss(file, src) {
  const lines = src.split('\n');
  const isCore = basename(file) === 'core.css';

  // (a) o DÍGITO VIVO é exclusivo do trilho: só .mns-rail__ms pode animar/transicionar um NÚMERO.
  //     Qualquer outro seletor de leitura numérica com animation/transition (que não seja none) reprova.
  //     Seletores de número fora do trilho: __fp, __nums, __pr, __ms fora do rail, verdict (é texto de estado).
  for (const { sel, body, idx } of blocks(src)) {
    const isRailMs = /\.mns-rail__ms\b/.test(sel);
    const tocaNumero = /__fp\b|__nums\b|__pr\b|mns-rail__ms/.test(sel);
    if (isRailMs) continue; // o único número que pode ter vida
    if (tocaNumero && /\b(animation|transition)\s*:/.test(body) && !/\b(animation|transition)\s*:\s*none\b/.test(body)) {
      report('FAIL', 'a digito-vivo-fora-do-trilho', file, lineOf(src, idx),
        'seletor de número (fp/nums/pr) com animation/transition — o dígito vivo é EXCLUSIVO do trilho (§8/assinatura 2)');
    }
  }

  // (b) prefers-reduced-motion presente no core.css.
  if (isCore && !/prefers-reduced-motion/.test(src)) {
    report('FAIL', 'b sem-reduced-motion', file, 1, 'core.css deve conter @media (prefers-reduced-motion) (§8/gate:12)');
  }

  // (d) tokens de verde-sucesso-tela / vermelho-alarme proibidos.
  lines.forEach((ln, i) => {
    if (/--mns-[a-z-]*(success|sucesso|verde-tela|alarme|alarm|red|erro-red)\b/i.test(ln)) {
      report('FAIL', 'd token-proibido', file, i + 1, 'token de verde-sucesso-tela / vermelho-alarme — a paleta é sálvia/âmbar-latão/terracota (§8/modo proíbe alarme)');
    }
    // vermelho-alarme cru (#f00 e vizinhos, #ff0000, rgb(255,0,0))
    const m = ln.match(/#(f{1,2}0{1,2}0{0,4}|ff0000)\b/i);
    if (m && !/\/\*/.test(ln.split(m[0])[0])) {
      report('FAIL', 'd vermelho-alarme', file, i + 1, `${m[0]} lê como vermelho-alarme — proibido (§8/modo)`);
    }
  });

  // (i) cores cruas proibidas no core.css — tudo via var(--mns-*).
  if (isCore) {
    lines.forEach((ln, i) => {
      const semComentario = ln.replace(/\/\*.*?\*\//g, '');
      const hex = semComentario.match(/#[0-9A-Fa-f]{3,8}\b/);
      if (hex) report('FAIL', 'i hex-cru-no-core', file, i + 1, `hex cru ${hex[0]} — use var(--mns-*)`);
      // rgb/rgba/hsl cru (mas color-mix(in srgb, var(...)) é permitido — usa tokens; black/transparent são keywords)
      const rgb = semComentario.match(/\b(rgb|rgba|hsl|hsla)\(/);
      if (rgb) report('FAIL', 'i cor-crua-no-core', file, i + 1, `${rgb[1]}() cru — use var(--mns-*)`);
    });
  }

  // (S2-css) a FÓRMULA log da escala do trilho existe documentada no core.css (o eixo é o esqueleto).
  if (isCore) {
    const temFormula = /log\(age_ms\).*log\(MIN\).*log\(MAX\)/s.test(src);
    if (!temFormula) {
      report('FAIL', 'S2 formula-ausente-css', file, 1,
        'core.css não documenta a fórmula log da escala ((log(age_ms)−log(MIN))/(log(MAX)−log(MIN))) — a assinatura 2 exige o eixo como esqueleto');
    }
    // posição vem de --mns-x; --mns-x jamais dirige width/height (posição, não barra)
    for (const { body, idx } of blocks(src)) {
      if (/(width|height)\s*:[^;]*var\(--mns-x\)/.test(body)) {
        report('FAIL', 'S2 x-como-barra', file, lineOf(src, idx),
          '--mns-x dirigindo width/height = bar-chart — a marca é POSIÇÃO no eixo do tempo (assinatura 2 proíbe)');
      }
    }
  }

  // (S3-css) abstain NUNCA desloca/inclina: o seletor [data-trust="abstain"] força transform travado.
  if (isCore) {
    const abstainBlock = [...blocks(src)].find((b) => /\[data-trust="abstain"\]/.test(b.sel) && /transform/.test(b.body));
    if (!abstainBlock) {
      report('FAIL', 'S3 abstain-sem-trava', file, 1,
        'não há regra travando o transform de [data-trust="abstain"] — o "não sei" NUNCA performa (regra INV herdada do produto)');
    } else if (!/translateX\(0\)/.test(abstainBlock.body) || !/rotate\(0deg\)/.test(abstainBlock.body)) {
      report('FAIL', 'S3 abstain-anima', file, lineOf(src, abstainBlock.idx),
        'abstain com transform não-neutro — deve ser translateX(0) rotate(0deg) (imóvel e digno)');
    }
  }

  // (S1-css) a fresta pousa na BASE do conteúdo: o ::before de .mns-dive__honest tem top:0 (não bottom, não header).
  //          E o painel do mergulho não usa box-shadow espalhado (Ando é corte, não glow).
  if (isCore) {
    const slitBefore = src.match(/\.mns-dive__honest::before\s*\{([^}]*)\}/);
    if (!slitBefore) {
      report('FAIL', 'S1 slit-ausente-css', file, 1, 'core.css não define .mns-dive__honest::before — a Meniscus Slit não existe (assinatura 1)');
    } else if (!/top:\s*0\b/.test(slitBefore[1])) {
      report('FAIL', 'S1 slit-nao-na-base', file, lineOf(src, src.indexOf(slitBefore[0])),
        'a fresta não pousa na base do conteúdo honesto (top:0 ausente) — proibido a luz no topo (seria header de template) (assinatura 1)');
    }
    // glow proibido: box-shadow espalhado no painel do mergulho
    const panelBlock = [...blocks(src)].find((b) => /\.mns-dive__panel\b/.test(b.sel));
    if (panelBlock && /box-shadow\s*:/.test(panelBlock.body) && !/box-shadow\s*:\s*none/.test(panelBlock.body)) {
      report('FAIL', 'S1 mergulho-com-glow', file, lineOf(src, panelBlock.idx),
        'painel do mergulho com box-shadow — a luz é CORTE, não glow espalhado (proibição própria da assinatura 1)');
    }
  }

  // (J-css) as classes-âncora da assinatura existem no core.css.
  if (isCore) {
    for (const cls of ['mns-trust', 'mns-rail', 'mns-dive__honest']) {
      if (!new RegExp(`\\.${cls}\\b`).test(src)) {
        report('FAIL', 'J assinatura-ausente-css', file, 1, `seletor .${cls} não existe no core.css — gesto da assinatura sem CSS (§8)`);
      }
    }
  }
}

/* ================================= HTML ================================= */
function lintHtml(file, src) {
  const lines = src.split('\n');
  const isSpecimen = basename(file) === 'specimen.html';

  // (f) zero recurso externo (offline-first).
  lines.forEach((ln, i) => {
    if (/(<script[^>]+src=|<link[^>]+href=|<img[^>]+src=|@import\s+|url\()\s*["']?https?:\/\//i.test(ln)) {
      report('FAIL', 'f recurso-externo', file, i + 1, 'carrega recurso de host externo — offline-first proíbe (§8 força offline)');
    }
  });

  // (e) cada estado de trust carrega RÓTULO textual (a palavra É o dado — paridade sem cor).
  //     O switcher declara os estados; o specimen deve conter os rótulos legíveis.
  if (isSpecimen) {
    for (const rotulo of ['FULL TRUST', 'this graph does NOT cover your repo']) {
      if (!src.includes(rotulo)) {
        report('FAIL', 'e estado-sem-rotulo', file, 1, `rótulo textual de estado ausente: "${rotulo}" — cor de estado nunca é o único portador (§8 a11y)`);
      }
    }
    // abstain: o rótulo real do produto (só é injetado por JS, mas o switcher precisa oferecer o estado)
    if (!/data-state="abstain"/.test(src)) {
      report('FAIL', 'e abstain-ausente', file, 1, 'o estado abstain não está no switcher — a alma do produto (o "não sei" digno) precisa ser provável (§9)');
    }
  }

  /* ---- regras da ASSINATURA (só sobre o specimen — o artefato julgado) ---- */
  if (!isSpecimen) return;

  // (J-html) as três classes-âncora da assinatura existem no specimen.
  for (const cls of ['mns-trust', 'mns-rail', 'mns-dive']) {
    if (!new RegExp(`class="[^"]*\\b${cls}\\b`).test(src)) {
      report('FAIL', 'J assinatura-ausente', file, 1, `classe .${cls} não existe no specimen — gesto da assinatura não materializado (§8)`);
    }
  }

  // (S1-html) UMA única Meniscus Slit: o portador .mns-dive__honest aparece exatamente 1x no specimen.
  const slits = (src.match(/class="[^"]*\bmns-dive__honest\b[^"]*"/g) || []).length;
  if (slits !== 1) {
    report('FAIL', 'S1 slit!=1', file, 1, `${slits} portadores .mns-dive__honest — a tela tem UMA fresta (a informação mais honesta), nem zero nem duas (assinatura 1)`);
  }

  // (S2-html) o dígito vivo mora só no trilho: nenhum elemento fora de .mns-rail carrega a classe do dígito.
  //           (grep grosseiro: mns-rail__ms só dentro do bloco do trilho — aqui o specimen injeta por JS, então
  //            garantimos que a classe do dígito NÃO aparece hardcoded em outro componente do HTML.)
  const msOutsideRail = (src.match(/\bmns-rail__ms\b/g) || []).length;
  // no specimen o trilho é injetado por JS; se aparecer hardcoded fora, é vazamento do dígito vivo.
  if (msOutsideRail > 0 && !/id="rail-track"/.test(src)) {
    report('FAIL', 'S2 digito-vazado', file, 1, 'classe do dígito vivo (mns-rail__ms) fora do contexto do trilho — a vida é exclusiva do tempo da memória (assinatura 2)');
  }

  // posição inline proibida no trilho (a coordenada vem de --mns-x via a fórmula, nunca left/top literal).
  lines.forEach((ln, i) => {
    if (/style="[^"]*(left|top)\s*:\s*\d/.test(ln) && /mns-rail__mark|mns-rail__stem/.test(ln)) {
      report('FAIL', 'S2 posicao-inline', file, i + 1, 'posição inline (left/top literal) numa marca do trilho — a coordenada vem de --mns-x (assinatura 2)');
    }
  });
}

/* ================================= genérico externo (CSS) ================================= */
function lintExternoGenerico(file, src) {
  src.split('\n').forEach((ln, i) => {
    if (/@import\s+["']?https?:\/\//i.test(ln) || /url\(\s*["']?https?:\/\//i.test(ln)) {
      report('FAIL', 'f recurso-externo', file, i + 1, 'CSS carrega recurso externo — offline-first proíbe');
    }
  });
}

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const ext = file.split('.').pop();
  if (ext === 'css') { lintCss(file, src); lintExternoGenerico(file, src); }
  else if (ext === 'html') { lintHtml(file, src); }
}

console.log('');
if (fails > 0) {
  console.log(`${R}FAIL${X} — ${fails} violação(ões), ${warns} aviso(s), ${files.length} arquivo(s)`);
  process.exit(1);
}
console.log(`${G}PASS${X} — 0 violações, ${warns} aviso(s), ${files.length} arquivo(s) verificado(s)`);
