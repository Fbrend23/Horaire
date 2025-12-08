<script setup>
import { useGameStore } from '@/stores/gameStore';
import BaseModal from './BaseModal.vue';

const store = useGameStore();
</script>

<template>
    <BaseModal @close="$emit('close')">

        <template #header>
            <h2>Shop</h2>
            <p class="beer-reminder">Bières disponibles : {{ Math.floor(store.beerScore) }} 🍺</p>
        </template>

        <div class="shop-items">
            <div v-for="upgrade in store.upgrades" :key="upgrade.id" class="shop-upgrade">
                <h3>{{ upgrade.name }}</h3>
                <p class="cost" :class="{ affordable: store.beerScore >= store.getUpgradeCost(upgrade.id) }">
                    Coût : {{ store.getUpgradeCost(upgrade.id) }} 🍺
                </p>
                <p>Quantité : {{ upgrade.quantity }}</p>

                <button @click="store.buyUpgrade(upgrade.id)"
                    :disabled="store.beerScore < store.getUpgradeCost(upgrade.id)">
                    Acheter
                </button>
            </div>
        </div>

    </BaseModal>
</template>

<style scoped>
.shop-items {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.shop-upgrade {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 10px;
    width: 150px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.cost.affordable {
    color: green;
}

.cost:not(.affordable) {
    color: red;
}
</style>