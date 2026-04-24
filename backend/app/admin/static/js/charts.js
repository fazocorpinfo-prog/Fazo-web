// Chart.js renderers — palette matches website tokens (cyan/blue glow).
(function () {
  if (typeof Chart === "undefined") return;

  const CYAN = "#00C2FF";
  const BLUE = "#0050FF";
  const TEXT_DIM = "rgba(160,174,192,0.8)";
  const GRID = "rgba(255, 255, 255, 0.05)";

  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = TEXT_DIM;
  Chart.defaults.borderColor = GRID;

  function gradient(ctx, area, from, to) {
    const g = ctx.createLinearGradient(0, area.top, 0, area.bottom);
    g.addColorStop(0, from);
    g.addColorStop(1, to);
    return g;
  }

  function formatShort(value) {
    if (value >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return value;
  }

  function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  const tooltipStyle = {
    backgroundColor: "rgba(11, 3, 36, 0.92)",
    titleColor: "#fff",
    bodyColor: "#A0AEC0",
    borderColor: "rgba(0, 194, 255, 0.35)",
    borderWidth: 1,
    padding: 12,
    cornerRadius: 10,
    displayColors: true,
    boxPadding: 6,
    titleFont: { family: "'Orbitron', sans-serif", size: 12, weight: "600" },
    bodyFont: { size: 12 },
  };

  function lineChart(canvasId, datasets, labels) {
    const el = document.getElementById(canvasId);
    if (!el) return null;
    const ctx = el.getContext("2d");
    return new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: tooltipStyle,
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: TEXT_DIM, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
          },
          y: {
            beginAtZero: true,
            grid: { color: GRID, drawBorder: false },
            ticks: { color: TEXT_DIM, callback: formatShort },
          },
        },
        elements: {
          line: { tension: 0.35, borderWidth: 2.5 },
          point: { radius: 0, hoverRadius: 5, hitRadius: 18 },
        },
      },
    });
  }

  function viewsDataset(ctxCanvas, points) {
    const ctx = ctxCanvas.getContext("2d");
    return {
      label: "Views",
      data: points.map((p) => p.value),
      borderColor: CYAN,
      backgroundColor: (c) => {
        const { chart } = c;
        const { ctx, chartArea } = chart;
        if (!chartArea) return "rgba(0,194,255,0.15)";
        return gradient(ctx, chartArea, "rgba(0,194,255,0.35)", "rgba(0,194,255,0)");
      },
      fill: true,
      pointBackgroundColor: CYAN,
      pointBorderColor: "#0B0324",
    };
  }

  function contactsDataset(points) {
    return {
      label: "Leads",
      data: points.map((p) => p.value),
      borderColor: BLUE,
      backgroundColor: (c) => {
        const { chart } = c;
        const { ctx, chartArea } = chart;
        if (!chartArea) return "rgba(0,80,255,0.1)";
        return gradient(ctx, chartArea, "rgba(0,80,255,0.4)", "rgba(0,80,255,0)");
      },
      fill: true,
      pointBackgroundColor: BLUE,
      pointBorderColor: "#0B0324",
    };
  }

  function labelsFrom(points) { return points.map((p) => fmtDate(p.date)); }

  function doughnutChart(canvasId, labels, values, colors) {
    const el = document.getElementById(canvasId);
    if (!el) return null;
    const ctx = el.getContext("2d");
    return new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderColor: "#0B0324",
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "64%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: TEXT_DIM,
              padding: 12,
              boxWidth: 10,
              boxHeight: 10,
              usePointStyle: true,
              pointStyle: "circle",
              font: { size: 11 },
            },
          },
          tooltip: tooltipStyle,
        },
      },
    });
  }

  const DEVICE_COLORS = ["#00C2FF", "#0050FF", "#7FE0FF", "#A0AEC0"];
  const LOCALE_COLORS = ["#00C2FF", "#0050FF", "#23D18B", "#FFB648", "#FF4D6D", "#7FE0FF"];

  function renderDashboard() {
    const D = window.__DASHBOARD__;
    if (!D) return;

    const viewsCanvas = document.getElementById("chart-views");
    if (viewsCanvas) {
      lineChart("chart-views", [viewsDataset(viewsCanvas, D.views)], labelsFrom(D.views));
    }
    const contactsCanvas = document.getElementById("chart-contacts");
    if (contactsCanvas) {
      lineChart("chart-contacts", [contactsDataset(D.contacts)], labelsFrom(D.contacts));
    }

    if (D.devices && D.devices.length) {
      doughnutChart(
        "chart-devices",
        D.devices.map((d) => d.device),
        D.devices.map((d) => d.count),
        DEVICE_COLORS
      );
    }
    if (D.locales && D.locales.length) {
      doughnutChart(
        "chart-locales",
        D.locales.map((d) => d.locale),
        D.locales.map((d) => d.count),
        LOCALE_COLORS
      );
    }
  }

  function renderAnalytics() {
    const A = window.__ANALYTICS__;
    if (!A) return;

    const combined = document.getElementById("chart-combined");
    if (combined) {
      lineChart(
        "chart-combined",
        [viewsDataset(combined, A.views), contactsDataset(A.contacts)],
        labelsFrom(A.views)
      );
    }

    if (A.devices && A.devices.length) {
      doughnutChart(
        "chart-devices",
        A.devices.map((d) => d.device),
        A.devices.map((d) => d.count),
        DEVICE_COLORS
      );
    }
    if (A.locales && A.locales.length) {
      doughnutChart(
        "chart-locales",
        A.locales.map((d) => d.locale),
        A.locales.map((d) => d.count),
        LOCALE_COLORS
      );
    }
  }

  renderDashboard();
  renderAnalytics();
})();
