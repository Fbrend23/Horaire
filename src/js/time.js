let simulatedNow = null;

export function getNow() {
  return simulatedNow || new Date();
}

export function setSimulatedTime(date) {
  simulatedNow = date;
}

export function resetTime() {
  simulatedNow = null;
}


export function updateClocks() {
  const now = new Date();

  // Utilisation de Intl.DateTimeFormat avec l'option timeZone pour chaque ville
  const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };

  const timeNewYork = new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'America/New_York' }).format(now);
  const timeLausanne = new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'Europe/Zurich' }).format(now);
  const timeTokyo = new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'Asia/Tokyo' }).format(now);

  document.getElementById('time-newyork').textContent = timeNewYork;
  document.getElementById('time-lausanne').textContent = timeLausanne;
  document.getElementById('time-tokyo').textContent = timeTokyo;
}

