<script setup>
import { useSettingsStore } from '../../stores/settingsStore'

defineProps(['isOpen'])
const emit = defineEmits(['close'])
const settingsStore = useSettingsStore()

function save() {
    emit('close')
}
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 w-full h-full bg-black/70 flex justify-center items-center z-[1000]"
        @click.self="emit('close')">
        <div class="bg-gray-800 p-8 rounded-lg w-[90%] max-w-sm text-white shadow-xl border border-white/10">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-blue-400">Paramètres d'affichage</h2>
                <span class="text-3xl cursor-pointer text-gray-400 hover:text-white transition-colors leading-none"
                    @click="emit('close')">&times;</span>
            </div>

            <div class="flex flex-col gap-4 mb-8">
                <label
                    class="flex items-center gap-3 text-lg cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                    <input type="checkbox" :checked="settingsStore.displaySettings.agenda"
                        @change="settingsStore.toggleDisplay('agenda')"
                        class="w-5 h-5 accent-blue-500 rounded cursor-pointer" />
                    Afficher Agenda
                </label>
                <label
                    class="flex items-center gap-3 text-lg cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                    <input type="checkbox" :checked="settingsStore.displaySettings.beerClicker"
                        @change="settingsStore.toggleDisplay('beerClicker')"
                        class="w-5 h-5 accent-blue-500 rounded cursor-pointer" />
                    Afficher Beer Clicker
                </label>
                <label
                    class="flex items-center gap-3 text-lg cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                    <input type="checkbox" :checked="settingsStore.displaySettings.clocks"
                        @change="settingsStore.toggleDisplay('clocks')"
                        class="w-5 h-5 accent-blue-500 rounded cursor-pointer" />
                    Afficher Horloges
                </label>
                <label
                    class="flex items-center gap-3 text-lg cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                    <input type="checkbox" :checked="settingsStore.displaySettings.vacances"
                        @change="settingsStore.toggleDisplay('vacances')"
                        class="w-5 h-5 accent-blue-500 rounded cursor-pointer" />
                    Afficher Vacances
                </label>
            </div>

            <div class="text-right">
                <button @click="save"
                    class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition-colors">Fermer</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* No more custom CSS */
</style>
