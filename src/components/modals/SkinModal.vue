<script setup>
import { useGameStore } from '@/stores/gameStore';
import BaseModal from './BaseModal.vue';

const store = useGameStore();
const getImageUrl = (imageName) => {
    return new URL(`../../assets/images/skins/${imageName}`, import.meta.url).href;
};
</script>

<template>
    <BaseModal @close="$emit('close')">

        <template #header>
            <h3>Boutique de Skins</h3>
            <p>Bières : {{ Math.floor(store.beerScore) }} 🍺</p>
        </template>

        <div class="skin-container">
            <div v-for="skin in store.AVAILABLE_SKINS" :key="skin.id" class="skin-item">
                <img :src="getImageUrl(skin.image)" :alt="skin.name" class="skin-preview" />
                <h4>{{ skin.name }}</h4>

                <div v-if="store.unlockedSkins.includes(skin.id)">
                    <button v-if="store.selectedSkin === skin.id" disabled class="active-btn">
                        Équipé
                    </button>
                    <button v-else @click="store.equipSkin(skin.id)">
                        Équiper
                    </button>
                </div>

                <div v-else>
                    <p :class="{ affordable: store.beerScore >= skin.price }">
                        {{ skin.price }} 🍺
                    </p>
                    <button @click="store.purchaseSkin(skin.id)" :disabled="store.beerScore < skin.price">
                        Acheter
                    </button>
                </div>
            </div>
        </div>

    </BaseModal>
</template>

<style scoped>
.skin-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
}

.skin-item {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    width: 140px;
    text-align: center;
}

.skin-preview {
    width: 64px;
    height: auto;
    margin-bottom: 10px;
}

.affordable {
    color: green;
}

.active-btn {
    background-color: #16a34a;
    color: white;
    cursor: default;
}
</style>