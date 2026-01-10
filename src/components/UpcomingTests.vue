<script setup>
import { computed } from 'vue'
import { useScheduleStore } from '../stores/scheduleStore'


const scheduleStore = useScheduleStore()

const formattedTests = computed(() => {
    return scheduleStore.tests
        .filter(test => {
            const start = new Date(test.date)
            // Use end_date if available, else assume 3h duration
            const end = test.end_date ? new Date(test.end_date) : new Date(start.getTime() + 3 * 60 * 60 * 1000)
            return new Date() < end
        })
        .map(test => {
            const d = new Date(test.date)
            const day = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
            const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

            // Calculate relative time (diff in days)
            const now = new Date()
            const diffTime = d - now
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            let relative = ''
            if (diffDays <= 0) relative = "Aujourd'hui" // Simple check, fine since we filtered expired ones
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
    <div class="h-[256px] flex flex-col relative group overflow-hidden rounded-xl">
        <!-- Header -->
        <div
            class="backdrop-blur-sm rounded-t-xl bg-surface border border-b-0 border-border p-4 flex justify-center items-center transition-colors">
            <h2 class="text-xl font-bold text-primary text-center">
                Examens à venir
            </h2>
        </div>

        <!-- List -->
        <div
            class="flex-1 backdrop-blur-sm bg-surface/50 border border-border rounded-b-xl overflow-y-auto p-2 space-y-2">
            <div v-if="formattedTests.length === 0"
                class="h-full flex flex-col justify-center items-center text-gray-400 opacity-60">
                <p>Aucun examen prévu</p>
                <p class="text-sm">Tout est calme...</p>
            </div>

            <div v-for="test in formattedTests" :key="test.id"
                class="bg-gray-800/80 rounded-lg p-3 border-l-4 border-primary flex justify-between items-center group/test hover:bg-gray-700/80 transition relative overflow-hidden">

                <!-- Glow Effect -->
                <div
                    class="absolute inset-0 bg-primary/5 opacity-0 group-hover/test:opacity-100 transition-opacity pointer-events-none">
                </div>

                <div>
                    <h3 class="font-bold text-lg text-white">{{ test.title }}</h3>
                    <div class="flex items-center gap-2 text-sm text-gray-300">
                        <span
                            class="bg-gray-900 rounded px-2 py-0.5 text-xs font-mono text-primary-light border border-gray-700">{{
                                test.module }}</span>
                        <span v-if="test.room" class="flex items-center gap-1 opacity-80">
                            Salle {{ test.room }}
                        </span>
                    </div>
                </div>

                <div class="text-right">
                    <p class="font-bold text-primary-light">{{ test.relative }}</p>
                    <p class="text-xs text-gray-400 capitalize">{{ test.formattedDate }}</p>
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
