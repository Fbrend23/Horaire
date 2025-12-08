<script setup>
import { useGameStore } from '@/stores/gameStore';
import { ref } from 'vue';

const store = useGameStore();
const beerImgRef = ref(null);

// Fonction locale pour l'animation visuelle
function handleClick() {
    store.incrementScore();
    const img = beerImgRef.value;
    if (img) {
        img.style.transform = 'scale(0.9)';
        setTimeout(() => {
            img.style.transform = 'scale(1)';
        }, 100);
    }
}
</script>

<template>
    <section class="beer-clicker-container">
        <div class="score-board">
            <h2>Beer Clicker</h2>
            <p>Score : <span class="score">{{ Math.floor(store.beerScore) }}</span> 🍺</p>
            <p>Multiplicateur : x{{ store.beerMultiplier }}</p>
        </div>

        <div class="click-zone">
            <img ref="beerImgRef" :src="store.currentSkinImage" alt="Bière à cliquer" class="beer-img"
                @click="handleClick" />
        </div>

        <div class="controls">
            <button @click="$emit('open-shop')">Boutique</button>
            <button @click="$emit('open-skins')">Skins</button>
            <button @click="store.startAutoClicker">Auto-Click</button>
        </div>
    </section>
</template>

<style scoped>
.beer-clicker-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: var(--card-background, #fff);
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.beer-img {
    width: 150px;
    cursor: pointer;
    transition: transform 0.1s ease;
    margin: 2rem 0;
}

.score {
    font-weight: bold;
    font-size: 1.5rem;
    color: #eab308;
}

.controls button {
    margin: 0 5px;
    padding: 8px 16px;
    cursor: pointer;
}
</style>