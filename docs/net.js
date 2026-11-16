/* A field of towers: nodes on a jittered grid, links to neighbours, and sealed
   units that hop from one edge of the field to the other. The page supplies the look. */
window.LicoNet = (canvas, skin) => {
  "use strict";
  const ctx = canvas.getContext("2d"), reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rnd = (() => { let s = skin.seed || 7; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; })();
  let W = 0, H = 0, dpr = 1, nodes = [], links = [], units = [], pointer = null, hot = null, last = 0;
  const build = () => {
    W = canvas.clientWidth; H = canvas.clientHeight; dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const cell = Math.max(skin.cell * (W < 760 ? 0.72 : 1), 56), cols = Math.ceil(W / cell) + 1, rows = Math.ceil(H / cell) + 1, at = new Map();
    nodes = []; links = []; units = [];
    for (let j = 0; j < rows; j += 1) for (let i = 0; i < cols; i += 1) {
      const depth = j / (rows - 1), x = (i + (skin.stagger && j % 2 ? 0.5 : 0) + (rnd() - 0.5) * skin.jitter) * cell, y = (j + (rnd() - 0.5) * skin.jitter) * cell * (skin.squash || 1) + (skin.top || 0) * H;
      if (rnd() < (skin.holes || 0) || y > H + cell) continue;
      const node = { x, y, depth, quiet: skin.clear(x / W, y / H), pulse: 0, links: [], edge: i === 0 || i === cols - 1 || j === 0 || j === rows - 1 };
      at.set(`${i},${j}`, node); nodes.push(node);
    }
    const tie = (a, b) => { if (!a || !b) return; const link = { a, b, glow: 0 }; links.push(link); a.links.push([b, link]); b.links.push([a, link]); };
    for (let j = 0; j < rows; j += 1) for (let i = 0; i < cols; i += 1) {
      const n = at.get(`${i},${j}`);
      if (skin.iso) { tie(n, at.get(`${i},${j + 1}`)); tie(n, at.get(`${i + (j % 2 ? 1 : -1)},${j + 1}`)); continue; }
      tie(n, at.get(`${i + 1},${j}`)); tie(n, at.get(`${i},${j + 1}`));
      if (skin.diagonal && rnd() < skin.diagonal) tie(n, at.get(`${i + 1},${j + 1}`));
    }
  };
  const route = () => {
    const edges = nodes.filter((n) => n.edge && n.links.length); if (edges.length < 2) return;
    const from = edges[Math.floor(rnd() * edges.length)]; let to = from, guard = 0;
    while ((to === from || Math.hypot(to.x - from.x, to.y - from.y) < Math.min(W, H) * 0.6) && guard++ < 40) to = edges[Math.floor(rnd() * edges.length)];
    const prev = new Map([[from, null]]), queue = [from];
    while (queue.length) { const n = queue.shift(); if (n === to) break; for (const [m] of n.links.slice().sort(() => rnd() - 0.5)) if (!prev.has(m)) { prev.set(m, n); queue.push(m); } }
    const path = []; for (let n = to; n; n = prev.get(n)) path.unshift(n);
    if (path.length > 2) units.push({ path, at: 0, seed: Math.floor(rnd() * 1e9) });
  };
  const frame = (ms) => {
    requestAnimationFrame(frame);
    const held = reduced || document.body.classList.contains("motion-paused");
    const dt = held ? 0 : Math.min(0.05, (ms - last) / 1000 || 0); last = ms;
    if (!held && units.length < (skin.traffic || 7) && rnd() < dt * 2.2) route();
    hot = null;
    if (pointer) { let best = 90; for (const n of nodes) { const d = Math.hypot(n.x - pointer.x, n.y - pointer.y); if (d < best) { best = d; hot = n; } } }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    for (const link of links) { link.glow = Math.max(0, link.glow - dt * 0.9); if (hot && (link.a === hot || link.b === hot)) link.glow = 1; }
    skin.links(ctx, links);
    units = units.filter((unit) => {
      unit.at += dt * (skin.speed || 1.5);
      const i = Math.floor(unit.at), t = unit.at - i;
      if (i >= unit.path.length - 1) { unit.path[unit.path.length - 1].pulse = 1; return false; }
      const a = unit.path[i], b = unit.path[i + 1], e = t * t * (3 - 2 * t);
      if (t < 0.12) a.pulse = Math.max(a.pulse, 1 - t * 8);
      const link = a.links.find(([m]) => m === b); if (link) link[1].glow = Math.max(link[1].glow, 0.8);
      unit.x = a.x + (b.x - a.x) * e; unit.y = a.y + (b.y - a.y) * e; unit.depth = a.depth + (b.depth - a.depth) * e; unit.hop = Math.sin(e * Math.PI);
      return true;
    });
    for (const n of nodes) n.pulse = Math.max(0, n.pulse - dt * 1.7);
    skin.draw(ctx, nodes, units.filter((unit) => !skin.clear(unit.x / W, unit.y / H)), hot, ms);
  };
  canvas.parentElement.addEventListener("pointermove", (event) => { const box = canvas.getBoundingClientRect(); pointer = { x: event.clientX - box.left, y: event.clientY - box.top }; }, { passive: true });
  canvas.parentElement.addEventListener("pointerleave", () => { pointer = null; });
  new ResizeObserver(build).observe(canvas);
  build(); if (reduced) for (let i = 0; i < 4; i += 1) route();
  requestAnimationFrame(frame);
};
/* A rook, standing on (x, y), s wide. */
window.LicoRook = (c, x, y, s) => {
  const w = s, h = s * 1.3, l = x - w / 2, t = y - h, m = w / 5;
  c.rect(l + w * 0.1, t + m * 0.9, w * 0.8, h - m * 0.9 - h * 0.14); c.rect(l, y - h * 0.16, w, h * 0.16);
  for (let i = 0; i < 3; i += 1) c.rect(l + w * 0.1 + i * (w * 0.8 - m) / 2, t, m, m);
};
