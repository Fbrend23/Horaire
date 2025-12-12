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
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-content">
            <span class="close-btn" @click="emit('close')">&times;</span>

            <div class="modal-header">
                <h2>Boutique de Skins</h2>
            </div>
            <p class="beer-reminder">{{ Math.floor(gameStore.beerScore) }} 🍺</p>

            <div class="skins-grid">
                <div v-for="skin in skins" :key="skin.id" class="skin-item">
                    <img :src="skin.image" :alt="skin.name" class="skin-pref" />
                    <h3>{{ skin.name }}</h3>

                    <div v-if="isUnlocked(skin)">
                        <p class="owned">Possédé</p>
                        <button v-if="gameStore.selectedSkin !== skin.id" @click="equip(skin)">
                            Équiper
                        </button>
                        <button v-else disabled class="equipped">
                            Équipé
                        </button>
                    </div>
                    <div v-else>
                        <p
                            :class="{ affordable: gameStore.beerScore >= skin.price, expensive: gameStore.beerScore < skin.price }">
                            Coût : {{ skin.price }} 🍺
                        </p>
                        <button @click="buy(skin)" :disabled="gameStore.beerScore < skin.price">
                            Acheter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    position: relative;
    background-color: #1f2937;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 800px;
    color: white;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 2.5rem;
    cursor: pointer;
    line-height: 1;
    color: #9ca3af;
    transition: color 0.2s;
}

.close-btn:hover {
    color: white;
}

.modal-header {
    text-align: center;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
}

.modal-header h2 {
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
    color: #60a5fa;
}

.beer-reminder {
    font-size: 1.5rem;
    color: #fbbf24;
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: bold;
}

.skins-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.skin-item {
    background-color: #374151;
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
}

.skin-pref {
    width: 80px;
    height: auto;
    margin-bottom: 0.5rem;
    margin-left: 15px;
}

.owned {
    color: #9ca3af;
}

.affordable {
    color: #4ade80 !important;
    font-weight: bold;
}

.expensive {
    color: #ef4444 !important;
    font-weight: bold;
}

button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    background-color: #3b82f6;
    color: white;
    cursor: pointer;
    margin-top: 0.5rem;
}

button:disabled {
    background-color: #6b7280;
    cursor: not-allowed;
}

button.equipped {
    background-color: #10b981;
}
</style>
