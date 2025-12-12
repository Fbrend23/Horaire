<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const notification = computed(() => gameStore.notification)
</script>

<template>
    <Transition name="fade">
        <div v-if="notification" class="notification-toast">
            <div class="icon">🏆</div>
            <div class="content">
                <h4>Succès Débloqué !</h4>
                <p>{{ notification.name }}</p>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.notification-toast {
    position: absolute;
    /* Relative to BeerClicker card now */
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(31, 41, 55, 0.95);
    border: 2px solid #fbbf24;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    z-index: 100;
    min-width: 250px;
    backdrop-filter: blur(4px);
}

.icon {
    font-size: 2rem;
}

.content h4 {
    margin: 0;
    color: #fbbf24;
    font-size: 1rem;
}

.content p {
    margin: 0;
    font-size: 0.9rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -20px);
    /* Slide down from top */
}
</style>
