<script setup>
import { computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'

defineProps(['isOpen'])
const emit = defineEmits(['close'])
const gameStore = useGameStore()

const achievementsList = computed(() => gameStore.achievements)
const unlockedCount = computed(() => achievementsList.value.filter(a => a.unlocked).length)
const totalCount = computed(() => achievementsList.value.length)
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 w-full h-full bg-black/70 flex justify-center items-center z-[1000]"
        @click.self="emit('close')">
        <div
            class="relative bg-slate-800 overflow-y-auto p-8 rounded-xl w-[95%] max-w-6xl max-h-[90vh] text-white shadow-2xl border border-white/10">
            <span
                class="absolute top-4 right-6 text-4xl cursor-pointer text-gray-400 hover:text-white transition-colors leading-none"
                @click="emit('close')">&times;</span>
            <div class="text-center my-4">
                <h2 class="text-3xl font-extrabold m-0 text-blue-400 uppercase tracking-wide">Mes Succès</h2>
            </div>
            <p class="text-center text-xl mb-6 font-bold text-amber-400">{{ unlockedCount }} / {{ totalCount }}</p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <template v-for="ach in achievementsList" :key="ach.id">
                    <div v-if="ach.unlocked"
                        class="bg-gray-700 p-4 rounded-md border-l-4 border-emerald-500 shadow-sm h-full flex flex-col justify-start">
                        <h4 class="m-0 mb-2 text-gray-100 font-bold border-none text-lg flex items-center gap-2">
                            {{ ach.name }} <span class="text-xl">🏆</span>
                        </h4>
                        <p class="m-0 text-gray-300 text-sm leading-relaxed">{{ ach.description }}</p>
                    </div>
                </template>
            </div>

            <div v-if="achievementsList.some(a => !a.unlocked && a.revealed)">
                <h3 class="text-xl font-bold text-gray-200 mb-4 mt-8 border-t border-gray-700 pt-4">Indices</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <template v-for="ach in achievementsList" :key="'clue-' + ach.id">
                        <div v-if="!ach.unlocked && ach.revealed"
                            class="bg-gray-700 p-4 rounded-md border-l-4 border-amber-400 shadow-sm h-full flex flex-col justify-start">
                            <h4 class="m-0 mb-2 text-gray-100 font-bold border-none text-lg flex items-center gap-2">
                                {{ ach.name }} <span
                                    class="text-xs uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Verrouillé</span>
                            </h4>
                            <p class="m-0 text-gray-300 text-sm leading-relaxed">{{ ach.description }}</p>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* No more custom CSS */
</style>
