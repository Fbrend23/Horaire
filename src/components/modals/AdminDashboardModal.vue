<script setup>
import { ref, computed } from 'vue'
import { useScheduleStore } from '../../stores/scheduleStore'
import { XMarkIcon, CalendarDaysIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid'

defineProps({
    isOpen: Boolean
})

const emit = defineEmits(['close', 'openScheduleEditor'])

async function handleLogout() {
    if (confirm('Se déconnecter ?')) {
        await scheduleStore.logout()
        emit('close')
    }
}

const scheduleStore = useScheduleStore()

// --- Vacation Logic ---
const newVacName = ref('')
const newVacStart = ref('')
const newVacEnd = ref('')

async function addVacation() {
    if (!newVacName.value || !newVacStart.value) return
    try {
        await scheduleStore.addVacation({
            name: newVacName.value,
            start_date: newVacStart.value,
            end_date: newVacEnd.value || null
        })
        newVacName.value = ''
        newVacStart.value = ''
        newVacEnd.value = ''
    } catch (e) {
        alert(e.message)
    }
}

async function deleteVacation(id) {
    if (confirm('Supprimer cette période de vacances ?')) {
        await scheduleStore.removeVacation(id)
    }
}

// --- Tests Logic ---
const newTestTitle = ref('')
const newTestModule = ref('')
const newTestDate = ref('')
const newTestTime = ref('')
const newTestEndTime = ref('')
const newTestRoom = ref('')
const isSavingTest = ref(false)

async function addTest() {
    if (!newTestTitle.value || !newTestDate.value) return
    isSavingTest.value = true
    try {
        const dateStr = `${newTestDate.value}T${newTestTime.value || '08:00'}:00`
        const dateObj = new Date(dateStr)
        
        let endDateObj = null
        if (newTestEndTime.value) {
            endDateObj = new Date(`${newTestDate.value}T${newTestEndTime.value}:00`)
        } else {
            // Default: +2 hours
            endDateObj = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000)
        }

        await scheduleStore.addTest({
            title: newTestTitle.value,
            module: newTestModule.value,
            room: newTestRoom.value,
            date: dateObj.toISOString(),
            end_date: endDateObj.toISOString()
        })
        // Reset
        newTestTitle.value = ''
        newTestModule.value = ''
        newTestDate.value = ''
        newTestTime.value = ''
        newTestEndTime.value = ''
        newTestRoom.value = ''
    } catch (e) {
        alert(e.message)
    } finally {
        isSavingTest.value = false
    }
}

async function deleteTest(id) {
    if (confirm('Supprimer cet examen ?')) {
        await scheduleStore.removeTest(id)
    }
}

