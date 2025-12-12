<script setup>
import { useGameStore } from '../../stores/gameStore'
import { skins } from '../../logic/gameData'

defineProps(['isOpen'])
const emit = defineEmits(['close'])
const gameStore = useGameStore()

function buy(skin) {
    gameStore.buySkin(skin.id, skin.price)
}

function equip(skin) {
    gameStore.setSkin(skin.id)
}

function isUnlocked(skin) {
    return gameStore.unlockedSkins.includes(skin.id)
}
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 w-full h-full bg-black/70 flex justify-center items-center z-[1000]"
        @click.self="emit('close')">
        <div
            class="relative bg-surface overflow-y-auto p-8 rounded-xl w-[90%] max-w-4xl max-h-[90vh] text-white shadow-2xl border border-border">
            <span
                class="absolute top-4 right-6 text-4xl cursor-pointer text-gray-400 hover:text-white transition-colors leading-none"
                @click="emit('close')">&times;</span>

            <div class="text-center my-4">
                <h2 class="text-3xl font-extrabold m-0 text-primary drop-shadow-md">Boutique de Skins</h2>
            </div>
            <p class="text-2xl text-primary mb-6 text-center font-bold">{{ Math.floor(gameStore.beerScore) }} 🍺</p>

            <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                <div v-for="skin in skins" :key="skin.id"
                    class="bg-slate-800/50 p-4 rounded-md text-center border border-slate-700 shadow-sm flex flex-col items-center">
                    <img :src="skin.image" :alt="skin.name" class="w-20 h-auto mb-2" />
                    <h3 class="text-lg font-bold text-gray-100 mb-2">{{ skin.name }}</h3>

                    <div v-if="isUnlocked(skin)" class="w-full">
                        <p class="text-gray-400 mb-2">Possédé</p>
                        <button v-if="gameStore.selectedSkin !== skin.id" @click="equip(skin)"
                            class="px-4 py-2 bg-secondary rounded text-white cursor-pointer hover:bg-secondary-hover transition-colors w-full">
                            Équiper
                        </button>
                        <button v-else disabled
                            class="px-4 py-2 bg-emerald-500 rounded text-white cursor-default w-full">
                            Équipé
                        </button>
                    </div>
                    <div v-else class="w-full">
                        <p class="mb-2 font-bold"
                            :class="gameStore.beerScore >= skin.price ? 'text-green-400' : 'text-red-500'">
                            Coût : {{ skin.price }} 🍺
                        </p>
                        <button @click="buy(skin)" :disabled="gameStore.beerScore < skin.price"
                            class="px-4 py-2 bg-secondary rounded text-white cursor-pointer hover:bg-secondary-hover transition-colors w-full disabled:bg-gray-500 disabled:cursor-not-allowed">
                            Acheter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* No more custom CSS */
</style>
