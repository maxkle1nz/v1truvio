/* specimen.js — gen-002 · MENISCUS. JS vanilla, zero dependência.
 * Renderiza a Bancada de Supervisão com os dados VERBATIM do north-packet-sample.json.
 * Responsabilidades: (1) a FÓRMULA da escala do trilho (log(age_ms)); (2) o dígito de ms VIVO
 * (incremento monotônico real — soma o elapsed desde a carga ao age_ms base); (3) o mergulho
 * (Meniscus Slit); (4) o switcher de estados. Respeita prefers-reduced-motion (o dígito continua
 * — é DADO real, não animação; só não há transição visual). */
(() => {
  'use strict';

  /* ----- dados REAIS (verbatim do north-packet-sample.json) ----- */
  const MEMORY = [
    { claim: 'O olho do Max — 6 movimentos analíticos, agora checklist obrigatório de quem desenvolve o m1nd',
      tier: 'medulla', source_agent: 'claude:main:fable-orchestrator', age_ms: 133637855, stale: false,
      path: 'maxeyedoctrine.light.md' },
    { claim: 'm1nd-brand-visuals-violate-aesthetic-doctrine.light.md',
      tier: 'medulla', source_agent: 'brand-audit', age_ms: 272592718, stale: false,
      path: 'm1nd-brand-visuals-violate-aesthetic-doctrine.light.md' },
    { claim: 'm1nd-brand-critique-2026-07-verified-overclaim-risks-in-positioning-creative.light.md',
      tier: 'medulla', source_agent: 'fable-brand-critic', age_ms: 271032997, stale: false,
      path: 'm1nd-brand-critique-2026-07-verified-overclaim-risks-in-positioning-creative.light.md' },
  ];
  const ANCHORS = [
    { label: 'walk', pagerank: 1.0 }, { label: 'collect', pagerank: 0.8191 },
    { label: 'README.md', pagerank: 0.5485 }, { label: '_observeTargets', pagerank: 0.1972 },
    { label: 'draw', pagerank: 0.1972 },
  ];
  const FOCUS = [
    { label: 'O olho do Max — 6 movimentos analíticos…', activation: 0.8122 },
    { label: 'Brand visual audit 2026-07…', activation: 0.7873 },
    { label: 'm1nd brand critique 2026-07…', activation: 0.6746 },
    { label: 'm1nd OMEGA era — doctrine + state…', activation: 0.6696 },
    { label: 'm1nd hosts CLI location', activation: 0.6695 },
  ];
  const SUFF_GATHERING_WHY = 'the strongest match left out still scores 0.23 — relevant context did not fit… raise token_budget/top_k or narrow the goal';

  const css = getComputedStyle(document.documentElement);
  const MIN_MS = parseFloat(css.getPropertyValue('--mns-trilho-min-ms')) || 3600000;
  const MAX_MS = parseFloat(css.getPropertyValue('--mns-trilho-max-ms')) || 2592000000;
  const COLLIDE = parseFloat(css.getPropertyValue('--mns-trilho-colisao-px')) || 44;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== A FÓRMULA ÚNICA DA ESCALA DO TRILHO (Assinatura 2, [card:02-moholy-nagy]) =====
   * x(age_ms) = (log(age_ms) − log(MIN)) / (log(MAX) − log(MIN)) , clamp 0..1
   * 0 = agora/fresco (esquerda) · 1 = MAX/passado (direita). É a mesma fórmula documentada no core.css. */
  const railX = (ageMs) => {
    const x = (Math.log(ageMs) - Math.log(MIN_MS)) / (Math.log(MAX_MS) - Math.log(MIN_MS));
    return Math.min(1, Math.max(0, x));
  };
  // expõe a fórmula para verificação externa (o juiz mede contra ela)
  window.__mnsRailX = railX;

  const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };

  /* ----- estado base T0: o age_ms cresce a partir da carga (relógio da confiança correndo) ----- */
  const T0 = performance.now();
  let liveNodes = [];   // { node, base }  — o dígito vivo

  /* ================= Trilho de Freshness ================= */
  const track = document.getElementById('rail-track');
  const exile = document.getElementById('rail-exile');
  const exileHint = document.getElementById('exile-hint');

  function renderRail(memory) {
    track.innerHTML = '';
    liveNodes = [];
    exile.querySelectorAll('.mns-exiled').forEach((n) => n.remove());
    let exiledCount = 0;

    // 1) separa on-rail (idade real) de exilados (stale / idade ausente)
    const onRail = [];
    memory.forEach((m) => {
      const hasAge = Number.isFinite(m.age_ms) && !m.stale;
      if (!hasAge) {
        exiledCount++;
        const ex = el('div', 'mns-exiled');
        ex.appendChild(el('b', null, m.stale ? 'stale' : 'unknown age'));
        ex.appendChild(document.createTextNode(m.source_agent + ' · ' + shortClaim(m.claim)));
        exile.appendChild(ex);
      } else {
        onRail.push({ m, x: railX(m.age_ms) });
      }
    });

    // 2) ANTI-COLISÃO por faixas: ordena por x; quem cair a < COLLIDE do vizinho de MESMA faixa sobe de faixa.
    //    A haste sempre crava em x (posição = dado, inviolável); só o rótulo muda de faixa (o texto se esquiva).
    const railWidth = track.getBoundingClientRect().width || 1000;
    onRail.sort((a, b) => a.x - b.x);
    const laneLastPx = [];  // último px ocupado por faixa
    onRail.forEach((it) => {
      const px = it.x * railWidth;
      let lane = 0;
      while (laneLastPx[lane] != null && px - laneLastPx[lane] < COLLIDE) lane++;
      laneLastPx[lane] = px;
      it.lane = lane;
    });

    // 3) monta o DOM: uma marca (haste + rótulo empilhado na faixa) — corrente contínua por construção
    onRail.forEach(({ m, x, lane }) => {
      const mark = el('div', 'mns-rail__mark');
      mark.setAttribute('role', 'listitem');
      mark.dataset.tier = m.tier;
      mark.style.setProperty('--mns-x', x.toFixed(5));
      mark.style.setProperty('--mns-lane', String(lane));

      const stem = el('div', 'mns-rail__stem');
      const labels = el('div', 'mns-rail__labels');
      const ms = el('div', 'mns-rail__ms', String(m.age_ms));
      const agent = el('div', 'mns-rail__agent', m.source_agent);
      labels.appendChild(ms);
      labels.appendChild(agent);

      const hit = el('button', 'mns-rail__hit');
      hit.type = 'button';
      hit.setAttribute('aria-label', 'Abrir claim de ' + m.source_agent);
      hit.addEventListener('click', () => openDive(m));

      mark.appendChild(stem);      // column-reverse: haste fica no FUNDO (na linha do tempo)
      mark.appendChild(labels);    // rótulo sobe
      mark.appendChild(hit);
      track.appendChild(mark);

      liveNodes.push({ node: ms, base: m.age_ms });
    });

    exile.dataset.empty = exiledCount === 0 ? 'true' : 'false';
    exileHint.style.display = exiledCount === 0 ? '' : 'none';
  }

  const shortClaim = (c) => c.length > 46 ? c.slice(0, 44) + '…' : c;

  /* ----- o dígito vivo: incremento monotônico REAL (elapsed desde a carga) ----- */
  function tickLive() {
    const elapsed = Math.floor(performance.now() - T0);
    for (const { node, base } of liveNodes) node.textContent = String(base + elapsed);
  }
  // atualiza ~4x/s: honesto (o dado cresge continuamente) sem custo. Roda mesmo sob reduced-motion (é dado, não animação decorativa).
  setInterval(tickLive, 250);
  tickLive();

  /* ================= Âncoras / Focus ================= */
  const anchorsBox = document.getElementById('anchors');
  function renderAnchors() {
    anchorsBox.innerHTML = '';
    ANCHORS.forEach((a) => {
      const row = el('div', 'mns-anchors__row');
      row.appendChild(el('span', 'mns-anchors__label', a.label));
      const bar = el('div', 'mns-anchors__bar');
      bar.style.setProperty('--mns-w', a.pagerank.toFixed(4));
      row.appendChild(bar);
      row.appendChild(el('span', 'mns-anchors__pr', a.pagerank.toFixed(4)));
      anchorsBox.appendChild(row);
    });
  }

  /* ================= Mergulho (Meniscus Slit) ================= */
  const dive = document.getElementById('dive');
  const diveClaim = document.getElementById('dive-claim');
  const diveHonest = document.getElementById('dive-honest');
  const diveClose = document.getElementById('dive-close');
  let lastFocus = null;

  function openDive(m) {
    diveClaim.textContent = m.claim;
    const ageNow = Number.isFinite(m.age_ms) ? (m.age_ms + Math.floor(performance.now() - T0)) : null;
    diveHonest.textContent = ageNow != null
      ? `${m.source_agent} · age ${ageNow} ms · tier ${m.tier}`
      : `${m.source_agent} · age ausente (unknown) · tier ${m.tier}`;
    dive.hidden = false;
    dive.dataset.open = 'true';
    lastFocus = document.activeElement;
    diveClose.focus();
  }
  function closeDive() {
    dive.dataset.open = 'false';
    dive.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  diveClose.addEventListener('click', closeDive);
  dive.addEventListener('click', (e) => { if (e.target === dive) closeDive(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && dive.dataset.open === 'true') closeDive(); });

  /* ================= Dial de tier (paridade teclado já via <button>) ================= */
  document.querySelectorAll('.mns-dial__opt').forEach((btn, _i, all) => {
    btn.addEventListener('click', () => {
      all.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
    });
  });
  document.querySelectorAll('.mns-recon__opt').forEach((btn) => {
    btn.addEventListener('click', () => { /* demo: sem mutação real (north é read-only) */ });
  });

  /* ================= Switcher de estados honestos ================= */
  const plate = document.getElementById('trust-plate');
  const verdict = document.getElementById('trust-verdict');
  const fp = document.getElementById('trust-fp');
  const tab = document.getElementById('trust-tab');
  const recon = document.getElementById('recon');
  const headSub = document.getElementById('head-sub');
  const suff = document.getElementById('suff');
  const suffBadge = document.getElementById('suff-badge');
  const suffNums = document.getElementById('suff-nums');
  const suffWhy = document.getElementById('suff-why');
  const reconEl = document.querySelector('.mns-bench__recon');

  const CANON = {
    trust: 'full', coverage: 'mismatch', verdict: 'FULL TRUST',
    fp: 'binário ef9c6e9 · grafo 521/500 · finalizado',
    sub: 'confiança plena no binário/grafo · cobertura ausente e honesta para este repo',
    suffState: 'sufficient', suffBadge: 'sufficient', suffNums: 'captured 0.2638 · top 0.2426',
    suffWhy: 'the top match scores 0.24; everything left out scores at most 0.14 (weak tail) — the strongest context is in hand',
    memory: MEMORY, reconVisible: true,
  };

  function applyState(name) {
    // parte do canônico e diverge só o que o estado muda (matriz de memória permanece real onde faz sentido)
    let s = { ...CANON };
    let memory = MEMORY;
    let reconVisible = true;

    if (name === 'degraded') {
      // trust degradado SINTÉTICO (declarado): a placa desloca+inclina, o reparo viaja junto. Sem alarme.
      s.trust = 'degraded'; s.coverage = 'match';
      s.verdict = 'REVERIFY'; s.fp = 'degraded · reverify — o binário mudou desde o bind';
      s.sub = 'trust degradado (dado sintético) · a placa desloca e inclina, o reparo viaja junto';
      reconVisible = false;
    } else if (name === 'stale') {
      // um claim marcado stale cai para a faixa cinza fora do trilho
      memory = MEMORY.map((m, i) => i === 1 ? { ...m, stale: true } : m);
      s.sub = 'um claim stale — exilado da linha do tempo confiável (idade nunca falsificada para agora)';
    } else if (name === 'abstain') {
      // a máquina retorna abstenção: violeta reservada, IMÓVEL (não performa)
      s.trust = 'abstain'; s.coverage = 'match';
      s.verdict = "ABSTAIN — I won't guess this one"; s.fp = 'insufficient_evidence · resposta honesta, não falha';
      s.sub = 'abstain — a máquina se recusa a adivinhar; a placa não recebe gesto (o "não sei" não performa)';
      s.suffState = 'insufficient'; s.suffBadge = 'insufficient';
      s.suffNums = 'captured 0.08 · top 0.08';
      s.suffWhy = 'no match clears the floor — the honest answer is abstain, not a guess';
      reconVisible = false;
    } else if (name === 'gathering') {
      s.suffState = 'gathering'; s.suffBadge = 'gathering';
      s.suffNums = 'captured 0.19 · top 0.23';
      s.suffWhy = SUFF_GATHERING_WHY;
      s.sub = 'suficiência gathering · a prosa epistêmica muda com o estado e é sempre honesta';
    } else if (name === 'empty') {
      memory = [];
      s.sub = 'sem memória neste tier · o vazio AFIRMA, não é tela em branco';
    }

    plate.dataset.trust = s.trust;
    plate.dataset.coverage = s.coverage;
    verdict.textContent = s.verdict;
    fp.textContent = s.fp;
    headSub.textContent = s.sub;
    suff.dataset.state = s.suffState;
    suffBadge.textContent = s.suffBadge;
    suffNums.textContent = s.suffNums;
    suffWhy.textContent = s.suffWhy;
    reconEl.style.display = reconVisible ? '' : 'none';

    renderRail(memory);
    if (memory.length === 0) {
      // trilho vazio: a afirmação de que não há memória neste tier
      track.innerHTML = '<p class="mns-gaps--empty" style="position:relative">nenhuma memória neste tier — a mente não afirma nada aqui.</p>';
      exile.dataset.empty = 'true';
      exileHint.style.display = '';
    }
  }

  document.querySelectorAll('.mns-switch__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mns-switch__btn').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      applyState(btn.dataset.state);
    });
  });

  /* ----- boot ----- */
  renderAnchors();
  renderRail(MEMORY);
})();
