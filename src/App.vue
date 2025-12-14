<script setup>
import { RouterView } from 'vue-router'
import { useGameStore } from './stores/gameStore'
import { useSettingsStore } from './stores/settingsStore'
import { useWeather } from './logic/weatherService'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const gameStore = useGameStore()
const settingsStore = useSettingsStore()
const { weatherState, weatherIntensity, windSpeed, isNight } = useWeather()
import cloudImg from '@/assets/Weather/cloud.png'
import { getGradientForTime } from './logic/timeGradient'

gameStore.initGame()

const currentGradient = ref('')
const globalStarOpacity = ref(0)
const targetStarOpacity = ref(0)

function updateGradient() {
    const now = new Date()
    const totalMinutes = now.getHours() * 60 + now.getMinutes()

    // Wrap around 24h
    const normalized = (totalMinutes % 1440 + 1440) % 1440

    const h = Math.floor(normalized / 60)
    const m = Math.floor(normalized % 60)

    currentGradient.value = getGradientForTime(h, m)

    // Check if we need to refresh particles due to day/night change
    const hour = now.getHours()
    const visualNight = hour >= 18 || hour < 8
    const currentIsNight = isNight.value || visualNight

    // Set target opacity for stars (fade in/out)
    targetStarOpacity.value = currentIsNight ? 1 : 0
}

const canvasRef = ref(null)
let animationId = null
let particles = []

class Particle {
    constructor(w, h, type) {
        this.reset(w, h, type)
    }

