<script setup>
import { useGameStore } from '../../stores/gameStore'
import { skins, accessories } from '../../logic/gameData'
import { ref } from 'vue'

const activeTab = ref('skins') // 'skins' or 'accessories'

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

function buyAccessory(acc) {
    gameStore.buyAccessory(acc.id, acc.price)
}

function toggleAccessory(acc) {
    gameStore.setAccessory(acc)
}

function isAccessoryUnlocked(acc) {
    return gameStore.unlockedAccessories.includes(acc.id)
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
                <h2 class="text-3xl font-extrabold m-0 text-primary drop-shadow-md">Boutique</h2>
            </div>
            <p class="text-2xl text-primary mb-6 text-center font-bold">{{ Math.floor(gameStore.beerScore) }} 🍺</p>

            <!-- Tabs -->
            <div class="flex justify-center gap-4 mb-6">
                <button @click="activeTab = 'skins'" class="px-6 py-2 rounded-full font-bold transition-all border-2"
                    :class="activeTab === 'skins' ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'">
                    Skins
                </button>
                <button @click="activeTab = 'accessories'"
                    class="px-6 py-2 rounded-full font-bold transition-all border-2"
                    :class="activeTab === 'accessories' ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'">
                    Accessoires
                </button>
            </div>

            <div v-if="activeTab === 'skins'" class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
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


            <div v-if="activeTab === 'accessories'" class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                <div v-for="acc in accessories" :key="acc.id"
                    class="bg-slate-800/50 p-4 rounded-md text-center border border-slate-700 shadow-sm flex flex-col items-center">
                    <img :src="acc.image" :alt="acc.name" class="w-16 h-16 object-contain mb-2" />
                    <h3 class="text-lg font-bold text-gray-100 mb-2">{{ acc.name }}</h3>

                    <div v-if="isAccessoryUnlocked(acc)" class="w-full">
                        <p class="text-gray-400 mb-2">Possédé ({{ acc.type }})</p>
                        <button v-if="gameStore.equippedAccessories[acc.type] !== acc.id" @click="toggleAccessory(acc)"
                            class="px-4 py-2 bg-secondary rounded text-white cursor-pointer hover:bg-secondary-hover transition-colors w-full">
                            Équiper
                        </button>
                        <button v-else @click="toggleAccessory(acc)"
                            class="px-4 py-2 bg-emerald-500 rounded text-white cursor-pointer hover:bg-emerald-600 transition-colors w-full">
                            Équipé (Retirer)
                        </button>
                    </div>
                    <div v-else class="w-full">
                        <p class="mb-2 font-bold"
                            :class="gameStore.beerScore >= acc.price ? 'text-green-400' : 'text-red-500'">
                            Coût : {{ acc.price }} 🍺
                        </p>
                        <button @click="buyAccessory(acc)" :disabled="gameStore.beerScore < acc.price"
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
