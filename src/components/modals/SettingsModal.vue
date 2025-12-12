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
        <div class="bg-surface p-8 rounded-lg w-[90%] max-w-sm text-white shadow-xl border border-border">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-primary">Paramètres d'affichage</h2>
                <span class="text-3xl cursor-pointer text-gray-400 hover:text-white transition-colors leading-none"
                    @click="emit('close')">&times;</span>
            </div>

            <div class="flex flex-col gap-4 mb-8">
                <label
                    class="flex items-center gap-3 text-lg cursor-pointer hover:bg-slate-700/50 p-2 rounded transition-colors">
                    <input type="checkbox" :checked="settingsStore.displaySettings.agenda"
                        @change="settingsStore.toggleDisplay('agenda')"
                        class="w-5 h-5 accent-secondary rounded cursor-pointer" />
                    Afficher Agenda
                </label>
                <label
                    class="flex items-center gap-3 text-lg cursor-pointer hover:bg-slate-700/50 p-2 rounded transition-colors">
                    <input type="checkbox" :checked="settingsStore.displaySettings.beerClicker"
                        @change="settingsStore.toggleDisplay('beerClicker')"
                        class="w-5 h-5 accent-secondary rounded cursor-pointer" />
                    Afficher Beer Clicker
                </label>
                <label
                    class="flex items-center gap-3 text-lg cursor-pointer hover:bg-slate-700/50 p-2 rounded transition-colors">
                    <input type="checkbox" :checked="settingsStore.displaySettings.clocks"
                        @change="settingsStore.toggleDisplay('clocks')"
                        class="w-5 h-5 accent-secondary rounded cursor-pointer" />
                    Afficher Horloges
                </label>
                <label
                    class="flex items-center gap-3 text-lg cursor-pointer hover:bg-slate-700/50 p-2 rounded transition-colors">
                    <input type="checkbox" :checked="settingsStore.displaySettings.vacances"
                        @change="settingsStore.toggleDisplay('vacances')"
                        class="w-5 h-5 accent-secondary rounded cursor-pointer" />
                    Afficher Vacances
                </label>

                <!-- Theme Toggle Section -->
                <div class="mt-4 pt-4 border-t border-border">
                    <h3 class="text-lg font-semibold text-gray-200 mb-2">Thème</h3>
                    <div class="flex gap-2">
                        <button @click="settingsStore.setTheme('sunset')"
                            class="flex-1 py-2 px-3 rounded border-2 transition-all font-semibold text-sm" :class="settingsStore.currentTheme === 'sunset'
                                ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                                : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:border-slate-500'">
                            Sunset
                        </button>
                        <button @click="settingsStore.setTheme('blue-night')"
                            class="flex-1 py-2 px-3 rounded border-2 transition-all font-semibold text-sm" :class="settingsStore.currentTheme === 'blue-night'
                                ? 'border-sky-500 bg-sky-500/20 text-sky-400'
                                : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:border-slate-500'">
                            Blue Night
                        </button>
                    </div>
                </div>

                <div class="mt-2 flex items-center justify-between">
                    <span class="text-gray-300">Météo & Effets</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" :checked="settingsStore.weatherEnabled"
                            @change="settingsStore.toggleWeather()" class="sr-only peer">
                        <div
                            class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary">
                        </div>
                    </label>
                </div>
            </div>

            <div class="text-right">
                <button @click="save"
                    class="px-6 py-2 bg-secondary hover:bg-secondary-hover text-white rounded font-semibold transition-colors">Fermer</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* No more custom CSS */
</style>