    reset(w, h, type) {
        this.x = Math.random() * w
        this.y = Math.random() * h
        this.type = type
        this.alpha = Math.random()
        const intensity = weatherIntensity.value || 0.5

        if (type === 'rain') {
            this.z = Math.random()
            const speedBase = 4 + Math.random() * 3
            this.vy = (speedBase + this.z * 6) * (0.8 + intensity * 0.4)

            this.length = (15 + Math.random() * 10) * (0.5 + this.z)
            this.width = 0.5 + this.z * 1.5
        } else if (type === 'snow') {
            this.vy = (0.5 + Math.random() * 1.5) * (0.8 + intensity * 0.5)
            this.size = (3 + Math.random() * 4) * (0.5 + intensity)
            this.angle = Math.random() * Math.PI * 2
        } else if (type === 'star') {
            this.vx = 0
            this.vy = 0
            this.size = 0.5 + Math.random() * 1.5
            this.alpha = 0.2 + Math.random() * 0.8
            this.fadeSpd = (Math.random() - 0.5) * 0.02
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
            this.y += this.vy
            const wx = (windSpeed.value || 0) * 0.2
            this.x += wx
            if (this.y > h) this.y = -10
            if (this.x > w + 20) this.x = -20
            if (this.x < -20) this.x = w + 20
        } else if (this.type === 'snow') {
            this.y += this.vy
            this.x += Math.sin(this.y * 0.01) * 0.5
            if (this.y > h) this.y = -5
        } else if (this.type === 'star') {
            this.alpha += this.fadeSpd
            if (this.alpha > 1 || this.alpha < 0.2) this.fadeSpd *= -1
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
            const wx = (windSpeed.value || 0) * 0.5
            const endX = this.x + wx
            const endY = this.y + this.length

            const grad = ctx.createLinearGradient(this.x, this.y, endX, endY)
            grad.addColorStop(0, `rgba(173, 216, 230, 0)`)
            grad.addColorStop(1, `rgba(173, 216, 230, ${0.3 + this.z * 0.7})`)

            ctx.strokeStyle = grad
            ctx.lineWidth = this.width
            ctx.lineCap = 'round'

            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(endX, endY)
            ctx.stroke()
        } else if (this.type === 'snow') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.lineWidth = 1.5
            ctx.save()
            ctx.translate(this.x, this.y)
            this.angle = (this.angle || 0) + 0.01
            ctx.rotate(this.angle)

            for (let i = 0; i < 6; i++) {
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.lineTo(0, this.size)
                ctx.moveTo(0, this.size * 0.6)
                ctx.lineTo(this.size * 0.3, this.size * 0.8)
                ctx.moveTo(0, this.size * 0.6)
                ctx.lineTo(-this.size * 0.3, this.size * 0.8)
                ctx.stroke()
                ctx.rotate(Math.PI / 3)
            }
            ctx.restore()
        } else if (this.type === 'star') {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * globalStarOpacity.value})`
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.fill()
        } else {
            ctx.fillStyle = `rgba(251, 146, 60, ${this.alpha * 0.5})`
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.fill()
        }
    }
}

const isMobile = ref(false)

function checkMobile() {
    isMobile.value = window.innerWidth < 768
}

function initParticles() {
    if (!canvasRef.value) return
    const w = window.innerWidth
    const h = window.innerHeight
    canvasRef.value.width = w
    canvasRef.value.height = h

    particles = []
    const type = weatherState.value === 'rain' ? 'rain' :
        weatherState.value === 'snow' ? 'snow' : 'dust'

    const intensity = weatherIntensity.value || 0.5

    let count = 30
    // Mobile optimization: Cap max particles
    if (type === 'rain') count = isMobile.value ? 40 : (50 + intensity * 200)
    if (type === 'snow') count = isMobile.value ? 20 : (20 + intensity * 100)
    if (weatherState.value === 'fog') count = 0

    // Mobile optimization: Cap stars
    const starCount = isMobile.value ? 50 : 150
    for (let i = 0; i < starCount; i++) {
        particles.push(new Particle(w, h, 'star'))
    }

    for (let i = 0; i < count; i++) {
        particles.push(new Particle(w, h, type))
    }
}

function animate() {
    if (!canvasRef.value) return
    const ctx = canvasRef.value.getContext('2d')
    const w = canvasRef.value.width
    const h = canvasRef.value.height

    // Smoothly interpolate star opacity
    globalStarOpacity.value += (targetStarOpacity.value - globalStarOpacity.value) * 0.01

    ctx.clearRect(0, 0, w, h)

    particles.forEach(p => {
        p.update(w, h)
        // Conditional drawing: Always draw stars, but check setting for others
        if (p.type === 'star' || settingsStore.weatherEnabled) {
            p.draw(ctx)
        }
    })

    animationId = requestAnimationFrame(animate)
}

const clouds = ref([])

function generateClouds() {
    clouds.value = []

    const intensity = weatherIntensity.value || 0.5

    // Mobile optimization: Drastically reduce cloud count
    let cloudCount = Math.floor(5 + (intensity - 0.4) * 60)
    cloudCount = Math.max(3, cloudCount)

    if (isMobile.value) {
        cloudCount = Math.min(cloudCount, 5) // Hard cap for mobile cloudy
    }

    let topMax = 70
    let widthBase = 150
    let opacityBase = 0.2 + (intensity * 0.3)
    let durationBase = 120

    let isFog = false
    if (weatherState.value === 'fog') {
        isFog = true
        // Mobile optimization: Reduce fog layers
        cloudCount = isMobile.value ? 5 : 30
        topMax = 120
        widthBase = 2000
        opacityBase = 0.8
        durationBase = 10
    }

    for (let i = 0; i < cloudCount; i++) {
        let top

        if (isFog) {
            const span = 300
            const segment = span / cloudCount
            const base = -120 + (i * segment)
            top = base + (Math.random() * 20 - 10)
        } else {
            top = Math.random() * topMax
        }

        const finalWidth = isFog ? 8000 : (widthBase + Math.random() * 400)

        // Mobile optimization: Use simple blur-xl instead of blur-3xl for fog
        const fogClass = isMobile.value ? 'blur-xl animate-fog-breathe brightness-70' : 'blur-3xl animate-fog-breathe brightness-70'

        clouds.value.push({
            wrapperStyle: {
                top: `${top}%`,
                left: isFog ? `calc(50% - ${finalWidth / 2}px)` : `-40%`,
                width: `${finalWidth}px`,
                animationDuration: `${durationBase + Math.random() * (isFog ? 20 : 120)}s`,
                animationDelay: `-${Math.random() * (durationBase + 120)}s`
            },
            imgStyle: {
                opacity: opacityBase + Math.random() * 0.05
            },
            class: `absolute z-10 pointer-events-none ${isFog ? fogClass : 'animate-cloud-drift'}`
        })
    }
}

watch([weatherState, isNight, () => settingsStore.weatherEnabled], ([newWeather, , isEnabled]) => {
    initParticles() // Always update particles array (but they only draw if enabled)

    // Cloud generation logic
    if ((newWeather === 'cloudy' || newWeather === 'fog') && isEnabled) {
        const isFog = newWeather === 'fog'
        const currentCount = clouds.value.length

        const needsRegen = currentCount === 0 || (isFog && currentCount !== 20) || (!isFog && currentCount === 20)

        if (needsRegen) generateClouds()
    } else {
        if (clouds.value.length > 0) clouds.value = []
    }
})

onMounted(() => {
    checkMobile()
    initParticles()
    animate()
    window.addEventListener('resize', () => {
        checkMobile()
        initParticles()
    })

    if ((weatherState.value === 'cloudy' || weatherState.value === 'fog') && settingsStore.weatherEnabled) {
        generateClouds()
    }

    updateGradient()
    setInterval(() => updateGradient(), 10000)
})

onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', initParticles)
})
</script>

<template>
    <!-- Dynamic Background Layer (Continuous Interpolation) -->
    <div class="fixed inset-0 pointer-events-none z-[-10]" :style="{ background: currentGradient }"></div>

    <canvas ref="canvasRef" class="fixed inset-0 pointer-events-none z-0 opacity-60"></canvas>

    <div class="relative z-10">
        <!-- Clouds Layer (Wider than viewport) -->
        <div v-if="(weatherState === 'cloudy' || weatherState === 'fog') && settingsStore.weatherEnabled"
            class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <!-- Cloud Asset -->
            <div v-for="(cloud, index) in clouds" :key="index" :class="cloud.class" :style="cloud.wrapperStyle">
                <img :src="cloudImg" class="w-full h-auto block" :style="cloud.imgStyle" />
            </div>
        </div>
        <RouterView />
    </div>

    <a href="https://github.com/Fbrend23/Horaire" class="github-btn" title="GitHub Repository" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    </a>

    <a href="https://contact.brendanfleurdelys.ch/index.php?origin=beer" class="contact-btn" title="Contact"
        target="_blank">
        💬
    </a>
</template>

<style>
/* Global styles are now in src/assets/main.css */


@keyframes cloud-drift {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(200vw);
    }
}

.animate-cloud-drift {
    animation-name: cloud-drift;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}

@keyframes fog-breathe {

    0%,
    100% {
        transform: scale(1.5);
        opacity: 0.06;
    }

    50% {
        transform: scale(1.6);
        opacity: 0.08;
    }
}

.animate-fog-breathe {
    animation: fog-breathe 15s ease-in-out infinite;
}
</style>
