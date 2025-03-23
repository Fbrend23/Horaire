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
