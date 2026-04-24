// Row click-through + any misc admin interactions.
(function () {
  document.querySelectorAll("tr.row-click[data-href]").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("a,button,form,input,select,textarea,label")) return;
      window.location.href = row.dataset.href;
    });
  });
})();
