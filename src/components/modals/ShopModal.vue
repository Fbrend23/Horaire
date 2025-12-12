<script setup>
import { computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { getShopUpgrades } from '../../logic/gameData'

defineProps(['isOpen'])
const emit = defineEmits(['close'])
const gameStore = useGameStore()

const upgradesList = computed(() => getShopUpgrades(gameStore))

function getCost(upgrade) {
    return gameStore.getUpgradeCost(upgrade.id)
}

function buy(upgrade) {
    gameStore.buyUpgrade(upgrade.id)
}
</script>

<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-content">
            <span class="close-btn" @click="emit('close')">&times;</span>
            <div class="modal-header">
                <h2>Shop</h2>
            </div>
            <p class="beer-reminder">{{ Math.floor(gameStore.beerScore) }} 🍺</p>

            <div class="upgrades-list">
                <div v-for="upgrade in upgradesList" :key="upgrade.id" class="upgrade-item">
                    <h3>{{ upgrade.name }}</h3>
                    <p>{{ upgrade.description }}</p>
                    <p :class="gameStore.beerScore >= getCost(upgrade) ? 'affordable' : 'expensive'">
                        Coût : {{ getCost(upgrade) }} 🍺
                    </p>
                    <p class="quantity-text">Quantité : {{ gameStore.upgrades[upgrade.id] || 0 }}</p>
                    <button @click="buy(upgrade)" :disabled="gameStore.beerScore < getCost(upgrade)">
                        Acheter
                    </button>
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
    background-color: #111827;
    padding: 2rem;
    border-radius: 8px;
    width: 95%;
    max-width: 1200px;
    max-height: 90vh;
    overflow-y: auto;
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
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #60a5fa;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.beer-reminder {
    font-size: 1.5rem;
    color: #fbbf24;
    margin-bottom: 2rem;
    text-align: center;
    font-weight: bold;
}

.upgrades-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
}

.upgrade-item {
    background-color: #1f2937;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5rem;
    text-align: center;
    border: 1px solid #374151;
}

.upgrade-item h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: bold;
    color: #f3f4f6;
}

.upgrade-item p {
    font-size: 0.85rem;
    margin: 0;
    color: #d1d5db;
}

.affordable {
    color: #4ade80 !important;
    font-weight: bold;
}

.expensive {
    color: #ef4444 !important;
    font-weight: bold;
}

.quantity-text {
    font-size: 0.8rem;
    color: #9ca3af;
}

button {
    width: 60%;
    margin: 0.5rem auto 0 auto;
    padding: 0.5rem;
    background-color: #6366f1;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #4f46e5;
}

button:disabled {
    background-color: #4b5563;
    cursor: not-allowed;
}
</style>
