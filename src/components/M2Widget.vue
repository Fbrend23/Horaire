<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { fetchM2Connections } from '../logic/transportService'
import { getNow } from '../logic/time'
import m2TrainImg from '@/assets/Decoration/m2_train.png'

const toVennes = ref([])
const toGare = ref([])
const currentTime = ref(new Date())
let updateInterval = null
let clockInterval = null

async function updateData() {
    const data = await fetchM2Connections()
    if (data) {
        toVennes.value = data.toVennes
        toGare.value = data.toGare
    }
}

// Reactive filtering: Show only future departures, limited to 3
const displayToVennes = computed(() => {
    return toVennes.value
        .filter(conn => new Date(conn.departure) > currentTime.value) // Hide if departed
        .slice(0, 3)
})

const displayToGare = computed(() => {
    return toGare.value
        .filter(conn => new Date(conn.departure) > currentTime.value) // Hide if departed
        .slice(0, 3)
})

function getMinutes(dateStr) {
    if (!dateStr) return '-'
    const target = new Date(dateStr)
    const diff = Math.floor((target - currentTime.value) / 60000)

    // Logic: diff < 0 is handled by filter, but '0' means < 60s
    if (diff <= 0) return 'Imminent'
    return `${diff} min`
}

onMounted(() => {
    // Initial fetch
    updateData()
    // Sync clock immediately
    currentTime.value = getNow()

    // Fetch data every 60s
    updateInterval = setInterval(updateData, 60000)

    // Update local clock every 5s for reactive countdown
    clockInterval = setInterval(() => {
        currentTime.value = getNow()
    }, 5000)
})

onUnmounted(() => {
    if (updateInterval) clearInterval(updateInterval)
    if (clockInterval) clearInterval(clockInterval)
})
</script>

<template>
    <div
        class="w-full h-auto md:h-[256px] bg-surface backdrop-blur-sm rounded-xl shadow-lg border border-border p-4 tilt-card alive-breath relative overflow-hidden group">

        <!-- Background Metro Animation -->
        <div class="absolute top-0 left-0 w-full h-20 overflow-hidden mask-fade opacity-30 pointer-events-none z-0">
            <img :src="m2TrainImg" class="metro-train" alt="Metro M2" />
        </div>

        <!-- Content -->
        <div class="relative z-10 flex flex-col h-full">
            <h2 class="text-xl font-bold text-center text-primary mb-4">Metro M2</h2>

            <div class="flex flex-col md:flex-row justify-around gap-6 text-center">
                <!-- Gare -> Vennes -->
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white border-b border-gray-600 pb-2 mb-2">Ouchy ->
                        Croisettes
                    </h3>
                    <div v-if="displayToVennes.length" class="flex flex-col gap-2">
                        <div v-for="(conn, idx) in displayToVennes" :key="idx"
                            class="flex justify-between items-center px-4 py-1 bg-black/20 rounded">
                            <span class="text-white text-sm">Départ de Lausanne-Gare</span>
                            <span class="font-bold text-xl text-primary">{{ getMinutes(conn.departure) }}</span>
                        </div>
                    </div>
                    <p v-else class="text-white italic">Chargement...</p>
                </div>

                <!-- Vennes -> Gare -->
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white border-b border-gray-600 pb-2 mb-2">Croisettes ->
                        Ouchy
                    </h3>
                    <div v-if="displayToGare.length" class="flex flex-col gap-2">
                        <div v-for="(conn, idx) in displayToGare" :key="idx"
                            class="flex justify-between items-center px-4 py-1 bg-black/20 rounded">
                            <span class="text-white text-sm">Départ de Vennes</span>
                            <span class="font-bold text-xl text-primary">{{ getMinutes(conn.departure) }}</span>
                        </div>
                    </div>
                    <p v-else class="text-white italic">Chargement...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Gradient Mask for fade in/out effect at edges */
.mask-fade {
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.metro-train {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 70px;
    /* Adjust based on image ratio */
    width: auto;
    opacity: 0.9;
    animation: metro-pass 12s linear infinite;
    filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.3));
}

@keyframes metro-pass {
    0% {
        left: -150px;
        /* Start off-screen left */
    }

    100% {
        left: 100%;
        /* End off-screen right */
    }
}
</style>
