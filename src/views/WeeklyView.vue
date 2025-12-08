<script setup>
import { weeklySchedule } from '@/logic/agenda.js';


const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];

function getStyle(module) {
    const startMin = module.startHour * 60 + module.startMinute;
    const endMin = module.endHour * 60 + module.endMinute;
    const duration = endMin - startMin;

    const top = (startMin - 480) * 1.5;
    const height = duration * 1.5;

    return {
        top: `${top}px`,
        height: `${height}px`
    };
}
</script>

<template>
    <div class="weekly-grid">
        <div v-for="(day, index) in days" :key="day" class="day-column">
            <div class="day-header">{{ day }}</div>
            <div class="day-content">
                <div v-for="mod in weeklySchedule.filter(m => m.dayOfWeek === index + 1)"
                    :key="mod.moduleName + mod.startHour" class="event" :style="getStyle(mod)">
                    <strong>{{ mod.moduleName }}</strong>
                    <small>{{ mod.room }}</small>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.weekly-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
}

.day-column {
    position: relative;
    background: #ddd;
    min-height: 600px;
}

.event {
    position: absolute;
    width: 90%;
    background: #3b82f6;
    color: white;
    border-radius: 5px;
    padding: 5px;
    left: 5%;
}
</style>