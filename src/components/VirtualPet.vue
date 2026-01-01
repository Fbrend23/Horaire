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
  },
  size: {
    type: Number,
    default: 48
  }
})

// Use sprite sheet for bird and dog, static images for others
const petImage = computed(() => {
  if (props.petType === 'bird') {
    return new URL(`../assets/Pets/sprite_sheet_bird.png`, import.meta.url).href
  }
  if (props.petType === 'dog') {
    // Determine Sprite Sheet based on complex state
    if (isRunning.value) {
      return new URL(`../assets/Pets/sprite_sheet_dog_run.png`, import.meta.url).href
    } else if (isWalking.value) {
      return new URL(`../assets/Pets/sprite_sheet_dog.png`, import.meta.url).href
    } else if (isSleeping.value) {
      return new URL(`../assets/Pets/sprite_sheet_dog_sleep.png`, import.meta.url).href
    } else if (isLying.value) {
      return new URL(`../assets/Pets/sprite_sheet_dog_lie.png`, import.meta.url).href
    } else if (isSitting.value) {
      return new URL(`../assets/Pets/sprite_sheet_dog_sit.png`, import.meta.url).href
    } else {
      return new URL(`../assets/Pets/sprite_sheet_dog_idle.png`, import.meta.url).href
    }
  }
  return new URL(`../assets/Pets/${props.petType}.png`, import.meta.url).href
})

// Pet state
const position = ref({ x: props.initialPosition.x, y: props.initialPosition.y })
const direction = ref(1) // 1 = right, -1 = left
const isWalking = ref(false)
const isRunning = ref(false)
const isSitting = ref(false)
const isLying = ref(false)
const isSleeping = ref(false)
const isFlipped = ref(false)
const currentFrame = ref(0) // Current animation frame (0-3)

// Interaction state
const isHappy = ref(false)
const hearts = ref([])
let heartIdCounter = 0

// Movement parameters
const speed = ref(0.5 + Math.random() * 1) // Random speed between 0.5 and 1.5

// Animation frame timing

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
  // Clear all idle states
  isSitting.value = false
  isLying.value = false
  isSleeping.value = false

  let moveDuration = 0

  // Decide if walking or running (Dog only)
  if (props.petType === 'dog' && Math.random() > 0.7) {
    isRunning.value = true
    isWalking.value = false // Mutually exclusive for logic simplicity in loop
    // Speed up for running
    speed.value = 2 + Math.random() * 1.5
    // Running lasts shorter
    moveDuration = 1000 + Math.random() * 2000
  } else {
    isRunning.value = false
    isWalking.value = true
    // Normal speed
    speed.value = 0.5 + Math.random() * 1
    moveDuration = 2000 + Math.random() * 4000
  }

  // Start frame animation
  startFrameAnimation()

  walkTimeoutId = setTimeout(() => {
    pause()
  }, moveDuration)
}

function startSleepSequence() {
  // Phase 1: Sit first
  isSitting.value = true
  startFrameAnimation()

  // Wait 2s before Lying down
  pauseTimeoutId = setTimeout(() => {
    isSitting.value = false
    isLying.value = true
    startFrameAnimation()

    // Wait 2s before Sleeping (Curling up)
    pauseTimeoutId = setTimeout(() => {
      isLying.value = false
      isSleeping.value = true
      startFrameAnimation()

      // Phase 3: Sleep for a while
      const sleepDuration = 5000 + Math.random() * 5000
      pauseTimeoutId = setTimeout(() => {
        // Wake up path: Sleep -> Lie -> Sit
        isSleeping.value = false
        isLying.value = true
        startFrameAnimation()

        // Wait 2s then Sit
        pauseTimeoutId = setTimeout(() => {
          isLying.value = false
          isSitting.value = true
          startFrameAnimation()

          // Wait 2s then walk
          pauseTimeoutId = setTimeout(() => {
            if (Math.random() > 0.5) {
              direction.value *= -1
              isFlipped.value = direction.value === -1
            }
            startWalking()
          }, 2000)

        }, 2000)

      }, sleepDuration)
    }, 2000)

  }, 2000)
}

function pause() {
  isWalking.value = false
  isRunning.value = false // Stop running

  let currentPauseDuration = 2000 + Math.random() * 3000

  // Decision Logic for Idle State (Dog only)
  if (props.petType === 'dog') {
    const rand = Math.random()
    if (rand > 0.8) { // 20% chance to sleep (sequence)
      startSleepSequence()
      return // Exit early, sequence handles timers
    } else if (rand > 0.4) {
      isSitting.value = true // Just sit
    }
    // Else stand idle
    startFrameAnimation() // Update speed for Sit/Idle
  }

  // Stop frame animation for non-dogs (dogs animate in all states)
  if (props.petType !== 'dog') {
    stopFrameAnimation()
    currentFrame.value = 0
  }

  pauseTimeoutId = setTimeout(() => {
    // Randomly change direction sometimes when resuming
    if (Math.random() > 0.5) {
      direction.value *= -1
      isFlipped.value = direction.value === -1
    }
    startWalking()
  }, currentPauseDuration)
}

