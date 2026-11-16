/* badtower.com: the page's motion state and the field of towers. */
(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const MOTION_KEY = "badtower-motion";
  let userPaused = false;
  try { userPaused = localStorage.getItem(MOTION_KEY) === "paused"; } catch { /* storage unavailable */ }
  const isPaused = () => userPaused || reduced.matches;

  const toggle = document.getElementById("motion-toggle");
  const icon = document.getElementById("motion-icon");
  const apply = () => {
    const paused = isPaused();
    document.body.classList.toggle("motion-paused", paused);
    if (!toggle) return;
    toggle.disabled = reduced.matches;
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.setAttribute("aria-label", paused ? "Resume motion" : "Pause motion");
    icon?.setAttribute("href", paused ? "#play" : "#pause");
  };
  toggle?.addEventListener("click", () => {
    userPaused = !userPaused;
    try { localStorage.setItem(MOTION_KEY, userPaused ? "paused" : "running"); } catch { /* storage unavailable */ }
    apply();
  });
  reduced.addEventListener("change", apply);
  apply();
})();

/* The field: gold towers on a slanted board; sealed units hop between them. */
(() => {
  "use strict";
  const canvas = document.getElementById("net");
  const copy = document.querySelector(".hero-copy");
  if (!canvas || !copy || !window.LicoNet) return;
  const hash = (n) => { n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d); n = Math.imul(n ^ (n >>> 12), 0x297a2d39); return (n ^ (n >>> 15)) >>> 0; };
  const SKIN = { gold: ["#ffd84f", "#f0ac0c", "#b87a00"], bright: ["#ffe27a", "#ffc72e", "#d99400"], lit: ["#fffbe6", "#ffe27a", "#ffc72e"], quiet: ["#75684a", "#40382a", "#2a251b"], unit: ["#fff8ea", "#cdbf9f", "#998c6a"] };
  const block = (c, x, y, w, h, [top, left, right], edge) => {
    const d = w / 2;
    c.fillStyle = left; c.beginPath(); c.moveTo(x - w, y); c.lineTo(x, y + d); c.lineTo(x, y + d - h); c.lineTo(x - w, y - h); c.fill();
    c.fillStyle = right; c.beginPath(); c.moveTo(x + w, y); c.lineTo(x, y + d); c.lineTo(x, y + d - h); c.lineTo(x + w, y - h); c.fill();
    c.fillStyle = top; c.beginPath(); c.moveTo(x, y - d - h); c.lineTo(x + w, y - h); c.lineTo(x, y + d - h); c.lineTo(x - w, y - h); c.closePath(); c.fill();
    if (edge) { c.strokeStyle = edge; c.lineWidth = 1; c.beginPath(); c.moveTo(x - w, y - h); c.lineTo(x, y + d - h); c.lineTo(x + w, y - h); c.stroke(); }
  };
  window.LicoNet(canvas, {
    cell: 132, jitter: 0, stagger: true, squash: 0.5, iso: true, holes: 0.1, traffic: 7, speed: 1.5, seed: 23,
    clear: (x, y) => (innerWidth < 760 ? y > 0.5 : x < 0.58 && y > 0.44) || y < 0.1,
    links: (c, links) => { for (const l of links) { c.strokeStyle = l.glow > 0.02 ? `rgba(255, 199, 46, ${0.16 + l.glow * 0.8})` : l.a.quiet && l.b.quiet ? "#12100c" : "#211d15"; c.lineWidth = 1.5 + l.glow * 1.5; c.beginPath(); c.moveTo(l.a.x, l.a.y); c.lineTo(l.b.x, l.b.y); c.stroke(); } },
    draw: (c, nodes, units, hot) => {
      /* Nothing stands behind the words. */
      const box = canvas.getBoundingClientRect(), text = copy.getBoundingClientRect(), left = text.left - box.left - 26, right = text.right - box.left + 26, top = text.top - box.top - 12, bottom = text.bottom - box.top + 70;
      nodes = nodes.filter((n) => !(n.quiet && n.x > left && n.x < right && n.y > top && n.y < bottom));
      const all = [...nodes.map((n) => ({ n, y: n.y })), ...units.map((u) => ({ u, y: u.y + 1 }))].sort((a, b) => a.y - b.y);
      for (const { n, u } of all) {
        if (u) { block(c, u.x, u.y - 50 - u.hop * 24, 8, 8, SKIN.unit); continue; }
        const id = hash(Math.round(n.x * 7 + n.y * 13)), lit = Math.max(n.pulse, n === hot ? 1 : 0), h = 20 + (id % 34) + lit * 8;
        if (lit > 0.02) block(c, n.x, n.y, 15, h, SKIN.lit, "rgba(255, 250, 230, .7)");
        else if (n.quiet) block(c, n.x, n.y, 15, h, SKIN.quiet, "rgba(255, 220, 130, .85)");
        else if (id % 9 < 2) block(c, n.x, n.y, 15, h, SKIN.bright, "rgba(255, 244, 210, .45)");
        else block(c, n.x, n.y, 15, h, SKIN.gold, "rgba(255, 244, 200, .55)");
      }
    },
  });
})();
