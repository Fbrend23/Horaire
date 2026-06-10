<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import confetti from 'canvas-confetti'
import TheHeader from '../components/TheHeader.vue'
import SettingsModal from '../components/modals/SettingsModal.vue'
import LoginModal from '../components/modals/LoginModal.vue'

const showSettings = ref(false)
const showLogin = ref(false)

// Canvas state
const canvasRef = ref(null)
let ctx = null
let animationFrameId = null
let rockets = []
let particles = []
let bannerPlane = null
let rocketTimer = null
let streamTimer = null
let planeTimer = null

// Text particle scanner helper
function getWordPoints(word, fontSize = 28) {
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    
    tempCanvas.width = 400
    tempCanvas.height = 100
    
    tempCtx.fillStyle = '#ffffff'
    tempCtx.font = `bold ${fontSize}px sans-serif`
    tempCtx.textBaseline = 'middle'
    tempCtx.textAlign = 'center'
    tempCtx.fillText(word, 200, 50)
    
    const imgData = tempCtx.getImageData(0, 0, 400, 100).data
    const points = []
    
    const step = 3 // high-resolution scan
    for (let y = 0; y < 100; y += step) {
        for (let x = 0; x < 400; x += step) {
            const index = (y * 400 + x) * 4
            const alpha = imgData[index + 3]
            if (alpha > 128) {
                points.push({
                    dx: x - 200,
                    dy: y - 50
                })
            }
        }
    }
    return points
}

class Rocket {
    constructor(w, h) {
        this.x = Math.random() * (w * 0.6) + w * 0.2
        this.y = h
        this.targetY = Math.random() * (h * 0.4) + h * 0.15
        this.speed = Math.random() * 4 + 8
        this.angle = Math.random() * 0.2 - 0.1 + Math.PI * 1.5 // pointing almost straight up
        this.vx = Math.cos(this.angle) * this.speed
        this.vy = Math.sin(this.angle) * this.speed
        
        // Choose a brilliant HSL color
        const hues = [0, 30, 60, 120, 180, 200, 260, 300, 330] // red, orange, yellow, green, cyan, blue, purple, pink
        const randomHue = hues[Math.floor(Math.random() * hues.length)]
        this.color = `hsl(${randomHue}, 100%, 60%)`
        this.exploded = false
        this.message = null
    }

    update() {
        this.x += this.vx
        this.y += this.vy
        this.vy += 0.04 // gravity slowing it down
        
        // Spawn trail particle (smoke / sparks)
        if (Math.random() < 0.5) {
            particles.push(new Particle(this.x, this.y, this.color, true))
        }

        if (this.vy >= 0 || this.y <= this.targetY) {
            this.exploded = true
            this.explode()
        }
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
    }

    explode() {
        if (this.message) {
            // Explode forming the word symmetrically
            const points = getWordPoints(this.message, 36)
            
            // Limit points to ensure high performance
            const maxPoints = 160
            const stepMultiplier = Math.max(1, Math.floor(points.length / maxPoints))
            
            for (let i = 0; i < points.length; i += stepMultiplier) {
                const pt = points[i]
                
                const p = new Particle(this.x, this.y, this.color, false)
                // Set symmetrical velocity offsets so it expands perfectly
                p.vx = pt.dx * 0.05
                p.vy = pt.dy * 0.05
                p.decay = 0.009 // decays slowly so text remains readable
                p.gravity = 0.004 // falls very slowly
                p.size = 2.5 // slightly thicker lines
                particles.push(p)
            }
        } else {
            // Standard circular explosion
            const sparkCount = Math.floor(Math.random() * 40) + 60
            for (let i = 0; i < sparkCount; i++) {
                particles.push(new Particle(this.x, this.y, this.color, false))
            }
        }
    }
}

class Particle {
    constructor(x, y, color, isTrail) {
        this.x = x
        this.y = y
        this.prevX = x
        this.prevY = y
        this.isTrail = isTrail
        this.color = color
        this.gravity = 0.09
        
        if (isTrail) {
            this.vx = Math.random() * 0.8 - 0.4
            this.vy = Math.random() * 1
            this.alpha = 1
            this.decay = Math.random() * 0.04 + 0.03
            this.size = Math.random() * 1.5 + 0.5
        } else {
            const angle = Math.random() * Math.PI * 2
            const speed = Math.random() * 5.5 + 1.5
            this.vx = Math.cos(angle) * speed
            this.vy = Math.sin(angle) * speed
            this.alpha = 1
            this.decay = Math.random() * 0.018 + 0.008
            this.size = Math.random() * 2 + 1
        }
    }

