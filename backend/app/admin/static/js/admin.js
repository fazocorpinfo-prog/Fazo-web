// Row click-through + theme toggle + misc admin interactions.
(function () {
  document.querySelectorAll("tr.row-click[data-href]").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("a,button,form,input,select,textarea,label")) return;
      window.location.href = row.dataset.href;
    });
  });

  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const root = document.documentElement;
      const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `admin_theme=${next};path=/;max-age=${maxAge};samesite=lax`;
    });
  }
})();
