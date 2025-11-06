/* weekly.js — version simplifiée */
import { weeklySchedule } from "./agenda.js";
import { getNow } from "./time.js";
import { loadTheme, toggleTheme, initializeContactModal } from "./theme.js";

document.addEventListener("DOMContentLoaded", () => {
  // Gestion du basculement du thème via un bouton
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.addEventListener("click", toggleTheme);
    initializeContactModal();
    loadTheme();
  }
});

/* ——— Réglages horaires ——— */
const DAY_START = "08:00";
const DAY_END = "17:25";
const BIG_BREAKS = [
  { time: "09:35", length: 15 },
  { time: "14:45", length: 15 },
];

/* ——— Échelle (≈ 80 px/heure) ——— */
const PX_PER_MIN = 80 / 60;

/* ——— Utilitaires temps ——— */
const parseHHMM = (s) => {
  const [h, m] = s.split(":").map(Number);
  return { h, m };
};
const toMin = (h, m = 0) => h * 60 + m;
const minOf = (s) => {
  const { h, m } = parseHHMM(s);
  return toMin(h, m);
};

const DAY_START_MIN = minOf(DAY_START);
const DAY_END_MIN = minOf(DAY_END);
const yFromMin = (min) => Math.max(0, min - DAY_START_MIN) * PX_PER_MIN;
const clampY = (y) =>
  Math.max(0, Math.min((DAY_END_MIN - DAY_START_MIN) * PX_PER_MIN, y));

/* ——— Jours ——— */
const DAYS = [
  { label: "Lun", value: 1 },
  { label: "Mar", value: 2 },
  { label: "Mer", value: 3 },
  { label: "Jeu", value: 4 },
  { label: "Ven", value: 5 },
];

/* ——— PDF par trimestre ——— */
const trimesterPdfs = {
  T1: "docs/horaire_T1.pdf",
  T2: "docs/horaire_T2.pdf",
  T3: "docs/horaire_T3.pdf",
};

/* ——— Rendu ——— */
function getPeriodStarts() {
  const starts = [];
  let t = DAY_START_MIN;

  while (t < DAY_END_MIN) {
    starts.push(t);

    const periodEnd = t + 45;
    const breakAtEnd = BIG_BREAKS.find((b) => minOf(b.time) === periodEnd);
    if (breakAtEnd) {
      // prochaine période = après la pause, pas de +5
      t = periodEnd + breakAtEnd.length;
      continue;
    }

    const breakBefore = BIG_BREAKS.find(
      (b) => periodEnd === minOf(b.time) + b.length
    );
    if (breakBefore) {
      t = periodEnd; // directement, pas de +5
      continue;
    }

    // Cas normal : ajout du petit gap de 5 min
    t = periodEnd + 5;
  }

  return starts.filter((s) => s < DAY_END_MIN);
}

function labelFromMin(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function render() {
  const timetable = document.getElementById("timetable");
  timetable.innerHTML = "";

  // Colonne heures (ticks alignés sur le début de CHAQUE période)
  const timeCol = document.createElement("div");
  timeCol.className = "time-col";

  const starts = getPeriodStarts();

  for (let i = 0; i < starts.length; i++) {
    const cur = starts[i];
    const next = i < starts.length - 1 ? starts[i + 1] : DAY_END_MIN;
    const tick = document.createElement("div");
    tick.className = "tick";
    tick.textContent = `P${i + 1} • ` + labelFromMin(cur);
    tick.style.height = `${(next - cur) * PX_PER_MIN}px`;
    timeCol.appendChild(tick);
  }

  timetable.appendChild(timeCol);

  const totalH = (DAY_END_MIN - DAY_START_MIN) * PX_PER_MIN;

  // Colonnes des jours
  for (const day of DAYS) {
    const col = document.createElement("div");
    col.className = "day-col";

    const header = document.createElement("div");
    header.className = "day-header";
    header.textContent = day.label;
    col.appendChild(header);

    const slots = document.createElement("div");
    slots.className = "slot-grid";
    slots.style.height = `${totalH}px`;
    col.appendChild(slots);

    // Grandes pauses (bande légère)
    for (const b of BIG_BREAKS) {
      const start = minOf(b.time);
      const end = start + b.length;
      const band = document.createElement("div");
      band.className = "big-break";
      band.style.top = `${yFromMin(start)}px`;
      band.style.height = `${(end - start) * PX_PER_MIN}px`;
      slots.appendChild(band);
    }

    // Indicateur “maintenant”
    const indicator = document.createElement("div");
    indicator.className = "now-indicator";
    const bubble = document.createElement("div");
    bubble.className = "now-bubble";
    bubble.textContent = "maintenant";
    indicator.appendChild(bubble);
    slots.appendChild(indicator);

    // Événements du jour
    const events = weeklySchedule.filter((e) => e.dayOfWeek === day.value);
    for (const ev of events) {
      const el = document.createElement("div");
      el.className = "event";
      const startMin = toMin(ev.startHour, ev.startMinute);
      const endMin = toMin(ev.endHour, ev.endMinute);
      el.style.top = `${yFromMin(startMin)}px`;
      el.style.height = `${Math.max(24, (endMin - startMin) * PX_PER_MIN)}px`;
      el.innerHTML = `<strong>${ev.moduleName}</strong>
                      <small>${ev.room} • ${pad2(ev.startHour)}:${pad2(
        ev.startMinute
      )} – ${pad2(ev.endHour)}:${pad2(ev.endMinute)}</small>`;
      slots.appendChild(el);
    }

    timetable.appendChild(col);
  }

  updateNowIndicator();
  setInterval(updateNowIndicator, 1000);
}

function updateNowIndicator() {
  const now = getNow();
  const wd = now.getDay(); // 1..5 = Lun..Ven
  const y = yFromMin(toMin(now.getHours(), now.getMinutes()));

  // cacher tous les indicateurs
  document
    .querySelectorAll(".now-indicator")
    .forEach((n) => (n.style.display = "none"));

  const idx = DAYS.findIndex((d) => d.value === wd);
  if (idx === -1) return; // weekend
  const col = document.querySelectorAll(".day-col")[idx];
  if (!col) return;

  const ind = col.querySelector(".now-indicator");
  ind.style.display = "block";
  ind.style.top = `${clampY(y)}px`;
}

/* ——— Toolbar ——— */
function initToolbar() {
  const select = document.getElementById("trimesterSelect");
  const link = document.getElementById("pdfLink");
  const apply = () => {
    const href = trimesterPdfs[select.value] || "#";
    link.href = href;
    link.download = href.split("/").pop() || "horaire.pdf";
    link.classList.toggle("disabled", href === "#");
  };
  select.addEventListener("change", apply);
  apply();
}

/* ——— Utils ——— */
const pad2 = (n) => String(n).padStart(2, "0");

/* ——— Boot ——— */
document.addEventListener("DOMContentLoaded", () => {
  // initToolbar();
  render();
});
