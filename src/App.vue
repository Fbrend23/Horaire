<script setup>
import { RouterView } from 'vue-router'
import { useGameStore } from './stores/gameStore'
import { useSettingsStore } from './stores/settingsStore'
import { useWeather } from './logic/weatherService'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const gameStore = useGameStore()
const settingsStore = useSettingsStore()
const { weatherState, isNight, weatherIntensity, windSpeed } = useWeather()

gameStore.initGame()

// --- Alive Logic: Weather & 3D Tilt ---
const canvasRef = ref(null)
let animationId = null
let particles = []

// Cloud System
const clouds = ref([])

function generateClouds() {
    clouds.value = []
    const count = 5 + Math.floor(Math.random() * 4) // 5 to 8 clouds
    for (let i = 0; i < count; i++) {
        // Randomize size class or style
        const baseSize = 10 + Math.random() * 20 // 10vh to 30vh
        // Randomize speed
        const duration = 40 + Math.random() * 60 // 40s to 100s
        // Randomize delay (negative to stagger start positions essentially)
        const delay = -Math.random() * 100
        // Randomize vertical top position
        const top = Math.random() * 70 // 0% to 70% top

        clouds.value.push({
            id: i,
            style: {
                height: `${baseSize}vh`,
                top: `${top}%`,
                left: `-${baseSize + 10}vh`, // Start just offscreen left based on size
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`
            }
        })
    }
}

// Particle System
class Particle {
    constructor(w, h, type) {
        this.reset(w, h, type)
    }

    reset(w, h, type) {
        this.x = Math.random() * w
        this.y = Math.random() * h
        this.type = type

        if (type === 'rain') {
            const intensity = weatherIntensity.value || 0.5
            const wind = windSpeed.value || 0

            // Wind tilt proportional to wind speed (-20km/h = -2vx etc)
            // Base wind slightly negative (left)
            this.vx = -(1 + wind / 10) + Math.random() * -1

            // Speed based on intensity (heavy rain falls faster)
            this.vy = (8 + intensity * 10) + Math.random() * 6

            // Length based on speed/intensity
            this.length = (15 + intensity * 20) + Math.random() * 15

            this.opacity = (0.2 + intensity * 0.4) + Math.random() * 0.2
        } else if (type === 'snow') {
            this.vx = 0
            this.vy = 1 + Math.random() * 2
            this.size = 2 + Math.random() * 2
        } else { // fireflies / dust
            this.vx = (Math.random() - 0.5) * 0.5
            this.vy = (Math.random() - 0.5) * 0.5
            this.size = 1 + Math.random() * 2
            this.alpha = Math.random()
            this.fadeSpd = 0.01 + Math.random() * 0.02
        }
    }

    update(w, h) {
        if (this.type === 'rain') {
            this.x += this.vx
            this.y += this.vy
            if (this.y > h) {
                this.y = -20
                this.x = Math.random() * w // Reset random x
            }
            if (this.x < 0) this.x = w // Wrap around
        } else if (this.type === 'snow') {
            this.y += this.vy
            this.x += Math.sin(this.y * 0.01) * 0.5
            if (this.y > h) this.y = -5
        } else {
            this.x += this.vx
            this.y += this.vy
            this.alpha += this.fadeSpd
            if (this.alpha > 1 || this.alpha < 0) this.fadeSpd *= -1
            if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset(w, h, this.type)
        }
    }

    draw(ctx) {
        if (this.type === 'rain') {
            // Draw slanted rain
            ctx.lineCap = 'round'
            ctx.strokeStyle = `rgba(174, 194, 224, ${this.opacity})` // Softer blue
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.x + this.vx, this.y + this.length)
            ctx.stroke()
        } else if (this.type === 'snow') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.fill()
        } else {
            ctx.fillStyle = `rgba(251, 146, 60, ${this.alpha * 0.5})` // Orange tint
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.fill()
        }
    }
}

function initParticles() {
    if (!canvasRef.value) return
    const w = window.innerWidth
    const h = window.innerHeight
    canvasRef.value.width = w
    canvasRef.value.height = h

    particles = []

    // 1. Weather Particles (Rain / Snow)
    if (settingsStore.weatherEnabled) {
        const type = weatherState.value === 'rain' ? 'rain' :
            weatherState.value === 'snow' ? 'snow' : null

        if (type) {
            let count = 50
            if (type === 'rain') {
                const intensity = weatherIntensity.value || 0.5
                count = 100 + Math.floor(intensity * 400)
            } else if (type === 'snow') {
                count = 50
            }

            for (let i = 0; i < count; i++) {
                particles.push(new Particle(w, h, type))
            }
        }
    }

    // 2. Ambient Effects (Dust / Fireflies)
    if (settingsStore.effectsEnabled) {
        // Only if not raining/snowing heavily, or just separate layer?
        // Let's add them regardless for now to show "life", or maybe only if NOT weather?
        // Usually dust is visible when clear.
        if (weatherState.value !== 'rain' && weatherState.value !== 'snow') {
            const count = 30
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(w, h, 'dust'))
            }
        }
    }

    // Cloud management: Only regenerate if we are cloudy/enabled AND clouds are missing
    // or if we need to clear them.
    if (weatherState.value === 'cloudy' && settingsStore.weatherEnabled) {
        if (clouds.value.length === 0) {
            generateClouds()
        }
    } else {
        // Clear clouds if not cloudy or disabled
        if (clouds.value.length > 0) {
            clouds.value = []
        }
    }
}

// Centralized control for the animation system
function updateWeatherSystem() {
    // 1. Update particle data based on current settings and weather
    initParticles()

    // 2. Decide if we need the loop running
    const shouldRun = settingsStore.weatherEnabled || settingsStore.effectsEnabled

    if (shouldRun) {
        if (!animationId) {
            animate()
        }
    } else {
        if (animationId) {
            cancelAnimationFrame(animationId)
            animationId = null
        }
        // Force clear
        const ctx = canvasRef.value?.getContext('2d')
        if (ctx && canvasRef.value) ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    }
}

function animate() {
    if (!canvasRef.value) return

    // Safety check: if disabled, stop (though updateWeatherSystem should handle this)
    if (!settingsStore.weatherEnabled && !settingsStore.effectsEnabled) {
        cancelAnimationFrame(animationId)
        animationId = null
        return
    }

    const ctx = canvasRef.value.getContext('2d')
    const w = canvasRef.value.width
    const h = canvasRef.value.height

    ctx.clearRect(0, 0, w, h)

    particles.forEach(p => {
        p.update(w, h)
        p.draw(ctx)
    })

    animationId = requestAnimationFrame(animate)
}

// Watchers
watch(
    [() => settingsStore.weatherEnabled, () => settingsStore.effectsEnabled],
    updateWeatherSystem
)

// If weather changes (e.g. clear -> rain), just update particles. 
// The loop (if running) will pick them up immediately.
watch([weatherState, weatherIntensity], () => {
    initParticles()
})

onMounted(() => {
    // Initial startup check
    updateWeatherSystem()
    window.addEventListener('resize', initParticles)
})

onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', initParticles)
})
</script>

<template>
    <canvas ref="canvasRef" class="fixed inset-0 pointer-events-none z-0 opacity-60"></canvas>

    <!-- Weather Visuals Layer -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <!-- Sun Rays (Clear) - Linked to weatherEnabled -->
        <!-- Using key to force re-render if needed, though v-if should suffice -->
        <div v-if="weatherState === 'clear' && !isNight && settingsStore.weatherEnabled"
            class="absolute inset-0 overflow-hidden">
            <img src="@/assets/Weather/sun_rays.png" alt="Sun Rays"
                class="absolute -top-[50px] -left-[50px] w-[600px] h-[600px] max-w-none animate-sun-flash opacity-60">
        </div>

        <!-- Drifting Clouds (Cloudy) - Linked to weatherEnabled -->
        <div v-if="weatherState === 'cloudy' && settingsStore.weatherEnabled" class="absolute inset-0 opacity-30">
            <img v-for="cloud in clouds" :key="cloud.id" src="@/assets/Weather/cloud.png" alt="Cloud"
                class="absolute animate-drift" :style="cloud.style">
        </div>
    </div>

    <div class="relative z-10">
        <RouterView />
    </div>

    <a href="https://contact.brendanfleurdelys.ch/index.php?origin=beer" class="contact-btn" title="Contact"
        target="_blank">
        💬
    </a>
</template>

<style>
/* Global styles are now in src/assets/main.css */
@keyframes sun-flash {

    0%,
    100% {
        opacity: 0.3;
        transform: scale(1);
    }

    50% {
        opacity: 0.6;
        transform: scale(1.05);
    }
}

.animate-sun-flash {
    animation: sun-flash 8s ease-in-out infinite;
}

@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-slow-spin {
    animation: spin-slow 60s linear infinite;
}

@keyframes drift {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(120vw);
    }
}

.animate-drift {
    animation-name: drift;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}
</style>
