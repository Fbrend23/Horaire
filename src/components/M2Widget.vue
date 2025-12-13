<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { fetchM2Connections } from '../logic/transportService'
import { getNow } from '../logic/time'

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
        class="w-full bg-surface backdrop-blur-sm rounded-xl shadow-lg border border-border p-4 tilt-card alive-breath">
        <h2 class="text-xl font-bold text-center text-primary mb-4">Metro M2</h2>

        <div class="flex flex-col md:flex-row justify-around gap-6 text-center">
            <!-- Gare -> Vennes -->
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-200 border-b border-gray-600 pb-2 mb-2">Ouchy -> Croisettes
                </h3>
                <div v-if="displayToVennes.length" class="flex flex-col gap-2">
                    <div v-for="(conn, idx) in displayToVennes" :key="idx"
                        class="flex justify-between items-center px-4 py-1 bg-black/20 rounded">
                        <span class="text-gray-400 text-sm">Départ de Lausanne-Gare</span>
                        <span class="font-bold text-xl text-primary">{{ getMinutes(conn.departure) }}</span>
                    </div>
                </div>
                <p v-else class="text-gray-500 italic">Chargement...</p>
            </div>

            <!-- Vennes -> Gare -->
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-200 border-b border-gray-600 pb-2 mb-2">Croisettes -> Ouchy
                </h3>
                <div v-if="displayToGare.length" class="flex flex-col gap-2">
                    <div v-for="(conn, idx) in displayToGare" :key="idx"
                        class="flex justify-between items-center px-4 py-1 bg-black/20 rounded">
                        <span class="text-gray-400 text-sm">Départ de Vennes</span>
                        <span class="font-bold text-xl text-primary">{{ getMinutes(conn.departure) }}</span>
                    </div>
                </div>
                <p v-else class="text-gray-500 italic">Chargement...</p>
            </div>
        </div>
    </div>
</template>
