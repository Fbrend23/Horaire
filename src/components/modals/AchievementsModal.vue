<script setup>
import { computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'

defineProps(['isOpen'])
const emit = defineEmits(['close'])
const gameStore = useGameStore()

const achievementsList = computed(() => gameStore.achievements)
const unlockedCount = computed(() => achievementsList.value.filter(a => a.unlocked).length)
const totalCount = computed(() => achievementsList.value.length)
</script>

<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-content">
            <span class="close-btn" @click="emit('close')">&times;</span>
            <div class="modal-header">
                <h2>Mes Succès</h2>
            </div>
            <p class="counter">{{ unlockedCount }} / {{ totalCount }}</p>

            <div class="achievements-list">
                <div v-for="ach in achievementsList" :key="ach.id">
                    <div v-if="ach.unlocked" class="achievement-item unlocked">
                        <h4>{{ ach.name }} 🏆</h4>
                        <p>{{ ach.description }}</p>
                    </div>
                </div>
            </div>

            <div v-if="achievementsList.some(a => !a.unlocked && a.revealed)">
                <h3>Indices</h3>
                <div v-for="ach in achievementsList" :key="'clue-' + ach.id">
                    <div v-if="!ach.unlocked && ach.revealed" class="achievement-item clue">
                        <h4>{{ ach.name }} (Verrouillé)</h4>
                        <p>{{ ach.description }}</p>
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
    max-width: 600px;
    max-height: 80vh;
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
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
    color: #60a5fa;
}

.counter {
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    font-weight: bold;
    color: #fbbf24;
}

.achievements-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
}

.achievement-item {
    background-color: #374151;
    padding: 1rem;
    border-radius: 6px;
    border-left: 4px solid #3b82f6;
}

.achievement-item.unlocked {
    border-color: #10b981;
}

.achievement-item.clue {
    border-color: #fbbf24;
}

h4 {
    margin: 0 0 0.5rem 0;
    color: #f3f4f6;
    font-weight: bold;
}
</style>
