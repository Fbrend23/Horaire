<script setup>
import { ref } from 'vue';
import TheHeader from '@/components/TheHeader.vue';
import HomeView from '@/views/HomeView.vue';

// Import des modales
import ShopModal from '@/components/modals/ShopModal.vue';
import SkinModal from '@/components/modals/SkinModal.vue';
import SettingsModal from '@/components/modals/SettingsModal.vue';
import AchievementsModal from '@/components/modals/AchievementsModal.vue';

// État des modales
const showShop = ref(false);
const showSkins = ref(false);
const showSettings = ref(false);
const showAchievements = ref(false);

// Mode Rave
const isRaveMode = ref(false);
function toggleRave() {
  isRaveMode.value = !isRaveMode.value;
  if (isRaveMode.value) document.body.classList.add('rave-mode');
  else document.body.classList.remove('rave-mode');
}
</script>

<template>
  <div class="app-layout">
    <TheHeader @open-settings="showSettings = true" @toggle-rave="toggleRave" />

    <main>
      <h1 class="main-title">Bienvenue jeune impatient</h1>

      <HomeView @open-shop="showShop = true" @open-skins="showSkins = true" />
    </main>

    <Transition name="fade">
      <ShopModal v-if="showShop" @close="showShop = false" />
    </Transition>

    <Transition name="fade">
      <SkinModal v-if="showSkins" @close="showSkins = false" />
    </Transition>

    <Transition name="fade">
      <SettingsModal v-if="showSettings" @close="showSettings = false" />
    </Transition>
  </div>
</template>

<style>
@import './assets/css/base.css';

/* Transition pour les modales */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.app-layout {
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--primary-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.main-title {
  text-align: center;
  margin: 20px 0;
  color: var(--title-color);
}
</style>