<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { weeklySchedule } from '@/logic/agenda.js';

const currentLessonName = ref("---");
const timeRemaining = ref("---");
const nextLessonName = ref("---");
const nextRoom = ref("-");

let intervalId = null;

function updateDisplay() {
    const now = new Date();

    // Recherche du module en cours
    const currentModule = weeklySchedule.find(m => m.estEnCours(now));

    if (currentModule) {
        currentLessonName.value = currentModule.moduleName;

        // Calcul du temps restant
        const end = currentModule.getEndDate(now);
        const diff = end - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        timeRemaining.value = `${hours}h ${minutes}m ${seconds}s`;
    } else {
        currentLessonName.value = "Aucun cours";
        timeRemaining.value = "-";
    }
}

onMounted(() => {
    updateDisplay();
    intervalId = setInterval(updateDisplay, 1000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>

<template>
    <div class="agenda-container">
        <section class="main fullscreen cours-actuel">
            <h2>Cours actuel</h2>
            <h3>{{ currentLessonName }}</h3>
            <p>Fin dans: <span class="countdown">{{ timeRemaining }}</span></p>
        </section>

        <section class="main fullscreen">
            <h2>Prochain cours</h2>
            <h3>{{ nextLessonName }}</h3>
            <p>Salle: {{ nextRoom }}</p>
        </section>
    </div>
</template>

<style scoped>
.agenda-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    align-items: center;
}

section {
    background-color: var(--card-background, #fff);
    border-radius: 14px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 80%;
    text-align: center;
}

.countdown {
    color: var(--countdown-color, #ef4444);
    font-weight: bold;
}
</style>