    update() {
        this.prevX = this.x
        this.prevY = this.y
        this.x += this.vx
        this.y += this.vy
        
        if (!this.isTrail) {
            this.vy += this.gravity // gravity pull
        }
        
        this.alpha -= this.decay
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.moveTo(this.prevX, this.prevY)
        ctx.lineTo(this.x, this.y)
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.size
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.restore()
    }
}

class CursorSparkle {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.prevX = x
        this.prevY = y
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 1.5 + 0.5
        this.vx = Math.cos(angle) * speed
        this.vy = Math.sin(angle) * speed + 0.3
        this.alpha = 1
        this.decay = Math.random() * 0.04 + 0.03
        this.gravity = 0.04
        this.size = Math.random() * 1.2 + 0.6
        // Gold sparkles hues
        this.color = `hsl(${Math.random() * 12 + 38}, 100%, ${Math.random() * 20 + 60}%)`
    }

    update() {
        this.prevX = this.x
        this.prevY = this.y
        this.x += this.vx
        this.y += this.vy
        this.vy += this.gravity
        this.alpha -= this.decay
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.moveTo(this.prevX, this.prevY)
        ctx.lineTo(this.x, this.y)
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.size
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.restore()
    }
}

class BannerPlane {
    constructor(w, h) {
        this.w = w
        this.h = h
        this.x = w + 100 // Start off-screen right
        this.y = h * 0.12 + Math.random() * (h * 0.08) // Upper sky (12-20% height)
        this.vx = -1.6 // Fly left
        this.text = "Bonne chance pour le McDo"
        this.bannerWidth = 210
        this.wavingOffset = 0
        this.wavingSpeed = 0.04
        this.propellerAngle = 0
    }

    update() {
        this.x += this.vx
        this.wavingOffset += this.wavingSpeed
        this.propellerAngle += 0.3
    }

    draw() {
        ctx.save()
        
        const px = this.x
        const py = this.y

        // --- DRAW VECTOR PLANE (FLYING LEFT) ---
        // Nose is on the left (px), Tail is on the right (px + 45)
        
        // 1. Tow hook at the tail (on the right)
        ctx.beginPath()
        ctx.moveTo(px + 42, py)
        ctx.lineTo(px + 48, py)
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.8)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // 2. Fuselage (main body) - capsule shape
        ctx.fillStyle = '#fb923c' // primary orange body
        ctx.beginPath()
        ctx.ellipse(px + 22, py, 20, 8, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // 3. Cockpit glass (dome)
        ctx.fillStyle = 'rgba(147, 197, 253, 0.8)' // sky blue translucent glass
        ctx.beginPath()
        ctx.ellipse(px + 16, py - 4, 8, 5, 0, Math.PI, Math.PI * 2)
        ctx.fill()

        // 4. Tail fin (rudder)
        ctx.fillStyle = '#ea580c' // darker orange accents
        ctx.beginPath()
        ctx.moveTo(px + 36, py - 3)
        ctx.lineTo(px + 44, py - 12)
        ctx.lineTo(px + 44, py)
        ctx.closePath()
        ctx.fill()

        // 5. Wings (drawn in perspective - low wing monoplane)
        ctx.fillStyle = '#ea580c'
        // Main wing pointing down
        ctx.beginPath()
        ctx.moveTo(px + 12, py + 4)
        ctx.lineTo(px + 18, py + 16)
        ctx.lineTo(px + 24, py + 16)
        ctx.lineTo(px + 20, py + 4)
        ctx.closePath()
        ctx.fill()

        // 6. Propeller at the nose (left side) - rotating line
        ctx.save()
        ctx.translate(px + 2, py)
        ctx.rotate(this.propellerAngle)
        ctx.beginPath()
        ctx.moveTo(0, -11)
        ctx.lineTo(0, 11)
        ctx.strokeStyle = '#e2e8f0' // light gray propeller
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()

        // --- DRAW TOW ROPE & BANNER ---
        // Rope goes from tail (px + 45) to the banner
        ctx.beginPath()
        ctx.moveTo(px + 46, py)
        
        const ropeEndX = px + 75
        const ropeEndY = py + Math.sin(this.wavingOffset) * 2
        ctx.lineTo(ropeEndX, ropeEndY)
        
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.6)'
        ctx.lineWidth = 1.5
        ctx.stroke()
        
