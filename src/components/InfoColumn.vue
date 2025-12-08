<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { getUpcomingVacations } from '@/logic/vacances.js';

// --- Horloges ---
const timeNewYork = ref('--:--:--');
const timeLausanne = ref('--:--:--');
const timeTokyo = ref('--:--:--');

function updateClocks() {
    const now = new Date();
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };

    timeNewYork.value = new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'America/New_York' }).format(now);
    timeLausanne.value = new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'Europe/Zurich' }).format(now);
    timeTokyo.value = new Intl.DateTimeFormat('fr-FR', { ...options, timeZone: 'Asia/Tokyo' }).format(now);
}

// --- Vacances ---
const nextVacation = computed(() => {
    const upcoming = getUpcomingVacations();
    if (upcoming.length > 0) {
        const vac = upcoming[0];
        const diff = Math.ceil((vac.startDate - new Date()) / (1000 * 60 * 60 * 24));
        return {
            name: vac.name,
            dateStr: vac.startDate.toLocaleDateString("fr-FR"),
            daysLeft: diff
        };
    }
    return null;
});

// --- Weekend Countdown ---
const timeToWeekend = ref('');

function updateWeekend() {
    const now = new Date();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;

    if (isWeekend) {
        timeToWeekend.value = "C'est le week-end !";
    } else {
        // Cible : Vendredi 16h35
        const target = new Date(now);
        target.setDate(now.getDate() + (5 - day));
        target.setHours(16, 35, 0);

        const diff = Math.floor((target - now) / 1000);
        if (diff > 0) {
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            timeToWeekend.value = `${h}h ${m}min`;
        } else {
            timeToWeekend.value = "Bientôt !";
        }
    }
}

let interval;
onMounted(() => {
    updateClocks();
    updateWeekend();
    interval = setInterval(() => {
        updateClocks();
        updateWeekend();
    }, 1000);
});

onUnmounted(() => clearInterval(interval));
</script>

<template>
    <div class="vac-column container-column">
        <div class="clocks-container">
            <div class="clock">
                <h3>New York</h3>
                <span>{{ timeNewYork }}</span>
            </div>
            <div class="clock">
                <h3>Lausanne</h3>
                <span>{{ timeLausanne }}</span>
            </div>
            <div class="clock">
                <h3>Tokyo</h3>
                <span>{{ timeTokyo }}</span>
            </div>
        </div>

        <div class="vacances-info">
            <section class="small-card">
                <h2>Week-end</h2>
                <p>{{ timeToWeekend }}</p>
            </section>

            <section class="small-card" v-if="nextVacation">
                <h2>Prochaines vacances</h2>
                <h3>{{ nextVacation.name }}</h3>
                <p>{{ nextVacation.dateStr }} ({{ nextVacation.daysLeft }} jours)</p>
            </section>
        </div>
    </div>
</template>

<style scoped>
.vac-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
}

.clocks-container {
    display: flex;
    justify-content: space-around;
    gap: 10px;
}

.clock {
    background-color: var(--card-background, #fff);
    padding: 10px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    flex: 1;
}

.clock h3 {
    font-size: 0.8rem;
    margin-bottom: 5px;
    color: var(--title-color, #3b82f6);
}

.small-card {
    background-color: var(--card-background, #fff);
    border-radius: 14px;
    padding: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    text-align: center;
}
</style>