<script setup>
import { useSettingsStore } from '@/stores/settingsStore';
import BeerClicker from '@/components/BeerClicker.vue';
import AgendaDisplay from '@/components/AgendaDisplay.vue';
import InfoColumn from '@/components/InfoColumn.vue';

const settings = useSettingsStore();

// Relaie les événements vers App.vue pour ouvrir les modales
defineEmits(['open-shop', 'open-skins']);
</script>

<template>
    <div class="dashboard-grid">

        <div v-if="settings.display.beerClicker" class="column left-col">
            <BeerClicker @open-shop="$emit('open-shop')" @open-skins="$emit('open-skins')" />
        </div>

        <div v-if="settings.display.agenda" class="column center-col">
            <AgendaDisplay />
        </div>

        <div v-if="settings.display.clocks || settings.display.vacances" class="column right-col">
            <InfoColumn />
        </div>

    </div>
</template>

<style scoped>
.dashboard-grid {
    display: grid;
    gap: 20px;
    padding: 20px;
    width: 100%;
    max-width: 1400px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

@media (min-width: 1024px) {

    .dashboard-grid {
        grid-template-columns: 1fr 1.5fr 1fr;
    }
}
</style>