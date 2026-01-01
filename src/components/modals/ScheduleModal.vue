<script setup>
import { ref, watch } from 'vue'
import { useScheduleStore } from '../../stores/scheduleStore'
import { Module } from '../../logic/module'
import { XMarkIcon, ArrowPathIcon, CheckIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const store = useScheduleStore()
const rows = ref([])
const hasError = ref(false)

// Constants
const DAYS = [
  { val: 1, label: 'Lundi' },
  { val: 2, label: 'Mardi' },
  { val: 3, label: 'Mercredi' },
  { val: 4, label: 'Jeudi' },
  { val: 5, label: 'Vendredi' }
]

function loadSchedule() {
  rows.value = store.weeklySchedule.map(m => ({
    day: m.dayOfWeek,
    start: `${String(m.startHour).padStart(2, '0')}:${String(m.startMinute).padStart(2, '0')}`,
    end: `${String(m.endHour).padStart(2, '0')}:${String(m.endMinute).padStart(2, '0')}`,
    name: m.moduleName,
    room: m.room,
    id: Math.random() // Temp ID for v-for key
  }))
  sortRows()
}

function sortRows() {
  rows.value.sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day
    return a.start.localeCompare(b.start)
  })
}

function addRow() {
  rows.value.push({
    day: 1,
    start: '08:00',
    end: '09:00',
    name: '',
    room: 'A01',
    id: Math.random()
  })
}

function removeRow(index) {
  rows.value.splice(index, 1)
}

function save() {
  hasError.value = false
  const newModules = []

  try {
    for (const r of rows.value) {
      if (!r.name) throw new Error("Le nom du cours est requis")
      
      const [sh, sm] = r.start.split(':').map(Number)
      const [eh, em] = r.end.split(':').map(Number)

      if (sh * 60 + sm >= eh * 60 + em) {
        throw new Error(`L'heure de fin doit être après l'heure de début pour "${r.name || 'Nouveau cours'}"`)
      }

      newModules.push(new Module(r.name, r.room, r.day, sh, sm, eh, em))
    }

    store.updateSchedule(newModules)
    emit('close')
  } catch (e) {
    hasError.value = e.message
    // Shake effect could be emitted here
  }
}

function reset() {
  if (confirm('Restaurer les horaires par défaut ?')) {
    store.resetToDefaults()
    loadSchedule()
  }
}

watch(() => props.isOpen, (val) => {
  if (val) loadSchedule()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('close')"></div>

      <div class="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
          <h3 class="text-xl font-bold text-white flex gap-2 items-center">
            <span>📅</span> Éditeur Graphique
          </h3>
          <button @click="emit('close')" class="text-slate-400 hover:text-white">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Toolbar -->
        <div class="px-6 py-3 bg-slate-800/30 flex justify-between items-center border-b border-slate-700">
          <button @click="addRow" class="flex items-center gap-2 text-green-400 hover:text-green-300 font-bold hover:bg-green-400/10 px-3 py-1 rounded transition-colors">
            <PlusIcon class="w-5 h-5" /> Ajouter un cours
          </button>

          <button @click="reset" class="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors">
            <ArrowPathIcon class="w-3 h-3" /> Restaurer défaut
          </button>
        </div>

        <!-- Content List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-2">
          <div v-if="rows.length === 0" class="text-center text-slate-500 py-10 italic">
            Aucun cours. Ajoutez-en un !
          </div>

          <div 
            v-for="(row, idx) in rows" 
            :key="row.id"
            class="hidden md:flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors group"
          >
            <!-- Day -->
            <select v-model="row.day" class="bg-slate-900 text-white rounded px-2 py-1 border border-slate-700 focus:border-blue-500 outline-none w-28">
              <option v-for="d in DAYS" :key="d.val" :value="d.val">{{ d.label }}</option>
            </select>

            <!-- Time -->
            <div class="flex items-center gap-1 bg-slate-900 rounded border border-slate-700 px-2 py-1">
              <input type="time" v-model="row.start" class="bg-transparent text-white outline-none w-24 text-center" />
              <span class="text-slate-500">-</span>
              <input type="time" v-model="row.end" class="bg-transparent text-white outline-none w-24 text-center" />
            </div>

            <!-- Name -->
            <input type="text" v-model="row.name" placeholder="Nom du cours" class="flex-1 bg-slate-900 text-white rounded px-3 py-1 border border-slate-700 focus:border-blue-500 outline-none" />

            <!-- Room -->
            <input type="text" v-model="row.room" placeholder="Salle" class="w-24 bg-slate-900 text-white rounded px-3 py-1 border border-slate-700 focus:border-blue-500 outline-none text-center" />

            <!-- Actions -->
            <button @click="removeRow(idx)" class="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Supprimer">
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Mobile View -->
           <div 
            v-for="(row, idx) in rows" 
            :key="row.id + '_mob'"
            class="flex md:hidden flex-col gap-2 bg-slate-800 p-3 rounded-lg border border-slate-700 relative"
          >
            <div class="flex justify-between items-center mb-1">
               <select v-model="row.day" class="bg-slate-900 text-white rounded px-2 py-1 border border-slate-700 text-sm font-bold">
                <option v-for="d in DAYS" :key="d.val" :value="d.val">{{ d.label }}</option>
              </select>
               <button @click="removeRow(idx)" class="text-slate-500 hover:text-red-500">
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
            
            <input type="text" v-model="row.name" placeholder="Nom du cours" class="w-full bg-slate-900 text-white rounded px-3 py-1 border border-slate-700" />
            
            <div class="flex justify-between gap-2">
               <div class="flex items-center gap-1 bg-slate-900 rounded border border-slate-700 px-2 py-1 flex-1 justify-center">
                <input type="time" v-model="row.start" class="bg-transparent text-white outline-none w-full text-center text-sm" />
                <span class="text-slate-500">-</span>
                <input type="time" v-model="row.end" class="bg-transparent text-white outline-none w-full text-center text-sm" />
              </div>
               <input type="text" v-model="row.room" placeholder="Salle" class="w-20 bg-slate-900 text-white rounded px-2 py-1 border border-slate-700 text-center" />
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-b-2xl">
          <div class="text-red-400 font-bold text-sm">
            {{ hasError }}
          </div>
          <div class="flex gap-3">
            <button @click="emit('close')" class="px-4 py-2 text-slate-300 hover:text-white">Annuler</button>
            <button @click="save" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-blue-900/20">
              <CheckIcon class="w-5 h-5" /> Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
