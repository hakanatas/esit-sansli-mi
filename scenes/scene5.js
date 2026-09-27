/* SAHNE 5 — ADİL OYUN (64–80 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 5, start: 64, end: 80, name: "A fair game", nameTr: "Adil oyun", concept: "3/6 = 3/6", conceptTr: "3/6 = 3/6", render });
})(window.LI = window.LI || {});
