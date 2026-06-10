import confetti from 'canvas-confetti'

export function triggerConfetti() {
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
  }

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      }),
    )
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  })
  fire(0.2, {
    spread: 60,
  })
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}

export function launchFireworks() {
  var duration = 10 * 1000
  var animationEnd = Date.now() + duration
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, shapes: ['circle'] }

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min
  }

  var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    var particleCount = 50 * (timeLeft / duration)
    // since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  }, 250)
}

export function launchRocketFirework() {
  const launchX = Math.random() * 0.6 + 0.2 // Random x between 0.2 and 0.8
  const peakY = Math.random() * 0.3 + 0.15 // Random peak height between 0.15 and 0.45
  const flightDuration = 700 // milliseconds

  // 1. Rocket trail shot from the bottom (using circles for sparks)
  confetti({
    particleCount: 20,
    angle: 90 + (Math.random() * 12 - 6), // slight vertical tilt
    spread: 3,
    startVelocity: 60, // fast upward speed
    origin: { x: launchX, y: 1 },
    colors: ['#ffaa00', '#ff5500', '#ffffff'],
    gravity: 1.6,
    ticks: 40,
    scalar: 0.8,
    shapes: ['circle']
  })

  // 2. Detonation burst at the peak
  setTimeout(() => {
    // Large colorful explosion (using circles for sparks)
    confetti({
      particleCount: 60,
      angle: 90,
      spread: 360,
      startVelocity: 30,
      origin: { x: launchX, y: peakY },
      colors: ['#ff2a2a', '#2aff2a', '#2a2aff', '#ffff2a', '#ff2aff', '#2affff', '#ffaa2a'],
      gravity: 0.8,
      ticks: 90,
      scalar: 1.1,
      shapes: ['circle']
    })

    // Secondary sparkly star crackle (using circles for sparks)
    confetti({
      particleCount: 25,
      angle: 90,
      spread: 360,
      startVelocity: 15,
      origin: { x: launchX, y: peakY },
      colors: ['#ffffff', '#ffee55'],
      gravity: 0.6,
      ticks: 60,
      scalar: 0.7,
      shapes: ['circle']
    })
  }, flightDuration)
}

export function launchRisingFireworks() {
  var duration = 8 * 1000
  var animationEnd = Date.now() + duration

  // Launch a rocket immediately
  launchRocketFirework()

  // 1. Confetti streams interval (fast)
  var streamInterval = setInterval(function () {
    var timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      return clearInterval(streamInterval)
    }

    confetti({
      particleCount: 2,
      angle: 62,
      spread: 45,
      origin: { x: 0, y: 1 },
      startVelocity: 45,
      decay: 0.92,
      gravity: 0.85,
      colors: ['#fb923c', '#ec4899', '#7c3aed', '#38bdf8', '#a855f7']
    })

    confetti({
      particleCount: 2,
      angle: 118,
      spread: 45,
      origin: { x: 1, y: 1 },
      startVelocity: 45,
      decay: 0.92,
      gravity: 0.85,
      colors: ['#fb923c', '#ec4899', '#7c3aed', '#38bdf8', '#a855f7']
    })
  }, 150)

  // 2. Rocket interval (slow)
  var rocketInterval = setInterval(function () {
    var timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      return clearInterval(rocketInterval)
    }

    launchRocketFirework()
  }, 1500) // launch a rocket every 1.5 seconds
}
