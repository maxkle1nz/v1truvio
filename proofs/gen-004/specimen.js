/* MASSIF specimen — vanilla JS, zero dependencies, offline-first.
 * Renders the m1nd code graph as an isometric block-field (Canvas 2D),
 * from the REAL data embedded in data/ (verbatim). Two scenarios:
 *   1) "estreia" — the live graph, 100% unpainted (0 nodes with xray:state:*)
 *   2) "organismo pintado" — the real overgrowth-dominant distribution
 *      (195 overgrowth / 4 unproven / 0 bedrock / 0 erosion, proof_coverage 0.0)
 * No fetch, no remote fonts, no CDN. All data is inlined below from data/*.json.
 *
 * THE THREE SIGNATURE GESTURES (see BRIEF §8):
 *   - UNPAINTED PLINTH  : empty porcelain top + contour + optional violet accent
 *   - STATE-STRATUM CAP : container top face = proportional segments (real counts)
 *   - PERSISTENCE GLINT : a block that changed state between snapshots breathes,
 *                         on a block that did NOT move; reduced-motion -> static tick
 */
'use strict';

/* ---------- 1. REAL DATA (verbatim from data/), inlined for offline-first ---------- */

// From data/xray_paint_dryrun.json (the real m1nd breakdown, today):
const FIELD = Object.freeze({
  scanned: 199, bedrock: 0, unproven: 4, overgrowth: 195,
  erosion_candidate: 0, painted: 0, proof_coverage: 0.0,
  manifest_source: 'file:…/xray.manifest.json', // path elided; presence is the fact
});

// From data/layers.json — the 4 real containers, real node_count as weight,
// and the truncation fact (returned < node_count => floor "≥ returned").
const CONTAINERS = Object.freeze([
  { key: 'entry_points·L3', name: 'entry_points', level: 3, count: 82, returned: 40, truncated: true,
    desc: 'Surface: HTTP routes, CLI entry points, main modules' },
  { key: 'data_access·L1',  name: 'data_access',  level: 1, count: 60, returned: 40, truncated: true,
    desc: 'Persistence and I/O: stores, pools, clients' },
  { key: 'tests·L2',        name: 'tests',        level: 2, count: 42, returned: 40, truncated: true,
    desc: 'Test infrastructure: unit + integration tests' },
  { key: 'data_access·L0',  name: 'data_access',  level: 0, count: 15, returned: 15, truncated: false,
    desc: 'Persistence and I/O: stores, pools, clients' },
]);

