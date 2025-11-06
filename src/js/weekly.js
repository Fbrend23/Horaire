/* weekly.js – Affichage de l’horaire hebdomadaire + bulle “maintenant” */
import { weeklySchedule } from "./agenda.js";
import { getNow } from "./time.js";

// Échelle: 30 min = 40px -> 80px/heure
const PX_PER_HALF_HOUR = 40;
const PX_PER_HOUR = PX_PER_HALF_HOUR * 2;

function computeBounds() {
  if (!weeklySchedule?.length) return { startHour: 8, endHour: 17 };
  let min = 24,
    max = 0;
  for (const m of weeklySchedule) {
    min = Math.min(min, m.startHour ?? new Date(m.startDate).getHours());
    max = Math.max(max, m.endHour ?? new Date(m.endDate).getHours());
  }
  min = Math.max(6, Math.floor(min));
  max = Math.min(21, Math.ceil(max + 0.5));
  return { startHour: min, endHour: max };
}
function minutesSince(h, m = 0) {
  return h * 60 + m;
}
function yFromTime(h, m, startHour) {
  const minutes = minutesSince(h, m) - minutesSince(startHour, 0);
  return (minutes / 60) * PX_PER_HOUR;
}

const DAYS = [
  { label: "Lun", value: 1 },
  { label: "Mar", value: 2 },
  { label: "Mer", value: 3 },
  { label: "Jeu", value: 4 },
  { label: "Ven", value: 5 },
];

function formatTime(h, m) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function render() {
  const timetable = document.getElementById("timetable");
  timetable.innerHTML = "";

  const { startHour, endHour } = computeBounds();
  const totalHours = endHour - startHour;

  // Colonne des heures (ticks toutes les 30min)
  const timeCol = document.createElement("div");
  timeCol.className = "time-col";
  for (let h = startHour; h <= endHour; h++) {
    const t0 = document.createElement("div");
    t0.className = "tick";
    t0.textContent = `${String(h).padStart(2, "0")}:00`;
    timeCol.appendChild(t0);
    if (h !== endHour) {
      const t1 = document.createElement("div");
      t1.className = "tick";
      t1.textContent = `:30`;
      timeCol.appendChild(t1);
    }
  }
  timetable.appendChild(timeCol);

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
    slots.style.height = `${totalHours * PX_PER_HOUR}px`;
    col.appendChild(slots);

    const indicator = document.createElement("div");
    indicator.className = "now-indicator";
    slots.appendChild(indicator);

    const bubble = document.createElement("div");
    bubble.className = "now-bubble";
    bubble.textContent = "maintenant";
    indicator.appendChild(bubble);

    // Événements du jour
    const events = weeklySchedule.filter((m) => m.dayOfWeek === day.value);
    for (const ev of events) {
      const el = document.createElement("div");
      el.className = "event";
      const startY = yFromTime(ev.startHour, ev.startMinute, startHour);
      const endY = yFromTime(ev.endHour, ev.endMinute, startHour);
      el.style.top = `${startY}px`;
      el.style.height = `${Math.max(24, endY - startY)}px`;
      el.innerHTML = `<strong>${ev.moduleName}</strong><small>${
        ev.room
      } • ${formatTime(ev.startHour, ev.startMinute)} – ${formatTime(
        ev.endHour,
        ev.endMinute
      )}</small>`;
      slots.appendChild(el);
    }

    timetable.appendChild(col);
  }

  updateNowIndicator();
  setInterval(updateNowIndicator, 1000);

  function updateNowIndicator() {
    const now = getNow();
    const weekday = now.getDay(); // 1=Mon ... 5=Fri
    const hour = now.getHours();
    const minute = now.getMinutes();

    const dayIdx = DAYS.findIndex((d) => d.value === weekday);
    document
      .querySelectorAll(".now-indicator")
      .forEach((ind) => (ind.style.display = "none"));

    if (dayIdx === -1) return; // weekend

    const col = document.querySelectorAll(".day-col")[dayIdx];
    if (!col) return;
    const slots = col.querySelector(".slot-grid");
    const indicator = slots.querySelector(".now-indicator");

    indicator.style.display = "block";
    const y = yFromTime(hour, minute, startHour);
    const maxY = (endHour - startHour) * PX_PER_HOUR;
    const clampedY = Math.max(0, Math.min(maxY, y));
    indicator.style.top = `${clampedY}px`;
    indicator.querySelector(".now-bubble").style.top = `0`;
  }
}

// Lien PDF par trimestre
const trimesterPdfs = {
  T1: "docs/horaire_T1.pdf",
  T2: "docs/horaire_T2.pdf",
  T3: "docs/horaire_T3.pdf",
};

function initToolbar() {
  const select = document.getElementById("trimesterSelect");
  const link = document.getElementById("pdfLink");
  function apply() {
    const val = select.value;
    const href = trimesterPdfs[val] || "#";
    link.href = href;
    link.download = href.split("/").pop() || "horaire.pdf";
    link.classList.toggle("disabled", href === "#");
  }
  select.addEventListener("change", apply);
  apply();
}

document.addEventListener("DOMContentLoaded", () => {
  initToolbar();
  render();
});
