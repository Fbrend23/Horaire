// Utility to parsing Hex to RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}

// Utility to interp two numbers
function lerp(start, end, t) {
  return start * (1 - t) + end * t
}

// Interp two RGB arrays -> Hex String
function lerpColor(c1, c2, t) {
  const r = Math.round(lerp(c1[0], c2[0], t))
  const g = Math.round(lerp(c1[1], c2[1], t))
  const b = Math.round(lerp(c1[2], c2[2], t))
  return `rgb(${r}, ${g}, ${b})`
}

// Keyframe Definitions (Winter Schedule)
// Keyframe Definitions (Winter Schedule)
const keyframes = [
  // NIGHT (Stable: 00:00 - 06:00)
  { time: 0, colors: ['#020617', '#0f172a'] }, // Deep Night
  { time: 360, colors: ['#020617', '#1e293b'] }, // Night End

  // DAWN (Transition: 06:00 - 09:00)
  { time: 420, colors: ['#1e1b4b', '#4c1d95'] }, // 07:00 Twilight (Dark Blue -> Purple)
  { time: 480, colors: ['#4c1d95', '#fb923c'] }, // 08:00 Sunrise (Purple -> Soft Orange)
  { time: 540, colors: ['#0ea5e9', '#7dd3fc'] }, // 09:00 Morning (Sky Blue -> Light Blue)

  // DAY (Stable: 09:00 - 16:00)
  { time: 960, colors: ['#0ea5e9', '#7dd3fc'] }, // 16:00 Afternoon

  // DUSK (Transition: 16:00 - 19:00)
  { time: 1020, colors: ['#1e3a8a', '#fdba74'] }, // 17:00 Sunset (Deep Blue -> Peach/Orange)
  { time: 1080, colors: ['#1e1b4b', '#be185d'] }, // 18:00 Twilight (Dark Blue -> Pink/Red)
  { time: 1140, colors: ['#020617', '#0f172a'] }, // 19:00 Night Start (Dark)

  // NIGHT (Stable: 19:00 - 24:00)
  { time: 1440, colors: ['#020617', '#0f172a'] }, // 24:00 Night
]

export function getGradientForTime(hours, minutes) {
  const totalMinutes = hours * 60 + minutes

  // Find the active segment
  let startFrame = keyframes[0]
  let endFrame = keyframes[keyframes.length - 1]

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (totalMinutes >= keyframes[i].time && totalMinutes < keyframes[i + 1].time) {
      startFrame = keyframes[i]
      endFrame = keyframes[i + 1]
      break
    }
  }

  // Calculate progress t (0 to 1)
  const duration = endFrame.time - startFrame.time
  const elapsed = totalMinutes - startFrame.time
  const t = duration === 0 ? 0 : elapsed / duration

  // Interpolate the 2 color stops (Zenith & Horizon)
  const startColors = startFrame.colors.map(hexToRgb)
  const endColors = endFrame.colors.map(hexToRgb)

  // Interpolate
  const cTop = lerpColor(startColors[0], endColors[0], t)
  const cBot = lerpColor(startColors[1], endColors[1], t)

  return `linear-gradient(to bottom, ${cTop}, ${cBot})`
}