        // Draw the banner container (glassmorphic box)
        ctx.font = 'bold 11px sans-serif'
        const textWidth = ctx.measureText(this.text).width
        this.bannerWidth = Math.max(140, Math.ceil(textWidth + 24))
        const bannerWidth = this.bannerWidth
        const bannerHeight = 28
        const bannerX = ropeEndX
        const bannerY = ropeEndY - bannerHeight / 2
        
        ctx.fillStyle = 'rgba(30, 41, 59, 0.85)'
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.4)'
        ctx.lineWidth = 1.2
        
        ctx.beginPath()
        ctx.roundRect(bannerX, bannerY, bannerWidth, bannerHeight, 4)
        ctx.fill()
        ctx.stroke()
        
        // Draw the banner text
        ctx.fillStyle = '#fb923c' // primary color
        ctx.font = 'bold 11px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(this.text, bannerX + bannerWidth / 2, bannerY + bannerHeight / 2)
        
        ctx.restore()
    }
}

function spawnRocket() {
    if (canvasRef.value) {
        const w = canvasRef.value.width
        const h = canvasRef.value.height
        const rocket = new Rocket(w, h)
        
        // 30% chance to be a random text rocket
        if (Math.random() < 0.30) {
            const texts = ["FIN !", "BIERES", "LIBRE", "SUCCES", "BRAVO !", "VACANCES", "WEEK-END", "DIPLOME", "FETE !", "SURVECU"]
            rocket.message = texts[Math.floor(Math.random() * texts.length)]
            // Target center sky for text readability
            rocket.x = w / 2 + (Math.random() * 100 - 50)
            rocket.targetY = h * 0.20 + (Math.random() * 30 - 15)
        }
        
        rockets.push(rocket)
    }
}

function spawnPlane() {
    if (canvasRef.value && !bannerPlane) {
        bannerPlane = new BannerPlane(canvasRef.value.width, canvasRef.value.height)
    }
}

function resizeCanvas() {
    if (canvasRef.value) {
        canvasRef.value.width = window.innerWidth
        canvasRef.value.height = window.innerHeight
    }
}

function animate() {
    if (!canvasRef.value) return
    ctx = canvasRef.value.getContext('2d')
    const w = canvasRef.value.width
    const h = canvasRef.value.height

    ctx.clearRect(0, 0, w, h)

    // Update & Draw rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.update()
        r.draw()
        if (r.exploded) {
            rockets.splice(i, 1)
        }
    }

    // Update & Draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.update()
        p.draw()
        if (p.alpha <= 0) {
            particles.splice(i, 1)
        }
    }

    // Update & Draw banner plane
    if (bannerPlane) {
        bannerPlane.update()
        bannerPlane.draw()
        // If plane and its banner fully fly off-screen left
        if (bannerPlane.x + 45 + 30 + bannerPlane.bannerWidth < 0) {
            bannerPlane = null
        }
    }

    animationFrameId = requestAnimationFrame(animate)
}

function triggerMoreFireworks() {
    // Spawn 5 rockets in rapid succession
    spawnRocket()
    setTimeout(spawnRocket, 150)
    setTimeout(spawnRocket, 300)
    setTimeout(spawnRocket, 450)
    setTimeout(spawnRocket, 600)
}

function handleMouseMove(event) {
    // Spawn 2 sparkles under the cursor
    for (let i = 0; i < 2; i++) {
        particles.push(new CursorSparkle(event.clientX, event.clientY))
    }
}

function handleScreenClick(event) {
    // Avoid triggering when clicking buttons, links or settings menu
    if (event.target.closest('button') || event.target.closest('a') || event.target.closest('.contact-btn') || event.target.closest('.github-btn')) return
    
    const x = event.clientX / window.innerWidth
    const y = event.clientY / window.innerHeight
    
    // Trigger confetti burst at mouse click
    confetti({
        particleCount: 25,
        spread: 60,
        origin: { x, y },
        colors: ['#fb923c', '#ec4899', '#7c3aed', '#38bdf8', '#a855f7', '#ffff33']
    })
}

