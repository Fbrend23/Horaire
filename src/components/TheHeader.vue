<script setup>
import { useSettingsStore } from '../stores/settingsStore'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const settingsStore = useSettingsStore()
const emit = defineEmits(['openSettings'])
const route = useRoute()

const isWeeklyView = computed(() => route.path === '/semaine')

function toggleTheme() {
    settingsStore.toggleTheme()
}

function toggleRave() {
    settingsStore.toggleRaveMode()
}
</script>

<template>
    <header class="container">
        <a href="https://brendanfleurdelys.ch">
            <img src="@/assets/logo/logo.png" alt="logo" id="logo" class="logo" />
        </a>
        <div class="controls">
            <!-- If on Weekly View, show Home button only (plus theme) -->
            <template v-if="isWeeklyView">
                <router-link to="/" class="nav-btn">🏠</router-link>
            </template>

            <!-- Else (Home View), show full controls -->
            <template v-else>
                <router-link to="/semaine" class="nav-btn">🗓️</router-link>
                <button @click="toggleRave" class="rave-btn">🕺</button>
            </template>

            <!-- Theme button always visible -->
            <button @click="toggleTheme" class="theme-btn">{{ settingsStore.theme === 'dark' ? '☀️' : '🌙' }}</button>

            <!-- Settings only on Home View -->
            <button v-if="!isWeeklyView" @click="emit('openSettings')" class="settings-btn">⚙️</button>
        </div>
    </header>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: transparent;
}

.logo {
    height: 50px;
    width: auto;
}

.controls {
    display: flex;
    gap: 1rem;
    align-items: center;
}

button,
.nav-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.2s;
}

button:hover,
.nav-btn:hover {
    transform: scale(1.1);
}

.rave-btn:active {
    animation: shake 0.5s;
}

@keyframes shake {
    0% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(5deg);
    }

    75% {
        transform: rotate(-5deg);
    }

    100% {
        transform: rotate(0deg);
    }
}
</style>
