<script setup>
import BeerClicker from './components/BeerClicker.vue';
</script>

<template>
  <main>
    <h1>Bienvenue jeune impatient</h1>
    <BeerClicker @open-shop="console.log('Ouvrir Shop')" @open-skins="console.log('Ouvrir Skins')" />
  </main>
</template>

<style>
@import './assets/css/base.css';

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-color, #f4f7fc);
}
</style>