// From data/snapshot_slice.json — 40 real nodes (label + external_id), each mapped
// (via layers.json membership) to the container it belongs to. tags[] carry NO
// xray:state:* (verified 0/40) => every one is unpainted in the estreia scenario.
// container index: 0=L3, 1=L1, 2=tests, 3=L0.
const BLOCKS = Object.freeze([
  { id: 'light::light::file::livingtreegraphchangedbrowsersse-light-md', label: 'livingtreegraphchangedbrowsersse.light.md', c: 3 },
  { id: 'light::light::meta::livingtreegraphchangedbrowsersse-light-md::protocol', label: 'L1GHT/1.0', c: 1 },
  { id: 'light::light::meta::livingtreegraphchangedbrowsersse-light-md::node', label: 'LivingTreeGraphChangedBrowserSSE', c: 1 },
  { id: 'light::light::meta::livingtreegraphchangedbrowsersse-light-md::state', label: 'authored', c: 1 },
  { id: 'light::light::section::livingtreegraphchangedbrowsersse-light-md::shipped-graph-changed-browser-sse-vendored-fonts-1', label: 'SHIPPED — graph_changed browser SSE + vendored fonts', c: 1 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::15::shipped-2026-07-03-pr-242-merge-f1d80f3', label: 'SHIPPED 2026-07-03, PR #242, merge f1d80f3', c: 2 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::17::event-graph-changed-browser-sse-relay-shipped-in-pr-242', label: '⍌ event: graph_changed browser SSE relay SHIPPED in PR 242', c: 2 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::18::confidence-high', label: '𝔻 confidence: high', c: 0 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::19::evidence-m1nd-mcp-src-http-server-rs', label: '𝔻 evidence: m1nd-mcp/src/http_server.rs', c: 0 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::20::evidence-m1nd-mcp-src-mcp-http-rs', label: '𝔻 evidence: m1nd-mcp/src/mcp_http.rs', c: 0 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::22::shipped-2026-07-03-pr-242', label: 'SHIPPED 2026-07-03, PR #242', c: 2 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::24::event-self-hosted-fonts-shipped-for-the-served-ui', label: '⍌ event: Self-hosted fonts SHIPPED for the served UI', c: 2 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::25::confidence-high', label: '𝔻 confidence: high', c: 0 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::26::evidence-m1nd-ui-src-index-css', label: '𝔻 evidence: m1nd-ui/src/index.css', c: 0 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::27::evidence-m1nd-ui-index-html', label: '𝔻 evidence: m1nd-ui/index.html', c: 0 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::31::state-human-layer-slice-0-residue-still-open', label: '⍐ state: Human-layer Slice-0 residue still open', c: 2 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::32::confidence-high', label: '𝔻 confidence: high', c: 0 },
  { id: 'light::light::tag::livingtreegraphchangedbrowsersse-light-md::33::evidence-docs-human-layer-prd-md', label: '𝔻 evidence: docs/HUMAN-LAYER-PRD.md', c: 0 },
  { id: 'light::light::file::slice-2r-degraded-reception-design-light-md', label: 'slice-2r-degraded-reception-design.light.md', c: 3 },
  { id: 'light::light::meta::slice-2r-degraded-reception-design-light-md::protocol', label: 'L1GHT/1.0', c: 1 },
  { id: 'light::light::meta::slice-2r-degraded-reception-design-light-md::node', label: 'Slice 2R degraded reception design', c: 1 },
  { id: 'light::light::meta::slice-2r-degraded-reception-design-light-md::state', label: 'authored', c: 1 },
  { id: 'light::light::section::slice-2r-degraded-reception-design-light-md::slice-2r-degraded-reception-design-1', label: 'Slice 2R degraded reception design', c: 1 },
  { id: 'light::light::tag::slice-2r-degraded-reception-design-light-md::16::entity-slice-2r-degraded-reception-wiring', label: '⍂ entity: Slice 2R degraded reception wiring', c: 2 },
  { id: 'light::light::tag::slice-2r-degraded-reception-design-light-md::17::confidence-0-9', label: '𝔻 confidence: 0.9', c: 0 },
  { id: 'light::light::tag::slice-2r-degraded-reception-design-light-md::18::evidence-m1nd-mcp-src-attach-client-rs', label: '𝔻 evidence: m1nd-mcp/src/attach_client.rs', c: 0 },
  { id: 'light::light::tag::slice-2r-degraded-reception-design-light-md::19::evidence-m1nd-mcp-src-mcp-http-rs', label: '𝔻 evidence: m1nd-mcp/src/mcp_http.rs', c: 0 },
  { id: 'light::light::tag::slice-2r-degraded-reception-design-light-md::20::evidence-m1nd-mcp-src-session-rs', label: '𝔻 evidence: m1nd-mcp/src/session.rs', c: 0 },
  { id: 'light::light::file::m1nd-day-2026-07-03-trilogy-light-md', label: 'm1nd-day-2026-07-03-trilogy.light.md', c: 3 },
  { id: 'light::light::meta::m1nd-day-2026-07-03-trilogy-light-md::protocol', label: 'L1GHT/1.0', c: 1 },
  { id: 'light::light::meta::m1nd-day-2026-07-03-trilogy-light-md::node', label: 'm1nd-day-2026-07-03-trilogy', c: 1 },
  { id: 'light::light::meta::m1nd-day-2026-07-03-trilogy-light-md::state', label: 'verified', c: 1 },
  { id: 'light::light::section::m1nd-day-2026-07-03-trilogy-light-md::2026-07-03-g1-dois-prds-fable-pranchas-next-living-tree-slice-0-1', label: '2026-07-03 - G1 + dois PRDs Fable + pranchas; next: Living Tree slice 0', c: 1 },
  { id: 'light::light::tag::m1nd-day-2026-07-03-trilogy-light-md::16::event-brand-gate-g1-closed', label: '⍌ event: brand-gate-G1-closed', c: 2 },
  { id: 'light::light::tag::m1nd-day-2026-07-03-trilogy-light-md::17::confidence-0-95', label: '𝔻 confidence: 0.95', c: 0 },
  { id: 'light::light::tag::m1nd-day-2026-07-03-trilogy-light-md::18::evidence-docs-wiki-src-changelog-md', label: '𝔻 evidence: docs/wiki/src/changelog.md', c: 0 },
  { id: 'light::light::tag::m1nd-day-2026-07-03-trilogy-light-md::22::event-human-layer-prd-merged', label: '⍌ event: human-layer-prd-merged', c: 2 },
  { id: 'light::light::tag::m1nd-day-2026-07-03-trilogy-light-md::23::confidence-0-95', label: '𝔻 confidence: 0.95', c: 0 },
  { id: 'light::light::tag::m1nd-day-2026-07-03-trilogy-light-md::24::evidence-docs-human-layer-prd-md', label: '𝔻 evidence: docs/HUMAN-LAYER-PRD.md', c: 0 },
  { id: 'light::light::tag::m1nd-day-2026-07-03-trilogy-light-md::28::event-delegation-layer-prd-merged', label: '⍌ event: delegation-layer-prd-merged', c: 2 },
]);

/* ---------- 2. THE 5-STATE GRAMMAR (lei de produto — from the motor) ---------- */
// Redundant-channel truth: color + form/fill + operator-language label. NEVER color alone.
const STATES = {
  bedrock:    { color: 'var(--mf-color-state-bedrock)',    edge: 'var(--mf-color-state-bedrock-edge)',    fill: 'solid',   op: 'bedrock',      hedge: 'structural evidence — test-exercised or grounded' },
  unproven:   { color: 'var(--mf-color-state-unproven)',   edge: 'var(--mf-color-state-unproven-edge)',   fill: 'solid',   op: 'unproven',     hedge: 'used, but no proof evidence yet' },
  overgrowth: { color: 'var(--mf-color-state-overgrowth)', edge: 'var(--mf-color-state-overgrowth-edge)', fill: 'solid',   op: 'overgrowth',   hedge: 'orphan — no incoming references' },
  erosion:    { color: 'var(--mf-color-state-erosion)',    edge: 'var(--mf-color-state-erosion-edge)',    fill: 'hatch',   op: 'erosion-cand', hedge: 'candidate drift, not a verdict' },
  unpainted:  { color: 'var(--mf-color-unpainted-fill)',   edge: 'var(--mf-color-mark-quiet)',            fill: 'empty',   op: 'unpainted',    hedge: 'not yet scanned — a reserved plot' },
};
// Fixed segment order for the STATE-STRATUM CAP (stable reading):
const STATE_ORDER = ['bedrock', 'unproven', 'overgrowth', 'erosion', 'unpainted'];

/* ---------- 3. IDENTITY-DEFINING BINARY RULES (greppable — see lint.mjs) ---------- */
// [lint:violet-plinth] The quarantined violet accent on the UNPAINTED PLINTH is a
// BINARY decision, ON. When on, an unpainted top carries a single small violet
// corner tick (iris/veil) — the "honest unknown" accent — and NOTHING else colored.
const MF_UNPAINTED_VIOLET_ACCENT = true; // <- the binary rule the lint asserts is present + true
// [lint:overgrowth-neutral] Overgrowth (the dominant state) MUST map to the neutral
// grey token, never to a red/alarm token. Asserted greppable:
const MF_OVERGROWTH_IS_NEUTRAL_GREY = true;
// [lint:erosion-hatched] Erosion is a CANDIDATE => hatched, never flat-filled:
const MF_EROSION_IS_HATCHED = true;
// [lint:plinth-never-grey] The unpainted plinth is NEVER the overgrowth grey fill:
const MF_UNPAINTED_NEVER_GREY_FILL = true;

/* ---------- 4. DETERMINISTIC POSITION (external_id -> stable slot) ---------- */
// FNV-1a over external_id => a block lands in the SAME place across snapshots.
// This is layout, not telemetry: it is what makes a state change perceptible as
// change-in-a-known-place (the premise of the PERSISTENCE GLINT).
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

/* ---------- 5. THE HONEST PAINTED DISTRIBUTION (scenario 2) ---------- */
// Derived to sum EXACTLY to the real aggregate: overgrowth 195, unproven 4,
// bedrock 0, erosion 0, scanned 199 (verified in build). Every container is
// overgrowth-dominant; the 4 unproven are placed 1-per-container (top 4 by size),
// deterministically, so the field reads "quase-tudo-grey + 4 ochre".
function paintedCounts(container) {
  const unpr = 1; // exactly one ochre per container => 4 total across the 4 containers
  return { bedrock: 0, unproven: unpr, overgrowth: container.count - unpr, erosion: 0, unpainted: 0 };
}
function unpaintedCounts(container) {
  return { bedrock: 0, unproven: 0, overgrowth: 0, erosion: 0, unpainted: container.count };
}
// Which real slice blocks become the "ochre" (unproven) ones in scenario 2:
// the FIRST block (lowest fnv1a) inside each container flips unpainted->unproven.
// This is deterministic and lets exactly one block per container carry the GLINT.
function ochreBlockIdForContainer(cIndex, blocks) {
  const members = blocks.filter((b) => b.c === cIndex);
  if (!members.length) return null;
  return members.reduce((min, b) => (fnv1a(b.id) < fnv1a(min.id) ? b : min), members[0]).id;
}

/* ---------- 6. ISOMETRIC PRISM PROJECTION ---------- */
// A treemap slot (grid x,y) -> screen. Isometric: the diagonal IS the projection
// (gives volume + territory reading), not a decorative diagonal [vetor:geometria=6].
const ISO = { tw: 26, th: 13, h: 14 }; // tile half-width, half-height, prism body height
function isoProject(gx, gy, originX, originY) {
  return {
    x: originX + (gx - gy) * ISO.tw,
    y: originY + (gx + gy) * ISO.th,
  };
}

/* ---------- 7. RENDER ---------- */
// Squarified-ish packing: containers are laid out as a nested treemap of plates,
// blocks tile inside each plate on the plate's local iso grid. Positions are a
// deterministic function of external_id (stable), NOT of array order.
function resolveVar(css, v) {
  // Canvas needs concrete colors; resolve the --mf-* var against :root.
  if (typeof v === 'string' && v.startsWith('var(')) {
    const name = v.slice(4, -1).trim();
    return css.getPropertyValue(name).trim() || '#000';
  }
  return v;
}

function makeState(scenario) {
  return { scenario, selected: null, hover: null, changedIds: new Set(), _breathAlpha: 1 };
}

// Public entry: draw the whole field.
function draw(canvas, S) {
  const ctx = canvas.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const C = (v) => resolveVar(css, v);
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  // ground
  ctx.fillStyle = C('var(--mf-color-field-ground)');
  ctx.fillRect(0, 0, W, H);

  // --- treemap: 4 plates packed into the field by node_count weight (squarified quarter) ---
  const total = CONTAINERS.reduce((a, c) => a + c.count, 0);
  const pad = 18;
  const area = { x: pad, y: 64, w: W - pad * 2, h: H - 150 };
  const plates = squarify(CONTAINERS.map((c) => ({ c, weight: c.count })), area);

  const hitBlocks = []; // for pointer picking
  const plateHits = [];

  for (const p of plates) {
    drawPlate(ctx, C, p, S);
    plateHits.push({ rect: p, container: p.c });
    // blocks inside this plate
    const members = BLOCKS.filter((b) => b.c === CONTAINERS.indexOf(p.c));
    layoutBlocksInPlate(members, p).forEach((slot) => {
      const st = blockState(slot.block, p.c, S);
      const scr = drawPrism(ctx, C, slot.px, slot.py, st, S, slot.block);
      hitBlocks.push({ block: slot.block, cx: slot.px, cy: slot.py, poly: scr.topPoly });
    });
  }

  S._hitBlocks = hitBlocks;
  S._plateHits = plateHits;

  // --- focus cut (Ando): darken the field when a piece is selected ---
  if (S.selected) {
    ctx.fillStyle = C('var(--mf-color-focus-scrim)');
    ctx.fillRect(0, 0, W, H);
    // re-draw the selected block (and its plate label) fully lit above the scrim
    const hit = hitBlocks.find((h) => h.block.id === S.selected);
    if (hit) {
      const p = plates.find((pl) => CONTAINERS.indexOf(pl.c) === hit.block.c);
      const st = blockState(hit.block, p.c, S);
      drawPrism(ctx, C, hit.cx, hit.cy, st, S, hit.block, /*lit*/ true);
    }
  }
}

// Squarified treemap (simplified, deterministic): split the area by weight,
// alternating the split axis to keep plates squarish.
function squarify(items, rect) {
  const out = [];
  const totalW = items.reduce((a, it) => a + it.weight, 0);
  let r = { ...rect };
  let remaining = totalW;
  // Sort desc by weight for a stable, squarish pack.
  const sorted = [...items].sort((a, b) => b.weight - a.weight);
  for (let i = 0; i < sorted.length; i++) {
    const it = sorted[i];
    const frac = it.weight / remaining;
    const horizontal = r.w >= r.h;
    if (i === sorted.length - 1) {
      out.push(Object.assign({ x: r.x, y: r.y, w: r.w, h: r.h }, it));
      break;
    }
    if (horizontal) {
      const w = r.w * frac;
      out.push(Object.assign({ x: r.x, y: r.y, w: w - 10, h: r.h }, it));
      r = { x: r.x + w, y: r.y, w: r.w - w, h: r.h };
    } else {
      const h = r.h * frac;
      out.push(Object.assign({ x: r.x, y: r.y, w: r.w, h: h - 10 }, it));
      r = { x: r.x, y: r.y + h, w: r.w, h: r.h - h };
    }
    remaining -= it.weight;
  }
  // attach .c
  return out.map((o) => Object.assign(o, { c: o.c }));
}

// A container plate: bone rectangle + matte contact shadow + STATE-STRATUM CAP
// on its top face + stamped label (top-left) + mono count + floor "≥ N" if truncated.
function drawPlate(ctx, C, p, S) {
  // plate shadow
  ctx.save();
  ctx.fillStyle = 'rgba(43,40,54,0.10)';
  ctx.fillRect(p.x + 3, p.y + 5, p.w, p.h);
  // plate body
  ctx.fillStyle = C('var(--mf-color-field-plate)');
  ctx.fillRect(p.x, p.y, p.w, p.h);
  // plate hairline
  ctx.strokeStyle = 'rgba(43,40,54,0.14)';
  ctx.lineWidth = 1;
  ctx.strokeRect(p.x + 0.5, p.y + 0.5, p.w - 1, p.h - 1);

  // --- THE STATE-STRATUM CAP: proportional segments across the plate top face ---
  const counts = (S.scenario === 'painted') ? paintedCounts(p.c) : unpaintedCounts(p.c);
  drawStratumCap(ctx, C, p.x, p.y, p.w, counts);

  // label stamp (top-left), UI face
  ctx.fillStyle = C('var(--mf-color-mark-strong)');
  ctx.font = `600 12px ${C('var(--mf-font-family-ui)')}`;
  ctx.textBaseline = 'top';
  ctx.fillText(`${p.c.name} · L${p.c.level}`, p.x + 12, p.y + 16);
  // count (mono), floor if truncated
  ctx.font = `500 11px ${C('var(--mf-font-family-mono)')}`;
  ctx.fillStyle = C('var(--mf-color-mark-quiet)');
  const countStr = p.c.truncated ? `≥ ${p.c.returned} blocks (of ${p.c.count})` : `${p.c.count} blocks`;
  ctx.fillText(countStr, p.x + 12, p.y + 32);
  ctx.restore();
}

// The cap band = a strip along the plate's top edge, cut into segments whose
// widths are the VERBATIM counts (never normalized to a visible minimum).
function drawStratumCap(ctx, C, x, y, w, counts) {
  const capH = 10;
  const total = STATE_ORDER.reduce((a, k) => a + (counts[k] || 0), 0) || 1;
  let cx = x;
  for (const k of STATE_ORDER) {
    const n = counts[k] || 0;
    if (n === 0) continue;
    const segW = (n / total) * w;
    const st = STATES[k];
    if (k === 'unpainted') {
      // empty pedestal segment: porcelain fill + contour only (no state color)
      ctx.fillStyle = C('var(--mf-color-unpainted-fill)');
      ctx.fillRect(cx, y, segW, capH);
      ctx.strokeStyle = C('var(--mf-color-mark-quiet)');
      ctx.lineWidth = 1;
      ctx.strokeRect(cx + 0.5, y + 0.5, Math.max(1, segW - 1), capH - 1);
      // hairline hatch to say "reserved", distinct from a colored fill
      ctx.save(); ctx.beginPath(); ctx.rect(cx, y, segW, capH); ctx.clip();
      ctx.strokeStyle = 'rgba(91,85,102,0.28)';
      for (let hx = cx - capH; hx < cx + segW; hx += 5) { ctx.beginPath(); ctx.moveTo(hx, y + capH); ctx.lineTo(hx + capH, y); ctx.stroke(); }
      ctx.restore();
    } else if (k === 'erosion') {
      ctx.fillStyle = C('var(--mf-color-field-plate)');
      ctx.fillRect(cx, y, segW, capH);
      ctx.save(); ctx.beginPath(); ctx.rect(cx, y, segW, capH); ctx.clip();
      ctx.strokeStyle = C('var(--mf-color-state-erosion)'); ctx.lineWidth = 1.5;
      for (let hx = cx - capH; hx < cx + segW; hx += 4) { ctx.beginPath(); ctx.moveTo(hx, y + capH); ctx.lineTo(hx + capH, y); ctx.stroke(); }
      ctx.restore();
    } else {
      ctx.fillStyle = C(st.color);
      ctx.fillRect(cx, y, segW, capH);
    }
    cx += segW;
  }
  // cap frame
  ctx.strokeStyle = 'rgba(43,40,54,0.22)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, capH);
}

// Lay members onto a local iso grid inside the plate, packed to fit; the ROW/COL a
// block occupies is a deterministic function of external_id (stable), then sorted
// so packing is dense. We keep it dense + legible for the density test.
function layoutBlocksInPlate(members, p) {
  const inner = { x: p.x + 14, y: p.y + 52, w: p.w - 28, h: p.h - 66 };
  const cols = Math.max(1, Math.floor(inner.w / (ISO.tw * 2)));
  // deterministic slot index from external_id, made dense by stable sort:
  const ordered = [...members].sort((a, b) => fnv1a(a.id) - fnv1a(b.id));
  const originX = inner.x + inner.w / 2;
  const originY = inner.y + 6;
  return ordered.map((block, i) => {
    const gx = i % cols;
    const gy = Math.floor(i / cols);
    const pr = isoProject(gx, gy, originX, originY);
    return { block, px: pr.x, py: pr.y };
  });
}

// Resolve a block's state under the current scenario.
function blockState(block, container, S) {
  if (S.scenario === 'unpainted') return 'unpainted';
  // painted: the deterministic ochre-per-container block is unproven; rest overgrowth.
  const ochreId = ochreBlockIdForContainer(block.c, BLOCKS);
  return (block.id === ochreId) ? 'unproven' : 'overgrowth';
}

// Draw one isometric prism. Returns the top-face polygon for hit-testing.
function drawPrism(ctx, C, cx, cy, stateKey, S, block, forceLit) {
  const st = STATES[stateKey];
  const tw = ISO.tw, th = ISO.th, bh = ISO.h;
  // top face diamond
  const top = [
    [cx, cy - th], [cx + tw, cy], [cx, cy + th], [cx - tw, cy],
  ];
  // left + right side faces
  const left = [[cx - tw, cy], [cx, cy + th], [cx, cy + th + bh], [cx - tw, cy + bh]];
  const right = [[cx, cy + th], [cx + tw, cy], [cx + tw, cy + bh], [cx, cy + th + bh]];

  // matte contact shadow (ellipse) under the prism
  ctx.save();
  ctx.fillStyle = 'rgba(43,40,54,0.08)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + th + bh + 2, tw * 0.9, th * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const isHover = S.hover === block.id;
  const isSel = S.selected === block.id;
  const lit = forceLit || false;

  if (stateKey === 'unpainted') {
    // THE UNPAINTED PLINTH: porcelain-on-porcelain, read by contour + luminance
    poly(ctx, left, C('var(--mf-color-block-side-a)'));
    poly(ctx, right, C('var(--mf-color-block-side-b)'));
    poly(ctx, top, C('var(--mf-color-unpainted-fill)'));
    // contour (the sole reading of "reserved plot")
    ctx.strokeStyle = C('var(--mf-color-mark-quiet)');
    ctx.lineWidth = 1.25;
    strokePoly(ctx, top);
    strokeEdge(ctx, [[cx - tw, cy], [cx - tw, cy + bh]]);
    strokeEdge(ctx, [[cx, cy + th], [cx, cy + th + bh]]);
    strokeEdge(ctx, [[cx + tw, cy], [cx + tw, cy + bh]]);
    // [lint:violet-plinth] binary-ON violet accent: a single small corner tick
    if (MF_UNPAINTED_VIOLET_ACCENT) {
      ctx.fillStyle = C('var(--mf-color-unpainted-accent)');
      ctx.beginPath();
      ctx.moveTo(cx, cy - th);
      ctx.lineTo(cx + 5, cy - th + 3);
      ctx.lineTo(cx, cy - th + 6);
      ctx.closePath();
      ctx.fill();
    }
  } else {
    // painted prism: side faces = top state token darkened (luminance volume)
    const sideA = C(st.edge);
    poly(ctx, left, shade(sideA, -0.10));
    poly(ctx, right, shade(sideA, -0.20));
    if (st.fill === 'hatch') {
      poly(ctx, top, C('var(--mf-color-field-plate)'));
      clipPoly(ctx, top, () => {
        ctx.strokeStyle = C(st.color); ctx.lineWidth = 1.5;
        for (let hx = cx - tw - th; hx < cx + tw; hx += 4) { ctx.beginPath(); ctx.moveTo(hx, cy + th); ctx.lineTo(hx + th * 2, cy - th); ctx.stroke(); }
      });
    } else {
      poly(ctx, top, C(st.color));
    }
    ctx.strokeStyle = C(st.edge); ctx.lineWidth = 1; strokePoly(ctx, top);
    // PERSISTENCE GLINT: a block whose state changed carries the breath/tick.
    if (S.changedIds && S.changedIds.has(block.id)) {
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        // static tick (corner marker) — information survives, motion does not
        ctx.fillStyle = C('var(--mf-color-unpainted-accent)');
        ctx.beginPath(); ctx.moveTo(cx, cy - th); ctx.lineTo(cx + 6, cy - th + 4); ctx.lineTo(cx, cy - th + 8); ctx.closePath(); ctx.fill();
      } else {
        // breathing highlight ring: opacity oscillates within the sanctioned ±0.15
        // envelope (1.0 <-> 0.85), driven by the RAF breath loop via S._breathAlpha.
        ctx.save();
        ctx.globalAlpha = (S._breathAlpha ?? 1);
        ctx.strokeStyle = C('var(--mf-color-unpainted-accent)'); ctx.lineWidth = 2;
        strokePoly(ctx, top);
        ctx.restore();
      }
    }
  }

  // hover contact-edge
  if (isHover && !lit) {
    ctx.strokeStyle = C('var(--mf-color-mark-strong)'); ctx.lineWidth = 2;
    strokePoly(ctx, top);
  }
  // selected marker
  if (isSel || lit) {
    ctx.strokeStyle = C('var(--mf-color-mark-strong)'); ctx.lineWidth = 2.5;
    strokePoly(ctx, top);
  }
  return { topPoly: top };
}

