// Interactive parallax:
//  - [data-parallax-tilt] cards tilt & glow under the cursor
//  - [data-parallax-stage] > [data-parallax-depth] elements translate with pointer
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  // ---- Tilt on glass cards ----
  const tiltCards = document.querySelectorAll("[data-parallax-tilt]");
  tiltCards.forEach((card) => {
    const max = parseFloat(card.dataset.tiltMax || "6");
    let raf = null;
    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    let mx = 0.5, my = 0.5;

    function onMove(e) {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      mx = Math.min(1, Math.max(0, px));
      my = Math.min(1, Math.max(0, py));
      targetX = (my - 0.5) * -2 * max;
      targetY = (mx - 0.5) * 2 * max;
      card.style.setProperty("--mx", mx.toFixed(3));
      card.style.setProperty("--my", my.toFixed(3));
      if (!raf) raf = requestAnimationFrame(loop);
    }

    function loop() {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      card.style.transform = `perspective(900px) rotateX(${curX.toFixed(2)}deg) rotateY(${curY.toFixed(2)}deg)`;
      if (Math.abs(targetX - curX) > 0.01 || Math.abs(targetY - curY) > 0.01) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    function onLeave() {
      targetX = 0; targetY = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    }

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
  });

  // ---- Stage depth parallax ----
  const stages = document.querySelectorAll("[data-parallax-stage]");
  stages.forEach((stage) => {
    const layers = stage.querySelectorAll("[data-parallax-depth]");
    if (!layers.length) return;

    let raf = null;
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    function onMove(e) {
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = px;
      targetY = py;
      if (!raf) raf = requestAnimationFrame(loop);
    }

    function loop() {
      curX += (targetX - curX) * 0.1;
      curY += (targetY - curY) * 0.1;
      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.parallaxDepth || "0.06");
        const tx = curX * depth * 60;
        const ty = curY * depth * 60;
        layer.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      });
      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    function onLeave() { targetX = 0; targetY = 0; if (!raf) raf = requestAnimationFrame(loop); }

    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
  });
})();
