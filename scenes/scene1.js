/* SAHNE 1 — OYUN (0–10 s)  Bir zar oyunu adil mi?
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /* ---- boxes and equal objects: cabinet projection, x right, y back, z up ---- */
  const Pj = (O, c, x, y, z) => [O[0] + x * c + y * c * 0.5, O[1] - z * c - y * c * 0.5];
  function poly(ctx, P, a, fill, seed, w = 3) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fill.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** a solid block x..x+dx, y..y+dy, z..z+dz */
  function block(ctx, O, c, x, y, z, dx, dy, dz, a, h, seed) {
    if (a <= 0) return;
    const P = (i, j, k) => Pj(O, c, x + i * dx, y + j * dy, z + k * dz), H = h > 0 ? amber(a * 0.6 * h) : null;
    poly(ctx, [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], a, [amber(a * 0.2), H], seed, 2.5);
    poly(ctx, [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.14})`, H], seed + 1, 2.5);
    poly(ctx, [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.04})`, H], seed + 2, 2.5);
  }
  function ball(ctx, O, c, x, y, z, a, seed) {
    if (a <= 0) return; const C = Pj(O, c, x + 0.5, y + 0.5, z + 0.5), r = c * 0.47;
    ctx.beginPath(); ctx.arc(C[0], C[1], r, 0, 7);
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    const g = ctx.createRadialGradient(C[0] - r * 0.35, C[1] - r * 0.35, r * 0.1, C[0], C[1], r);
    g.addColorStop(0, amber(a * 0.12)); g.addColorStop(1, amber(a * 0.45)); ctx.fillStyle = g; ctx.fill();
    const P = []; for (let i = 0; i <= 28; i++) P.push([C[0] + r * Math.cos(i / 28 * 6.2832), C[1] + r * Math.sin(i / 28 * 6.2832)]);
    Ink.path(ctx, P, { w: 2.5, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** items [{x,y,z,dx,dy,dz}] in painter's order, each with a fill index i */
  function fillList(L, W, H, dx = 1) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x += dx) out.push({ x, y, z, dx, dy: 1, dz: 1 });
    out.forEach((q, i) => (q.i = i));
    return out.slice().sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  const shown = (t, t0, dt, n) => Math.max(0, Math.min(n, Math.floor((t - t0) / dt + 0.4)));
  /** an open glass box: back walls first, then the contents, then the front edges */
  function container(ctx, O, c, L, W, H, a, seed, draw) {
    if (a <= 0) return;
    const P = (x, y, z) => Pj(O, c, x, y, z), ink = `rgba(${LI.INK_RGB},${a * 0.05})`;
    poly(ctx, [P(0, W, 0), P(L, W, 0), P(L, W, H), P(0, W, H)], a * 0.8, [ink], seed, 2);
    poly(ctx, [P(0, 0, 0), P(0, W, 0), P(0, W, H), P(0, 0, H)], a * 0.8, [ink], seed + 1, 2);
    poly(ctx, [P(0, 0, 0), P(L, 0, 0), P(L, W, 0), P(0, W, 0)], a * 0.8, [ink], seed + 2, 2);
    if (draw) draw();
    [[[0, 0, 0], [L, 0, 0]], [[L, 0, 0], [L, 0, H]], [[L, 0, H], [0, 0, H]], [[0, 0, H], [0, 0, 0]], [[L, 0, 0], [L, W, 0]], [[L, W, 0], [L, W, H]], [[L, W, H], [L, 0, H]], [[0, W, H], [L, W, H]], [[0, 0, H], [0, W, H]]]
      .forEach(([p, q], i) => Ink.path(ctx, [P(...p), P(...q)], { w: 3, alpha: a * 0.85, seed: seed + 10 + i, taper: [0, 0] }));
  }
  function fillBox(ctx, O, c, L, W, H, t, t0, dt, a, seed, kind = 'cube', hot = 0) {
    const dx = kind === 'brick' ? 2 : 1, items = fillList(L, W, H, dx);
    container(ctx, O, c, L, W, H, a, seed, () => items.forEach((q) => {
      const k = seg(t, t0 + q.i * dt, t0 + q.i * dt + 0.35); if (k <= 0) return;
      const dz = (1 - inOut(k)) * (H + 1 - q.z);
      if (kind === 'ball') ball(ctx, O, c, q.x, q.y, q.z + dz, a * k, seed + 100 + q.i * 3);
      else block(ctx, O, c, q.x, q.y, q.z + dz, q.dx, 1, 1, a * k, hot, seed + 100 + q.i * 3);
    }));
    return items.length;
  }
  function tag(ctx, env, O, c, L, text, a, hot) {
    if (a <= 0) return; const s = KD.L(env).G.s;
    F().T(ctx, text, O[0] + L * c / 2, O[1] + s * 0.95, { size: s * 0.66, alpha: a, halo: true, color: hot ? A.amber : undefined });
  }
  /** cubes of an L × W × H prism; when(q) gives each cube's arrival time (Infinity = never) */
  function cubes(L, W, H) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x++) out.push({ x, y, z });
    return out.sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  function fillT(ctx, O, c, B, t, a, when, hot, seed) {
    let n = 0;
    container(ctx, O, c, B[0], B[1], B[2], a, seed, () => cubes(...B).forEach((q, i) => {
      const t0 = when(q); if (!(t >= t0)) return; n++;
      const k = seg(t, t0, t0 + 0.3);
      block(ctx, O, c, q.x, q.y, q.z + (1 - inOut(k)) * 1.2, 1, 1, 1, a * k, hot ? hot(q) : 0, seed + 100 + i * 3);
    }));
    return n;
  }
  function edges(ctx, env, O, c, B, a, labels) {
    if (a <= 0) return; const s = KD.L(env).G.s, o = { size: s * 0.7, alpha: a, halo: true, color: A.amber };
    const m = (p, q) => { const P = Pj(O, c, ...p), Q = Pj(O, c, ...q); return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; };
    const [L, W, H] = B;
    let q = m([0, 0, 0], [L, 0, 0]); F().T(ctx, labels[0], q[0], q[1] + 36, o);
    q = m([L, 0, 0], [L, W, 0]); F().T(ctx, labels[1], q[0] + 50, q[1] + 12, o);
    q = m([L, W, 0], [L, W, H]); F().T(ctx, labels[2], q[0] + 48, q[1], o);
  }
  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  /** a row of outcomes; cls(i) = 'A', 'B' or null */
  function tokens(ctx, env, n, labels, cls, t, t0, a, seed) {
    if (a <= 0) return; const T = KD.L(env).TK, gap = Math.min(T.gap, T.W / n), r = Math.min(T.r, gap * 0.42);
    for (let i = 0; i < n; i++) {
      const k = seg(t, t0 + i * 0.06, t0 + i * 0.06 + 0.3); if (k <= 0) continue;
      const x = T.x + (i - (n - 1) / 2) * gap, y = T.y - (1 - k) * 30, c = cls(i), al = a * k;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = `rgba(${LI.PAPER_RGB},${al})`; ctx.fill();
      if (c === 'A') { ctx.fillStyle = amber(al * 0.75); ctx.fill(); } else if (c === 'B') { ctx.fillStyle = `rgba(${LI.INK_RGB},${al * 0.35})`; ctx.fill(); }
      const P = []; for (let j = 0; j <= 24; j++) P.push([x + r * Math.cos(j / 24 * 6.2832), y + r * Math.sin(j / 24 * 6.2832)]);
      Ink.path(ctx, P, { w: 2.5, alpha: al * 0.9, seed: seed + i, taper: [0, 0] });
      if (labels) F().T(ctx, labels(i), x, y + 1, { size: r * 0.95, alpha: al, color: c === 'B' ? undefined : undefined });
      if (c) F().T(ctx, c, x, y - r - 18, { size: r * 0.6, alpha: al, halo: true, color: c === 'A' ? A.amber : undefined });
    }
  }
  function under(ctx, env, text, a, hot, dy = 0) { if (a <= 0) return; const T = KD.L(env).TK, s = KD.L(env).G.s; F().T(ctx, text, T.x, T.y + T.r + s * 1.2 + dy, { size: s * 0.8, alpha: a, halo: true, color: hot ? A.amber : undefined }); }
  function tally2(ctx, env, t, rows) { const T = KD.L(env).T2; rows.forEach(([t0, t1, q, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, q, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); }); }
  function spinner(ctx, env, t, a) {
    if (a <= 0) return; const S = KD.L(env).SP, s = KD.L(env).G.s, C = [S.x, S.y];
    const secs = [[0, 180, 'kırmızı', amber(a * 0.7)], [180, 270, 'mavi', `rgba(${LI.INK_RGB},${a * 0.35})`], [270, 360, 'sarı', amber(a * 0.25)]];
    secs.forEach(([d0, d1, name, fill], i) => {
      const P = [C]; for (let j = 0; j <= 30; j++) { const u = (d0 + (d1 - d0) * j / 30 - 90) * Math.PI / 180; P.push([C[0] + S.r * Math.cos(u), C[1] + S.r * Math.sin(u)]); }
      ctx.beginPath(); P.forEach((q, k) => (k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill(); ctx.fillStyle = fill; ctx.fill();
      Ink.path(ctx, P.concat([C]), { w: 2.5, alpha: a * 0.9, seed: 99000 + i, taper: [0, 0] });
      const m = ((d0 + d1) / 2 - 90) * Math.PI / 180;
      F().T(ctx, name, C[0] + S.r * 0.55 * Math.cos(m), C[1] + S.r * 0.55 * Math.sin(m), { size: s * 0.6, alpha: a, halo: true });
    });
    // the pointer spins and settles
    const u = (-90 + 1440 * (1 - Math.pow(1 - seg(t, 48.4, 51.4), 3)) + 30) * Math.PI / 180;
    Ink.path(ctx, [C, [C[0] + S.r * 0.85 * Math.cos(u), C[1] + S.r * 0.85 * Math.sin(u)]], { w: 5, alpha: a, seed: 99100, taper: [0, 0.6] });
    ctx.beginPath(); ctx.arc(C[0], C[1], 8, 0, 7); ctx.fillStyle = `rgba(${LI.INK_RGB},${a})`; ctx.fill();
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Bu oyun adil mi?'],
      [10.6, 27.8, 'Eşit olasılıklı olmanın ölçütü'],
      [28.4, 45.8, 'Oyundaki olayları hesaplayalım'],
      [46.4, 63.8, 'Bölmeleri eşit olmayan bir çark'],
      [64.4, 79.8, 'Oyunu adil yapalım'],
    ]);
  }

  function figure(ctx, env, t) {
    const a = END(t), lab = (i) => String(i + 1);
    // S1: the game
    tokens(ctx, env, 6, lab, (i) => (t > 6.4 ? (i >= 3 ? 'A' : i < 2 ? 'B' : null) : null), t, 5.0, a * win(t, 4.6, 10.2), 99200);
    // S2: odd and even
    const a2 = a * win(t, 10.8, 27.8);
    tokens(ctx, env, 6, lab, (i) => (t > 15.0 ? ((i + 1) % 2 ? 'A' : 'B') : null), t, 11.2, a2, 99300);
    under(ctx, env, 'A: tek, 3/6 · B: çift, 3/6', a2 * seg(t, 17.0, 17.4), t > 21.0);
    // S3: the game's events
    const a3 = a * win(t, 28.8, 45.8);
    tokens(ctx, env, 6, lab, (i) => (i >= 3 ? 'A' : i < 2 ? 'B' : null), t, 29.2, a3, 99400);
    under(ctx, env, 'P(3’ten büyük) = 3/6 · P(3’ten küçük) = 2/6', a3 * seg(t, 31.6, 32.0), t > 36.0);
    tally(ctx, env, t, [[33.4, 45.8, '3/6 ≠ 2/6: eşit olasılıklı değil'], [35.0, 45.8, '3 gelirse kimse kazanmaz'], [37.0, 45.8, 'Oyun Ali’nin lehine: adil değil ✗', true]]);
    // S4: the spinner
    spinner(ctx, env, t, a * win(t, 46.8, 63.8) * seg(t, 47.0, 47.6));
    tally2(ctx, env, t, [[52.0, 63.8, 'kırmızı: 180/360 = 1/2'], [53.4, 63.8, 'mavi: 90/360 = 1/4 · sarı: 90/360 = 1/4'], [55.4, 63.8, 'mavi = sarı ✓ · kırmızı ≠ mavi ✗', true]]);
    // S5: fix the game
    const a5 = a * win(t, 64.8, 79.8);
    tokens(ctx, env, 6, lab, (i) => (i >= 3 ? 'A' : t > 67.0 ? 'B' : i < 2 ? 'B' : null), t, 65.2, a5, 99500);
    under(ctx, env, 'P(A) = 3/6 · P(B) = 3/6', a5 * seg(t, 68.4, 68.8), t > 70.4);
    tally(ctx, env, t, [[70.4, 79.8, 'Ali: 4, 5, 6 · Ayşe: 1, 2, 3'], [72.0, 79.8, '3/6 = 3/6: eşit olasılıklı'], [73.6, 79.8, 'Oyun artık adil ✓', true]]);
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[5.6, 10.2, 'Zar atılıyor: 3’ten büyükse Ali (A), 3’ten küçükse Ayşe (B) kazanır'],
      [11.4, 18.8, 'Ölçüt: iki olayın olasılıkları eşitse eşit olasılıklıdırlar'], [19.0, 27.8, 'Zarda tek ve çift sayı gelmesi'],
      [29.4, 45.8, 'A: 3’ten büyük (4, 5, 6) · B: 3’ten küçük (1, 2)'],
      [47.4, 63.8, 'Çarkın bölmeleri eşit değil: olasılık açıyla orantılı'],
      [65.4, 79.8, 'Ayşe’nin olayına 3’ü de ekleyelim']]);
    exprs(ctx, t, at(W, 1), [[8.0, 10.2, 'İki olayın kazanma şansı eşit mi?'], [14.0, 18.8, 'Çıktıları eşit olasılıklıysa: çıktı sayısı eşit mi?'],
      [22.0, 27.8, 'Her birinde 3 çıktı: 3/6 = 3/6'],
      [57.0, 63.8, 'Hesap, ölçütle karşılaştırıldı'],
      [75.0, 79.8, 'Adil oyun: kazanma olayları eşit olasılıklı']]);
    exprs(ctx, t, at(W, 2), [[24.0, 27.8, 'Tek ve çift gelmesi eşit olasılıklı ✓', true],
      [41.0, 45.8, 'Bu iki olay eşit olasılıklı değil ✗', true],
      [59.0, 63.8, 'Bölme sayısına değil, büyüklüğüne bak!', true],
      [77.0, 79.8, 'Hesapla, ölçütle karşılaştır, karar ver', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Ölçüt: olasılıklar eşit mi?', 80.6], ['Tek ve çift: 3/6 = 3/6 ✓', 81.6], ['3’ten büyük ve küçük: 3/6 ≠ 2/6 ✗', 82.6], ['Hesapla, karşılaştır, karar ver!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A game', nameTr: 'Oyun', concept: 'Is it fair?', conceptTr: 'Adil mi?', render });
})(window.LI = window.LI || {});
