<script setup>
import { RouterView } from 'vue-router'
import { useGameStore } from './stores/gameStore'
import { useSettingsStore } from './stores/settingsStore'

// Init stores
const gameStore = useGameStore()
const settingsStore = useSettingsStore()

gameStore.initGame()

// Apply theme on start
const currentTheme = settingsStore.theme
document.body.classList.add(`${currentTheme}-mode`)
</script>

<template>
    <RouterView />

    <a href="https://contact.brendanfleurdelys.ch/index.php?origin=beer" class="contact-btn" title="Contact"
        target="_blank">
        💬
    </a>
</template>

<style>
/* Global Styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #111827;
    /* Dark default */
    color: #f3f4f6;
    transition: background-color 0.3s, color 0.3s;
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background: #1f2937;
}

::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
}

/* Theme classes */
.light-mode {
    background-color: #f3f4f6;
    color: #1f2937;
}

.light-mode .modal-content,
.light-mode .small-card,
.light-mode .main-card,
.light-mode .clocks-container {
    background-color: white;
    color: #1f2937;
    border: 1px solid #e5e7eb;
}

/* Rave mode class just acts as a flag/hook now, or we can keep some base styles */
/* Rave mode styling */
.rave-mode {
    --rave-hue: 0deg;
}

.rave-mode :is(h1, h2, h3, h4, h5, h6, p, span, a, li, label, strong, em, button) {
    filter: hue-rotate(var(--rave-hue));
    transition: filter 0.3s ease;
}

/* Try to exclude button backgrounds if possible, or accept button color shift as part of "text/controls" */

.contact-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #3b82f6;
    color: white;
    border-radius: 5px;
    text-decoration: none;
    font-size: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s, background-color 0.2s;
    z-index: 1000;
}

.contact-btn:hover {
    background-color: #2563eb;
    transform: none;
    /* Legacy didn't have scale on hover in same way, but I'll keep it simple or match legacy transition */
}
</style>
