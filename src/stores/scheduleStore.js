import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Module } from '../logic/module'
import { supabase } from '../supabase'

export const useScheduleStore = defineStore('schedule', () => {
  // --- Auth & Admin ---
  const user = ref(null)
  const isAdmin = computed(() => !!user.value)

  // Validate session on load
  supabase.auth.getSession().then(({ data }) => {
    user.value = data.session?.user ?? null
  })

  supabase.auth.onAuthStateChange((_, session) => {
    user.value = session?.user ?? null
  })

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  // --- Data: Schedule (Modules) ---
  const weeklySchedule = ref([])

  async function fetchModules() {
    const { data, error } = await supabase.from('modules').select('*')

    if (error) {
      console.error('Error fetching modules:', error)
      return
    }

    if (data) {
      // Map DB fields to Module class
      weeklySchedule.value = data.map(
        (m) =>
          new Module(m.name, m.room, m.day, m.start_hour, m.start_minute, m.end_hour, m.end_minute),
      )
    }
  }

  // Full Replace Strategy for Schedule
  async function saveModules(newModules) {
    // 1. Delete all existing modules (kept simple for this scale)
    const { error: delError } = await supabase.from('modules').delete().gte('day', 0) // Delete all valid days

    if (delError) throw delError

    // 2. Insert new
    const toInsert = newModules.map((m) => ({
      name: m.moduleName,
      room: m.room,
      day: m.dayOfWeek,
      start_hour: m.startHour,
      start_minute: m.startMinute,
      end_hour: m.endHour,
      end_minute: m.endMinute,
    }))

    // Supabase bulk insert
    if (toInsert.length > 0) {
      const { error: insError } = await supabase.from('modules').insert(toInsert)

      if (insError) throw insError
    }

    // Update local state
    weeklySchedule.value = newModules
  }

  // Forward compatibility wrapper (used by ScheduleModal)
  async function updateSchedule(newModules) {
    await saveModules(newModules)
  }

  function resetToDefaults() {
    alert("Reset vers défauts non disponible en mode Cloud pour l'instant.")
  }

  // --- Data: Tests ---
  const tests = ref([])

  async function fetchTests() {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('date', { ascending: true })

    if (error) console.error(error)
    else tests.value = data || []
  }

  async function addTest(test) {
    const { error } = await supabase.from('tests').insert(test)
    if (error) throw error
    await fetchTests()
  }

  async function removeTest(id) {
    const { error } = await supabase.from('tests').delete().eq('id', id)
    if (error) throw error
    await fetchTests()
  }

  // --- Data: Vacations ---
  const vacations = ref([])

  async function fetchVacations() {
    const { data, error } = await supabase
      .from('vacations')
      .select('*')
      .order('start_date', { ascending: true })

    if (error) console.error(error)
    else vacations.value = data || []
  }

  async function addVacation(vacation) {
    // vacation: { name, start_date, end_date }
    const { error } = await supabase.from('vacations').insert(vacation)
    if (error) throw error
    await fetchVacations()
  }

  async function removeVacation(id) {
    const { error } = await supabase.from('vacations').delete().eq('id', id)
    if (error) throw error
    await fetchVacations()
  }

  // Init
  fetchTests()
  fetchModules()
  fetchVacations()

  return {
    // Auth
    user,
    isAdmin,
    login,
    logout,
    // Schedule
    weeklySchedule,
    updateSchedule, // kept for compatibility with ScheduleModal
    resetToDefaults,
    fetchModules,
    // Tests
    tests,
    addTest,
    removeTest,
    fetchTests,
    // Vacations
    vacations,
    addVacation,
    removeVacation,
    fetchVacations,
  }
})