// Simple formatter for tests list
const formattedTests = computed(() => {
    return scheduleStore.tests.map(t => ({
        ...t,
        displayDate: new Date(t.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    }))
})

// Tab navigation
const activeTab = ref('tests') // 'tests', 'vacations'
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>

            <div
                class="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[85vh]">
                <!-- Header -->
                <div
                    class="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
                    <h2 class="text-2xl font-bold text-white flex items-center gap-2">
                        🛡️ Panel Admin
                    </h2>
                    <div class="flex items-center gap-4">
                        <button @click="handleLogout"
                            class="text-red-400 hover:text-red-300 flex items-center gap-2 text-sm font-bold bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 transition hover:bg-red-500/20">
                            <ArrowRightOnRectangleIcon class="w-4 h-4" />
                            Déconnexion
                        </button>
                        <button @click="$emit('close')" class="text-slate-400 hover:text-white">
                            <XMarkIcon class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto p-6 space-y-8">

                    <!-- Quick Actions -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button @click="$emit('openScheduleEditor')"
                            class="p-4 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 rounded-xl flex items-center gap-4 transition group text-left">
                            <div
                                class="p-3 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform text-white">
                                <CalendarDaysIcon class="w-6 h-6" />
                            </div>
                            <div>
                                <div class="font-bold text-blue-100">Éditeur d'Horaire</div>
                                <div class="text-xs text-blue-300">Modifier les cours de la semaine</div>
                            </div>
                        </button>
                    </div>

                    <div class="border-t border-slate-700 my-4"></div>

                    <!-- Tabs -->
                    <div class="flex gap-4 border-b border-slate-700 mb-4">
                        <button @click="activeTab = 'tests'"
                            class="pb-2 px-1 text-sm font-bold transition-colors border-b-2"
                            :class="activeTab === 'tests' ? 'text-primary border-primary' : 'text-slate-400 border-transparent hover:text-slate-200'">
                            Examens
                        </button>
                        <button @click="activeTab = 'vacations'"
                            class="pb-2 px-1 text-sm font-bold transition-colors border-b-2"
                            :class="activeTab === 'vacations' ? 'text-primary border-primary' : 'text-slate-400 border-transparent hover:text-slate-200'">
                            Vacances
                        </button>
                    </div>

                    <!-- Tests Management -->
                    <div v-if="activeTab === 'tests'" class="space-y-4 animate-fade-in">
                        <h3 class="font-bold text-lg text-white">Ajouter un Examen</h3>
                        <form @submit.prevent="addTest"
                            class="grid grid-cols-2 gap-3 bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <input v-model="newTestTitle" placeholder="Titre (ex: Math)"
                                class="col-span-2 bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-primary"
                                required />
                            <input v-model="newTestModule" placeholder="Module (ex: M123)"
                                class="bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-primary"
                                required />
                            <input v-model="newTestRoom" placeholder="Salle"
                                class="bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-primary" />
                            <input v-model="newTestDate" type="date"
                                class="bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-primary"
                                required />
                            <div class="col-span-2 flex gap-2">
                                <input v-model="newTestTime" type="time" placeholder="Heure Début"
                                    class="flex-1 bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-primary" />
                                <input v-model="newTestEndTime" type="time" placeholder="Heure Fin"
                                    class="flex-1 bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-primary" />
                            </div>
                            <button
                                class="col-span-2 bg-primary hover:bg-primary-hover text-white py-2 rounded font-bold transition">Ajouter</button>
                        </form>

                        <h3 class="font-bold text-lg text-white mt-6">Liste des Examens</h3>
                        <div class="space-y-2">
                            <div v-for="test in formattedTests" :key="test.id"
                                class="flex justify-between items-center bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <div>
                                    <div class="font-bold text-white">{{ test.title }} <span
                                            class="text-xs text-primary-light bg-primary/10 px-1 rounded ml-2">{{
                                                test.module }}</span></div>
                                    <div class="text-xs text-slate-400">
                                        {{ test.displayDate }} - <span v-if="test.room">{{ test.room }}</span><span
                                            v-else>Salle inconnue</span>
                                    </div>
                                </div>
                                <button @click="deleteTest(test.id)" class="text-slate-500 hover:text-red-400 p-2">
                                    <span class="sr-only">Supprimer</span> 🗑️
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Vacations Management -->
                    <div v-if="activeTab === 'vacations'" class="space-y-4 animate-fade-in">
                        <h3 class="font-bold text-lg text-white">Ajouter une période</h3>
                        <form @submit.prevent="addVacation"
                            class="grid grid-cols-2 gap-3 bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <input v-model="newVacName" placeholder="Nom (ex: Noël)"
                                class="col-span-2 bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-primary"
                                required />
                            <input v-model="newVacStart" type="date"
                                class="bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-primary"
                                required />
                            <input v-model="newVacEnd" type="date"
                                class="bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-primary"
                                required />
                            <button
                                class="col-span-2 bg-primary hover:bg-primary-hover text-white py-2 rounded font-bold transition">Ajouter</button>
                        </form>

                        <h3 class="font-bold text-lg text-white mt-6">Périodes définies</h3>
                        <div class="space-y-2">
                            <div v-for="vac in scheduleStore.vacations" :key="vac.id"
                                class="flex justify-between items-center bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <div>
                                    <div class="font-bold text-white">{{ vac.name }}</div>
                                    <div class="text-xs text-slate-400">Du {{ vac.start_date }} au {{ vac.end_date ||
                                        '...' }}</div>
                                </div>
                                <button @click="deleteVacation(vac.id)" class="text-slate-500 hover:text-red-400 p-2">
                                    <span class="sr-only">Supprimer</span> 🗑️
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