function startFrameAnimation() {
  if (frameIntervalId) clearInterval(frameIntervalId) // Clear existing to allow speed change

  // Determine speed based on state
  let speed = 150 // Default for walking/running
  if (isSleeping.value) speed = 400 // Very slow breathing
  else if (isLying.value) speed = 300 // Slow breathing
  else if (isSitting.value) speed = 300 // Slow breathing
  else if (!isWalking.value && props.petType === 'dog') speed = 300 // Idle standing

  if (isRunning.value) speed = 100 // Fast running

  frameIntervalId = setInterval(() => {
    // Dog animates even when idle (different sprite sheet)
    if (isWalking.value || isRunning.value || props.petType === 'dog') {
      currentFrame.value = (currentFrame.value + 1) % 4 // Cycle through 4 frames
    } else {
      currentFrame.value = 0 // Reset to idle frame for others
    }
  }, speed)
}

function stopFrameAnimation() {
  if (frameIntervalId) {
    clearInterval(frameIntervalId)
    frameIntervalId = null
  }
}

function animate() {
  if (isWalking.value || isRunning.value) {
    // Move pet
    position.value.x += direction.value * speed.value

    // Check bounds and reverse if needed
    if (position.value.x <= 0) {
      position.value.x = 0
      direction.value = 1
      isFlipped.value = false
    } else if (position.value.x >= headerBounds.value.width - props.size) {
      position.value.x = headerBounds.value.width - props.size
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

function getSpriteStyle() {
  // Dog: 2x2 Grid (1024x1024 source, 512x512 frames)
  if (props.petType === 'dog') {
    const col = currentFrame.value % 2
    const row = Math.floor(currentFrame.value / 2)

    // Vertical offsets to ground the dog (push sprite down)
    let yOffset = 0

    return {
      backgroundImage: `url(${petImage.value})`,
      backgroundPosition: `-${col * props.size}px calc(-${row * props.size}px + ${yOffset}px)`,
      backgroundSize: `${props.size * 2}px ${props.size * 2}px`
    }
  }

  // Bird: 4x1 Strip (2048x512 source, 512x512 frames)
  if (props.petType === 'bird') {
    return {
      backgroundImage: `url(${petImage.value})`,
      backgroundPosition: `-${currentFrame.value * props.size}px 0px`,
      backgroundSize: `${props.size * 4}px ${props.size}px`
    }
  }

  // Static image fallback
  return {
    backgroundImage: `url(${petImage.value})`,
    backgroundSize: `${props.size}px ${props.size}px`
  }
}

function petAnimal() {
  // Prevent click propagation if needed, though this is absolute positioned

  // 1. Visual Reaction: Spawn Heart
  spawnHeart()

  // 2. Physical Reaction: Jump/Bounce
  if (!isHappy.value) {
    isHappy.value = true

    // Resume "normal" state after jump animation (e.g. 500ms)
    setTimeout(() => {
      isHappy.value = false
    }, 500)
  }

  // 3. Logic Reaction: Pause if walking to acknowledge user
  if (isWalking.value) {
    isWalking.value = false
    // Resume walking after a short happy moment
    if (walkTimeoutId) clearTimeout(walkTimeoutId)
    setTimeout(() => {
      startWalking()
    }, 1000)
  }
}

function spawnHeart() {
  const id = heartIdCounter++
  // Random slight offset for natural feel
  const offset = (Math.random() - 0.5) * 20

  hearts.value.push({
    id,
    x: offset,
    y: -10
  })

  // Remove heart after animation finishes (1s)
  setTimeout(() => {
    hearts.value = hearts.value.filter(h => h.id !== id)
  }, 1000)
}
</script>

<template>
  <div class="virtual-pet" :style="{
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size}px`,
    height: `${size}px`,
    transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)'
  }" @click="petAnimal" @mouseenter="isWalking = false" @mouseleave="startWalking">
    <div class="pet-sprite" :class="{ 'walking': isWalking, 'happy': isHappy }" :style="{
      width: `${size}px`,
      height: `${size}px`,
      ...getSpriteStyle()
    }" />

    <!-- Heart Particles -->
    <div v-for="heart in hearts" :key="heart.id" class="heart-particle" :style="{
      left: `calc(50% + ${heart.x}px)`,
      top: `${heart.y}px`
    }">
      ❤️
    </div>
  </div>
</template>

<style scoped>
.virtual-pet {
  position: absolute;
  pointer-events: auto;
  /* Enable clicks */
  cursor: pointer;
  z-index: 5;
  transition: transform 0.3s ease;
}

.pet-sprite {
  background-repeat: no-repeat;
  /* Scale sprite sheet logic handled inline now */
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Birds should hover a bit higher */
.virtual-pet:has(.pet-sprite) {
  animation: none;
}



/* Animations */
.happy {
  animation: jump 0.5s ease-out;
}

@keyframes jump {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px) scale(1.1);
  }

  100% {
    transform: translateY(0);
  }
}

.heart-particle {
  position: absolute;
  font-size: 12px;
  pointer-events: none;
  animation: float-up 1s ease-out forwards;
  /* Ensure hearts aren't flipped even if pet is */
  transform: scaleX(1) !important;
}

/* Cancel parent flip for hearts if needed, 
   but since heart is direct child of flipped parent, 
   we might need logic or wrap hearts outside flipped div.
   Actually easier: applying flip to sprite ONLY, not container.
   But current logic applies flip to container.
   Fix: Apply flip to pet-sprite only, OR counter-flip hearts.
*/

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateY(0) scale(0.5);
  }

  50% {
    opacity: 1;
    transform: translateY(-30px) scale(1.2);
  }

  100% {
    opacity: 0;
    transform: translateY(-60px) scale(1);
  }
}
</style>
