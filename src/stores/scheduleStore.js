import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Module } from '../logic/module'

// Security Constants (PBKDF2-HMAC-SHA512)
// Default Password: "admin" (overridable via VITE_ADMIN_SALT and VITE_ADMIN_HASH)
const SALT_HEX = import.meta.env.VITE_ADMIN_SALT || 'd380ffc67948e58cb7608b2244b0b0a3'
const HASH_HEX =
  import.meta.env.VITE_ADMIN_HASH ||
  '39c0651a2ae56dca0112ed7b060b7bb5daa7818ed51802a6f2592be70379ffb4abf30478ddefb766821d9c880d73500273a1d12f77d86280e34b421f73a3ef72'

// Default schedule (fallback)
const DEFAULT_SCHEDULE = [
  new Module('P_Bulle', 'B13', 1, 8, 0, 11, 25),
  new Module('Projet 183', 'A21', 1, 12, 20, 14, 45),
  new Module('Séance de classe', 'A21', 1, 15, 0, 15, 45),
  new Module('I426', 'B22', 2, 8, 0, 11, 25),
  new Module('C294', 'A01', 2, 13, 10, 16, 35),
  new Module('C294', 'A01', 3, 8, 0, 12, 15),
  new Module('Projet 324', 'A11', 3, 13, 10, 15, 45),
  new Module('I183', 'A21', 4, 8, 0, 12, 15),
  new Module('I165', 'B11', 4, 13, 10, 16, 35),
  new Module('I324', 'A11', 5, 8, 0, 12, 15),
  new Module('P_Prod', 'A01', 5, 13, 10, 15, 45),
]

async function verifyPassword(password) {
  if (!password) return false
  const enc = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )

  const saltBuffer = new Uint8Array(SALT_HEX.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-512',
    },
    keyMaterial,
    512,
  )

  const hashArray = Array.from(new Uint8Array(derivedBits))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return hashHex === HASH_HEX
}

export const useScheduleStore = defineStore('schedule', () => {
  const weeklySchedule = ref([])
  const isAdminUnlocked = ref(false)

  // Initialize from LocalStorage or Defaults
  const saved = localStorage.getItem('horaire_schedule')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      weeklySchedule.value = parsed.map((m) => Module.fromJSON(m))
    } catch (e) {
      console.error('Failed to parse schedule, using default', e)
      weeklySchedule.value = [...DEFAULT_SCHEDULE]
    }
  } else {
    weeklySchedule.value = [...DEFAULT_SCHEDULE]
  }

  // Persistence
  watch(
    weeklySchedule,
    (newVal) => {
      const serialized = newVal.map((m) => m.toJSON())
      localStorage.setItem('horaire_schedule', JSON.stringify(serialized))
    },
    { deep: true },
  )

  async function unlock(password) {
    if (await verifyPassword(password)) {
      isAdminUnlocked.value = true
      return true
    }
    return false
  }

  function lock() {
    isAdminUnlocked.value = false
  }

  function updateSchedule(newModules) {
    weeklySchedule.value = newModules
  }

  function resetToDefaults() {
    weeklySchedule.value = [...DEFAULT_SCHEDULE]
  }

  return {
    weeklySchedule,
    isAdminUnlocked,
    unlock,
    lock,
    updateSchedule,
    resetToDefaults,
  }
})
