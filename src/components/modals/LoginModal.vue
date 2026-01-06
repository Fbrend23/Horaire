<script setup>
import { ref } from 'vue'
import { useScheduleStore } from '../../stores/scheduleStore'
import { XMarkIcon } from '@heroicons/vue/24/solid'

defineProps({
    isOpen: Boolean
})

const emit = defineEmits(['close'])

const scheduleStore = useScheduleStore()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

async function handleLogin() {
    isLoading.value = true
    errorMsg.value = ''
    try {
        await scheduleStore.login(email.value, password.value)
        emit('close')
    } catch (e) {
        errorMsg.value = "Erreur de connexion. Vérifiez vos identifiants."
        console.error(e)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>

            <!-- Modal Content -->
            <div
                class="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md relative z-10 p-6 animate-scale-in">
                <button @click="$emit('close')"
                    class="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                    <XMarkIcon class="w-6 h-6" />
                </button>

                <h2 class="text-2xl font-bold mb-6 text-center">Connexion Admin</h2>

                <form @submit.prevent="handleLogin" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input v-model="email" type="email" required placeholder="admin@horaire.com"
                            class="w-full bg-black/40 border border-gray-600 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
                        <input v-model="password" type="password" required placeholder="••••••••"
                            class="w-full bg-black/40 border border-gray-600 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" />
                    </div>

                    <div v-if="errorMsg"
                        class="p-3 bg-red-900/50 border border-red-700/50 text-red-200 text-sm rounded">
                        {{ errorMsg }}
                    </div>

                    <button type="submit" :disabled="isLoading"
                        class="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="isLoading">Connexion...</span>
                        <span v-else>Se connecter</span>
                    </button>
                </form>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.animate-scale-in {
    animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
