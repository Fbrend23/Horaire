<script setup>
import { useSettingsStore } from '@/stores/settingsStore';
import BaseModal from './BaseModal.vue';

const store = useSettingsStore();
</script>

<template>
    <BaseModal @close="$emit('close')">
        <template #header>
            <h2>Paramètres d'affichage</h2>
        </template>

        <div class="settings-list">
            <label>
                <input type="checkbox" v-model="store.display.agenda" /> Afficher Agenda
            </label>
            <label>
                <input type="checkbox" v-model="store.display.beerClicker" /> Afficher Beer Clicker
            </label>
            <label>
                <input type="checkbox" v-model="store.display.clocks" /> Afficher Horloges
            </label>
            <label>
                <input type="checkbox" v-model="store.display.vacances" /> Afficher Vacances
            </label>
        </div>
    </BaseModal>
</template>

<style scoped>
.settings-list label {
    display: block;
    margin: 10px 0;
    font-size: 1.1rem;
    cursor: pointer;
}

input[type="checkbox"] {
    margin-right: 10px;
}
</style>