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
    if (type === 'rain') count = 50 + intensity * 200
    if (type === 'snow') count = 20 + intensity * 100
    if (weatherState.value === 'fog') count = 0

    // Always add stars, visibility controlled by opacity
    const starCount = 150
    for (let i = 0; i < starCount; i++) {
        particles.push(new Particle(w, h, 'star'))
    }

    for (let i = 0; i < count; i++) {
        particles.push(new Particle(w, h, type))
    }
}

function animate() {
    if (!canvasRef.value || !settingsStore.weatherEnabled) return
    const ctx = canvasRef.value.getContext('2d')
    const w = canvasRef.value.width
    const h = canvasRef.value.height

    // Smoothly interpolate star opacity
    globalStarOpacity.value += (targetStarOpacity.value - globalStarOpacity.value) * 0.01

    ctx.clearRect(0, 0, w, h)

    particles.forEach(p => {
        p.update(w, h)
        p.draw(ctx)
    })

    animationId = requestAnimationFrame(animate)
}

const clouds = ref([])

function generateClouds() {
    clouds.value = []

    const intensity = weatherIntensity.value || 0.5

    let cloudCount = Math.floor(5 + (intensity - 0.4) * 60)
    cloudCount = Math.max(3, cloudCount)

    let topMax = 70
    let widthBase = 150
    let opacityBase = 0.2 + (intensity * 0.3)
    let durationBase = 120

    let isFog = false
    if (weatherState.value === 'fog') {
        isFog = true
        cloudCount = 30
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
            class: `absolute z-10 pointer-events-none ${isFog ? 'blur-3xl animate-fog-breathe brightness-70' : 'animate-cloud-drift'}`
        })
    }
}

watch([weatherState, isNight], ([newWeather]) => {
    initParticles()
    if ((newWeather === 'cloudy' || newWeather === 'fog') && settingsStore.weatherEnabled) {
        const isFog = newWeather === 'fog'
        const currentCount = clouds.value.length

        const needsRegen = currentCount === 0 || (isFog && currentCount !== 20) || (!isFog && currentCount === 20)

        if (needsRegen) generateClouds()
    } else {
        if (clouds.value.length > 0) clouds.value = []
    }
})

onMounted(() => {
    initParticles()
    animate()
    window.addEventListener('resize', initParticles)
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

    <a href="https://contact.brendanfleurdelys.ch/index.php?origin=beer" class="contact-btn" title="Contact"
        target="_blank">
        💬
    </a>
</template>

<style>
/* Global styles are now in src/assets/main.css */

/* RESTORED LOCAL STYLES (Renamed to avoid conflict) */
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
