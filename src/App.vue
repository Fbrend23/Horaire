<script setup>
import { RouterView } from 'vue-router'
import { useGameStore } from './stores/gameStore'
import { useSettingsStore } from './stores/settingsStore'
import { useWeather } from './logic/weatherService'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const gameStore = useGameStore()
const settingsStore = useSettingsStore()
const { weatherState } = useWeather()

gameStore.initGame()

// --- Alive Logic: Weather & 3D Tilt ---
const canvasRef = ref(null)
let animationId = null
let particles = []

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
            this.vy = 4 + Math.random() * 4
            this.length = 10 + Math.random() * 10
        } else if (type === 'snow') {
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
            this.y += this.vy
            if (this.y > h) this.y = -10
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
            ctx.strokeStyle = 'rgba(173, 216, 230, 0.4)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.x, this.y + this.length)
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
    const type = weatherState.value === 'rain' ? 'rain' :
        weatherState.value === 'snow' ? 'snow' : 'dust'

    const count = type === 'rain' ? 100 : type === 'snow' ? 50 : 30

    for (let i = 0; i < count; i++) {
        particles.push(new Particle(w, h, type))
    }
}

function animate() {
    if (!canvasRef.value || !settingsStore.weatherEnabled) return
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

// 3D Tilt Logic
function handleMouseMove(e) {
    if (settingsStore.currentTheme !== 'sunset') return

    const x = e.clientX / window.innerWidth
    const y = e.clientY / window.innerHeight

    const root = document.documentElement
    // Calculate tilt angles (-10 to 10 deg)
    const tiltX = (y - 0.5) * 10
    const tiltY = (x - 0.5) * -10

    root.style.setProperty('--tilt-x', `${tiltX}deg`)
    root.style.setProperty('--tilt-y', `${tiltY}deg`)
}

watch(weatherState, () => {
    initParticles()
})

onMounted(() => {
    initParticles()
    animate()
    window.addEventListener('resize', initParticles)
    // window.addEventListener('mousemove', handleMouseMove) // Disabled per user request
})

onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', initParticles)
    // window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
    <canvas ref="canvasRef" class="fixed inset-0 pointer-events-none z-0 opacity-60"></canvas>

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
</style>
