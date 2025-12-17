<script setup>
import { computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { formatNumber } from '@/utils/format'

defineProps(['isOpen'])
const emit = defineEmits(['close'])
const gameStore = useGameStore()

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
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 w-full h-full bg-black/70 flex justify-center items-center z-[1000]"
        @click.self="emit('close')">
        <div
            class="relative bg-surface rounded-xl w-[95%] max-w-lg text-white shadow-2xl border border-border flex flex-col p-6 animate-fade-in">

            <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-white transition-colors"
                @click="emit('close')">
                &times;
            </button>

            <h2 class="text-3xl font-extrabold text-center mb-6 text-primary uppercase tracking-wide">Statistiques</h2>

            <div class="grid grid-cols-1 gap-4">
                <div v-for="(stat, index) in stats" :key="index"
                    class="bg-black/20 p-4 rounded-lg flex items-center justify-between border border-white/5 hover:border-primary/30 transition-colors">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">{{ stat.icon }}</span>
                        <span class="text-gray-300 font-semibold">{{ stat.label }}</span>
                    </div>
                    <span class="text-xl font-bold text-primary">{{ stat.value }}</span>
                </div>
            </div>

            <div class="mt-8 text-center text-xs text-gray-500">
                v2.8.0 - L'Âge d'Or
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