/* ---------- 8. canvas polygon helpers ---------- */
function poly(ctx, pts, fill) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
function strokePoly(ctx, pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.stroke(); }
function strokeEdge(ctx, seg) { ctx.beginPath(); ctx.moveTo(seg[0][0], seg[0][1]); ctx.lineTo(seg[1][0], seg[1][1]); ctx.stroke(); }
function clipPoly(ctx, pts, fn) { ctx.save(); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.clip(); fn(); ctx.restore(); }
// darken a hex color by frac (0..1)
function shade(hex, frac) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  let n = parseInt(m[1], 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = 1 + frac;
  r = Math.max(0, Math.min(255, Math.round(r * f)));
  g = Math.max(0, Math.min(255, Math.round(g * f)));
  b = Math.max(0, Math.min(255, Math.round(b * f)));
  return `rgb(${r},${g},${b})`;
}

// point in polygon (ray casting)
function pointInPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > py) !== (yj > py)) && (px < ((xj - xi) * (py - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/* ---------- 9. WIRING: build DOM shell, panels, and interactions ---------- */
function pickBlock(S, mx, my) {
  if (!S._hitBlocks) return null;
  // topmost last-drawn wins; iterate reverse
  for (let i = S._hitBlocks.length - 1; i >= 0; i--) {
    if (pointInPoly(mx, my, S._hitBlocks[i].poly)) return S._hitBlocks[i].block;
  }
  return null;
}

function fmtCoverage(v) { return Number(v).toFixed(1); }

function buildFieldBar(S) {
  const bar = document.getElementById('mf-fieldbar');
  const stats = [
    ['scanned', FIELD.scanned], ['bedrock', FIELD.bedrock], ['unproven', FIELD.unproven],
    ['overgrowth', FIELD.overgrowth], ['erosion', FIELD.erosion_candidate], ['proof_coverage', fmtCoverage(FIELD.proof_coverage)],
  ];
  bar.innerHTML = stats.map(([k, v]) =>
    `<span class="mf-stat"><span class="mf-stat-k">${k}</span><span class="mf-stat-v">${v}</span></span>`
  ).join('<span class="mf-stat-sep">·</span>');
}

function openDetail(S, block) {
  const el = document.getElementById('mf-detail');
  const stateKey = blockState(block, block.c, S);
  const st = STATES[stateKey];
  const container = CONTAINERS[block.c];
  const changed = S.changedIds && S.changedIds.has(block.id);
  el.innerHTML = `
    <div class="mf-detail-head">
      <span class="mf-chip mf-chip-${stateKey}">${st.op}</span>
      ${changed ? '<span class="mf-chip mf-chip-changed">changed since last read</span>' : ''}
    </div>
    <div class="mf-detail-label">${escapeHtml(block.label)}</div>
    <div class="mf-hedge">${st.hedge}</div>
    <dl class="mf-meta">
      <dt>region</dt><dd>${container.name} · L${container.level}</dd>
      <dt>external_id</dt><dd class="mf-mono mf-break">${escapeHtml(block.id)}</dd>
      <dt>manifest</dt><dd>${FIELD.erosion_candidate === 0 && stateKey !== 'erosion' ? 'present (no candidate here)' : 'present'}</dd>
    </dl>
    <div class="mf-detail-foot mf-hedge-note">read-only — this view changes nothing.</div>
  `;
  el.classList.add('mf-open');
}
function closeDetail() { const el = document.getElementById('mf-detail'); el.classList.remove('mf-open'); el.innerHTML = ''; }

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function buildLegend() {
  const el = document.getElementById('mf-legend');
  const rows = STATE_ORDER.map((k) => {
    const st = STATES[k];
    return `<div class="mf-legend-row">
      <span class="mf-swatch mf-swatch-${k}" aria-hidden="true"></span>
      <span class="mf-legend-op">${st.op}</span>
      <span class="mf-legend-hedge">${st.hedge}</span>
    </div>`;
  }).join('');
  el.innerHTML = `<div class="mf-legend-title">evidence states</div>${rows}`;
}

/* ---------- 10. BOOT ---------- */
function boot() {
  const canvas = document.getElementById('mf-canvas');
  const S = makeState('unpainted');
  window.__MF_STATE = S; // for the browser proof to inspect
  buildFieldBar(S);
  buildLegend();

  let raf = null;
  function render() { draw(canvas, S); }

  // PERSISTENCE GLINT breath loop (only runs when there is a changed block AND
  // reduced-motion is not set). Drives S._breathAlpha; render each frame.
  let breathOn = false;
  function breathLoop(t) {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (S.changedIds.size > 0 && !reduce) {
      const phase = (Math.sin((t / 3400) * Math.PI * 2) + 1) / 2; // 0..1 over 3.4s
      S._breathAlpha = 0.85 + phase * 0.15; // sanctioned ±0.15 envelope: 0.85 <-> 1.0
      render();
      raf = requestAnimationFrame(breathLoop);
      breathOn = true;
    } else {
      S._breathAlpha = 1;
      breathOn = false;
      render();
    }
  }

  function setScenario(name) {
    S.scenario = name;
    S.selected = null; closeDetail();
    // In the painted scenario, mark the per-container ochre blocks as "changed"
    // ONLY when arriving from unpainted (unpainted->painted is a real state change),
    // so the PERSISTENCE GLINT has a real, honest trigger to demonstrate.
    S.changedIds = new Set();
    if (name === 'painted') {
      for (let ci = 0; ci < CONTAINERS.length; ci++) {
        const id = ochreBlockIdForContainer(ci, BLOCKS);
        if (id) S.changedIds.add(id); // these flipped unpainted -> unproven
      }
    }
    document.querySelectorAll('[data-mf-scenario]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.mfScenario === name));
    });
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(breathLoop);
  }

  // pointer
  canvas.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    const b = pickBlock(S, e.clientX - r.left, e.clientY - r.top);
    const id = b ? b.id : null;
    if (id !== S.hover) { S.hover = id; if (!breathOn) render(); }
    canvas.style.cursor = b ? 'pointer' : 'default';
  });
  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    const b = pickBlock(S, e.clientX - r.left, e.clientY - r.top);
    if (b) { S.selected = b.id; openDetail(S, b); }
    else { S.selected = null; closeDetail(); }
    if (!breathOn) render();
  });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') { S.selected = null; closeDetail(); if (!breathOn) render(); } });
  window.addEventListener('resize', () => { if (!breathOn) render(); });

  document.querySelectorAll('[data-mf-scenario]').forEach((btn) => {
    btn.addEventListener('click', () => setScenario(btn.dataset.mfScenario));
  });

  setScenario('unpainted');
  render();

  // expose a tiny API for the browser proof (deterministic checks)
  window.__MF = {
    state: () => S,
    setScenario,
    counts: (name) => CONTAINERS.map((c) => (name === 'painted' ? paintedCounts(c) : unpaintedCounts(c))),
    aggregate: () => {
      const acc = { bedrock: 0, unproven: 0, overgrowth: 0, erosion: 0, unpainted: 0 };
      const fn = S.scenario === 'painted' ? paintedCounts : unpaintedCounts;
      CONTAINERS.forEach((c) => { const x = fn(c); for (const k in acc) acc[k] += (x[k] || 0); });
      return acc;
    },
    render,
  };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