onMounted(() => {
    // Canvas setup
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()

    // 1. Launch firework rockets
    spawnRocket()
    rocketTimer = setInterval(spawnRocket, 1400)

    // 2. Fast corner confetti streams
    streamTimer = setInterval(() => {
        // Confetti from bottom left
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 45,
            origin: { x: 0, y: 1 },
            startVelocity: 45,
            decay: 0.92,
            gravity: 0.85,
            colors: ['#fb923c', '#ec4899', '#7c3aed', '#38bdf8', '#a855f7']
        })

        // Confetti from bottom right
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 45,
            origin: { x: 1, y: 1 },
            startVelocity: 45,
            decay: 0.92,
            gravity: 0.85,
            colors: ['#fb923c', '#ec4899', '#7c3aed', '#38bdf8', '#a855f7']
        })
    }, 150)

    // 3. Spawn plane with banner (first launch at 3s, then every 25s)
    setTimeout(spawnPlane, 3000)
    planeTimer = setInterval(spawnPlane, 25000)
})

onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas)
    cancelAnimationFrame(animationFrameId)
    clearInterval(rocketTimer)
    clearInterval(streamTimer)
    clearInterval(planeTimer)
})
</script>

<template>
    <div @click="handleScreenClick" @mousemove="handleMouseMove" class="min-h-screen text-white flex flex-col relative select-none cursor-default">
        <!-- Main Application Header -->
        <TheHeader @openSettings="showSettings = true" />

        <!-- Custom Fireworks Canvas Layer (drawn in front of the card) -->
        <canvas ref="canvasRef" class="absolute inset-0 pointer-events-none z-30"></canvas>

        <!-- Main Content Area -->
        <div class="flex-grow flex flex-col justify-center items-center p-4 md:p-8 z-10">
            
            <div class="w-full max-w-2xl flex flex-col items-center">
                
                <!-- Final Message Card (Matching App styling: bg-surface and border-border with celebrate-glow) -->
                <div class="w-full bg-surface backdrop-blur-md border border-border rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/50 text-center animate-fade-in animate-celebrate-glow">
                    
                    <!-- Inner border decoration -->
                    <div class="absolute inset-1.5 border border-white/5 rounded-lg pointer-events-none"></div>

                    <!-- Animated Wreath/Graduation icon -->
                    <div class="text-6xl mb-6 animate-bounce">
                        🎓
                    </div>

                    <!-- Title -->
                    <h1 class="text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-200 via-primary to-pink-500 bg-clip-text text-transparent drop-shadow mb-6 uppercase">
                        Enfin la fin !
                    </h1>

                    <!-- Message Body -->
                    <p class="text-base md:text-lg text-slate-200 leading-relaxed mb-8">
                        Félicitations ! La formation est officiellement terminée. Tu as bravé tous les réveils matinaux, planifié tes vacances scolaires avec rigueur et optimisé de main de maître la brasserie du Beer Clicker.
                    </p>

                    <!-- Action buttons -->
                    <div class="flex flex-wrap justify-center gap-4">
                        
                        <button @click="triggerMoreFireworks" 
                            class="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-20">
                            <span>🎆</span> Lancer des Feux d'artifice
                        </button>

                        <router-link to="/dashboard" 
                            class="flex items-center gap-2 px-5 py-3 rounded-full bg-secondary hover:bg-secondary-hover font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 z-20">
                            <span>🗓️</span> Accéder à l'Agenda
                        </router-link>

                    </div>

                </div>

            </div>
        </div>

        <!-- Settings Modals -->
        <SettingsModal :isOpen="showSettings" @close="showSettings = false" @openLogin="showLogin = true" />
        <LoginModal :isOpen="showLogin" @close="showLogin = false" />
    </div>
</template>

<style scoped>
/* Fade-in animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Color changing celebratory card glow */
@keyframes celebrate-glow {
    0%, 100% {
        box-shadow: 0 10px 30px -5px rgba(251, 146, 60, 0.2), 0 0 15px rgba(251, 146, 60, 0.1);
        border-color: rgba(251, 146, 60, 0.25);
    }
    50% {
        box-shadow: 0 10px 40px -5px rgba(236, 72, 153, 0.4), 0 0 25px rgba(236, 72, 153, 0.2);
        border-color: rgba(236, 72, 153, 0.45);
    }
}

.animate-celebrate-glow {
    animation: celebrate-glow 5s ease-in-out infinite;
}
</style>
