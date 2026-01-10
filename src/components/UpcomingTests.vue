<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useScheduleStore } from '../stores/scheduleStore'


const scheduleStore = useScheduleStore()
const currentTime = ref(new Date())
let intervalId = null

onMounted(() => {
    intervalId = setInterval(() => {
        currentTime.value = new Date()
    }, 60000) // Update every minute
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})

const formattedTests = computed(() => {
    return scheduleStore.tests
        .filter(test => {
            const start = new Date(test.date)
            // Use end_date if available, else assume 3h duration
            const end = test.end_date ? new Date(test.end_date) : new Date(start.getTime() + 3 * 60 * 60 * 1000)
            return currentTime.value < end
        })
        .map(test => {
            const d = new Date(test.date)
            const day = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
            const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

            // Calculate relative time (diff in days)
            const now = new Date(currentTime.value)
            now.setHours(0, 0, 0, 0)
            
            const testDate = new Date(d)
            testDate.setHours(0, 0, 0, 0)
            
            const diffTime = testDate.getTime() - now.getTime()
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

            let relative = ''
            if (diffDays === 0) relative = "Aujourd'hui"
            else if (diffDays === 1) relative = "Demain"
            else relative = `Dans ${diffDays} jours`

            return {
                ...test,
                formattedDate: `${day} à ${time}`,
                relative
            }
        })
})
</script>

<template>
    <div
        class="w-full h-auto md:h-[256px] bg-surface backdrop-blur-sm rounded-xl shadow-lg border border-border p-4 relative overflow-hidden flex flex-col">
        
        <h2 class="text-xl font-bold text-center text-primary mb-4 shrink-0">
            Examens à venir
        </h2>

        <div class="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            <div v-if="formattedTests.length === 0"
                class="h-full flex flex-col justify-center items-center text-white">
                <p>Aucun examen prévu</p>
                <p class="text-sm">Tout est calme...</p>
            </div>

            <div v-for="test in formattedTests" :key="test.id"
                class="bg-black/20 rounded-lg p-3 border-l-4 border-primary flex justify-between items-center hover:bg-black/30 transition relative overflow-hidden group">
                
                <div>
                    <h3 class="font-bold text-lg text-white leading-tight">{{ test.title }}</h3>
                    <div class="flex items-center gap-2 text-sm text-white mt-1">
                        <span
                            class="bg-gray-800 rounded px-1.5 py-0.5 text-xs font-mono text-primary-light border border-gray-700">{{
                                test.module }}</span>
                        <span v-if="test.room" class="flex items-center gap-1 opacity-80 text-xs">
                            {{ test.room }}
                        </span>
                    </div>
                </div>

                <div class="text-right shrink-0">
                    <p class="font-bold text-primary-light">{{ test.relative }}</p>
                    <p class="text-[10px] text-white capitalize">{{ test.formattedDate }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
