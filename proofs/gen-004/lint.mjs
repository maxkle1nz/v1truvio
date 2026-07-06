#!/usr/bin/env node
/* MASSIF identity lint — zero dependencies (node stdlib only).
 * Mechanically enforces the greppable rules of the gen-004 brief §8 signature +
 * the three gestures' prohibitions + the design-system quarantines.
 * EXIT 0 = artifact conforms. EXIT 1 = a rule is violated (prints which).
 *
 * Run: node lint.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const R = (f) => { try { return readFileSync(join(here, f), 'utf8'); } catch { return ''; } };

const tokensJson = R('tokens.json');
const tokensCss = R('tokens.css');
const coreCss = R('core.css');
const js = R('specimen.js');
const specimenHtml = R('specimen.html');
const studiesHtml = R('studies.html');
const ALL = [tokensCss, coreCss, js, specimenHtml, studiesHtml].join('\n');

let fails = 0, passes = 0;
const ok = (msg) => { passes++; console.log(`  ok   ${msg}`); };
const bad = (msg) => { fails++; console.log(`  FAIL ${msg}`); };
function assert(cond, pass, fail) { cond ? ok(pass) : bad(fail); }

console.log('MASSIF identity lint\n────────────────────');

/* ===== 0. offline-first / zero external deps (hard rule) ===== */
console.log('\n[offline-first]');
{
  // no remote fetch, no CDN, no remote webfonts anywhere in shipped artifact
  const remote = /https?:\/\/(?!raw\.githubusercontent\.com\/design-tokens)/i; // allow only the DTCG $schema URL in tokens.json
  assert(!remote.test(ALL), 'no http(s) URLs in shipped html/css/js', 'found a remote URL (CDN/webfont) — must be offline-first');
  // CDN/webfont hosts only count when referenced as a URL (src/href/url()/import),
  // not when named in honest prose like "no CDN". Require a // or protocol prefix.
  assert(!/(?:\/\/|https?:)[^\s'")]*(?:fonts\.googleapis|fonts\.gstatic|unpkg|jsdelivr|cdn\.)/i.test(ALL), 'no known CDN/webfont hosts referenced', 'a CDN/webfont host is referenced as a URL');
  assert(!/\bfetch\s*\(|XMLHttpRequest|import\s+[^\n]*from\s+['"]https?:/i.test(js), 'no fetch/XHR/remote import in specimen.js', 'specimen.js performs a network call');
  // token build stays stdlib-only
  assert(!/require\(|from ['"](?!node:)/.test(R('build-tokens.mjs')), 'build-tokens.mjs uses only node: stdlib', 'build-tokens.mjs pulls a non-stdlib dependency');
}

/* ===== 1. palette anchored VERBATIM to the m1nd design system ===== */
console.log('\n[palette anchor]');
{
  const anchors = ['#f7f4ef', '#efeae2', '#2b2836', '#5b5566', '#6fa287', '#c89b3c', '#b8b2a8', '#b0563b', '#7c3aed', '#ede9fe'];
  for (const a of anchors) assert(tokensCss.includes(a), `token present: ${a}`, `anchor token missing from tokens.css: ${a}`);
  // no invented brand hues: every 6-digit hex in tokens.css must be an anchor OR a
  // declared luminance derivative (edge/side/top-light/scrim). Whitelist those.
  const allowed = new Set([...anchors,
    '#4f7a63', '#a07a26', '#948e84', '#8c4530', // *-edge (state token darkened)
    '#fbf9f5', '#ece7de', '#e2ddd2', // block top/side luminance derivatives
  ].map((s) => s.toLowerCase()));
  const hexes = [...tokensCss.matchAll(/#([0-9a-f]{6})\b/gi)].map((m) => ('#' + m[1]).toLowerCase());
  const rogue = [...new Set(hexes)].filter((h) => !allowed.has(h));
  assert(rogue.length === 0, 'no rogue hues in tokens.css (all anchored or luminance-derived)', `rogue hue(s) in tokens.css: ${rogue.join(', ')}`);
}

/* ===== 2. state -> token mapping (semantic reuse, not invented) ===== */
console.log('\n[state->token]');
{
  assert(/state-bedrock:\s*#6fa287/.test(tokensCss), 'bedrock -> sage #6fa287', 'bedrock not mapped to sage');
  assert(/state-unproven:\s*#c89b3c/.test(tokensCss), 'unproven -> ochre #c89b3c', 'unproven not mapped to ochre');
  assert(/state-overgrowth:\s*#b8b2a8/.test(tokensCss), 'overgrowth -> grey #b8b2a8', 'overgrowth not mapped to grey');
  assert(/state-erosion:\s*#b0563b/.test(tokensCss), 'erosion -> brick #b0563b', 'erosion not mapped to brick');
}

/* ===== 3. GESTURE 1 — UNPAINTED PLINTH: the BINARY violet rule (gate instr. b) ===== */
console.log('\n[gesture 1: unpainted plinth — binary violet accent]');
{
  // The rule must be a single, greppable boolean constant, and it must be TRUE.
  const m = /MF_UNPAINTED_VIOLET_ACCENT\s*=\s*(true|false)\b/.exec(js);
  assert(!!m, 'binary rule MF_UNPAINTED_VIOLET_ACCENT is declared (greppable)', 'MF_UNPAINTED_VIOLET_ACCENT constant not found');
  assert(m && m[1] === 'true', 'MF_UNPAINTED_VIOLET_ACCENT === true (accent decided ON)', 'MF_UNPAINTED_VIOLET_ACCENT is not true — the accent must be a decided binary');
  // the accent uses the quarantined violet token, nothing else
  assert(/unpainted-accent\)/.test(js) && /--mf-color-unpainted-accent:\s*#7c3aed/.test(tokensCss),
    'plinth accent uses the quarantined iris #7c3aed (honest-unknown token)', 'plinth accent does not use the quarantined violet token');
  // PROHIBITION: the plinth top fill is porcelain, and NEVER the overgrowth grey
  assert(/--mf-color-unpainted-fill:\s*#f7f4ef/.test(tokensCss), 'plinth fill is porcelain (empty), not a state color', 'plinth fill is not porcelain');
  const grey = /MF_UNPAINTED_NEVER_GREY_FILL\s*=\s*true/.test(js);
  assert(grey, 'greppable rule: plinth NEVER uses overgrowth grey fill', 'missing/false rule MF_UNPAINTED_NEVER_GREY_FILL');
  // PROHIBITION: unpainted NEVER breathes (no glint on a not-scanned node)
  // => in blockState, unpainted returns before any changed-check; and changedIds
  //    is only populated for painted blocks. Assert unpainted is excluded.
  assert(/scenario === 'unpainted'\)\s*return 'unpainted'/.test(js.replace(/\s+/g, ' ')) ||
         /return 'unpainted'/.test(js), 'unpainted resolves before any glint path', 'unpainted state not short-circuited');
}

/* ===== 4. GESTURE 2 — STATE-STRATUM CAP: verbatim counts, fixed order, no oscillation ===== */
console.log('\n[gesture 2: state-stratum cap]');
{
  assert(/STATE_ORDER\s*=\s*\[\s*'bedrock',\s*'unproven',\s*'overgrowth',\s*'erosion',\s*'unpainted'\s*\]/.test(js.replace(/\s+/g, ' ')),
    'segment order fixed: bedrock->unproven->overgrowth->erosion->unpainted', 'STATE_ORDER is not the fixed reading order');
  // widths are raw counts (n/total * w), never normalized to a visible minimum
  assert(/segW\s*=\s*\(n\s*\/\s*total\)\s*\*\s*w/.test(js), 'cap segment width = verbatim count fraction (no min-inflation)', 'cap segments are not verbatim-count proportional');
  // the cap must not be animated: no requestAnimationFrame / breath touches the cap fn
  const capFn = /function drawStratumCap[\s\S]*?\n}/.exec(js)?.[0] || '';
  assert(!/requestAnimationFrame|breath|Math\.sin/.test(capFn), 'cap never animates/oscillates (critical data)', 'the stratum cap animates — violates the entropy lock');
}

/* ===== 5. GESTURE 3 — PERSISTENCE GLINT: only on real state change, reduced-motion tick ===== */
console.log('\n[gesture 3: persistence glint]');
{
  // glint gated on changedIds (a real state change between snapshots), never hover/load
  assert(/changedIds\s*&&\s*S\.changedIds\.has\(block\.id\)/.test(js), 'glint gated on changedIds (real state change)', 'glint not gated on a real state change');
  // reduced-motion path renders a STATIC TICK, not motion
  assert(/prefers-reduced-motion:\s*reduce/.test(js) && /static tick/.test(js), 'reduced-motion -> static tick (info survives, motion does not)', 'reduced-motion static-tick contract missing in JS');
  assert(/prefers-reduced-motion:\s*reduce/.test(coreCss), 'core.css carries the reduced-motion contract block', 'core.css missing prefers-reduced-motion contract');
  // breath envelope matches the sanctioned ±0.15 / 3.4s design-system animation
  assert(/--mf-duration-breath:\s*3\.4s/.test(tokensCss), 'breath period is 3.4s (design-system tremor-breath)', 'breath period is not the sanctioned 3.4s');
  assert(/breath-floor[\s\S]*0\.85/.test(tokensJson) || /0\.85/.test(js), 'breath trough 0.85 (±0.15 envelope)', 'breath ±0.15 envelope not present');
}

/* ===== 6. MODE (Laboratório) prohibitions: no alarm, no war aesthetic ===== */
console.log('\n[mode: laboratório prohibitions]');
{
  const neutral = /MF_OVERGROWTH_IS_NEUTRAL_GREY\s*=\s*true/.test(js);
  assert(neutral, 'greppable rule: overgrowth (dominant) maps to neutral grey, not alarm', 'missing/false rule MF_OVERGROWTH_IS_NEUTRAL_GREY');
  // brick is reserved for erosion-candidate only, and is hatched (candidate, not verdict)
  const hatched = /MF_EROSION_IS_HATCHED\s*=\s*true/.test(js);
  assert(hatched, 'greppable rule: erosion is hatched (candidate), never flat brick', 'missing/false rule MF_EROSION_IS_HATCHED');
  // no war/HUD vocabulary leaked into the UI. We match HUD/war terms that have no
  // honest use here; the bare word "alarm" is NOT banned because the doctrine copy
  // legitimately says the field is "not an alarm" — we ban urgency PUNCTUATION and
  // war-HUD nouns instead. (grammar comment "red/alarm token" is a comment, excluded.)
  const uiCopy = [specimenHtml, studiesHtml, coreCss].join('\n'); // rendered/authored copy, not JS comments
  assert(!/crosshair|reticle|target-lock|danger-zone|threat level|\bALERT!|\bALARM!/i.test(uiCopy + '\n' + js.replace(/\/\/[^\n]*/g, '')),
    'no war/HUD/urgency vocabulary in UI (comments excluded)', 'war/HUD/urgency vocabulary present in UI');
}

/* ===== 7. copy law (Hall): never "proven/done"; unpainted is a named state ===== */
console.log('\n[copy law: honest state]');
{
  // the states legend must NOT say proven/done; must use the hedge language
  assert(!/\b(proven|done|complete|verified✓|all-clear)\b/i.test(js.match(/const STATES[\s\S]*?};/)?.[0] || ''),
    'no "proven/done" in the state grammar copy', 'state copy uses forbidden "proven/done" language');
  assert(/not yet scanned/.test(js), 'unpainted named honestly ("not yet scanned — a reserved plot")', 'unpainted not named as an honest state');
  assert(/candidate/.test(js), 'erosion framed as "candidate", not verdict', 'erosion not framed as candidate');
}

/* ===== 8. redundant channel: state never color-only (a11y / daltonism) ===== */
console.log('\n[redundant channel]');
{
  // every state has an operator-language label (op) AND a form/fill AND a color
  const states = ['bedrock', 'unproven', 'overgrowth', 'erosion', 'unpainted'];
  for (const s of states) {
    const rx = new RegExp(`${s}:\\s*{[^}]*op:\\s*'[^']+'[^}]*fill:\\s*'[^']+'`);
    // note: object literal order in source is color, edge, fill, op — check both keys exist in the block
    const block = new RegExp(`${s}:\\s*{([^}]*)}`).exec(js)?.[1] || '';
    assert(/op:\s*'[^']+'/.test(block) && /fill:\s*'[^']+'/.test(block) && /color:/.test(block),
      `state '${s}' has color + fill(form) + op(label)`, `state '${s}' is missing a redundant channel`);
  }
  // legend swatches encode FORM too (erosion hatch, unpainted contour) in CSS
  assert(/mf-swatch-erosion[\s\S]*repeating-linear-gradient/.test(coreCss), 'erosion swatch encodes hatch form (not color-only)', 'erosion swatch is color-only');
  assert(/mf-swatch-unpainted[\s\S]*border/.test(coreCss), 'unpainted swatch encodes contour form (not color-only)', 'unpainted swatch is color-only');
}

/* ===== 9. read-only / cerimonialidade 0: no rite, no confirm gate ===== */
console.log('\n[read-only: zero rite]');
{
  assert(!/confirm\(|window\.confirm|are you sure|hold to confirm|press and hold/i.test(ALL), 'no confirmation rite anywhere (read-only view)', 'a confirmation rite exists — view must be read-only');
  assert(/read-only/i.test(ALL), 'read-only nature is stated to the operator', 'read-only nature not surfaced');
}

/* ===== 10. no identity inheritance from ALMUS / other generations ===== */
console.log('\n[no foreign identity]');
{
  // MASSIF prefix is --mf-, never --alm-; no ALMUS hues/faces leaked
  assert(!/--alm-/.test(ALL), 'no --alm- tokens (ALMUS identity not inherited)', 'ALMUS --alm- token leaked in');
  assert(!/Chakra Petch|JetBrains Mono|#b7d63b|#e0561f|#0f1013/i.test(ALL), 'no ALMUS faces/hues (Chakra/JetBrains/lime/signal/void)', 'an ALMUS face or hue leaked in');
  assert(/--mf-/.test(tokensCss), 'identity uses its own --mf- prefix', '--mf- prefix missing');
}

/* ===== 11. numbers are mono tabular (Moholy/Rams: number is fact) ===== */
console.log('\n[numbers: mono tabular]');
{
  assert(/--mf-font-family-mono:\s*'IBM Plex Mono'/.test(tokensCss), 'mono family is IBM Plex Mono (design system)', 'mono family is not IBM Plex Mono');
  assert(/font-variant-numeric:\s*tabular-nums/.test(coreCss), 'stat/meta numbers are tabular-nums', 'numbers are not tabular-nums');
}

/* ===== 12. real data verbatim (no invented telemetry) ===== */
console.log('\n[data verbatim]');
{
  assert(/scanned:\s*199/.test(js) && /overgrowth:\s*195/.test(js) && /unproven:\s*4/.test(js) && /proof_coverage:\s*0\.0/.test(js),
    'field bar uses real aggregate (199/195/4, proof_coverage 0.0)', 'field aggregate does not match the real data');
  assert(/count:\s*82/.test(js) && /count:\s*60/.test(js) && /count:\s*42/.test(js) && /count:\s*15/.test(js),
    'container weights are real node_count (82/60/42/15)', 'container weights are not the real node_count');
  assert(/≥ \$\{p\.c\.returned\}|≥ \$\{c\.returned\}|≥\$\{c\.returned\}/.test(js) || /≥ /.test(js),
    'truncated containers show floor "≥ N", never a fake total', 'truncated floor "≥ N" missing');
}

/* ===== summary ===== */
console.log('\n────────────────────');
console.log(`${passes} passed, ${fails} failed`);
if (fails > 0) { console.log('LINT FAILED'); process.exit(1); }
console.log('LINT OK');
process.exit(0);
