<script setup>
import { useSettingsStore } from '../../stores/settingsStore'

defineProps(['isOpen'])
const emit = defineEmits(['close'])
const settingsStore = useSettingsStore()

function save() {
    emit('close')
}
</script>

<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Paramètres d'affichage</h2>
                <span class="close-btn" @click="emit('close')">&times;</span>
            </div>

            <div class="settings-list">
                <label>
                    <input type="checkbox" :checked="settingsStore.displaySettings.agenda"
                        @change="settingsStore.toggleDisplay('agenda')" />
                    Afficher Agenda
                </label>
                <label>
                    <input type="checkbox" :checked="settingsStore.displaySettings.beerClicker"
                        @change="settingsStore.toggleDisplay('beerClicker')" />
                    Afficher Beer Clicker
                </label>
                <label>
                    <input type="checkbox" :checked="settingsStore.displaySettings.clocks"
                        @change="settingsStore.toggleDisplay('clocks')" />
                    Afficher Horloges
                </label>
                <label>
                    <input type="checkbox" :checked="settingsStore.displaySettings.vacances"
                        @change="settingsStore.toggleDisplay('vacances')" />
                    Afficher Vacances
                </label>
            </div>

            <div class="actions">
                <button @click="save">Fermer</button>
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
    background-color: #1f2937;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    color: white;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.close-btn {
    font-size: 2rem;
    cursor: pointer;
}

.settings-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
}

label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    cursor: pointer;
}

input[type="checkbox"] {
    width: 20px;
    height: 20px;
}

.actions {
    text-align: right;
}

button {
    padding: 0.5rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>
