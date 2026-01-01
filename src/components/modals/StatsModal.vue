<script setup>
import { computed, ref } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { formatNumber } from '@/utils/format'

defineProps(['isOpen'])
const emit = defineEmits(['close'])
const gameStore = useGameStore()

const activeTab = ref('stats') // 'stats' or 'achievements'

// Stats Logic
const stats = computed(() => [
    {
        label: 'Golden Beers Capturées',
        value: formatNumber(gameStore.goldenBeersClicked),
        icon: '🍺'
    },
    {
        label: 'Gains Golden Beers',
        value: formatNumber(gameStore.goldenBeerEarnings),
        icon: '💰'
    },
    {
        label: 'Clics Manuels',
        value: formatNumber(gameStore.manualClicks),
        icon: '👆'
    }
])

// Achievements Logic
const achievementsList = computed(() => gameStore.achievements)
const unlockedCount = computed(() => achievementsList.value.filter(a => a.unlocked).length)
const totalCount = computed(() => achievementsList.value.length)
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 w-full h-full bg-black/70 flex justify-center items-center z-[1000]"
        @click.self="emit('close')">
        <div
            class="relative bg-surface rounded-xl w-[95%] max-w-4xl h-[80vh] text-white shadow-2xl border border-border flex flex-col overflow-hidden animate-fade-in">

            <!-- Header & Tabs -->
            <div class="bg-black/20 p-4 border-b border-white/10 shrink-0">
                <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-white transition-colors z-10"
                    @click="emit('close')">
                    &times;
                </button>

                <div class="flex justify-center gap-4 mt-2">
                    <button @click="activeTab = 'stats'"
                        class="px-6 py-2 rounded-lg font-bold transition-all border-b-4"
                        :class="activeTab === 'stats' ? 'bg-primary text-black border-amber-600' : 'bg-slate-700 text-gray-400 border-slate-900 hover:text-white'">
                        STATISTIQUES
                    </button>
                    <button @click="activeTab = 'achievements'"
                        class="px-6 py-2 rounded-lg font-bold transition-all border-b-4"
                        :class="activeTab === 'achievements' ? 'bg-primary text-black border-amber-600' : 'bg-slate-700 text-gray-400 border-slate-900 hover:text-white'">
                        SUCCÈS ({{ unlockedCount }}/{{ totalCount }})
                    </button>
                </div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">

                <!-- Stats Tab -->
                <div v-if="activeTab === 'stats'" class="max-w-2xl mx-auto animate-slide-up">
                    <h2 class="text-3xl font-extrabold text-center mb-8 text-white/90 uppercase tracking-wide">Résumé de
                        carrière</h2>

                    <div class="grid grid-cols-1 gap-4">
                        <div v-for="(stat, index) in stats" :key="index"
                            class="bg-black/20 p-6 rounded-xl flex items-center justify-between border border-white/5 hover:border-primary/30 transition-colors group">
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    {{ stat.icon }}
                                </div>
                                <span class="text-gray-300 font-semibold text-lg">{{ stat.label }}</span>
                            </div>
                            <span class="text-2xl font-bold text-primary font-mono">{{ stat.value }}</span>
                        </div>
                    </div>
                </div>

                <!-- Achievements Tab -->
                <div v-else class="animate-slide-up">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <template v-for="ach in achievementsList" :key="ach.id">
                            <div v-if="ach.unlocked"
                                class="bg-slate-800/50 p-4 rounded-md border-l-4 border-emerald-500 shadow-sm h-full flex flex-col justify-start">
                                <h4
                                    class="m-0 mb-2 text-gray-100 font-bold border-none text-lg flex items-center gap-2">
                                    {{ ach.name }} <span class="text-xl">🏆</span>
                                </h4>
                                <p class="m-0 text-gray-300 text-sm leading-relaxed">{{ ach.description }}</p>
                            </div>
                        </template>
                    </div>

                    <!-- Clues -->
                    <div v-if="achievementsList.some(a => !a.unlocked && a.revealed)">
                        <h3 class="text-xl font-bold text-gray-200 mb-4 mt-8 border-t border-gray-700 pt-4">Indices</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <template v-for="ach in achievementsList" :key="'clue-' + ach.id">
                                <div v-if="!ach.unlocked && ach.revealed"
                                    class="bg-slate-800/50 p-4 rounded-md border-l-4 border-primary shadow-sm h-full flex flex-col justify-start">
                                    <h4
                                        class="m-0 mb-2 text-gray-100 font-bold border-none text-lg flex items-center gap-2">
                                        {{ ach.name }} <span
                                            class="text-xs uppercase bg-primary/20 text-primary px-2 py-0.5 rounded">Verrouillé</span>
                                    </h4>
                                    <p class="m-0 text-gray-300 text-sm leading-relaxed">{{ ach.description }}</p>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Footer -->
            <div class="bg-black/20 p-2 text-center text-xs text-gray-500 shrink-0">
                v2.7.0 - L'Âge d'Or
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.2s ease-out;
}

.animate-slide-up {
    animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.98);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>
