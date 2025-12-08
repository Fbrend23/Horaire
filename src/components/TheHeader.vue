<script setup>
import { useSettingsStore } from '@/stores/settingsStore';
import { computed } from 'vue';

const store = useSettingsStore();
const emit = defineEmits(['open-settings', 'toggle-rave']);

// Logo dynamique selon le thème
const logoSrc = computed(() => {
    const fileName = store.theme === 'dark' ? 'logo.png' : 'logo_noir.png';
    return new URL(`../assets/images/${fileName}`, import.meta.url).href;
});
</script>

<template>
    <header class="container header-bar">
        <div class="logo-container">
            <img :src="logoSrc" alt="logo" id="logo" />
        </div>

        <div class="actions">
            <a class="nav-btn" href="#">🗓️</a>

            <button @click="$emit('toggle-rave')">🕺</button>
            <button @click="store.toggleTheme()">🌓</button>
            <button @click="$emit('open-settings')">⚙️</button>
        </div>
    </header>
</template>

<style scoped>
.header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    height: 64px;
}

#logo {
    height: 42px;
    width: auto;
}

.actions {
    display: flex;
    gap: 10px;
}

button,
.nav-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
    text-decoration: none;
}
</style>