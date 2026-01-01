<script setup>
import { ref } from 'vue'
import { useScheduleStore } from '../../stores/scheduleStore'
import { LockClosedIcon, XMarkIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'unlocked'])

const store = useScheduleStore()
const password = ref('')
const error = ref(false)
const shaking = ref(false)

async function checkPassword() {
  const success = await store.unlock(password.value)
  if (success) {
    emit('unlocked')
    emit('close')
    password.value = ''
    error.value = false
  } else {
    error.value = true
    shake()
    password.value = ''
  }
}

function shake() {
  shaking.value = true
  setTimeout(() => shaking.value = false, 500)
}

function close() {
  password.value = ''
  error.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        @click="close"
      ></div>

      <!-- Modal -->
      <div 
        class="relative w-full max-w-xs bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transform transition-all"
        :class="{ 'animate-shake': shaking }"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <LockClosedIcon class="w-5 h-5 text-red-400" />
            Sécurité
          </h3>
          <button @click="close" class="text-slate-400 hover:text-white transition-colors">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 flex flex-col items-center gap-4">
          <p class="text-slate-300 text-sm text-center">
            Veuillez entrer le mot de passe pour modifier l'horaire.
          </p>

          <input 
            type="password" 
            v-model="password"
            @keyup.enter="checkPassword"
            placeholder="......"
            class="w-48 bg-slate-900 border-2 border-slate-600 rounded-lg py-2 px-4 text-center text-xl tracking-widest text-white focus:outline-none focus:border-blue-500 transition-colors"
            autofocus
          />

          <p v-if="error" class="text-red-400 text-xs font-bold animate-pulse">
            Mot de passe Incorrect
          </p>

          <button 
            @click="checkPassword"
            class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
          >
            Déverrouiller
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
