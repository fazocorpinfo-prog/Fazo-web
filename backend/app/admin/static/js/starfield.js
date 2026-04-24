// Lightweight starfield with cyan/blue palette matching website tokens.
(function () {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0, height = 0;
  const stars = [];
  const STAR_COUNT = 90;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function seed() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: rnd(0.4, 1.8),
        baseA: rnd(0.25, 0.8),
        phase: rnd(0, Math.PI * 2),
        speed: rnd(0.002, 0.006),
        drift: rnd(0.02, 0.08),
        hue: Math.random() > 0.75 ? "cyan" : "white",
      });
    }
  }

  const pointer = { x: 0.5, y: 0.5 };
  window.addEventListener("mousemove", (e) => {
    pointer.x = e.clientX / window.innerWidth;
    pointer.y = e.clientY / window.innerHeight;
  }, { passive: true });

  function draw(now) {
    ctx.clearRect(0, 0, width, height);
    const t = now * 0.001;
    const shiftX = (pointer.x - 0.5) * 14;
    const shiftY = (pointer.y - 0.5) * 14;

    for (const s of stars) {
      const twinkle = Math.sin(t * 2 + s.phase) * 0.35 + 0.65;
      const alpha = Math.max(0.05, s.baseA * twinkle);
      const x = s.x + shiftX * s.drift * 6;
      const y = s.y + shiftY * s.drift * 6;

      if (s.hue === "cyan") {
        ctx.shadowColor = "rgba(0, 194, 255, 0.8)";
        ctx.shadowBlur = 6;
        ctx.fillStyle = `rgba(0, 194, 255, ${alpha})`;
      } else {
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
        ctx.shadowBlur = 3;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
      }

      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();

      s.y += s.speed * 30;
      if (s.y > height + 4) { s.y = -4; s.x = Math.random() * width; }
    }
    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  resize();
  seed();
  window.addEventListener("resize", () => { resize(); seed(); });

  if (reduce) {
    // Draw a single frame with alpha ~ base
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      ctx.fillStyle = s.hue === "cyan" ? `rgba(0, 194, 255, ${s.baseA})` : `rgba(255, 255, 255, ${s.baseA})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
  } else {
    requestAnimationFrame(draw);
  }
})();
