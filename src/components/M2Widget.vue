<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { fetchM2Connections } from '../logic/transportService'
import { getNow } from '../logic/time'

const toVennes = ref([])
const toGare = ref([])
let intervalId = null

async function update() {
    const data = await fetchM2Connections()
    if (data) {
        toVennes.value = data.toVennes
        toGare.value = data.toGare
    }
}

function getMinutes(dateStr) {
    if (!dateStr) return '-'
    const now = getNow()
    const target = new Date(dateStr)
    const diff = Math.floor((target - now) / 60000) // minutes
    if (diff < 0) return 'Dép.'
    if (diff === 0) return 'Maintenant'
    return `${diff} min`
}

onMounted(() => {
    update()
    intervalId = setInterval(update, 60000) // Update every minute
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})
</script>

<template>
    <div
        class="w-full bg-surface backdrop-blur-sm rounded-xl shadow-lg border border-border p-4 tilt-card alive-breath">
        <h2 class="text-xl font-bold text-center text-primary mb-4">Metro M2</h2>

        <div class="flex flex-col md:flex-row justify-around gap-6 text-center">
            <!-- Gare -> Vennes -->
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-200 border-b border-gray-600 pb-2 mb-2">Gare -> Vennes
                </h3>
                <div v-if="toVennes.length" class="flex flex-col gap-2">
                    <div v-for="(conn, idx) in toVennes" :key="idx"
                        class="flex justify-between items-center px-4 py-1 bg-black/20 rounded">
                        <span class="text-gray-400 text-sm">Départ de Lausanne-Gare</span>
                        <span class="font-bold text-xl text-primary">{{ getMinutes(conn.departure) }}</span>
                    </div>
                </div>
                <p v-else class="text-gray-500 italic">Chargement...</p>
            </div>

            <!-- Vennes -> Gare -->
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-200 border-b border-gray-600 pb-2 mb-2">Vennes -> Gare
                </h3>
                <div v-if="toGare.length" class="flex flex-col gap-2">
                    <div v-for="(conn, idx) in toGare" :key="idx"
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
