<script setup>
import { useAchievementStore } from '@/stores/achievementStore';
import BaseModal from './BaseModal.vue';
import { computed } from 'vue';

const store = useAchievementStore();

// Calculs pour l'affichage
const unlockedCount = computed(() => store.unlockedIds.length);
const totalCount = computed(() => store.definitions.length);

const unlockedList = computed(() =>
    store.definitions.filter(a => store.unlockedIds.includes(a.id))
);

// Succès non débloqués mais dont l'indice a été acheté
const clueList = computed(() =>
    store.definitions.filter(a => !store.unlockedIds.includes(a.id) && store.revealedIds.includes(a.id))
);
</script>

<template>
    <BaseModal @close="$emit('close')">
        <template #header>
            <h2>Mes Succès</h2>
            <p>{{ unlockedCount }} / {{ totalCount }} débloqués</p>
        </template>

        <div class="achievements-container">
            <div v-for="ach in unlockedList" :key="ach.id" class="achievement-item unlocked">
                <h4>{{ ach.name }}</h4>
                <p>{{ ach.description }}</p>
            </div>

            <div v-if="clueList.length > 0">
                <h3>Indices débloqués</h3>
                <div v-for="ach in clueList" :key="ach.id" class="achievement-item clue">
                    <h4>{{ ach.name }}</h4>
                    <p>{{ ach.description }}</p>
                </div>
            </div>

            <p v-if="unlockedCount === 0 && clueList.length === 0" class="empty-msg">
                Jouez pour débloquer des succès !
            </p>
        </div>
    </BaseModal>
</template>

<style scoped>
.achievements-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.achievement-item {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 8px;
    background-color: #f0fdf4;
    /* Vert très clair */
}

.achievement-item.clue {
    background-color: #fffbeb;
    /* Jaune très clair */
    border-style: dashed;
}

.achievement-item h4 {
    margin: 0 0 5px 0;
    color: #16a34a;
}

.achievement-item.clue h4 {
    color: #d97706;
}
</style>