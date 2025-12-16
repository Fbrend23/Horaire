<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  petType: {
    type: String,
    required: true,
    validator: (value) => ['cat', 'dog', 'bird'].includes(value)
  },
  initialPosition: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
})

// Use sprite sheet for bird, static images for others
const petImage = computed(() => {
  if (props.petType === 'bird') {
    return new URL(`../assets/Pets/sprite_sheet_bird.png`, import.meta.url).href
  }
  return new URL(`../assets/Pets/${props.petType}.png`, import.meta.url).href
})

// Pet state
const position = ref({ x: props.initialPosition.x, y: props.initialPosition.y })
const direction = ref(1) // 1 = right, -1 = left
const isWalking = ref(false)
const isFlipped = ref(false)
const currentFrame = ref(0) // Current animation frame (0-3)

// Movement parameters
const speed = ref(0.5 + Math.random() * 1) // Random speed between 0.5 and 1.5
const pauseDuration = ref(2000 + Math.random() * 3000) // Random pause 2-5 seconds

// Animation frame timing
const frameInterval = 150 // milliseconds between frames
let frameIntervalId = null

// Get header bounds (assuming header is about 80px tall)
const headerBounds = ref({ width: 0, height: 80 })

let animationFrameId = null
let pauseTimeoutId = null
let walkTimeoutId = null

function updateBounds() {
  if (typeof window !== 'undefined') {
    headerBounds.value.width = window.innerWidth
  }
}

function startWalking() {
  isWalking.value = true
  const walkDuration = 1000 + Math.random() * 2000 // Walk for 1-3 seconds

  // Start frame animation
  startFrameAnimation()

  walkTimeoutId = setTimeout(() => {
    pause()
  }, walkDuration)
}

function pause() {
  isWalking.value = false

  // Stop frame animation and reset to idle frame
  stopFrameAnimation()
  currentFrame.value = 0

  pauseTimeoutId = setTimeout(() => {
    // Randomly change direction sometimes when resuming
    if (Math.random() > 0.7) {
      direction.value *= -1
      isFlipped.value = direction.value === -1
    }
    startWalking()
  }, pauseDuration.value)
}

function startFrameAnimation() {
  frameIntervalId = setInterval(() => {
    if (isWalking.value) {
      currentFrame.value = (currentFrame.value + 1) % 4 // Cycle through 4 frames
    }
  }, frameInterval)
}

function stopFrameAnimation() {
  if (frameIntervalId) {
    clearInterval(frameIntervalId)
    frameIntervalId = null
  }
}

function animate() {
  if (isWalking.value) {
    // Move pet
    position.value.x += direction.value * speed.value

    // Check bounds and reverse if needed
    const petWidth = 64 // Display width
    if (position.value.x <= 0) {
      position.value.x = 0
      direction.value = 1
      isFlipped.value = false
    } else if (position.value.x >= headerBounds.value.width - petWidth) {
      position.value.x = headerBounds.value.width - petWidth
      direction.value = -1
      isFlipped.value = true
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  updateBounds()
  window.addEventListener('resize', updateBounds)

  // Random initial delay before starting
  setTimeout(() => {
    startWalking()
    animate()
  }, Math.random() * 2000)
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (pauseTimeoutId) clearTimeout(pauseTimeoutId)
  if (walkTimeoutId) clearTimeout(walkTimeoutId)
  stopFrameAnimation()
  window.removeEventListener('resize', updateBounds)
})
</script>

<template>
  <div class="virtual-pet" :style="{
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)'
  }">
    <div class="pet-sprite" :class="{ 'walking': isWalking }" :style="petType === 'bird' ? {
      backgroundImage: `url(${petImage})`,
      backgroundPosition: `-${currentFrame * 64}px 0px`,
      backgroundSize: '256px 64px'
    } : {
      backgroundImage: `url(${petImage})`,
      backgroundSize: '64px 64px'
    }" />
  </div>
</template>

<style scoped>
.virtual-pet {
  position: absolute;
  width: 64px;
  /* Display size (scaled down from 512px frame width) */
  height: 64px;
  pointer-events: none;
  z-index: 5;
  transition: transform 0.3s ease;
}

.pet-sprite {
  width: 64px;
  height: 64px;
  background-repeat: no-repeat;
  /* Scale sprite sheet: 4 frames × 512px = 2048px, scaled to match 64px height */
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Birds should hover a bit higher */
.virtual-pet:has(.pet-sprite) {
  animation: none;
}
</style>
