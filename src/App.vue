<script setup>
import { RouterView } from 'vue-router'
import { useGameStore } from './stores/gameStore'
// settingsStore initialization removed (unused)
const gameStore = useGameStore()

gameStore.initGame()

// Apply theme on start (handled by settingsStore watch mostly, but we trigger init logic)
// settingsStore already watches and applies on init. We can remove the manual add here.
</script>

<template>
    <RouterView />

    <a href="https://contact.brendanfleurdelys.ch/index.php?origin=beer" class="contact-btn" title="Contact"
        target="_blank">
        💬
    </a>
</template>

<style>
/* Global styles are now in src/assets/main.css */
</style>
